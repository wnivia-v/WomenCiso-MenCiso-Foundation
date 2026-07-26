import { NextRequest, NextResponse } from "next/server";
import { TextractClient, AnalyzeDocumentCommand, DetectDocumentTextCommand } from "@aws-sdk/client-textract";
import { RekognitionClient, DetectFacesCommand } from "@aws-sdk/client-rekognition";
import { verificarLimite, obtenerIP } from "@/lib/limite-peticiones";

/**
 * API Route: POST /api/ocr
 *
 * Recibe una imagen en base64 y usa Amazon Textract para extraer texto.
 * Reconoce documentos de cualquier país:
 * - CURP mexicana
 * - Pasaportes (MRZ - Machine Readable Zone)
 * - Licencias de conducir
 * - Cédulas/DNI de cualquier país
 * - Actas de nacimiento
 * - Cualquier documento con texto legible
 *
 * Si el documento contiene una foto del titular, la detecta y la devuelve
 * para uso como referencia visual del paciente (útil en pacientes NN).
 *
 * Seguridad:
 * - Credenciales vía IAM Role de Amplify (sin claves hardcodeadas)
 * - Validación de tamaño máximo (5MB)
 * - El procesamiento ocurre en el servidor, nunca en el cliente
 */

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB — límite de Textract

/**
 * Tope del cuerpo de la petición. El base64 infla los bytes cerca de un 37%,
 * así que 7 MB deja margen para una imagen de 5 MB más el prefijo data URI.
 */
const MAX_BODY_SIZE = 7 * 1024 * 1024;

/** Peticiones permitidas por IP en la ventana. Cada una cuesta dinero en AWS. */
const LIMITE_PETICIONES = 10;
const VENTANA_MS = 60_000;

/** Tiempo máximo de espera a AWS, para no dejar peticiones colgadas. */
const TIMEOUT_AWS_MS = 15_000;

/**
 * Firmas de archivo de los formatos que Textract acepta.
 * Se valida el contenido real en lugar de confiar en el tipo declarado: el
 * prefijo `data:image/png` lo escribe el cliente y puede mentir. Sin esta
 * comprobación, cualquier secuencia de bytes llegaría a Textract y generaría
 * una llamada facturable que va a fallar de todos modos.
 */
const FIRMAS_IMAGEN: { nombre: string; bytes: number[] }[] = [
  { nombre: "JPEG", bytes: [0xff, 0xd8, 0xff] },
  { nombre: "PNG", bytes: [0x89, 0x50, 0x4e, 0x47] },
  { nombre: "TIFF (LE)", bytes: [0x49, 0x49, 0x2a, 0x00] },
  { nombre: "TIFF (BE)", bytes: [0x4d, 0x4d, 0x00, 0x2a] },
];

function esImagenValida(buffer: Buffer): boolean {
  return FIRMAS_IMAGEN.some((firma) =>
    firma.bytes.every((byte, i) => buffer[i] === byte)
  );
}

/**
 * Clasifica un error de AWS en una categoría publicable.
 *
 * No se devuelve el mensaje original al cliente: los errores de AWS suelen
 * incluir el ARN completo del rol, que expone el número de cuenta y el nombre
 * del rol. Por ejemplo, un fallo de permisos devuelve algo como
 * "User: arn:aws:sts::<cuenta>:assumed-role/<rol>/... is not authorized...".
 * Entregar eso a cualquiera que invoque la ruta es regalar reconocimiento de
 * la infraestructura. El mensaje completo se registra en CloudWatch, donde solo
 * lo ve quien administra la cuenta.
 */
