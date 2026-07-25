import { DollarSign, TrendingUp, TrendingDown, CreditCard, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const resumenFinanciero = {
  totalGastado: 487500,
  totalCubierto: 412000,
  pendientePago: 75500,
  presupuestoMes: 600000,
};

const costosPorPaciente = [
  {
    paciente: "Ana Lucía Torres",
    totalCostos: 185000,
    cubierto: 150000,
    pendiente: 35000,
    desglose: [
      { concepto: "Cirugía desbridamiento", monto: 85000, cubiertoPor: "WomenCiso y MenCiso Foundation", estatus: "PAGADO" },
      { concepto: "Hospitalización 5 días UCI", monto: 62000, cubiertoPor: "IMSS (derivación)", estatus: "PAGADO" },
      { concepto: "Medicamentos especializados", monto: 18000, cubiertoPor: "Farmacia aliada", estatus: "APROBADO" },
      { concepto: "Material de curación", monto: 12000, cubiertoPor: "Donación empresa", estatus: "PAGADO" },
      { concepto: "Posible injerto facial", monto: 8000, cubiertoPor: "Pendiente", estatus: "PENDIENTE" },
    ],
  },
  {
    paciente: "Luis Fernando Pérez",
    totalCostos: 215000,
    cubierto: 180000,
    pendiente: 35000,
    desglose: [
      { concepto: "Traslado Shriners Galveston (vuelos)", monto: 45000, cubiertoPor: "WomenCiso y MenCiso Foundation", estatus: "PAGADO" },
      { concepto: "Cirugía injerto parcial", monto: 95000, cubiertoPor: "Shriners (sin costo)", estatus: "PAGADO" },
      { concepto: "Hospedaje familiar (3 semanas)", monto: 30000, cubiertoPor: "Aliado internacional", estatus: "PAGADO" },
      { concepto: "Rehabilitación post-quirúrgica", monto: 25000, cubiertoPor: "WomenCiso y MenCiso Foundation", estatus: "APROBADO" },
      { concepto: "Presoterapia (traje compresivo)", monto: 20000, cubiertoPor: "Pendiente", estatus: "PENDIENTE" },
    ],
  },
  {
    paciente: "María García López",
    totalCostos: 52000,
    cubierto: 47000,
    pendiente: 5000,
    desglose: [
      { concepto: "Urgencia + desbridamiento", monto: 32000, cubiertoPor: "Seguro Popular", estatus: "PAGADO" },
      { concepto: "Curaciones (10 sesiones)", monto: 15000, cubiertoPor: "WomenCiso y MenCiso Foundation", estatus: "PAGADO" },
      { concepto: "Crema sulfadiazina (3 meses)", monto: 5000, cubiertoPor: "Pendiente", estatus: "PENDIENTE" },
    ],
  },
  {
    paciente: "Diego Martínez Pérez",
    totalCostos: 35500,
    cubierto: 35000,
    pendiente: 500,
    desglose: [
      { concepto: "Injerto mano derecha", monto: 28000, cubiertoPor: "Hospital Civil (servicio social)", estatus: "PAGADO" },
      { concepto: "Terapia física (8 sesiones)", monto: 7000, cubiertoPor: "WomenCiso y MenCiso Foundation", estatus: "PAGADO" },
      { concepto: "Férula nocturna", monto: 500, cubiertoPor: "Pendiente", estatus: "PENDIENTE" },
    ],
  },
];

function formatMoney(amount: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(amount);
}

function getEstatusVariant(estatus: string) {
  switch (estatus) {
    case "PAGADO": return "success" as const;
    case "APROBADO": return "info" as const;
    case "PENDIENTE": return "warning" as const;
    case "RECHAZADO": return "danger" as const;
    default: return "default" as const;
  }
}

export default function CostosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Costos</h1>
        <p className="text-sm text-gray-500">
          Control de gastos médicos, financiamiento por aliados y balance financiero
        </p>
      </div>

      {/* Resumen financiero */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-orange-100 p-2">
                <DollarSign className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Gastado</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatMoney(resumenFinanciero.totalGastado)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Cubierto por Aliados</p>
                <p className="text-lg font-bold text-green-700">
                  {formatMoney(resumenFinanciero.totalCubierto)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-100 p-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Pendiente de Pago</p>
                <p className="text-lg font-bold text-red-700">
                  {formatMoney(resumenFinanciero.pendientePago)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">% Cobertura</p>
                <p className="text-lg font-bold text-blue-700">
                  {Math.round((resumenFinanciero.totalCubierto / resumenFinanciero.totalGastado) * 100)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barra de progreso presupuesto */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Presupuesto mensual</span>
            <span className="text-sm text-gray-500">
              {formatMoney(resumenFinanciero.totalGastado)} / {formatMoney(resumenFinanciero.presupuestoMes)}
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-gray-200">
            <div
              className="h-3 rounded-full bg-orange-500"
              style={{
                width: `${Math.min((resumenFinanciero.totalGastado / resumenFinanciero.presupuestoMes) * 100, 100)}%`,
              }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {Math.round((resumenFinanciero.totalGastado / resumenFinanciero.presupuestoMes) * 100)}% utilizado
          </p>
        </CardContent>
      </Card>

      {/* Costos por paciente */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Desglose por Paciente</h2>
        {costosPorPaciente.map((pac) => (
          <Card key={pac.paciente}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{pac.paciente}</CardTitle>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{formatMoney(pac.totalCostos)}</p>
                  <p className="text-xs text-gray-500">
                    Cubierto: {formatMoney(pac.cubierto)} |{" "}
                    <span className="text-red-600">Pendiente: {formatMoney(pac.pendiente)}</span>
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs text-gray-500">
                      <th className="pb-2">Concepto</th>
                      <th className="pb-2">Monto</th>
                      <th className="pb-2">Cubierto por</th>
                      <th className="pb-2">Estatus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {pac.desglose.map((item, i) => (
                      <tr key={i} className="text-gray-700">
                        <td className="py-2">{item.concepto}</td>
                        <td className="py-2 font-medium">{formatMoney(item.monto)}</td>
                        <td className="py-2">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3 text-gray-400" />
                            {item.cubiertoPor}
                          </span>
                        </td>
                        <td className="py-2">
                          <Badge variant={getEstatusVariant(item.estatus)}>
                            {item.estatus}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
