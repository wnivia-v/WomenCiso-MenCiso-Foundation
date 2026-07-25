"use client";

import { Building2, MapPin, Phone, Bed, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";

const MapaHospitales = dynamic(() => import("@/components/mapa-hospitales").then(m => m.MapaHospitales), {
  ssr: false,
  loading: () => (
    <div className="flex h-72 items-center justify-center rounded-lg bg-navy-50 border border-navy-200 md:h-80">
      <p className="text-sm text-navy-500">Cargando mapa...</p>
    </div>
  ),
});

const hospitales = [
  {
    id: "1",
    nombre: "CENIAQ",
    nombreCompleto: "Centro Nacional de Investigación y Atención de Quemados",
    tipo: "PUBLICO",
    nivel: "CENTRO_REFERENCIA",
    estado: "CDMX",
    direccion: "Av. México-Xochimilco 289, Tlalpan",
    telefono: "55 0001-XXXX",
    camasDisponibles: 3,
    camasTotales: 40,
    tieneUCI: true,
    tieneQuirofano: true,
    especialidad: ["Quemaduras", "Cirugía reconstructiva", "Pediatría"],
  },
  {
    id: "2",
    nombre: "H. Traumatología IMSS",
    nombreCompleto: "Hospital de Traumatología Victorio de la Fuente Narváez",
    tipo: "PUBLICO",
    nivel: "TERCER_NIVEL",
    estado: "CDMX",
    direccion: "Av. Colector 15 s/n, Magdalena de las Salinas",
    telefono: "55 0002-XXXX",
    camasDisponibles: 5,
    camasTotales: 30,
    tieneUCI: true,
    tieneQuirofano: true,
    especialidad: ["Quemaduras", "Traumatología"],
  },
  {
    id: "3",
    nombre: "H. Pediátrico Tacubaya",
    nombreCompleto: "Hospital Pediátrico de Tacubaya",
    tipo: "PUBLICO",
    nivel: "SEGUNDO_NIVEL",
    estado: "CDMX",
    direccion: "Calle Carlos B. Zetina 44, Escandón",
    telefono: "55 0003-XXXX",
    camasDisponibles: 2,
    camasTotales: 15,
    tieneUCI: false,
    tieneQuirofano: true,
    especialidad: ["Pediatría", "Quemaduras pediátricas"],
  },
  {
    id: "4",
    nombre: "H. Civil Guadalajara",
    nombreCompleto: "Hospital Civil de Guadalajara Fray Antonio Alcalde",
    tipo: "PUBLICO",
    nivel: "TERCER_NIVEL",
    estado: "Jalisco",
    direccion: "Hospital 278, El Retiro, Guadalajara",
    telefono: "33 3942-4400",
    camasDisponibles: 4,
    camasTotales: 25,
    tieneUCI: true,
    tieneQuirofano: true,
    especialidad: ["Quemaduras", "Cirugía plástica"],
  },
  {
    id: "5",
    nombre: "H. General de México",
    nombreCompleto: "Hospital General de México Dr. Eduardo Liceaga",
    tipo: "PUBLICO",
    nivel: "TERCER_NIVEL",
    estado: "CDMX",
    direccion: "Dr. Balmis 148, Doctores",
    telefono: "55 2789-2000",
    camasDisponibles: 1,
    camasTotales: 20,
    tieneUCI: true,
    tieneQuirofano: true,
    especialidad: ["Quemaduras", "Cirugía reconstructiva"],
  },
  {
    id: "6",
    nombre: "H. Infantil Federico Gómez",
    nombreCompleto: "Hospital Infantil de México Federico Gómez",
    tipo: "PUBLICO",
    nivel: "TERCER_NIVEL",
    estado: "CDMX",
    direccion: "Dr. Márquez 162, Doctores",
    telefono: "55 5228-9917",
    camasDisponibles: 0,
    camasTotales: 10,
    tieneUCI: true,
    tieneQuirofano: true,
    especialidad: ["Pediatría", "Cirugía pediátrica"],
  },
  {
    id: "7",
    nombre: "H. para el Niño (IMIEM)",
    nombreCompleto: "Hospital para el Niño IMIEM",
    tipo: "PUBLICO",
    nivel: "TERCER_NIVEL",
    estado: "Edo. de México",
    direccion: "Paseo Colón s/n, Isidro Fabela, Toluca",
    telefono: "722 217-5530",
    camasDisponibles: 3,
    camasTotales: 12,
    tieneUCI: true,
    tieneQuirofano: true,
    especialidad: ["Pediatría", "Quemaduras pediátricas"],
  },
  {
    id: "8",
    nombre: "Shriners Galveston",
    nombreCompleto: "Shriners Hospitals for Children — Galveston",
    tipo: "PRIVADO",
    nivel: "CENTRO_REFERENCIA",
    estado: "Texas, EUA",
    direccion: "815 Market St, Galveston, TX",
    telefono: "+1 409-770-6600",
    camasDisponibles: 10,
    camasTotales: 30,
    tieneUCI: true,
    tieneQuirofano: true,
    especialidad: ["Quemaduras pediátricas", "Rehabilitación"],
  },
];

function getNivelLabel(nivel: string) {
  const labels: Record<string, string> = {
    PRIMER_NIVEL: "1er Nivel",
    SEGUNDO_NIVEL: "2do Nivel",
    TERCER_NIVEL: "3er Nivel",
    CENTRO_REFERENCIA: "Referencia",
  };
  return labels[nivel] || nivel;
}

function getNivelVariant(nivel: string) {
  switch (nivel) {
    case "CENTRO_REFERENCIA": return "danger" as const;
    case "TERCER_NIVEL": return "warning" as const;
    case "SEGUNDO_NIVEL": return "info" as const;
    default: return "default" as const;
  }
}

export default function HospitalesPage() {
  const totalCamas = hospitales.reduce((sum, h) => sum + h.camasDisponibles, 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-navy-800 md:text-2xl">Red de Hospitales</h1>
        <p className="text-sm text-navy-500">Hospitales especializados en quemaduras</p>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <Card>
          <CardContent className="p-3 text-center md:p-4">
            <p className="text-xl font-bold text-navy-800 md:text-3xl">{hospitales.length}</p>
            <p className="text-xs text-navy-500">Hospitales</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center md:p-4">
            <p className="text-xl font-bold text-green-600 md:text-3xl">{totalCamas}</p>
            <p className="text-xs text-navy-500">Camas libres</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center md:p-4">
            <p className="text-xl font-bold text-blue-600 md:text-3xl">
              {hospitales.filter(h => h.tieneUCI).length}
            </p>
            <p className="text-xs text-navy-500">Con UCI</p>
          </CardContent>
        </Card>
      </div>

      {/* Mapa real de la red hospitalaria */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-500" />
            Mapa de Red Hospitalaria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MapaHospitales />
          <div className="mt-2 flex items-center gap-4 text-[10px] text-navy-500">
            <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full bg-green-500" /> Con camas</span>
            <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full bg-yellow-500" /> Pocas camas</span>
            <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full bg-red-500" /> Sin camas</span>
            <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full bg-blue-500" /> Paciente</span>
          </div>
        </CardContent>
      </Card>

      {/* Lista de hospitales */}
      <div className="space-y-3">
        {hospitales.map((hospital) => (
          <Card key={hospital.id} className="active:bg-navy-50">
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Nombre + badges */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-navy-800 text-sm md:text-base">
                      {hospital.nombre}
                    </h3>
                    <p className="text-xs text-navy-500 md:hidden">{hospital.estado}</p>
                    <p className="hidden text-xs text-navy-500 md:block">{hospital.nombreCompleto}</p>
                  </div>
                  {/* Camas */}
                  <div className="shrink-0 text-right">
                    <div className="flex items-center gap-1">
                      <Bed className="h-3.5 w-3.5 text-navy-400" />
                      <span className={`text-base font-bold ${
                        hospital.camasDisponibles > 0 ? "text-green-600" : "text-red-600"
                      }`}>
                        {hospital.camasDisponibles}
                      </span>
                      <span className="text-xs text-navy-400">/{hospital.camasTotales}</span>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant={getNivelVariant(hospital.nivel)}>
                    {getNivelLabel(hospital.nivel)}
                  </Badge>
                  {hospital.tieneUCI && (
                    <span className="flex items-center gap-0.5 rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-700">
                      <CheckCircle2 className="h-3 w-3" /> UCI
                    </span>
                  )}
                  {hospital.tieneQuirofano && (
                    <span className="flex items-center gap-0.5 rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-700">
                      <CheckCircle2 className="h-3 w-3" /> Quirófano
                    </span>
                  )}
                </div>

                {/* Info de contacto */}
                <div className="space-y-1 text-xs text-navy-600">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 shrink-0 text-navy-400" />
                    <span className="truncate">{hospital.direccion}, {hospital.estado}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="h-3 w-3 shrink-0 text-navy-400" />
                    <a href={`tel:${hospital.telefono.replace(/\s/g, '')}`} className="text-navy-700 underline">
                      {hospital.telefono}
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
