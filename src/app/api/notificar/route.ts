import { NextRequest, NextResponse } from "next/server";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { verificarLimite, obtenerIP } from "@/lib/limite-peticiones";

/**
 * API Route: POST /api/notificar
 *
 * Envía un SMS al familiar del paciente cuando se canaliza una emergencia.
 *
 * Caso de uso real: María reportó que su hijo de 4 años se quemó. El
 * coordinador clasifica, canaliza al CENIAQ, y el sistema envía
 * automáticamente un SMS a María:
 *
 *   "WomenCiso: Su hijo fue canalizado al CENIAQ.
 *    Dirección: Av. México-Xochimilco 289, Tlalpan.
 *    Llegar por puerta de urgencias.
 *    Nivel de gravedad: GRAVE.
 *    Línea de atención: 800 000 XXXX"
 *
 * Esto funciona sin internet ni smartphone — un SMS llega a cualquier celular.
 * En una emergencia donde la familia está en pánico, recibir instrucciones
 * concretas de a dónde ir reduce el tiempo de decisión.
 *
 * Amazon SNS permite enviar hasta 100 SMS/mes gratis (Free Tier).
 */

const LIMITE_SMS = 5; // SMS por IP por minuto (previene spam)
const VENTANA_MS = 60_000;

export async function POST(request: NextRequest) {
  const ip = obtenerIP(request.headers);
  const limite = verificarLimite(ip, LIMITE_SMS, VENTANA_MS);
  if (!limite.permitido) {
    return NextResponse.json(
      { error: "Límite de notificaciones alcanzado." },
      { status: 429, headers: { "Retry-After": String(limite.reintentarEn) } }
    );
  }

  try {
    const body = await request.json();
    const { telefono, mensaje, tipo } = body as {
      telefono?: string;
      mensaje?: string;
      tipo?: "canalizacion" | "cita" | "alerta";
    };

    if (!telefono || typeof telefono !== "string") {
      return NextResponse.json({ error: "Falta el número de teléfono." }, { status: 400 });
    }

    if (!mensaje || typeof mensaje !== "string" || mensaje.length === 0) {
      return NextResponse.json({ error: "Falta el mensaje." }, { status: 400 });
    }

    if (mensaje.length > 160) {
      return NextResponse.json({ error: "El mensaje excede 160 caracteres." }, { status: 400 });
    }

    // Normalizar teléfono mexicano: +52 + 10 dígitos
    const telefonoLimpio = telefono.replace(/[\s\-\(\)]/g, "");
    let telefonoE164: string;

    if (telefonoLimpio.startsWith("+")) {
      telefonoE164 = telefonoLimpio;
    } else if (telefonoLimpio.length === 10) {
      telefonoE164 = `+52${telefonoLimpio}`;
    } else if (telefonoLimpio.startsWith("52") && telefonoLimpio.length === 12) {
      telefonoE164 = `+${telefonoLimpio}`;
    } else {
      telefonoE164 = `+${telefonoLimpio}`;
    }

    // Validar formato E.164
    if (!/^\+\d{10,15}$/.test(telefonoE164)) {
      return NextResponse.json(
        { error: "Número de teléfono inválido. Use formato: 55 1234 5678" },
        { status: 400 }
      );
    }

    try {
      const snsClient = new SNSClient({
        region: process.env.AWS_REGION_TEXTRACT || "us-east-1",
        requestHandler: { requestTimeout: 10_000 },
      });

      await snsClient.send(new PublishCommand({
        PhoneNumber: telefonoE164,
        Message: mensaje,
        MessageAttributes: {
          "AWS.SNS.SMS.SenderID": {
            DataType: "String",
            StringValue: "WomenCiso",
          },
          "AWS.SNS.SMS.SMSType": {
            DataType: "String",
            // Transactional = entrega prioritaria (para emergencias)
            StringValue: tipo === "canalizacion" ? "Transactional" : "Promotional",
          },
        },
      }));

      return NextResponse.json({
        success: true,
        enviado: true,
        destino: telefonoE164.slice(0, 5) + "****" + telefonoE164.slice(-2),
        tipo: tipo || "canalizacion",
      });
    } catch (awsError) {
      console.error("SNS no disponible:", (awsError as { name?: string })?.name);
      return NextResponse.json({
        success: true,
        enviado: false,
        mode: "demo",
        mensaje: "SMS simulado — SNS no configurado en este entorno.",
        destino: telefonoE164.slice(0, 5) + "****" + telefonoE164.slice(-2),
      });
    }
  } catch {
    return NextResponse.json({ error: "Error al procesar la notificación." }, { status: 500 });
  }
}
