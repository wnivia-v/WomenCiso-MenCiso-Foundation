/**
 * Limitador de peticiones por IP, en memoria.
 *
 * Contexto y limitaciones — esto importa entenderlo:
 *
 * El estado vive en la memoria del proceso. En Amplify, cada instancia de
 * cómputo tiene su propio contador, así que un atacante distribuido entre
 * muchas instancias obtiene un límite efectivo mayor al configurado. Tampoco
 * sobrevive a un reinicio del proceso.
 *
 * Entonces por qué existe: la ruta /api/ocr invoca Amazon Textract y
 * Rekognition, que se cobran por llamada. Sin ningún freno, un script trivial
 * puede generar miles de invocaciones y una factura considerable en minutos.
 * Este limitador no detiene a un atacante decidido, pero convierte un ataque
 * gratuito y automático en uno que requiere infraestructura distribuida. Es una
 * mitigación de costo, no una defensa perimetral.
 *
 * La defensa real para producción es AWS WAF con reglas de tasa por IP delante
 * de Amplify, que actúa antes de que la petición consuma cómputo. Está anotado
 * en el roadmap de la auditoría de seguridad.
 */

interface Ventana {
  conteo: number;
  expiraEn: number;
}

const registros = new Map<string, Ventana>();

/** Elimina ventanas vencidas para que el Map no crezca sin límite. */
function limpiar(ahora: number) {
  for (const [clave, ventana] of registros) {
    if (ventana.expiraEn <= ahora) registros.delete(clave);
  }
}

export interface ResultadoLimite {
  permitido: boolean;
  restantes: number;
  /** Segundos que faltan para que se reinicie la ventana. */
  reintentarEn: number;
}

/**
 * @param identificador Normalmente la IP del cliente.
 * @param maxPeticiones Peticiones permitidas dentro de la ventana.
 * @param ventanaMs Duración de la ventana en milisegundos.
 */
export function verificarLimite(
  identificador: string,
  maxPeticiones: number,
  ventanaMs: number
): ResultadoLimite {
  const ahora = Date.now();

  // La limpieza es probabilística para no recorrer todo el Map en cada
  // petición; con tráfico bajo el Map se mantiene pequeño de todas formas.
  if (Math.random() < 0.05) limpiar(ahora);

  const existente = registros.get(identificador);

  if (!existente || existente.expiraEn <= ahora) {
    registros.set(identificador, { conteo: 1, expiraEn: ahora + ventanaMs });
    return { permitido: true, restantes: maxPeticiones - 1, reintentarEn: 0 };
  }

  if (existente.conteo >= maxPeticiones) {
    return {
      permitido: false,
      restantes: 0,
      reintentarEn: Math.ceil((existente.expiraEn - ahora) / 1000),
    };
  }

  existente.conteo += 1;
  return {
    permitido: true,
    restantes: maxPeticiones - existente.conteo,
    reintentarEn: 0,
  };
}

/**
 * Extrae la IP del cliente de las cabeceras del proxy.
 *
 * Amplify sitúa CloudFront delante, que fija `x-forwarded-for`. Se toma el
 * primer valor de la lista, que es el cliente original; los siguientes son los
 * proxies intermedios. Un cliente puede falsificar esta cabecera, así que no
 * sirve para autorización, solo para agrupar tráfico.
 */
export function obtenerIP(cabeceras: Headers): string {
  const forwarded = cabeceras.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return cabeceras.get("x-real-ip") || "desconocida";
}
