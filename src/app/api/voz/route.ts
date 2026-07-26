import { NextRequest, NextResponse } from "next/server";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { verificarLimite, obtenerIP } from "@/lib/limite-peticiones";

/**
 * API Route: POST /api/voz
 *
 * Convierte texto en audio usando Amazon Polly con voz neural.
 * Devuelve un stream de audio MP3 que el navegador reproduce directamente.
 *
 * Voz seleccionada: "Lupe" — español mexicano, motor neural.
 * Suena como una persona real, no como un robot.
 *
 * Seguridad:
 * - Rate limiting (20 peticiones/minuto — la lectura genera más llamadas que el OCR)
 * - Límite de texto (1000 caracteres por petición)
 * - Credenciales vía IAM Role (sin claves hardcodeadas)
 * - Sin caché de respuestas (el audio puede contener datos del paciente leídos)
 */

const MAX_CARACTERES = 1000;
const LIMITE_PETICIONES = 20;
const VENTANA_MS = 60_000;

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = obtenerIP(request.headers);
  const limite = verificarLimite(ip, LIMITE_PETICIONES, VENTANA_MS);
  if (!limite.permitido) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes de voz." },
      { status: 429, headers: { "Retry-After": String(limite.reintentarEn) } }
    );
  }

  try {
    const body = await request.json();
    const { texto, idioma } = body as { texto?: string; idioma?: string };

    if (!texto || typeof texto !== "string" || texto.trim().length === 0) {
      return NextResponse.json({ error: "Texto vacío." }, { status: 400 });
    }

    if (texto.length > MAX_CARACTERES) {
      return NextResponse.json(
        { error: `El texto excede el límite de ${MAX_CARACTERES} caracteres.` },
        { status: 400 }
      );
    }

    // Seleccionar voz según idioma
    // Lupe: español mexicano neural (suena muy natural)
    // Ruth: inglés estadounidense neural
    const voiceId = idioma === "en" ? "Ruth" : "Lupe";
    const langCode = idioma === "en" ? "en-US" : "es-MX";

    try {
      const pollyClient = new PollyClient({
        region: process.env.AWS_REGION_TEXTRACT || "us-east-1",
        requestHandler: { requestTimeout: 10_000 },
      });

      const command = new SynthesizeSpeechCommand({
        Text: texto,
        OutputFormat: "mp3",
        VoiceId: voiceId,
        LanguageCode: langCode,
        Engine: "neural", // Voz neural — mucho más natural que la estándar
      });

      const response = await pollyClient.send(command);

      if (!response.AudioStream) {
        return NextResponse.json({ error: "No se generó audio." }, { status: 500 });
      }

      // Convertir el stream a bytes
      const chunks: Uint8Array[] = [];
      const reader = response.AudioStream as AsyncIterable<Uint8Array>;
      for await (const chunk of reader) {
        chunks.push(chunk);
      }
      const audioBuffer = Buffer.concat(chunks);

      return new NextResponse(audioBuffer, {
        status: 200,
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Length": String(audioBuffer.length),
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        },
      });
    } catch (awsError) {
      // Si Polly no está disponible, devolver indicación para que el cliente
      // use el fallback del navegador (SpeechSynthesis)
      console.error("Polly no disponible:", (awsError as { name?: string })?.name);
      return NextResponse.json(
        { error: "fallback", mensaje: "Servicio de voz no disponible, usando voz del navegador." },
        { status: 503 }
      );
    }
  } catch {
    return NextResponse.json({ error: "Error al procesar la solicitud." }, { status: 500 });
  }
}