function clasificarError(error: unknown): { categoria: string; publico: string } {
  const nombre = (error as { name?: string })?.name || "";

  if (nombre.includes("AccessDenied") || nombre.includes("UnrecognizedClient")) {
    return {
      categoria: nombre,
      publico: "El servicio de lectura no está autorizado en este entorno.",
    };
  }
  if (nombre.includes("Credentials") || nombre.includes("Token")) {
    return {
      categoria: nombre,
      publico: "El servicio de lectura no tiene credenciales configuradas.",
    };
  }
  if (nombre.includes("Throttling") || nombre.includes("LimitExceeded")) {
    return {
      categoria: nombre,
      publico: "El servicio de lectura está saturado. Intenta en unos segundos.",
    };
  }
  if (nombre.includes("InvalidParameter") || nombre.includes("UnsupportedDocument")) {
    return {
      categoria: nombre,
      publico: "El documento no se pudo interpretar. Prueba con otra foto.",
    };
  }
  if (nombre === "TimeoutError" || nombre.includes("Timeout")) {
    return {
      categoria: "Timeout",
      publico: "El servicio de lectura tardó demasiado en responder.",
    };
  }
  return { categoria: nombre || "ErrorDesconocido", publico: "El servicio de lectura no respondió." };
}

export async function POST(request: NextRequest) {
  try {
    // --- Límite de tasa ---
    // Va primero, antes de leer el cuerpo: si se rechaza la petición, no tiene
    // sentido haber gastado memoria en recibir megabytes de datos.
    const ip = obtenerIP(request.headers);
    const limite = verificarLimite(ip, LIMITE_PETICIONES, VENTANA_MS);
    if (!limite.permitido) {
      return NextResponse.json(
        {
          error: `Demasiadas solicitudes. Espera ${limite.reintentarEn} segundos.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(limite.reintentarEn),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    // --- Tamaño del cuerpo, ANTES de parsearlo ---
    // La validación de tamaño tiene que ocurrir aquí y no después de
    // `request.json()`. Parsear primero significa cargar todo el cuerpo en
    // memoria: un cuerpo de cientos de megabytes agotaría la memoria de la
    // instancia antes de llegar a cualquier comprobación.
    const contentLength = request.headers.get("content-length");
    if (contentLength && Number(contentLength) > MAX_BODY_SIZE) {
      return NextResponse.json(
        { error: "La imagen excede el tamaño máximo permitido." },
        { status: 413 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Cuerpo de la petición inválido." }, { status: 400 });
    }

    const imageBase64 = (body as { imageBase64?: unknown })?.imageBase64;

    // Se valida el tipo explícitamente: sin esto, un valor no textual haría
    // fallar `.replace()` más abajo con un error de ejecución.
    if (typeof imageBase64 !== "string" || imageBase64.length === 0) {
      return NextResponse.json({ error: "No se proporcionó imagen." }, { status: 400 });
    }

    if (imageBase64.length > MAX_BODY_SIZE) {
      return NextResponse.json(
        { error: "La imagen excede el tamaño máximo permitido." },
        { status: 413 }
      );
    }

    // Extraer el base64 puro (quitar el prefijo data:image/...)
    const base64Data = imageBase64.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");

    if (imageBuffer.length === 0) {
      return NextResponse.json({ error: "La imagen está vacía o mal codificada." }, { status: 400 });
    }

    if (imageBuffer.length > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: "La imagen excede el tamaño máximo de 5 MB." },
        { status: 413 }
      );
    }

    // --- Verificar que el contenido sea realmente una imagen ---
    if (!esImagenValida(imageBuffer)) {
      return NextResponse.json(
        { error: "El archivo no es una imagen válida (se admiten JPEG, PNG y TIFF)." },
        { status: 415 }
      );
    }

    // Intentar siempre con Textract primero.
    // Si falla por credenciales (entorno local sin IAM Role), usar datos demo.
    try {
      // Los tiempos de espera evitan que una llamada colgada a AWS mantenga
      // ocupada la instancia de cómputo indefinidamente. Sin esto, unas pocas
      // peticiones lentas simultáneas bastan para agotar la concurrencia.
      const configuracionAWS = {
        region: process.env.AWS_REGION_TEXTRACT || "us-east-1",
        requestHandler: {
          requestTimeout: TIMEOUT_AWS_MS,
          connectionTimeout: 5_000,
        },
        maxAttempts: 2,
      };

      const textractClient = new TextractClient(configuracionAWS);

      // Intentar primero con AnalyzeDocument (detecta formularios y tablas)
      // Si falla, caer a DetectDocumentText (solo texto)
      let lineas: string[] = [];
      let palabras: { text: string; confidence: number; geometry?: unknown }[] = [];

    try {
      const analyzeCommand = new AnalyzeDocumentCommand({
        Document: { Bytes: imageBuffer },
        FeatureTypes: ["FORMS", "TABLES"],
      });
      const analyzeResponse = await textractClient.send(analyzeCommand);

      if (analyzeResponse.Blocks) {
        for (const block of analyzeResponse.Blocks) {
          if (block.BlockType === "LINE" && block.Text) {
            lineas.push(block.Text);
          }
          if (block.BlockType === "WORD" && block.Text) {
            palabras.push({
              text: block.Text,
              confidence: block.Confidence || 0,
              geometry: block.Geometry,
            });
          }
        }
      }
    } catch {
      // Fallback a detección simple de texto
      const detectCommand = new DetectDocumentTextCommand({
        Document: { Bytes: imageBuffer },
      });
      const detectResponse = await textractClient.send(detectCommand);

      if (detectResponse.Blocks) {
        for (const block of detectResponse.Blocks) {
          if (block.BlockType === "LINE" && block.Text) {
            lineas.push(block.Text);
          }
          if (block.BlockType === "WORD" && block.Text) {
            palabras.push({
              text: block.Text,
              confidence: block.Confidence || 0,
            });
          }
        }
      }
    }

    const textoCompleto = lineas.join("\n");

    // Extraer datos universales del documento
    const datos = extraerDatosUniversal(lineas, textoCompleto);

    // ===== DETECCIÓN DE ROSTRO (Amazon Rekognition) =====
    // Si el documento tiene una foto del titular (pasaporte, INE, cédula),
    // Rekognition la detecta y devolvemos las coordenadas para recortarla.
    // Esto es clave para pacientes NN: la foto permite reconocimiento posterior.
    let fotoRostro: { detectado: boolean; boundingBox?: { top: number; left: number; width: number; height: number }; confianza?: number; edad?: { min: number; max: number }; generoDetectado?: string } = { detectado: false };

    try {
      const rekognitionClient = new RekognitionClient(configuracionAWS);

      const detectFacesCommand = new DetectFacesCommand({
        Image: { Bytes: imageBuffer },
        Attributes: ["ALL"],
      });

      const facesResponse = await rekognitionClient.send(detectFacesCommand);

      if (facesResponse.FaceDetails && facesResponse.FaceDetails.length > 0) {
        // Tomar el rostro con mayor confianza (probablemente la foto del documento)
        const rostro = facesResponse.FaceDetails.reduce((mejor, actual) =>
          (actual.Confidence || 0) > (mejor.Confidence || 0) ? actual : mejor
        );

        fotoRostro = {
          detectado: true,
          boundingBox: rostro.BoundingBox ? {
            top: rostro.BoundingBox.Top || 0,
            left: rostro.BoundingBox.Left || 0,
            width: rostro.BoundingBox.Width || 0,
            height: rostro.BoundingBox.Height || 0,
          } : undefined,
          confianza: Math.round(rostro.Confidence || 0),
        };

        // Extraer edad estimada del rostro (útil para pediatría)
        if (rostro.AgeRange) {
          fotoRostro.edad = {
            min: rostro.AgeRange.Low || 0,
            max: rostro.AgeRange.High || 0,
          };
        }

        // Género detectado por el rostro (refuerza o corrige lo leído del texto)
        if (rostro.Gender && rostro.Gender.Confidence && rostro.Gender.Confidence > 90) {
          fotoRostro.generoDetectado = rostro.Gender.Value === "Male" ? "MASCULINO" : "FEMENINO";
        }
      }
    } catch {
      // Rekognition puede fallar si la imagen no contiene un rostro claro
      // No es un error crítico — simplemente no se detectó rostro
    }

    return NextResponse.json({
      success: true,
      mode: "textract",
      datos,
      fotoRostro,
      textoCompleto,
      lineasDetectadas: lineas.length,
      confianzaPromedio: palabras.length > 0
        ? Math.round(palabras.reduce((sum, p) => sum + p.confidence, 0) / palabras.length)
        : 0,
    });
    } catch (awsError) {
      // Si Textract/Rekognition fallan, se cae a modo demo para que la app siga
      // usable, pero se indica el motivo. Sin ninguna señal, un problema de
      // permisos es indistinguible de un entorno local sin credenciales y se
      // acaba depurando a ciegas.
      //
      // Al cliente va solo la categoría del error y un mensaje redactado. El
      // detalle completo queda en CloudWatch: ver `clasificarError` para el
      // razonamiento sobre por qué no se publica el mensaje original.
      const { categoria, publico } = clasificarError(awsError);

      console.error("AWS no disponible, usando modo demo:", {
        categoria,
        // El mensaje completo se registra solo del lado servidor.
        detalle: (awsError as { message?: string })?.message,
      });

      return NextResponse.json({
        success: true,
        mode: "demo",
        datos: obtenerDatosDemo(),
        fotoRostro: { detectado: false },
        textoCompleto: "Modo demo — el servicio de lectura no respondió",
        diagnostico: { tipo: categoria, mensaje: publico },
      });
    }
  } catch (error) {
    // El error interno no se propaga al cliente: un stack trace o un mensaje de
    // biblioteca puede revelar rutas del sistema de archivos y versiones de
    // dependencias, que sirven para buscar vulnerabilidades conocidas.
    console.error("Error en OCR:", error);
    return NextResponse.json(
      { error: "Error al procesar la imagen. Intenta de nuevo." },
      { status: 500 }
    );
  }
}

/**
 * Extracción universal de datos de documentos de identidad.
 * Intenta múltiples estrategias en orden de especificidad:
 * 1. CURP mexicana (patrón único de 18 caracteres)
 * 2. MRZ de pasaporte (Machine Readable Zone - estándar ICAO 9303)
 * 3. Patrones genéricos (fechas, nombres, números de documento)
 */
function extraerDatosUniversal(lineas: string[], textoCompleto: string) {
  const texto = textoCompleto.toUpperCase();
  const datos: Record<string, string> = {};

  // ===== 1. CURP MEXICANA =====
  const curpRegex = /[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d/;
  const curpMatch = texto.match(curpRegex);
  if (curpMatch) {
    datos.curp = curpMatch[0];
    datos.tipoDocumento = "CURP Mexicana";
    const curp = curpMatch[0];
    const anio = parseInt(curp.substring(4, 6));
    const mes = curp.substring(6, 8);
    const dia = curp.substring(8, 10);
    const anioCompleto = anio > 30 ? 1900 + anio : 2000 + anio;
    datos.fechaNacimiento = `${anioCompleto}-${mes}-${dia}`;
    datos.genero = curp[10] === "H" ? "MASCULINO" : "FEMENINO";

    const estadosCurp: Record<string, string> = {
      AS: "Aguascalientes", BC: "Baja California", BS: "Baja California Sur",
      CC: "Campeche", CL: "Coahuila", CM: "Colima", CS: "Chiapas",
      CH: "Chihuahua", DF: "Ciudad de México", DG: "Durango",
      GT: "Guanajuato", GR: "Guerrero", HG: "Hidalgo", JC: "Jalisco",
      MC: "Estado de México", MN: "Michoacán", MS: "Morelos",
      NT: "Nayarit", NL: "Nuevo León", OC: "Oaxaca", PL: "Puebla",
      QT: "Querétaro", QR: "Quintana Roo", SP: "San Luis Potosí",
      SL: "Sinaloa", SR: "Sonora", TC: "Tabasco", TS: "Tamaulipas",
      TL: "Tlaxcala", VZ: "Veracruz", YN: "Yucatán", ZS: "Zacatecas",
      NE: "Nacido en el extranjero",
    };
    const codigoEstado = curp.substring(11, 13);
    if (estadosCurp[codigoEstado]) {
      datos.estado = estadosCurp[codigoEstado];
    }
  }

  // ===== 2. MRZ DE PASAPORTE (ICAO 9303) =====
  // Líneas de 44 caracteres con formato P<PAIS<<APELLIDO<<NOMBRE
  const mrzRegex = /P[<A-Z][A-Z]{3}[A-Z<]{39}/;
  const mrzLineas = lineas.filter(l => l.replace(/\s/g, "").length >= 42 && /^[A-Z0-9<]+$/.test(l.replace(/\s/g, "")));

  if (mrzLineas.length >= 2) {
    datos.tipoDocumento = "Pasaporte";
    const linea1 = mrzLineas[0].replace(/\s/g, "");
    const linea2 = mrzLineas[1].replace(/\s/g, "");

    // Línea 1: tipo + país + nombre
    if (linea1.length >= 44) {
      const pais = linea1.substring(2, 5).replace(/</g, "");
      datos.paisEmision = pais;

      const nombreParte = linea1.substring(5).split("<<");
      if (nombreParte.length >= 2) {
        datos.apellidoPaterno = nombreParte[0].replace(/</g, " ").trim();
        datos.nombre = nombreParte[1].replace(/</g, " ").trim();
      }
    }

    // Línea 2: número de pasaporte + nacionalidad + fecha nacimiento + sexo
    if (linea2.length >= 44) {
      datos.numeroDocumento = linea2.substring(0, 9).replace(/</g, "");
      const fechaNacMRZ = linea2.substring(13, 19); // AAMMDD
      if (/^\d{6}$/.test(fechaNacMRZ)) {
        const anio = parseInt(fechaNacMRZ.substring(0, 2));
        const anioCompleto = anio > 30 ? 1900 + anio : 2000 + anio;
        datos.fechaNacimiento = `${anioCompleto}-${fechaNacMRZ.substring(2, 4)}-${fechaNacMRZ.substring(4, 6)}`;
      }
      const sexo = linea2[20];
      if (sexo === "M" || sexo === "F") {
        datos.genero = sexo === "M" ? "MASCULINO" : "FEMENINO";
      }
    }
  }

  // ===== 3. CÉDULA COLOMBIANA =====
  const ccRegex = /(?:C\.?C\.?|CEDULA|CÉDULA)\s*(?:NO\.?)?\s*(\d{6,12})/i;
  const ccMatch = texto.match(ccRegex);
  if (ccMatch && !datos.tipoDocumento) {
    datos.numeroDocumento = ccMatch[1];
    datos.tipoDocumento = "Cédula de Ciudadanía";
  }

  // ===== 4. DNI/NIE ESPAÑOL =====
  const dniRegex = /(\d{8}[A-Z])|([XYZ]\d{7}[A-Z])/;
  const dniMatch = texto.match(dniRegex);
  if (dniMatch && !datos.tipoDocumento) {
    datos.numeroDocumento = dniMatch[0];
    datos.tipoDocumento = dniMatch[0].match(/^[XYZ]/) ? "NIE España" : "DNI España";
  }

  // ===== 5. INE MEXICANA (Clave de elector) =====
  const ineRegex = /[A-Z]{6}\d{8}[HM]\d{3}/;
  const ineMatch = texto.match(ineRegex);
  if (ineMatch && !datos.tipoDocumento) {
    datos.numeroDocumento = ineMatch[0];
    datos.tipoDocumento = "INE/IFE México";
  }

  // ===== 6. LICENCIA DE CONDUCIR (genérica) =====
  if (!datos.tipoDocumento) {
    const licenciaKeywords = /LICENCIA|LICENSE|DRIVER|CONDUCIR|PERMISO DE CONDUCCION/i;
    if (licenciaKeywords.test(texto)) {
      datos.tipoDocumento = "Licencia de Conducir";
      // Buscar número de licencia (secuencia alfanumérica prominente)
      const numLicencia = texto.match(/(?:NO\.?|NUM\.?|NUMBER|LICENCIA)\s*:?\s*([A-Z0-9]{6,15})/);
      if (numLicencia) {
        datos.numeroDocumento = numLicencia[1];
      }
    }
  }

  // ===== 7. DETECCIÓN GENÉRICA DE FECHAS =====
  if (!datos.fechaNacimiento) {
    // Formatos: DD/MM/AAAA, DD-MM-AAAA, MM/DD/AAAA, AAAA-MM-DD
    const fechaPatrones = [
      { regex: /(?:NACIMIENTO|BIRTH|NAC|DOB|F\.?\s*NAC)[:\s]*(\d{2})[\/\-.](\d{2})[\/\-.](\d{4})/, tipo: "dmy" },
      { regex: /(\d{4})[\/\-.](\d{2})[\/\-.](\d{2})/, tipo: "ymd" },
      { regex: /(\d{2})[\/\-.](\d{2})[\/\-.](\d{4})/, tipo: "dmy" },
    ];

    for (const patron of fechaPatrones) {
      const match = texto.match(patron.regex);
      if (match) {
        if (patron.tipo === "ymd") {
          datos.fechaNacimiento = `${match[1]}-${match[2]}-${match[3]}`;
        } else {
          datos.fechaNacimiento = `${match[3]}-${match[2]}-${match[1]}`;
        }
        break;
      }
    }
  }

  // ===== 8. DETECCIÓN GENÉRICA DE GÉNERO =====
  if (!datos.genero) {
    if (/\b(MASCULINO|MALE|HOMBRE|MASC|SEX:?\s*M)\b/.test(texto)) {
      datos.genero = "MASCULINO";
    } else if (/\b(FEMENINO|FEMALE|MUJER|FEM|SEX:?\s*F)\b/.test(texto)) {
      datos.genero = "FEMENINO";
    }
  }

  // ===== 9. DETECCIÓN GENÉRICA DE NOMBRE =====
  if (!datos.nombre && !datos.nombreCompleto) {
    // Buscar etiquetas comunes que preceden al nombre
    const nombrePatrones = [
      /(?:NOMBRE|NAME|GIVEN NAME|PRENOM)[S]?\s*:?\s*([A-ZÁÉÍÓÚÑÜÂÊÎÔÛÀÈÌÒÙ\s]{2,40})/i,
      /(?:APELLIDO|SURNAME|LAST NAME|NOM)\s*:?\s*([A-ZÁÉÍÓÚÑÜÂÊÎÔÛÀÈÌÒÙ\s]{2,40})/i,
    ];

    for (const patron of nombrePatrones) {
      const match = texto.match(patron);
      if (match) {
        const valor = match[1].trim();
        if (valor.length > 2 && !/^(NOMBRE|NAME|APELLIDO|SURNAME)$/i.test(valor)) {
          if (!datos.nombre) datos.nombre = valor;
          else if (!datos.apellidoPaterno) datos.apellidoPaterno = valor;
        }
      }
    }

    // Si no encontró con etiquetas, buscar líneas que parezcan nombres
    if (!datos.nombre) {
      for (const linea of lineas) {
        const limpia = linea.trim();
        if (
          /^[A-ZÁÉÍÓÚÑÜÂÊÎÔÛÀÈÌÒÙ\s-]+$/i.test(limpia) &&
          limpia.length >= 5 &&
          limpia.length <= 50 &&
          limpia.split(/\s+/).length >= 2 &&
          !/CURP|REGISTRO|NACIMIENTO|REPUBLIC|ESTADOS|GOBIERNO|SECRETARIA|ELECTORAL|INSTITUTO/i.test(limpia)
        ) {
          datos.nombreCompleto = limpia;
          const partes = limpia.split(/\s+/);
          if (partes.length >= 3) {
            datos.apellidoPaterno = partes[0];
            datos.apellidoMaterno = partes[1];
            datos.nombre = partes.slice(2).join(" ");
          } else if (partes.length === 2) {
            datos.apellidoPaterno = partes[0];
            datos.nombre = partes[1];
          }
          break;
        }
      }
    }
  }

  // ===== 10. NÚMERO DE DOCUMENTO GENÉRICO =====
  if (!datos.numeroDocumento && !datos.curp) {
    const numDocPatrones = [
      /(?:NO\.?|NUM\.?|NUMBER|FOLIO|DOCUMENTO)\s*:?\s*([A-Z0-9]{5,20})/,
      /(?:ID|IDENTIFICATION)\s*:?\s*([A-Z0-9]{5,20})/,
    ];
    for (const patron of numDocPatrones) {
      const match = texto.match(patron);
      if (match) {
        datos.numeroDocumento = match[1];
        break;
      }
    }
  }

  // ===== 11. NACIONALIDAD =====
  if (!datos.paisEmision) {
    const nacionalidadMatch = texto.match(/(?:NACIONALIDAD|NATIONALITY|CIUDADANIA)\s*:?\s*([A-ZÁÉÍÓÚÑ\s]{3,20})/i);
    if (nacionalidadMatch) {
      datos.nacionalidad = nacionalidadMatch[1].trim();
    }
  }

  // Si no se detectó tipo de documento pero hay datos extraídos
  if (!datos.tipoDocumento && (datos.nombre || datos.fechaNacimiento || datos.numeroDocumento)) {
    datos.tipoDocumento = "Documento de identidad";
  }

  return datos;
}

/**
 * Datos de demostración cuando no hay credenciales AWS configuradas.
 */
function obtenerDatosDemo() {
  const demos = [
    {
      nombre: "SOFIA",
      apellidoPaterno: "GARCIA",
      apellidoMaterno: "LOPEZ",
      fechaNacimiento: "2018-05-12",
      genero: "FEMENINO",
      curp: "GALS180512MDFRPF04",
      estado: "Ciudad de México",
      tipoDocumento: "CURP Mexicana",
    },
    {
      nombre: "DIEGO",
      apellidoPaterno: "MARTINEZ",
      apellidoMaterno: "REYES",
      fechaNacimiento: "2015-11-03",
      genero: "MASCULINO",
      curp: "MARD151103HMCRGY09",
      estado: "Estado de México",
      tipoDocumento: "CURP Mexicana",
    },
    {
      nombre: "VALENTINA",
      apellidoPaterno: "HERNANDEZ",
      apellidoMaterno: "CRUZ",
      fechaNacimiento: "2020-02-28",
      genero: "FEMENINO",
      curp: "HECV200228MDFRNL07",
      estado: "Jalisco",
      tipoDocumento: "CURP Mexicana",
    },
    {
      nombre: "JAMES",
      apellidoPaterno: "SMITH",
      fechaNacimiento: "2019-08-15",
      genero: "MASCULINO",
      numeroDocumento: "PA9284756",
      paisEmision: "USA",
      tipoDocumento: "Pasaporte",
    },
    {
      nombre: "MARIA JOSE",
      apellidoPaterno: "RODRIGUEZ",
      apellidoMaterno: "PEREZ",
      fechaNacimiento: "2017-03-22",
      genero: "FEMENINO",
      numeroDocumento: "1098765432",
      tipoDocumento: "Cédula de Ciudadanía",
    },
  ];
  return demos[Math.floor(Math.random() * demos.length)];
}
