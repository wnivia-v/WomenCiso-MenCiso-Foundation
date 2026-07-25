import { Database, CloudOff } from "lucide-react";
import type { OrigenDatos } from "@/lib/datos";

interface IndicadorOrigenProps {
  origen: OrigenDatos;
  error?: string;
  /** Cantidad de registros recuperados, si aplica. */
  registros?: number;
}

/**
 * Muestra de dónde salieron los datos de la pantalla.
 *
 * No es decoración: si la base de datos no responde y la pantalla cae a datos
 * de respaldo, un listado de camas disponibles deja de reflejar la realidad.
 * Canalizar a un hospital sin cupo por confiar en una cifra obsoleta es un daño
 * concreto, así que el estado de la conexión tiene que estar a la vista.
 */
export function IndicadorOrigen({ origen, error, registros }: IndicadorOrigenProps) {
  if (origen === "rds") {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-2.5 py-1 dark:border-green-500/30 dark:bg-green-500/10">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
        </span>
        <Database className="h-3 w-3 text-green-700 dark:text-green-400" />
        <span className="text-[10px] font-semibold text-green-800 dark:text-green-300">
          Amazon RDS
        </span>
        {registros !== undefined && (
          <span className="text-[10px] text-green-700 dark:text-green-400">
            · {registros} {registros === 1 ? "registro" : "registros"}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1 dark:border-amber-500/40 dark:bg-amber-500/10"
      title={error ? `Motivo: ${error}` : undefined}
    >
      <CloudOff className="h-3 w-3 text-amber-700 dark:text-amber-400" />
      <span className="text-[10px] font-semibold text-amber-900 dark:text-amber-300">
        Datos de respaldo
      </span>
      <span className="hidden text-[10px] text-amber-800 dark:text-amber-400 sm:inline">
        · sin conexión a la base
      </span>
    </div>
  );
}
