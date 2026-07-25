import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const pacientes = [
  { id: "1", nombre: "María García López", edad: 4, genero: "F", estado: "ACTIVO", diagnostico: "Quemadura 2° profundo por escaldadura", scq: "15%", hospital: "CENIAQ" },
  { id: "2", nombre: "Carlos Ramírez Soto", edad: 7, genero: "M", estado: "EN_RECUPERACION", diagnostico: "Quemadura 2° superficial por pirotecnia", scq: "8%", hospital: "H. Pediátrico Tacubaya" },
  { id: "3", nombre: "Ana Lucía Torres", edad: 12, genero: "F", estado: "ACTIVO", diagnostico: "Quemadura 3° por químicos - zona facial", scq: "25%", hospital: "CENIAQ" },
  { id: "4", nombre: "Diego Martínez Pérez", edad: 9, genero: "M", estado: "SEGUIMIENTO", diagnostico: "Quemadura eléctrica 3° - mano derecha", scq: "5%", hospital: "H. Civil Guadalajara" },
  { id: "5", nombre: "Sofía Hernández Torres", edad: 6, genero: "F", estado: "EN_RECUPERACION", diagnostico: "Quemadura 2° por aceite caliente", scq: "12%", hospital: "H. para el Niño IMIEM" },
  { id: "6", nombre: "Luis Fernando Pérez", edad: 11, genero: "M", estado: "SEGUIMIENTO", diagnostico: "Secuelas de quemadura — pendiente injerto", scq: "18%", hospital: "Shriners Galveston" },
];

function getEstadoVariant(estado: string) {
  switch (estado) {
    case "ACTIVO": return "danger" as const;
    case "EN_RECUPERACION": return "warning" as const;
    case "SEGUIMIENTO": return "info" as const;
    default: return "success" as const;
  }
}

function getEstadoLabel(estado: string) {
  const labels: Record<string, string> = {
    ACTIVO: "Activo",
    EN_RECUPERACION: "Recuperación",
    SEGUIMIENTO: "Seguimiento",
    ALTA_MEDICA: "Alta",
  };
  return labels[estado] || estado;
}

export default function PacientesPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-navy-800 md:text-2xl">Pacientes</h1>
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

      {/* Stats */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <div className="shrink-0 rounded-lg bg-red-50 px-4 py-2 text-center">
          <p className="text-lg font-bold text-red-700">{pacientes.filter(p => p.estado === "ACTIVO").length}</p>
          <p className="text-[10px] text-red-600">Activos</p>
        </div>
        <div className="shrink-0 rounded-lg bg-amber-50 px-4 py-2 text-center">
          <p className="text-lg font-bold text-amber-700">{pacientes.filter(p => p.estado === "EN_RECUPERACION").length}</p>
          <p className="text-[10px] text-amber-600">Recuperación</p>
        </div>
        <div className="shrink-0 rounded-lg bg-blue-50 px-4 py-2 text-center">
          <p className="text-lg font-bold text-blue-700">{pacientes.filter(p => p.estado === "SEGUIMIENTO").length}</p>
          <p className="text-[10px] text-blue-600">Seguimiento</p>
        </div>
        <div className="shrink-0 rounded-lg bg-navy-50 px-4 py-2 text-center">
          <p className="text-lg font-bold text-navy-700">{pacientes.length}</p>
          <p className="text-[10px] text-navy-600">Total</p>
        </div>
      </div>

      {/* Lista de pacientes - tarjetas en móvil, tabla en desktop */}
      <div className="space-y-3 md:hidden">
        {pacientes.map((p) => (
          <Card key={p.id} className="active:bg-navy-50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-100 text-sm font-bold text-navy-700">
                    {p.nombre.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-navy-800">{p.nombre}</p>
                    <p className="text-xs text-navy-500">{p.edad} años • {p.hospital}</p>
                  </div>
                </div>
                <Badge variant={getEstadoVariant(p.estado)}>
                  {getEstadoLabel(p.estado)}
                </Badge>
              </div>
              <div className="mt-2 ml-13 pl-[52px]">
                <p className="text-xs text-navy-600">{p.diagnostico}</p>
                <p className="mt-0.5 text-xs font-medium text-navy-700">SCQ: {p.scq}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabla desktop */}
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
                <tr className="border-b border-navy-100 text-left">
                  <th className="pb-3 font-medium text-navy-500">Paciente</th>
                  <th className="pb-3 font-medium text-navy-500">Edad</th>
                  <th className="pb-3 font-medium text-navy-500">Diagnóstico</th>
                  <th className="pb-3 font-medium text-navy-500">SCQ</th>
                  <th className="pb-3 font-medium text-navy-500">Hospital</th>
                  <th className="pb-3 font-medium text-navy-500">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {pacientes.map((p) => (
                  <tr key={p.id} className="hover:bg-navy-50/50">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-100 text-xs font-bold text-navy-700">
                          {p.nombre.charAt(0)}
                        </div>
                        <span className="font-medium text-navy-800">{p.nombre}</span>
                      </div>
                    </td>
                    <td className="py-3 text-navy-600">{p.edad} años</td>
                    <td className="py-3 text-navy-600 max-w-[200px] truncate">{p.diagnostico}</td>
                    <td className="py-3 font-medium text-navy-800">{p.scq}</td>
                    <td className="py-3 text-navy-600">{p.hospital}</td>
                    <td className="py-3">
                      <Badge variant={getEstadoVariant(p.estado)}>{getEstadoLabel(p.estado)}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
