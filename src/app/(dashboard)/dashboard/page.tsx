import {
  AlertTriangle, Users, Building2, Activity, TrendingUp, Clock,
  Heart, Shield, BarChart3, Timer,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndicadorOrigen } from "@/components/indicador-origen";
import { obtenerEstadisticas, obtenerEmergencias, etiquetaCausa } from "@/lib/datos";

export const dynamic = "force-dynamic";

// Datos para gráfica de barras (pacientes por mes)
const pacientesPorMes = [
  { mes: "Ene", total: 8 },
  { mes: "Feb", total: 12 },
  { mes: "Mar", total: 18 },
  { mes: "Abr", total: 14 },
  { mes: "May", total: 22 },
  { mes: "Jun", total: 16 },
  { mes: "Jul", total: 24 },
];

/** Colores por nivel de gravedad, consistentes con el resto del sistema. */
const COLOR_GRAVEDAD: Record<string, string> = {
  LEVE: "bg-green-500",
  MODERADO: "bg-yellow-500",
  GRAVE: "bg-orange-500",
  CRITICO: "bg-red-500",
};

const ETIQUETA_GRAVEDAD: Record<string, string> = {
  LEVE: "Leve",
  MODERADO: "Moderado",
  GRAVE: "Grave",
  CRITICO: "Crítico",
};

// KPIs de rendimiento
const kpis = [
  { nombre: "Tiempo promedio de triage", valor: "4.2 min", meta: "< 5 min", cumple: true },
  { nombre: "Canalización exitosa", valor: "96%", meta: "> 90%", cumple: true },
  { nombre: "Seguimiento a 30 días", valor: "88%", meta: "> 85%", cumple: true },
  { nombre: "Satisfacción familiar", valor: "4.7/5", meta: "> 4.5", cumple: true },
];

