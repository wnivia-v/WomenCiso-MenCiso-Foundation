"use client";

import { useState } from "react";
import { FileDown, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DatosReporte {
  titulo: string;
  paciente?: string;
  edad?: string;
  gravedad?: string;
  prioridad?: string;
  causa?: string;
  superficie?: string;
  zonas?: string[];
  hospital?: string;
  fecha?: string;
  reportadoPor?: string;
  ubicacion?: string;
  observaciones?: string;
  gps?: { lat: number; lng: number } | null;
}

interface ExportarPDFProps {
  datos: DatosReporte;
}

/**
 * Genera un reporte de canalización imprimible.
 *
 * Usa la API nativa del navegador (window.print) sobre un documento HTML
 * formateado. Esta decisión es deliberada:
 *
 * - No agrega dependencias pesadas (jsPDF, html2pdf) que inflan el bundle.
 * - Funciona offline (importante para la PWA en zonas sin señal).
 * - El resultado es un PDF real cuando el usuario elige "Guardar como PDF"
 *   en el diálogo de impresión.
 * - Funciona en todos los navegadores y dispositivos sin configuración.
 *
 * El hospital recibe este documento con todos los datos del triage para
 * preparar la atención antes de que llegue el paciente.
 */
export function ExportarPDF({ datos }: ExportarPDFProps) {
  const [estado, setEstado] = useState<"idle" | "generando" | "listo">("idle");

  const generar = () => {
    setEstado("generando");

    const ahora = new Date();
    const fechaFormateada = ahora.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Reporte de Canalizacion - ${datos.paciente || "Paciente"}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #1a2332; padding: 20mm; line-height: 1.5; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #1B2A4A; padding-bottom: 12px; margin-bottom: 20px; }
    .logo-area h1 { font-size: 16px; color: #1B2A4A; font-weight: 800; }
    .logo-area p { font-size: 10px; color: #666; }
    .meta { text-align: right; font-size: 10px; color: #666; }
    .meta strong { color: #1B2A4A; }
    .gravedad { display: inline-block; padding: 6px 16px; border-radius: 8px; font-weight: 800; font-size: 18px; margin: 12px 0; }
    .CRITICO { background: #fef2f2; color: #991b1b; border: 2px solid #ef4444; }
    .GRAVE { background: #fff7ed; color: #9a3412; border: 2px solid #f97316; }
    .MODERADO { background: #fefce8; color: #854d0e; border: 2px solid #eab308; }
    .LEVE { background: #f0fdf4; color: #166534; border: 2px solid #22c55e; }
    .section { margin-bottom: 16px; }
    .section-title { font-size: 11px; font-weight: 700; color: #1B2A4A; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-bottom: 8px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .field label { font-size: 9px; text-transform: uppercase; color: #6b7280; font-weight: 600; }
    .field value, .field p { font-size: 12px; color: #1a2332; font-weight: 500; }
    .zonas { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
    .zona-tag { background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 4px; padding: 2px 8px; font-size: 10px; }
    .footer { margin-top: 30px; padding-top: 12px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 9px; color: #9ca3af; }
    .alerta { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 10px; margin: 12px 0; font-size: 11px; color: #991b1b; }
    @media print { body { padding: 15mm; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-area">
      <h1>WomenCiso y MenCiso Foundation</h1>
      <p>Sistema Integral de Atencion a Quemados</p>
      <p>Reporte de Canalizacion</p>
    </div>
    <div class="meta">
      <p><strong>Fecha:</strong> ${fechaFormateada}</p>
      <p><strong>Folio:</strong> EMG-${Date.now().toString(36).toUpperCase()}</p>
      <p><strong>Generado por:</strong> Triage Rapido</p>
    </div>
  </div>

  <div style="text-align:center;">
    <span class="gravedad ${datos.gravedad || ""}">${datos.gravedad || "SIN CLASIFICAR"}</span>
    <p style="font-size:11px; color:#666; margin-top:4px;">Prioridad: ${datos.prioridad || "—"}</p>
  </div>

  <div class="section">
    <div class="section-title">Datos del Paciente</div>
    <div class="grid">
      <div class="field"><label>Nombre</label><p>${datos.paciente || "No identificado"}</p></div>
      <div class="field"><label>Edad</label><p>${datos.edad || "—"} anos</p></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Datos de la Quemadura</div>
    <div class="grid">
      <div class="field"><label>Causa</label><p>${datos.causa || "—"}</p></div>
      <div class="field"><label>Superficie Corporal (SCQ)</label><p>${datos.superficie || "—"}%</p></div>
    </div>
    ${datos.zonas && datos.zonas.length > 0 ? `
    <div style="margin-top:8px;">
      <label style="font-size:9px; text-transform:uppercase; color:#6b7280; font-weight:600;">Zonas afectadas</label>
      <div class="zonas">${datos.zonas.map((z) => `<span class="zona-tag">${z}</span>`).join("")}</div>
    </div>` : ""}
  </div>

  <div class="section">
    <div class="section-title">Hospital Recomendado</div>
    <p style="font-size:14px; font-weight:700; color:#1B2A4A;">${datos.hospital || "Por definir"}</p>
  </div>

  <div class="section">
    <div class="section-title">Informacion del Reporte</div>
    <div class="grid">
      <div class="field"><label>Reportado por</label><p>${datos.reportadoPor || "—"}</p></div>
      <div class="field"><label>Ubicacion</label><p>${datos.ubicacion || "—"}</p></div>
    </div>
    ${datos.gps ? `<p style="font-size:10px; color:#666; margin-top:4px;">GPS: ${datos.gps.lat.toFixed(5)}, ${datos.gps.lng.toFixed(5)}</p>` : ""}
    ${datos.observaciones ? `<div style="margin-top:8px;"><label style="font-size:9px; text-transform:uppercase; color:#6b7280; font-weight:600;">Observaciones</label><p style="font-size:11px; margin-top:2px;">${datos.observaciones}</p></div>` : ""}
  </div>

  <div class="alerta">
    <strong>IMPORTANTE:</strong> Este reporte es una orientacion generada por un sistema automatizado. No sustituye la valoracion medica. El hospital receptor debe realizar su propia evaluacion al ingreso del paciente.
  </div>

  <div class="footer">
    <p>WomenCiso y MenCiso Foundation — Sistema de Atencion Integral a Quemados</p>
    <p>Todos los derechos reservados &copy; 2026 Wladimir Nivia — Ing. Informatico</p>
    <p>Documento generado automaticamente. Valido como referencia de canalizacion.</p>
  </div>
</body>
</html>`;

    // Abrir ventana de impresión
    const ventana = window.open("", "_blank", "width=800,height=600");
    if (ventana) {
      ventana.document.write(html);
      ventana.document.close();
      setTimeout(() => {
        ventana.print();
        setEstado("listo");
        setTimeout(() => setEstado("idle"), 3000);
      }, 500);
    } else {
      // Fallback si el popup está bloqueado
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte-canalizacion-${datos.paciente || "paciente"}.html`;
      a.click();
      URL.revokeObjectURL(url);
      setEstado("listo");
      setTimeout(() => setEstado("idle"), 3000);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full sm:w-auto"
      onClick={generar}
      disabled={estado === "generando"}
    >
      {estado === "generando" && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
      {estado === "listo" && <CheckCircle2 className="mr-1.5 h-4 w-4 text-green-600" />}
      {estado === "idle" && <FileDown className="mr-1.5 h-4 w-4" />}
      {estado === "listo" ? "PDF Generado" : "Exportar PDF"}
    </Button>
  );
}
