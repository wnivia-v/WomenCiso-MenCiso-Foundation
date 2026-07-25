import Link from "next/link";
import { Plus, Users, Phone, MapPin, Droplet, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndicadorOrigen } from "@/components/indicador-origen";
import { obtenerPacientes } from "@/lib/datos";

export const dynamic = "force-dynamic";

/** Iniciales para el avatar, tomando nombre y primer apellido. */
function iniciales(nombreCompleto: string): string {
  const partes = nombreCompleto.trim().split(/\s+/);
  if (partes.length === 1) return partes[0].charAt(0).toUpperCase();
  return (partes[0].charAt(0) + partes[1].charAt(0)).toUpperCase();
}

function etiquetaGenero(genero: string): string {
  switch (genero) {
    case "MASCULINO":
      return "M";
    case "FEMENINO":
      return "F";
    default:
      return "O";
  }
}

export default async function PacientesPage() {
  const { datos: pacientes, origen, error } = await obtenerPacientes();

  const conEmergencias = pacientes.filter((p) => p.totalEmergencias > 0).length;
  const menoresDeCinco = pacientes.filter((p) => p.edad < 5).length;
  const conAlergias = pacientes.filter((p) => p.alergias && p.alergias !== "Ninguna conocida").length;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-navy-800 dark:text-white md:text-2xl">Pacientes</h1>
          <p className="text-sm text-navy-500">Registro y seguimiento</p>
        </div>
        <Link href="/pacientes/nuevo">
          <Button size="sm" variant="secondary" className="shrink-0">
            <Plus className="mr-1.5 h-4 w-4" />
            <span className="hidden sm:inline">Nuevo Paciente</span>
            <span className="sm:hidden">Nuevo</span>
          </Button>
        </Link>
      </div>

      <IndicadorOrigen origen={origen} error={error} registros={pacientes.length} />

      {/* Resumen */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <div className="shrink-0 rounded-lg bg-navy-50 px-4 py-2 text-center dark:bg-navy-800">
          <p className="text-lg font-bold text-navy-700 dark:text-white">{pacientes.length}</p>
          <p className="text-[10px] text-navy-600 dark:text-navy-400">Total</p>
        </div>
        <div className="shrink-0 rounded-lg bg-red-50 px-4 py-2 text-center dark:bg-red-500/10">
          <p className="text-lg font-bold text-red-700 dark:text-red-300">{conEmergencias}</p>
          <p className="text-[10px] text-red-600 dark:text-red-400">Con emergencia</p>
        </div>
        <div className="shrink-0 rounded-lg bg-amber-50 px-4 py-2 text-center dark:bg-amber-500/10">
          <p className="text-lg font-bold text-amber-700 dark:text-amber-300">{menoresDeCinco}</p>
          <p className="text-[10px] text-amber-600 dark:text-amber-400">Menores de 5</p>
        </div>
        <div className="shrink-0 rounded-lg bg-purple-50 px-4 py-2 text-center dark:bg-purple-500/10">
          <p className="text-lg font-bold text-purple-700 dark:text-purple-300">{conAlergias}</p>
          <p className="text-[10px] text-purple-600 dark:text-purple-400">Con alergias</p>
        </div>
      </div>

      {pacientes.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Users className="mx-auto h-8 w-8 text-navy-300" />
            <p className="mt-2 text-sm text-navy-600 dark:text-navy-300">
              No hay pacientes registrados.
            </p>
            <Link href="/pacientes/nuevo" className="mt-4 inline-block">
              <Button size="sm" variant="secondary">
                <Plus className="mr-1.5 h-4 w-4" />
                Registrar el primero
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Tarjetas en móvil */}
          <div className="space-y-3 md:hidden">
            {pacientes.map((p) => (
              <Card key={p.id} className="active:bg-navy-50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-100 text-sm font-bold text-navy-700 dark:bg-navy-800 dark:text-navy-200">
                        {iniciales(p.nombreCompleto)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-navy-800 dark:text-white">
                          {p.nombreCompleto}
                        </p>
                        <p className="text-xs text-navy-500">
                          {p.edad} años · {etiquetaGenero(p.genero)}
                          {p.tipoSangre && ` · ${p.tipoSangre}`}
                        </p>
                      </div>
                    </div>
                    {p.totalEmergencias > 0 && (
                      <Badge variant="danger">
                        {p.totalEmergencias} {p.totalEmergencias === 1 ? "caso" : "casos"}
                      </Badge>
                    )}
                  </div>

                  <div className="mt-3 space-y-1 pl-[52px] text-xs text-navy-600 dark:text-navy-300">
                    {p.curp && <p className="font-mono text-[10px] text-navy-500">{p.curp}</p>}
                    {p.contactoEmergencia && (
                      <p className="flex items-center gap-1.5">
                        <Phone className="h-3 w-3 shrink-0 text-navy-400" />
                        {p.contactoEmergencia}
                        {p.parentescoContacto && ` (${p.parentescoContacto})`}
                      </p>
                    )}
                    {(p.municipio || p.estado) && (
                      <p className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 shrink-0 text-navy-400" />
                        {[p.municipio, p.estado].filter(Boolean).join(", ")}
                      </p>
                    )}
                    {p.alergias && p.alergias !== "Ninguna conocida" && (
                      <p className="flex items-center gap-1.5 font-medium text-red-700 dark:text-red-300">
                        <AlertTriangle className="h-3 w-3 shrink-0" />
                        Alergia: {p.alergias}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabla en escritorio */}
          <Card className="hidden md:block">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Listado de Pacientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-navy-100 text-left dark:border-navy-800">
                      <th className="pb-3 font-medium text-navy-500">Paciente</th>
                      <th className="pb-3 font-medium text-navy-500">Edad</th>
                      <th className="pb-3 font-medium text-navy-500">CURP</th>
                      <th className="pb-3 font-medium text-navy-500">Contacto</th>
                      <th className="pb-3 font-medium text-navy-500">Ubicación</th>
                      <th className="pb-3 font-medium text-navy-500">Sangre</th>
                      <th className="pb-3 font-medium text-navy-500">Casos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-50 dark:divide-navy-800/50">
                    {pacientes.map((p) => (
                      <tr key={p.id} className="hover:bg-navy-50/50 dark:hover:bg-navy-800/50">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-100 text-xs font-bold text-navy-700 dark:bg-navy-800 dark:text-navy-200">
                              {iniciales(p.nombreCompleto)}
                            </div>
                            <div>
                              <span className="font-medium text-navy-800 dark:text-white">
                                {p.nombreCompleto}
                              </span>
                              {p.alergias && p.alergias !== "Ninguna conocida" && (
                                <p className="flex items-center gap-1 text-[10px] font-medium text-red-700 dark:text-red-300">
                                  <AlertTriangle className="h-2.5 w-2.5" />
                                  {p.alergias}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-navy-600 dark:text-navy-300">
                          {p.edad} años · {etiquetaGenero(p.genero)}
                        </td>
                        <td className="py-3 font-mono text-[11px] text-navy-500">
                          {p.curp || "—"}
                        </td>
                        <td className="max-w-[180px] py-3 text-navy-600 dark:text-navy-300">
                          {p.contactoEmergencia ? (
                            <div className="truncate">
                              {p.contactoEmergencia}
                              {p.parentescoContacto && (
                                <span className="text-navy-400"> ({p.parentescoContacto})</span>
                              )}
                            </div>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="py-3 text-navy-600 dark:text-navy-300">
                          {[p.municipio, p.estado].filter(Boolean).join(", ") || "—"}
                        </td>
                        <td className="py-3">
                          {p.tipoSangre ? (
                            <span className="inline-flex items-center gap-1 rounded bg-red-50 px-1.5 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-500/15 dark:text-red-300">
                              <Droplet className="h-2.5 w-2.5" />
                              {p.tipoSangre}
                            </span>
                          ) : (
                            <span className="text-navy-400">—</span>
                          )}
                        </td>
                        <td className="py-3">
                          {p.totalEmergencias > 0 ? (
                            <Badge variant="danger">{p.totalEmergencias}</Badge>
                          ) : (
                            <span className="text-xs text-navy-400">Sin casos</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
