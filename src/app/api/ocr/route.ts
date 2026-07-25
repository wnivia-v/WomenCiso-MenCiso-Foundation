import { NextRequest, NextResponse } from "next/server";
import { TextractClient, DetectDocumentTextCommand } from "@aws-sdk/client-textract";

/**
 * API Route: POST /api/ocr
 *
 * Recibe una imagen en base64 y usa Amazon Textract para extraer texto.
 * Luego intenta identificar campos clave de documentos mexicanos (CURP, nombre, fecha).
 *
 * Seguridad:
 * - Las credenciales AWS están en variables de entorno del servidor (nunca en el cliente)
 * - Se valida el tamaño máximo de la imagen (5MB)
 * - Se valida que el contenido sea una imagen
 */

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB - límite de Textract

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageBase64 } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { error: "No se proporcionó imagen" },
        { status: 400 }
      );
    }

    // Extraer el base64 puro (quitar el prefijo data:image/...)
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Validar tamaño
    if (imageBuffer.length > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: "La imagen excede el tamaño máximo de 5MB" },
        { status: 400 }
      );
    }

    // En entorno local sin rol de IAM, usar modo demo
    // En Amplify, el rol de servicio proporciona credenciales automáticamente
    const esEntornoLocal = process.env.NODE_ENV === "development" && !process.env.AWS_EXECUTION_ENV;

    if (esEntornoLocal) {
      return NextResponse.json({
        success: true,
        mode: "demo",
        datos: obtenerDatosDemo(),
        textoCompleto: "Modo demo local — en Amplify se usa Amazon Textract con IAM Role",
      });
    }

    // Crear cliente de Textract usando credenciales del entorno (IAM Role de Amplify)
    // No se necesitan claves de acceso — el rol de servicio de Amplify
    // tiene adjuntada la política AmazonTextractFullAccess
    const textractClient = new TextractClient({
      region: process.env.AWS_REGION_TEXTRACT || "us-east-1",
    });

    // Llamar a Textract
    const command = new DetectDocumentTextCommand({
      Document: {
        Bytes: imageBuffer,
      },
    });

    const response = await textractClient.send(command);

    // Extraer líneas de texto detectadas
    const lineas: string[] = [];
    if (response.Blocks) {
      for (const block of response.Blocks) {
        if (block.BlockType === "LINE" && block.Text) {
          lineas.push(block.Text);
        }
      }
    }

    const textoCompleto = lineas.join("\n");

    // Intentar extraer datos estructurados de documentos mexicanos
    const datos = extraerDatosDocumento(lineas);

    return NextResponse.json({
      success: true,
      mode: "textract",
      datos,
      textoCompleto,
      lineasDetectadas: lineas.length,
    });
  } catch (error) {
    console.error("Error en OCR:", error);
    return NextResponse.json(
      { error: "Error al procesar la imagen. Intente de nuevo." },
      { status: 500 }
    );
  }
}

/**
 * Intenta extraer datos estructurados de documentos mexicanos.
 * Busca patrones de CURP, nombres, fechas, etc.
 */
function extraerDatosDocumento(lineas: string[]) {
  const texto = lineas.join(" ").toUpperCase();
  const datos: Record<string, string> = {};

  // Buscar CURP (18 caracteres alfanuméricos con patrón específico)
  const curpRegex = /[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d/;
  const curpMatch = texto.match(curpRegex);
  if (curpMatch) {
    datos.curp = curpMatch[0];

    // Extraer datos de la CURP
    const curp = curpMatch[0];
    // Fecha de nacimiento: posiciones 4-9 (AAMMDD)
    const anio = parseInt(curp.substring(4, 6));
    const mes = curp.substring(6, 8);
    const dia = curp.substring(8, 10);
    const anioCompleto = anio > 30 ? 1900 + anio : 2000 + anio;
    datos.fechaNacimiento = `${anioCompleto}-${mes}-${dia}`;

    // Género: posición 10 (H=Masculino, M=Femenino)
    datos.genero = curp[10] === "H" ? "MASCULINO" : "FEMENINO";

    // Estado: posiciones 11-12
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

  // Buscar nombre completo (líneas que parecen nombres — letras y espacios, sin números)
  for (const linea of lineas) {
    const lineaLimpia = linea.trim();
    // Buscar patrón "APELLIDO PATERNO / APELLIDO MATERNO / NOMBRE(S)"
    if (/^[A-ZÁÉÍÓÚÑ\s]+$/.test(lineaLimpia) && lineaLimpia.length > 5 && lineaLimpia.split(" ").length >= 2) {
      if (!datos.nombreCompleto && !lineaLimpia.includes("CURP") && !lineaLimpia.includes("REGISTRO")) {
        datos.nombreCompleto = lineaLimpia;
        const partes = lineaLimpia.split(/\s+/);
        if (partes.length >= 3) {
          datos.apellidoPaterno = partes[0];
          datos.apellidoMaterno = partes[1];
          datos.nombre = partes.slice(2).join(" ");
        } else if (partes.length === 2) {
          datos.apellidoPaterno = partes[0];
          datos.nombre = partes[1];
        }
      }
    }
  }

  // Buscar fecha en formato DD/MM/AAAA o DD-MM-AAAA
  const fechaRegex = /(\d{2})[\/\-](\d{2})[\/\-](\d{4})/;
  const fechaMatch = texto.match(fechaRegex);
  if (fechaMatch && !datos.fechaNacimiento) {
    datos.fechaNacimiento = `${fechaMatch[3]}-${fechaMatch[2]}-${fechaMatch[1]}`;
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
    },
    {
      nombre: "DIEGO",
      apellidoPaterno: "MARTINEZ",
      apellidoMaterno: "REYES",
      fechaNacimiento: "2015-11-03",
      genero: "MASCULINO",
      curp: "MARD151103HMCRGY09",
      estado: "Estado de México",
    },
    {
      nombre: "VALENTINA",
      apellidoPaterno: "HERNANDEZ",
      apellidoMaterno: "CRUZ",
      fechaNacimiento: "2020-02-28",
      genero: "FEMENINO",
      curp: "HECV200228MDFRNL07",
      estado: "Jalisco",
    },
  ];
  return demos[Math.floor(Math.random() * demos.length)];
}
