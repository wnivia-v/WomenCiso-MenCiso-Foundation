import Link from "next/link";
import { Plus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const emergencias = [
  {
    id: "EMG-001",
    paciente: "María García López",
    edad: 4,
    causa: "Escaldadura (agua caliente)",
    grado: "SEGUNDO_GRADO_PROFUNDO",
    superficie: 15,
    zonas: ["brazo derecho", "torso anterior"],
    gravedad: "GRAVE",
    prioridad: "ALTA",
    estado: "EN_TRIAGE",
    fecha: "2026-07-24T10:30:00",
    reportadoPor: "Madre",
  },
  {
    id: "EMG-002",
    paciente: "Carlos Ramírez Soto",
    edad: 7,
    causa: "Fuego directo (pirotecnia)",
    grado: "SEGUNDO_GRADO_SUPERFICIAL",
    superficie: 8,
    zonas: ["mano izquierda", "antebrazo izquierdo"],
    gravedad: "MODERADO",
    prioridad: "MEDIA",
    estado: "CANALIZADA",
    fecha: "2026-07-24T09:15:00",
    reportadoPor: "Padre",
  },
  {
    id: "EMG-003",
    paciente: "Ana Lucía Torres",
    edad: 12,
    causa: "Químicas (ácido de limpieza)",
    grado: "TERCER_GRADO",
    superficie: 25,
    zonas: ["cara", "cuello", "vías respiratorias"],
    gravedad: "CRITICO",
    prioridad: "CRITICA",
    estado: "EN_TRANSITO",
    fecha: "2026-07-24T08:00:00",
    reportadoPor: "Vecina",
  },
  {
    id: "EMG-004",
    paciente: "Diego Martínez",
    edad: 9,
    causa: "Eléctrica",
    grado: "TERCER_GRADO",
    superficie: 5,
    zonas: ["mano derecha", "brazo derecho"],
    gravedad: "GRAVE",
    prioridad: "ALTA",
    estado: "RECIBIDA_EN_HOSPITAL",
    fecha: "2026-07-23T18:45:00",
    reportadoPor: "Paramédico",
  },
];

function getGravedadVariant(gravedad: string) {
  switch (gravedad) {
    case "CRITICO": return "danger" as const;
    case "GRAVE": return "warning" as const;
    case "MODERADO": return "info" as const;
    default: return "success" as const;
  }
}

function getPrioridadColor(prioridad: string) {
  switch (prioridad) {
    case "CRITICA": return "bg-red-500";
    case "ALTA": return "bg-orange-500";
    case "MEDIA": return "bg-yellow-500";
    default: return "bg-green-500";
  }
}

function getEstadoLabel(estado: string) {
  const labels: Record<string, string> = {
    REPORTADA: "Reportada",
    EN_TRIAGE: "En triage",
    CANALIZADA: "Canalizada",
    EN_TRANSITO: "En tránsito",
    RECIBIDA_EN_HOSPITAL: "Recibida",
    EN_TRATAMIENTO: "En tratamiento",
    CERRADA: "Cerrada",
  };
  return labels[estado] || estado;
}

export default function EmergenciasPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-navy-800 md:text-2xl">Emergencias</h1>
          <p className="text-sm text-navy-500">Gestión de reportes y triage</p>
        </div>
        <Link href="/emergencias/nueva">
          <Button size="sm" variant="secondary" className="shrink-0">
            <Plus className="mr-1.5 h-4 w-4" />
            <span className="hidden sm:inline">Nueva Emergencia</span>
            <span className="sm:hidden">Nueva</span>
          </Button>
        </Link>
      </div>

      {/* Resumen rápido - scrolleable horizontal en móvil */}
      <div className="flex gap-2 overflow-x-auto pb-1 md:grid md:grid-cols-4 md:gap-3 md:overflow-visible">
        <div className="shrink-0 rounded-lg bg-red-50 px-4 py-2.5 text-center md:px-3 md:py-3">
          <p className="text-xl font-bold text-red-700 md:text-2xl">1</p>
          <p className="text-xs text-red-600">Críticas</p>
        </div>
        <div className="shrink-0 rounded-lg bg-orange-50 px-4 py-2.5 text-center md:px-3 md:py-3">
          <p className="text-xl font-bold text-orange-700 md:text-2xl">2</p>
          <p className="text-xs text-orange-600">Graves</p>
        </div>
        <div className="shrink-0 rounded-lg bg-yellow-50 px-4 py-2.5 text-center md:px-3 md:py-3">
          <p className="text-xl font-bold text-yellow-700 md:text-2xl">1</p>
          <p className="text-xs text-yellow-600">Moderadas</p>
        </div>
        <div className="shrink-0 rounded-lg bg-green-50 px-4 py-2.5 text-center md:px-3 md:py-3">
          <p className="text-xl font-bold text-green-700 md:text-2xl">0</p>
          <p className="text-xs text-green-600">Leves</p>
        </div>
      </div>

      {/* Lista de emergencias */}
      <Card>
        <CardHeader>
          <CardTitle>Emergencias Activas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {emergencias.map((emg) => (
              <div
                key={emg.id}
                className="rounded-lg border border-navy-100 p-3 transition-colors active:bg-navy-50 md:p-4"
              >
                <div className="flex items-start gap-3">
                  {/* Indicador de prioridad */}
                  <div className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${getPrioridadColor(emg.prioridad)}`} />

                  {/* Info principal */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-medium text-navy-800">
                        {emg.paciente}
                      </span>
                      <span className="text-sm text-navy-500">
                        ({emg.edad} años)
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-navy-600">{emg.causa}</p>

                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <Badge variant={getGravedadVariant(emg.gravedad)}>
                        {emg.gravedad}
                      </Badge>
                      <Badge>{getEstadoLabel(emg.estado)}</Badge>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-navy-500">
                      <span>SCQ: {emg.superficie}%</span>
                      <span>Reportó: {emg.reportadoPor}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
