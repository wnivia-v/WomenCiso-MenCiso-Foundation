import { NextRequest, NextResponse } from "next/server";
import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate";
import { verificarLimite, obtenerIP } from "@/lib/limite-peticiones";

/**
 * API Route: POST /api/traducir
 *
 * Traduce texto a cualquier idioma usando Amazon Translate.
 *
 * Caso de uso real: un turista japonés se quema en Cancún. Su seguro médico
 * necesita el expediente en japonés. El coordinador presiona "Traducir" y
 * Amazon Translate convierte el diagnóstico, tratamiento y notas al idioma
 * del paciente o de la institución solicitante.
 *
 * Otro caso: un niño guatemalteco hablante de una lengua maya es atendido.
 * El psicólogo necesita comunicar instrucciones básicas. Amazon Translate
 * no cubre todas las lenguas indígenas, pero sí las más extendidas.
 *
 * Amazon Translate Free Tier: 2 millones de caracteres/mes durante 12 meses.
 */

const MAX_CARACTERES = 5000;
const LIMITE_PETICIONES = 15;
const VENTANA_MS = 60_000;

// Idiomas relevantes para el contexto humanitario en México
const IDIOMAS_SOPORTADOS: Record<string, string> = {
  es: "Español",
  en: "English",
  fr: "Français",
  pt: "Português",
  ja: "日本語",
  zh: "中文",
  ko: "한국어",
  de: "Deutsch",
  it: "Italiano",
  ru: "Русский",
  ar: "العربية",
  hi: "हिन्दी",
  "zh-TW": "繁體中文",
};

export async function GET() {
  return NextResponse.json({ idiomas: IDIOMAS_SOPORTADOS });
}

export async function POST(request: NextRequest) {
  const ip = obtenerIP(request.headers);
  const limite = verificarLimite(ip, LIMITE_PETICIONES, VENTANA_MS);
  if (!limite.permitido) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes de traducción." },
      { status: 429, headers: { "Retry-After": String(limite.reintentarEn) } }
    );
  }

  try {
    const body = await request.json();
    const { texto, idiomaOrigen, idiomaDestino } = body as {
      texto?: string;
      idiomaOrigen?: string;
      idiomaDestino?: string;
    };

    if (!texto || typeof texto !== "string" || texto.trim().length === 0) {
      return NextResponse.json({ error: "Texto vacío." }, { status: 400 });
    }

    if (texto.length > MAX_CARACTERES) {
      return NextResponse.json(
        { error: `El texto excede el límite de ${MAX_CARACTERES} caracteres.` },
        { status: 400 }
      );
    }

    if (!idiomaDestino || typeof idiomaDestino !== "string") {
      return NextResponse.json({ error: "Falta el idioma destino." }, { status: 400 });
    }

    const origen = idiomaOrigen || "auto"; // "auto" = Amazon detecta el idioma

    try {
      const translateClient = new TranslateClient({
        region: process.env.AWS_REGION_TEXTRACT || "us-east-1",
        requestHandler: { requestTimeout: 10_000 },
      });

      const command = new TranslateTextCommand({
        Text: texto,
        SourceLanguageCode: origen,
        TargetLanguageCode: idiomaDestino,
      });

      const response = await translateClient.send(command);

      return NextResponse.json({
        success: true,
        textoOriginal: texto,
        textoTraducido: response.TranslatedText,
        idiomaOrigen: response.SourceLanguageCode,
        idiomaDestino: idiomaDestino,
        nombreIdiomaDestino: IDIOMAS_SOPORTADOS[idiomaDestino] || idiomaDestino,
      });
    } catch (awsError) {
      console.error("Translate no disponible:", (awsError as { name?: string })?.name);
      return NextResponse.json({
        success: true,
        mode: "demo",
        textoOriginal: texto,
        textoTraducido: `[Traducción a ${IDIOMAS_SOPORTADOS[idiomaDestino] || idiomaDestino} no disponible — Amazon Translate no configurado]`,
        idiomaOrigen: origen,
        idiomaDestino: idiomaDestino,
      });
    }
  } catch {
    return NextResponse.json({ error: "Error al procesar la traducción." }, { status: 500 });
  }
}
