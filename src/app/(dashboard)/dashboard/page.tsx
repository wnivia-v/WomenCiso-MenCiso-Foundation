import {
  AlertTriangle, Users, Building2, Activity, TrendingUp, Clock,
  Heart, Shield, BarChart3, Timer,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stats = [
  { name: "Pacientes Activos", value: "24", change: "+3 este mes", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  { name: "Emergencias Hoy", value: "2", change: "1 en triage", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
  { name: "Hospitales Conectados", value: "8", change: "5 con camas", icon: Building2, color: "text-green-600", bg: "bg-green-50" },
  { name: "En Seguimiento", value: "18", change: "4 próxima cita", icon: Activity, color: "text-gold-500", bg: "bg-gold-50" },
];

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

// Datos para gráfica de gravedad (pie chart simulado con barras horizontales)
const gravedadDistribucion = [
  { nivel: "Leve", cantidad: 45, color: "bg-green-500", porcentaje: 31 },
  { nivel: "Moderado", cantidad: 52, color: "bg-yellow-500", porcentaje: 36 },
  { nivel: "Grave", cantidad: 35, color: "bg-orange-500", porcentaje: 24 },
  { nivel: "Crítico", cantidad: 14, color: "bg-red-500", porcentaje: 9 },
];

// KPIs de rendimiento
const kpis = [
  { nombre: "Tiempo promedio de triage", valor: "4.2 min", meta: "< 5 min", cumple: true },
  { nombre: "Canalización exitosa", valor: "96%", meta: "> 90%", cumple: true },
  { nombre: "Seguimiento a 30 días", valor: "88%", meta: "> 85%", cumple: true },
  { nombre: "Satisfacción familiar", valor: "4.7/5", meta: "> 4.5", cumple: true },
];

const emergenciasRecientes = [
  { id: "EMG-001", paciente: "María G., 4 años", tipo: "Escaldadura", gravedad: "GRAVE", estado: "EN_TRIAGE", tiempo: "Hace 15 min" },
  { id: "EMG-002", paciente: "Carlos R., 7 años", tipo: "Fuego directo", gravedad: "MODERADO", estado: "CANALIZADA", tiempo: "Hace 1 hora" },
  { id: "EMG-003", paciente: "Ana L., 12 años", tipo: "Química", gravedad: "CRITICO", estado: "EN_TRANSITO", tiempo: "Hace 2 horas" },
];

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

export default function DashboardPage() {
  const maxPacientes = Math.max(...pacientesPorMes.map((m) => m.total));

  return (
    <div className="space-y-5 md:space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy-800 md:text-2xl">Panel de Control</h1>
        <p className="text-sm text-navy-500">Vista general — WomenCiso y MenCiso Foundation</p>
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
            <div className="space-y-3">
              {gravedadDistribucion.map((g) => (
                <div key={g.nivel} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-navy-700">{g.nivel}</span>
                    <span className="text-sm font-semibold text-navy-800">{g.cantidad} ({g.porcentaje}%)</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${g.color} transition-all duration-700`}
                      style={{ width: `${g.porcentaje}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-navy-500">Total de casos clasificados: <strong>146</strong></p>
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
            <div className="space-y-3">
              {emergenciasRecientes.map((emg) => (
                <div key={emg.id} className="rounded-lg border border-navy-100 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-sm font-medium text-navy-800">{emg.paciente}</span>
                        <Badge variant={getGravedadVariant(emg.gravedad)}>{emg.gravedad}</Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-navy-500">{emg.tipo} — {getEstadoLabel(emg.estado)}</p>
                    </div>
                    <span className="flex shrink-0 items-center gap-1 text-xs text-navy-400">
                      <Clock className="h-3 w-3" />{emg.tiempo}
                    </span>
                  </div>
                </div>
              ))}
            </div>
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
