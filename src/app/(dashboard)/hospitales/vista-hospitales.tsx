"use client";

import dynamic from "next/dynamic";
import { MapPin, Phone, Bed, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { HospitalVista } from "@/lib/datos";

/**
 * Parte interactiva de la pantalla de hospitales.
 *
 * Vive separada de `page.tsx` porque el mapa de Leaflet necesita ejecutarse en
 * el navegador (`ssr: false`), mientras que la consulta a la base de datos tiene
 * que ocurrir en el servidor. Los datos entran por props.
 */

const MapaHospitales = dynamic(
  () => import("@/components/mapa-hospitales").then((m) => m.MapaHospitales),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-72 items-center justify-center rounded-lg border border-navy-200 bg-navy-50 md:h-80">
        <p className="text-sm text-navy-500">Cargando mapa...</p>
      </div>
    ),
  }
);

const ETIQUETAS_NIVEL: Record<string, string> = {
  PRIMER_NIVEL: "1er Nivel",
  SEGUNDO_NIVEL: "2do Nivel",
  TERCER_NIVEL: "3er Nivel",
  CENTRO_REFERENCIA: "Referencia",
};

function variantePorNivel(nivel: string) {
  switch (nivel) {
    case "CENTRO_REFERENCIA":
      return "danger" as const;
    case "TERCER_NIVEL":
      return "warning" as const;
    case "SEGUNDO_NIVEL":
      return "info" as const;
    default:
      return "default" as const;
  }
}

export function VistaHospitales({ hospitales }: { hospitales: HospitalVista[] }) {
  return (
    <>
      {/* Mapa de la red */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-500" />
            Mapa de Red Hospitalaria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MapaHospitales hospitales={hospitales} />
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-navy-500 dark:text-navy-400">
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-green-500" /> Con camas
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-yellow-500" /> Pocas camas
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-red-500" /> Sin camas
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-blue-500" /> Paciente
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Listado */}
      <div className="space-y-3">
        {hospitales.map((hospital) => (
          <Card key={hospital.id} className="active:bg-navy-50">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-navy-800 dark:text-white md:text-base">
                      {hospital.nombreCorto}
                    </h3>
                    <p className="text-xs text-navy-500 md:hidden">
                      {hospital.municipio}, {hospital.estado}
                    </p>
                    <p className="hidden text-xs text-navy-500 md:block">{hospital.nombre}</p>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="flex items-center gap-1">
                      <Bed className="h-3.5 w-3.5 text-navy-400" />
                      <span
                        className={`text-base font-bold ${
                          hospital.camasDisponibles > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {hospital.camasDisponibles}
                      </span>
                      <span className="text-xs text-navy-400">/{hospital.camasTotales}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <Badge variant={variantePorNivel(hospital.nivelAtencion)}>
                    {ETIQUETAS_NIVEL[hospital.nivelAtencion] || hospital.nivelAtencion}
                  </Badge>
                  {hospital.tieneUCI && (
                    <span className="flex items-center gap-0.5 rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-700 dark:bg-green-500/15 dark:text-green-300">
                      <CheckCircle2 className="h-3 w-3" /> UCI
                    </span>
                  )}
                  {hospital.tieneQuirofano && (
                    <span className="flex items-center gap-0.5 rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-700 dark:bg-green-500/15 dark:text-green-300">
                      <CheckCircle2 className="h-3 w-3" /> Quirófano
                    </span>
                  )}
                  {hospital.especialidad.slice(0, 2).map((esp) => (
                    <span
                      key={esp}
                      className="rounded-full bg-navy-100 px-2 py-0.5 text-xs text-navy-600 dark:bg-navy-800 dark:text-navy-300"
                    >
                      {esp}
                    </span>
                  ))}
                </div>

                <div className="space-y-1 text-xs text-navy-600 dark:text-navy-300">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 shrink-0 text-navy-400" />
                    <span className="truncate">
                      {hospital.direccion}, {hospital.municipio}, {hospital.estado}
                    </span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="h-3 w-3 shrink-0 text-navy-400" />
                    <a
                      href={`tel:${hospital.telefono.replace(/\s/g, "")}`}
                      className="text-navy-700 underline dark:text-navy-200"
                    >
                      {hospital.telefono}
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
