import { FileText, Calendar, Scissors, Pill } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const expedientes = [
  {
    id: "1", paciente: "María García López", edad: 4,
    diagnostico: "Quemadura 2° profundo por escaldadura. SCQ 15%. Brazo derecho y torso anterior.",
    pronostico: "Favorable. Riesgo de contractura en codo derecho.",
    tratamiento: "Desbridamiento + curaciones diarias con sulfadiazina de plata.",
    medicamentos: "Sulfadiazina tópica, Paracetamol, Ibuprofeno",
    estado: "ACTIVO",
    cirugias: [{ tipo: "Desbridamiento quirúrgico", fecha: "24 Jul 2026", hospital: "CENIAQ", resultado: "Exitoso" }],
    proximaCita: "26 Jul", documentos: 4,
  },
  {
    id: "2", paciente: "Carlos Ramírez Soto", edad: 7,
    diagnostico: "Quemadura 2° superficial por pirotecnia. SCQ 8%. Mano y antebrazo izquierdo.",
    pronostico: "Bueno. Epitelización en 2-3 semanas sin injerto.",
    tratamiento: "Curaciones c/48hrs con apósito hidrocoloide. Fisioterapia de mano.",
    medicamentos: "Paracetamol, apósito Mepilex",
    estado: "EN_RECUPERACION",
    cirugias: [],
    proximaCita: "28 Jul", documentos: 2,
  },
  {
    id: "3", paciente: "Luis Fernando Pérez", edad: 11,
    diagnostico: "Secuelas de quemadura. Contractura en cuello y axila. SCQ original 18%.",
    pronostico: "Requiere cirugía reconstructiva. Candidato a colgajo libre.",
    tratamiento: "Rehabilitación + presoterapia. Lista de espera Shriners.",
    medicamentos: "Crema hidratante especializada, presoterapia",
    estado: "SEGUIMIENTO",
    cirugias: [
      { tipo: "Injerto de piel parcial", fecha: "15 Jun 2026", hospital: "H. Civil Guadalajara", resultado: "Prendimiento 80%" },
      { tipo: "Liberación de contractura", fecha: "20 May 2026", hospital: "H. Civil Guadalajara", resultado: "Mejoró 60% movimiento" },
    ],
    proximaCita: "10 Ago", documentos: 8,
  },
];

function getEstadoVariant(estado: string) {
  switch (estado) {
    case "ACTIVO": return "danger" as const;
    case "EN_RECUPERACION": return "warning" as const;
    default: return "info" as const;
  }
}

export default function ExpedientesPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-navy-800 md:text-2xl">Expedientes Médicos</h1>
        <p className="text-sm text-navy-500">Historial clínico, cirugías y tratamientos</p>
      </div>

      <div className="space-y-4">
        {expedientes.map((exp) => (
          <Card key={exp.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                  <FileText className="h-4 w-4 text-gold-500" />
                  {exp.paciente} ({exp.edad} años)
                </CardTitle>
                <Badge variant={getEstadoVariant(exp.estado)}>{exp.estado}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs font-medium text-navy-500">Diagnóstico</p>
                <p className="mt-0.5 text-sm text-navy-700">{exp.diagnostico}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-navy-500">Pronóstico</p>
                <p className="mt-0.5 text-sm text-navy-600">{exp.pronostico}</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-3">
                <p className="flex items-center gap-1.5 text-xs font-medium text-blue-800">
                  <Pill className="h-3.5 w-3.5" /> Tratamiento
                </p>
                <p className="mt-1 text-xs text-blue-700">{exp.tratamiento}</p>
                <p className="mt-0.5 text-[11px] text-blue-600">Medicamentos: {exp.medicamentos}</p>
              </div>

              {exp.cirugias.length > 0 && (
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-medium text-navy-700">
                    <Scissors className="h-3.5 w-3.5" /> Cirugías ({exp.cirugias.length})
                  </p>
                  <div className="mt-1.5 space-y-1.5">
                    {exp.cirugias.map((cx, i) => (
                      <div key={i} className="rounded-lg border border-navy-100 p-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-navy-800">{cx.tipo}</span>
                          <span className="text-[10px] text-navy-500">{cx.fecha}</span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-navy-600">{cx.hospital} — {cx.resultado}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 border-t border-navy-50 pt-2 text-[11px] text-navy-500">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Próxima: {exp.proximaCita}</span>
                <span>{exp.documentos} documentos</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
