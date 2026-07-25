import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndicadorOrigen } from "@/components/indicador-origen";
import { obtenerEmergencias, etiquetaCausa } from "@/lib/datos";

/** Sin caché: el estado de una emergencia cambia minuto a minuto. */
export const dynamic = "force-dynamic";

const ETIQUETAS_ESTADO: Record<string, string> = {
  REPORTADA: "Reportada",
  EN_TRIAGE: "En triage",
  CANALIZADA: "Canalizada",
  EN_TRANSITO: "En tránsito",
  RECIBIDA_EN_HOSPITAL: "Recibida",
  EN_TRATAMIENTO: "En tratamiento",
  CERRADA: "Cerrada",
};

function varianteGravedad(gravedad: string) {
  switch (gravedad) {
    case "CRITICO":
      return "danger" as const;
    case "GRAVE":
      return "warning" as const;
    case "MODERADO":
      return "info" as const;
    default:
      return "success" as const;
  }
}

function colorPrioridad(prioridad: string) {
  switch (prioridad) {
    case "CRITICA":
      return "bg-red-500";
    case "ALTA":
      return "bg-orange-500";
    case "MEDIA":
      return "bg-yellow-500";
    default:
      return "bg-green-500";
  }
}

export default async function EmergenciasPage() {
  const { datos: emergencias, origen, error } = await obtenerEmergencias();

  // Los conteos se derivan de los datos, no son constantes escritas a mano.
  // Un número fijo se desincroniza del listado en cuanto cambia la base.
  const conteo = {
    criticas: emergencias.filter((e) => e.gravedad === "CRITICO").length,
    graves: emergencias.filter((e) => e.gravedad === "GRAVE").length,
    moderadas: emergencias.filter((e) => e.gravedad === "MODERADO").length,
    leves: emergencias.filter((e) => e.gravedad === "LEVE").length,
  };

  return (
    <div className="space-y-5">
      {/* Encabezado */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-navy-800 dark:text-white md:text-2xl">
            Emergencias
          </h1>
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

      <IndicadorOrigen origen={origen} error={error} registros={emergencias.length} />

      {/* Resumen por gravedad */}
      <div className="flex gap-2 overflow-x-auto pb-1 md:grid md:grid-cols-4 md:gap-3 md:overflow-visible">
        <div className="shrink-0 rounded-lg bg-red-50 px-4 py-2.5 text-center dark:bg-red-500/10 md:px-3 md:py-3">
          <p className="text-xl font-bold text-red-700 dark:text-red-300 md:text-2xl">
            {conteo.criticas}
          </p>
          <p className="text-xs text-red-600 dark:text-red-400">Críticas</p>
        </div>
        <div className="shrink-0 rounded-lg bg-orange-50 px-4 py-2.5 text-center dark:bg-orange-500/10 md:px-3 md:py-3">
          <p className="text-xl font-bold text-orange-700 dark:text-orange-300 md:text-2xl">
            {conteo.graves}
          </p>
          <p className="text-xs text-orange-600 dark:text-orange-400">Graves</p>
        </div>
        <div className="shrink-0 rounded-lg bg-yellow-50 px-4 py-2.5 text-center dark:bg-yellow-500/10 md:px-3 md:py-3">
          <p className="text-xl font-bold text-yellow-700 dark:text-yellow-300 md:text-2xl">
            {conteo.moderadas}
          </p>
          <p className="text-xs text-yellow-600 dark:text-yellow-400">Moderadas</p>
        </div>
        <div className="shrink-0 rounded-lg bg-green-50 px-4 py-2.5 text-center dark:bg-green-500/10 md:px-3 md:py-3">
          <p className="text-xl font-bold text-green-700 dark:text-green-300 md:text-2xl">
            {conteo.leves}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400">Leves</p>
        </div>
      </div>

      {/* Listado */}
      <Card>
        <CardHeader>
          <CardTitle>Emergencias Activas</CardTitle>
        </CardHeader>
        <CardContent>
          {emergencias.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-navy-600 dark:text-navy-300">
                No hay emergencias registradas.
              </p>
              <p className="mt-1 text-xs text-navy-500">
                Las emergencias que registres en el triage aparecerán aquí.
              </p>
              <Link href="/emergencias/nueva" className="mt-4 inline-block">
                <Button size="sm" variant="secondary">
                  <Plus className="mr-1.5 h-4 w-4" />
                  Registrar la primera
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {emergencias.map((emg) => (
                <div
                  key={emg.id}
                  className="rounded-lg border border-navy-100 p-3 transition-colors active:bg-navy-50 dark:border-navy-800 md:p-4"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${colorPrioridad(emg.prioridad)}`}
                      title={`Prioridad ${emg.prioridad}`}
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-mono text-[10px] text-navy-400">{emg.folio}</span>
                        <span className="font-medium text-navy-800 dark:text-white">
                          {emg.paciente}
                        </span>
                        <span className="text-sm text-navy-500">({emg.edad} años)</span>
                      </div>

                      <p className="mt-0.5 text-sm text-navy-600 dark:text-navy-300">
                        {etiquetaCausa(emg.causa)}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <Badge variant={varianteGravedad(emg.gravedad)}>{emg.gravedad}</Badge>
                        <Badge>{ETIQUETAS_ESTADO[emg.estado] || emg.estado}</Badge>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-navy-500">
                        <span>SCQ: {emg.superficie}%</span>
                        <span>Reportó: {emg.reportadoPor}</span>
                        {emg.hospital && <span>Hospital: {emg.hospital}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
