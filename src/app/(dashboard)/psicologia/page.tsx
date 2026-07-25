import { Brain, Calendar, User, MessageCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const sesiones = [
  {
    id: "1",
    paciente: "María García López",
    edad: 4,
    psicologo: "Lic. Andrea Vázquez",
    tipo: "EVALUACION_INICIAL",
    fecha: "2026-07-24",
    objetivo: "Evaluación del impacto emocional post-quemadura. Valorar necesidad de intervención familiar.",
    estadoEmocional: "Ansiedad ante curaciones, llanto frecuente, dificultad para dormir. Apego aumentado a la madre.",
    observaciones: "Se recomienda terapia de juego para manejo del dolor y ansiedad. Incluir a la madre en sesiones.",
    avance: "Primera sesión — línea base establecida",
  },
  {
    id: "2",
    paciente: "Carlos Ramírez Soto",
    edad: 7,
    psicologo: "Lic. Andrea Vázquez",
    tipo: "TERAPIA_INDIVIDUAL",
    fecha: "2026-07-22",
    objetivo: "Manejo del miedo al fuego y pirotecnia. Técnicas de relajación.",
    estadoEmocional: "Miedo específico a la pirotecnia. Pesadillas 2-3 veces por semana. Humor estable en lo demás.",
    observaciones: "Se trabajó desensibilización gradual con imágenes. Paciente cooperador. Enseñar respiración 4-7-8 a padres.",
    avance: "3ra sesión — mejoría en ansiedad, pesadillas reducidas a 1/semana",
  },
  {
    id: "3",
    paciente: "Ana Lucía Torres",
    edad: 12,
    psicologo: "Lic. Roberto Méndez",
    tipo: "CRISIS",
    fecha: "2026-07-24",
    objetivo: "Intervención en crisis por afectación facial. Ideación de rechazo social.",
    estadoEmocional: "Tristeza profunda, llanto, verbaliza 'ya no voy a ser bonita'. Preocupación por regreso a escuela.",
    observaciones: "Prioridad alta. Se requiere intervención semanal. Considerar grupo de apoyo con otros adolescentes con quemaduras.",
    avance: "Intervención en crisis — paciente estabilizada pero requiere seguimiento intensivo",
  },
  {
    id: "4",
    paciente: "Diego Martínez Pérez",
    edad: 9,
    psicologo: "Lic. Andrea Vázquez",
    tipo: "SEGUIMIENTO",
    fecha: "2026-07-20",
    objetivo: "Seguimiento de adaptación post-quirúrgica. Revisión de progreso.",
    estadoEmocional: "Estable. Preocupado por funcionalidad de la mano para jugar fútbol. Motivado con la terapia física.",
    observaciones: "Buena evolución. Mantener sesiones quincenales. Integrar objetivos deportivos como motivación para rehabilitación.",
    avance: "5ta sesión — progreso sostenido, humor positivo",
  },
  {
    id: "5",
    paciente: "Luis Fernando Pérez",
    edad: 11,
    psicologo: "Lic. Roberto Méndez",
    tipo: "TERAPIA_FAMILIAR",
    fecha: "2026-07-18",
    objetivo: "Sesión con madre y paciente. Preparación emocional para cirugía en Shriners.",
    estadoEmocional: "Ansiedad anticipatoria por viaje al extranjero. Madre angustiada por separación de hermanos.",
    observaciones: "Se trabajó plan de comunicación durante hospitalización. Madre necesita red de apoyo — coordinar con trabajo social.",
    avance: "Sesión familiar productiva. Ambos expresaron miedos y se creó plan de afrontamiento.",
  },
];

function getTipoLabel(tipo: string) {
  const labels: Record<string, string> = {
    EVALUACION_INICIAL: "Evaluación inicial",
    TERAPIA_INDIVIDUAL: "Terapia individual",
    TERAPIA_FAMILIAR: "Terapia familiar",
    GRUPO_APOYO: "Grupo de apoyo",
    CRISIS: "Crisis",
    SEGUIMIENTO: "Seguimiento",
  };
  return labels[tipo] || tipo;
}

function getTipoVariant(tipo: string) {
  switch (tipo) {
    case "CRISIS": return "danger" as const;
    case "EVALUACION_INICIAL": return "warning" as const;
    case "TERAPIA_FAMILIAR": return "info" as const;
    default: return "default" as const;
  }
}

export default function PsicologiaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Atención Psicológica</h1>
        <p className="text-sm text-gray-500">
          Acompañamiento emocional para pacientes y familias afectadas por quemaduras
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-lg bg-purple-50 p-3 text-center">
          <p className="text-2xl font-bold text-purple-700">5</p>
          <p className="text-xs text-purple-600">Pacientes en terapia</p>
        </div>
        <div className="rounded-lg bg-red-50 p-3 text-center">
          <p className="text-2xl font-bold text-red-700">1</p>
          <p className="text-xs text-red-600">En crisis</p>
        </div>
        <div className="rounded-lg bg-blue-50 p-3 text-center">
          <p className="text-2xl font-bold text-blue-700">12</p>
          <p className="text-xs text-blue-600">Sesiones este mes</p>
        </div>
        <div className="rounded-lg bg-green-50 p-3 text-center">
          <p className="text-2xl font-bold text-green-700">3</p>
          <p className="text-xs text-green-600">Con progreso positivo</p>
        </div>
      </div>

      {/* Sesiones */}
      <div className="space-y-4">
        {sesiones.map((sesion) => (
          <Card key={sesion.id}>
            <CardContent className="p-5">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-purple-100 p-2">
                      <Brain className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">
                        {sesion.paciente}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({sesion.edad} años)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getTipoVariant(sesion.tipo)}>
                      {getTipoLabel(sesion.tipo)}
                    </Badge>
                    <span className="text-xs text-gray-400">{sesion.fecha}</span>
                  </div>
                </div>

                {/* Psicólogo */}
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <User className="h-3 w-3" />
                  {sesion.psicologo}
                </div>

                {/* Objetivo */}
                <div>
                  <p className="text-xs font-medium text-gray-500">Objetivo de la sesión:</p>
                  <p className="text-sm text-gray-700">{sesion.objetivo}</p>
                </div>

                {/* Estado emocional */}
                <div className="rounded-lg bg-purple-50 p-3">
                  <p className="text-xs font-medium text-purple-800">
                    <MessageCircle className="mr-1 inline h-3 w-3" />
                    Estado emocional:
                  </p>
                  <p className="mt-1 text-sm text-purple-700">{sesion.estadoEmocional}</p>
                </div>

                {/* Observaciones */}
                <div>
                  <p className="text-xs font-medium text-gray-500">Observaciones:</p>
                  <p className="text-sm text-gray-600">{sesion.observaciones}</p>
                </div>

                {/* Avance */}
                <div className="flex items-center gap-2 border-t border-gray-100 pt-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-700">{sesion.avance}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
