"use client";

import { Heart, Calendar, FileText, Phone, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QRExpediente } from "@/components/qr-expediente";

const expediente = {
  paciente: "Sofía García López",
  edad: 8,
  fechaIngreso: "15 de marzo, 2026",
  diagnostico: "Quemadura de 2° grado superficial en antebrazo izquierdo",
  scq: "8%",
  causa: "Escaldadura — líquido caliente",
  hospitalActual: "Hospital Pediátrico de Tacubaya",
  medicoTratante: "Dra. Patricia Hernández",
  estado: "EN_RECUPERACION",
  proximaCita: "28 de julio, 2026 — Control de cicatrización",
};

const historial = [
  { fecha: "15/03/2026", evento: "Ingreso por emergencia — Triage GRAVE", tipo: "emergencia" },
  { fecha: "16/03/2026", evento: "Cirugía de desbridamiento", tipo: "cirugia" },
  { fecha: "22/03/2026", evento: "Alta hospitalaria — seguimiento ambulatorio", tipo: "alta" },
  { fecha: "05/04/2026", evento: "Control 1 — Evolución favorable", tipo: "control" },
  { fecha: "03/05/2026", evento: "Control 2 — Inicio terapia compresiva", tipo: "control" },
  { fecha: "14/06/2026", evento: "Control 3 — Cicatrización al 80%", tipo: "control" },
  { fecha: "10/07/2026", evento: "Sesión psicología — Adaptación escolar", tipo: "psicologia" },
];

export default function MiExpedientePage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy-800 md:text-2xl">Mi Expediente</h1>
          <p className="text-sm text-navy-500">Información del paciente y seguimiento</p>
        </div>
        <QRExpediente pacienteId="PAC-2026-0089" pacienteNombre={expediente.paciente} />
      </div>

      {/* Resumen del paciente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              {expediente.paciente}
            </span>
            <Badge variant="info">{expediente.edad} años</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <div>
                <p className="text-xs text-navy-400">Diagnóstico</p>
                <p className="text-sm font-medium text-navy-700">{expediente.diagnostico}</p>
              </div>
              <div>
                <p className="text-xs text-navy-400">Causa</p>
                <p className="text-sm text-navy-700">{expediente.causa}</p>
              </div>
              <div>
                <p className="text-xs text-navy-400">SCQ</p>
                <p className="text-sm text-navy-700">{expediente.scq}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-navy-400">Hospital</p>
                <p className="text-sm font-medium text-navy-700">{expediente.hospitalActual}</p>
              </div>
              <div>
                <p className="text-xs text-navy-400">Médico tratante</p>
                <p className="text-sm text-navy-700">{expediente.medicoTratante}</p>
              </div>
              <div>
                <p className="text-xs text-navy-400">Estado</p>
                <Badge variant="success">En recuperación</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Próxima cita */}
      <Card className="border-gold-200 bg-gold-50/30">
        <CardContent className="flex items-center gap-3 p-4">
          <Calendar className="h-8 w-8 text-gold-500 shrink-0" />
          <div>
            <p className="text-xs font-medium text-gold-700">Próxima cita</p>
            <p className="text-sm font-semibold text-navy-800">{expediente.proximaCita}</p>
          </div>
        </CardContent>
      </Card>

      {/* Contacto de emergencia */}
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <Phone className="h-5 w-5 text-navy-500 shrink-0" />
          <div>
            <p className="text-xs text-navy-400">Línea de atención WomenCiso y MenCiso</p>
            <p className="text-sm font-semibold text-navy-800">800 000 XXXX (24/7)</p>
          </div>
        </CardContent>
      </Card>

      {/* Historial */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-navy-600" />
            Historial de Atención
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {historial.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-100 text-[10px] font-bold text-navy-600">
                  {historial.length - i}
                </div>
                <div className="flex-1 border-b border-gray-50 pb-2">
                  <p className="text-sm text-navy-700">{item.evento}</p>
                  <p className="text-xs text-navy-400">{item.fecha}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
