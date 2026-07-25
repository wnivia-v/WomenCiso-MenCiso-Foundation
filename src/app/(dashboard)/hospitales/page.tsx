import { Card, CardContent } from "@/components/ui/card";
import { IndicadorOrigen } from "@/components/indicador-origen";
import { obtenerHospitales } from "@/lib/datos";
import { VistaHospitales } from "./vista-hospitales";

/**
 * Se desactiva el caché porque la disponibilidad de camas cambia
 * constantemente. Servir un valor cacheado podría llevar a canalizar un
 * paciente a un hospital que ya se llenó.
 */
export const dynamic = "force-dynamic";

export default async function HospitalesPage() {
  const { datos: hospitales, origen, error } = await obtenerHospitales();

  const camasLibres = hospitales.reduce((sum, h) => sum + h.camasDisponibles, 0);
  const conUCI = hospitales.filter((h) => h.tieneUCI).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-navy-800 dark:text-white md:text-2xl">
            Red de Hospitales
          </h1>
          <p className="text-sm text-navy-500">Hospitales especializados en quemaduras</p>
        </div>
        <IndicadorOrigen origen={origen} error={error} registros={hospitales.length} />
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <Card>
          <CardContent className="p-3 text-center md:p-4">
            <p className="text-xl font-bold text-navy-800 dark:text-white md:text-3xl">
              {hospitales.length}
            </p>
            <p className="text-xs text-navy-500">Hospitales</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center md:p-4">
            <p className="text-xl font-bold text-green-600 md:text-3xl">{camasLibres}</p>
            <p className="text-xs text-navy-500">Camas libres</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center md:p-4">
            <p className="text-xl font-bold text-blue-600 md:text-3xl">{conUCI}</p>
            <p className="text-xs text-navy-500">Con UCI</p>
          </CardContent>
        </Card>
      </div>

      <VistaHospitales hospitales={hospitales} />
    </div>
  );
}
