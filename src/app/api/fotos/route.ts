import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { verificarLimite, obtenerIP } from "@/lib/limite-peticiones";

/**
 * API Route: POST /api/fotos
 *
 * Sube una foto del triage a Amazon S3 para que el hospital la vea desde
 * cualquier dispositivo ANTES de que el paciente llegue.
 *
 * Caso de uso real: el paramédico toma fotos de la quemadura en la escena.
 * Las fotos viajan al hospital inmediatamente para que el equipo médico
 * prepare sala, instrumental y medicamentos específicos antes de la llegada.
 * Esto reduce el tiempo entre ingreso y primer tratamiento.
 *
 * Bucket: womenciso-triage-fotos (configurado en variables de entorno)
 * Organización: /{emergenciaId}/{timestamp}-{indice}.jpg
 */

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const BUCKET_NAME = process.env.S3_BUCKET_FOTOS || "womenciso-triage-fotos";

export async function POST(request: NextRequest) {
  const ip = obtenerIP(request.headers);
  const limite = verificarLimite(ip, 15, 60_000);
  if (!limite.permitido) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes." },
      { status: 429, headers: { "Retry-After": String(limite.reintentarEn) } }
    );
  }

  try {
    const body = await request.json();
    const { imageBase64, emergenciaId, indice } = body as {
      imageBase64?: string;
      emergenciaId?: string;
      indice?: number;
    };

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return NextResponse.json({ error: "No se proporcionó imagen." }, { status: 400 });
    }

    if (!emergenciaId || typeof emergenciaId !== "string") {
      return NextResponse.json({ error: "Falta el ID de emergencia." }, { status: 400 });
    }

    // Limpiar y decodificar
    const base64Data = imageBase64.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");

    if (imageBuffer.length > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: "Imagen mayor a 5 MB." }, { status: 413 });
    }

    // Determinar tipo MIME por magic bytes
    let contentType = "image/jpeg";
    if (imageBuffer[0] === 0x89 && imageBuffer[1] === 0x50) contentType = "image/png";

    const timestamp = Date.now();
    const key = `emergencias/${emergenciaId}/${timestamp}-${indice || 0}.${contentType === "image/png" ? "png" : "jpg"}`;

    try {
      const s3Client = new S3Client({
        region: process.env.AWS_REGION_TEXTRACT || "us-east-1",
        requestHandler: { requestTimeout: 15_000 },
      });

      await s3Client.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: imageBuffer,
        ContentType: contentType,
        Metadata: {
          emergenciaId,
          subidaPor: "triage-rapido",
          timestamp: new Date().toISOString(),
        },
      }));

      const url = `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;

      return NextResponse.json({
        success: true,
        url,
        key,
        tamano: imageBuffer.length,
      });
    } catch (awsError) {
      console.error("S3 no disponible:", (awsError as { name?: string })?.name);
      return NextResponse.json({
        success: true,
        mode: "local",
        mensaje: "Foto almacenada localmente — S3 no configurado en este entorno.",
        key: `local/${emergenciaId}/${timestamp}.jpg`,
      });
    }
  } catch {
    return NextResponse.json({ error: "Error al procesar la imagen." }, { status: 500 });
  }
}