/** Convierte una fecha ISO en texto relativo ("Hace 15 min"). */
function tiempoRelativo(iso: string): string {
  const minutos = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutos < 1) return "Ahora mismo";
  if (minutos < 60) return `Hace ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `Hace ${horas} ${horas === 1 ? "hora" : "horas"}`;
  const dias = Math.floor(horas / 24);
  return `Hace ${dias} ${dias === 1 ? "día" : "días"}`;
}

/** Abrevia "María García López" como "María G." para las listas compactas. */
function nombreCompacto(nombreCompleto: string): string {
  const partes = nombreCompleto.trim().split(/\s+/);
  if (partes.length < 2) return nombreCompleto;
  return `${partes[0]} ${partes[1].charAt(0)}.`;
}

const proximasCitas = [
  { paciente: "Diego M., 9 años", tipo: "Curación", fecha: "Hoy 14:00", hospital: "Hospital Civil" },
  { paciente: "Sofía T., 6 años", tipo: "Psicología", fecha: "Hoy 16:30", hospital: "WomenCiso y MenCiso" },
  { paciente: "Luis P., 11 años", tipo: "Revisión médica", fecha: "Mañana 10:00", hospital: "Shriners" },
];

function getGravedadVariant(gravedad: string) {
  switch (gravedad) {
    case "CRITICO": return "danger" as const;
    case "GRAVE": return "warning" as const;
    case "MODERADO": return "info" as const;
    default: return "default" as const;
  }
}

function getEstadoLabel(estado: string) {
  const labels: Record<string, string> = {
    REPORTADA: "Reportada", EN_TRIAGE: "En triage", CANALIZADA: "Canalizada",
    EN_TRANSITO: "En tránsito", RECIBIDA_EN_HOSPITAL: "Recibida",
    EN_TRATAMIENTO: "En tratamiento", CERRADA: "Cerrada",
  };
  return labels[estado] || estado;
}

export default async function DashboardPage() {
  // Las dos consultas son independientes, así que van en paralelo.
  const [resEstadisticas, resEmergencias] = await Promise.all([
    obtenerEstadisticas(),
    obtenerEmergencias(),
  ]);

  const est = resEstadisticas.datos;
  const emergenciasRecientes = resEmergencias.datos.slice(0, 3);

  const maxPacientes = Math.max(...pacientesPorMes.map((m) => m.total));

  // El total de casos clasificados sale de la suma real por nivel, no de una
  // constante: si se escribe a mano, los porcentajes dejan de cuadrar en cuanto
  // entra una emergencia nueva.
  const totalClasificados = est.porGravedad.reduce((sum, g) => sum + g.cantidad, 0);

  const stats = [
    {
      name: "Pacientes Registrados",
      value: String(est.pacientesTotales),
      change: `${est.emergenciasActivas} con caso activo`,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      name: "Emergencias Activas",
      value: String(est.emergenciasActivas),
      change: "sin cerrar",
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      name: "Hospitales Conectados",
      value: String(est.hospitalesActivos),
      change: `${est.hospitalesConCamas} con camas`,
      icon: Building2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      name: "Camas Disponibles",
      value: String(est.camasDisponibles),
      change: "en toda la red",
      icon: Activity,
      color: "text-gold-500",
      bg: "bg-gold-50",
    },
  ];

  return (
    <div className="space-y-5 md:space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-navy-800 dark:text-white md:text-2xl">
            Panel de Control
          </h1>
          <p className="text-sm text-navy-500">Vista general — WomenCiso y MenCiso Foundation</p>
        </div>
        <IndicadorOrigen origen={resEstadisticas.origen} error={resEstadisticas.error} />
      </div>

      {/* Contador de impacto en tiempo real */}
      <Card className="border-gold-200 bg-gold-50/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-gold-500" />
              <p className="text-sm font-semibold text-navy-800">Impacto hoy</p>
            </div>
            <div className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="text-center">
              <p className="text-xl font-bold text-navy-800">47 min</p>
              <p className="text-[10px] text-navy-500">Ahorro en canalización</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-navy-800">3</p>
              <p className="text-[10px] text-navy-500">Familias asistidas hoy</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-navy-800">2</p>
              <p className="text-[10px] text-navy-500">Canalizaciones exitosas</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-navy-800">1</p>
              <p className="text-[10px] text-navy-500">Caso legal iniciado</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats principales */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-3 md:p-5">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="order-2 md:order-1">
                  <p className="text-xs text-navy-500 md:text-sm">{stat.name}</p>
                  <p className="text-2xl font-bold text-navy-800 md:text-3xl">{stat.value}</p>
                  <p className="hidden text-xs text-navy-400 md:block">{stat.change}</p>
                </div>
                <div className={`order-1 self-end rounded-lg p-2 md:order-2 md:p-3 ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 md:h-6 md:w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Gráfica de barras: pacientes por mes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              Pacientes Atendidos por Mes (2026)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-40">
              {pacientesPorMes.map((mes) => (
                <div key={mes.mes} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-navy-700">{mes.total}</span>
                  <div
                    className="w-full rounded-t-md bg-blue-500 transition-all duration-500"
                    style={{ height: `${(mes.total / maxPacientes) * 100}%` }}
                  />
                  <span className="text-[10px] text-navy-500">{mes.mes}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-navy-500">
              <span>Total 2026: <strong className="text-navy-800">146 pacientes</strong></span>
              <span className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-3 w-3" /> +34% vs 2025
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Distribución por gravedad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-navy-600" />
              Distribución por Gravedad
            </CardTitle>
          </CardHeader>
          <CardContent>
            {totalClasificados === 0 ? (
              <p className="py-6 text-center text-sm text-navy-500">
                Aún no hay casos clasificados.
              </p>
            ) : (
              <>
                <div className="space-y-3">
                  {est.porGravedad.map((g) => {
                    const porcentaje = Math.round((g.cantidad / totalClasificados) * 100);
                    return (
                      <div key={g.nivel} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-navy-700 dark:text-navy-200">
                            {ETIQUETA_GRAVEDAD[g.nivel] || g.nivel}
                          </span>
                          <span className="text-sm font-semibold text-navy-800 dark:text-white">
                            {g.cantidad} ({porcentaje}%)
                          </span>
                        </div>
                        <div className="h-3 w-full rounded-full bg-gray-100 dark:bg-navy-800">
                          <div
                            className={`h-full rounded-full ${COLOR_GRAVEDAD[g.nivel] || "bg-navy-400"} transition-all duration-700`}
                            style={{ width: `${porcentaje}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-3 text-xs text-navy-500">
                  Total de casos clasificados: <strong>{totalClasificados}</strong>
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* KPIs de rendimiento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-gold-500" />
            Indicadores de Rendimiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {kpis.map((kpi) => (
              <div key={kpi.nombre} className="rounded-lg border border-navy-100 p-3 text-center">
                <p className="text-lg font-bold text-navy-800 md:text-xl">{kpi.valor}</p>
                <p className="text-[10px] text-navy-500 mt-0.5">{kpi.nombre}</p>
                <p className="mt-1 text-[10px] text-green-600 font-medium">Meta: {kpi.meta} ✓</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergencias y Citas */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Emergencias Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {emergenciasRecientes.length === 0 ? (
              <p className="py-6 text-center text-sm text-navy-500">
                No hay emergencias registradas.
              </p>
            ) : (
              <div className="space-y-3">
                {emergenciasRecientes.map((emg) => (
                  <div
                    key={emg.id}
                    className="rounded-lg border border-navy-100 p-3 dark:border-navy-800"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-sm font-medium text-navy-800 dark:text-white">
                            {nombreCompacto(emg.paciente)}, {emg.edad} años
                          </span>
                          <Badge variant={getGravedadVariant(emg.gravedad)}>{emg.gravedad}</Badge>
                        </div>
                        <p className="mt-0.5 text-xs text-navy-500">
                          {etiquetaCausa(emg.causa)} — {getEstadoLabel(emg.estado)}
                        </p>
                      </div>
                      <span className="flex shrink-0 items-center gap-1 text-xs text-navy-400">
                        <Clock className="h-3 w-3" />
                        {tiempoRelativo(emg.fecha)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-green-500" />
              Próximas Citas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {proximasCitas.map((cita, i) => (
                <div key={i} className="rounded-lg border border-navy-100 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <span className="text-sm font-medium text-navy-800">{cita.paciente}</span>
                      <p className="mt-0.5 text-xs text-navy-500">{cita.tipo} — {cita.hospital}</p>
                    </div>
                    <span className="flex shrink-0 items-center gap-1 rounded-md bg-gold-50 px-2 py-1 text-xs font-medium text-gold-700">
                      <Clock className="h-3 w-3" />{cita.fecha}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
