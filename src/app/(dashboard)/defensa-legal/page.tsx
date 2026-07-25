"use client";

import { Scale, GraduationCap, Users, Phone, Shield, FileText, Clock, Building, HandHeart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const casosAtendidos = [
  {
    id: "LEG-001",
    tipo: "Accidente laboral",
    descripcion: "Quemadura por derrame de aceite industrial en fábrica. Empleador no tenía protocolos de seguridad.",
    estado: "EN_PROCESO",
    abogado: "Lic. Fernanda Torres (UNAM)",
    universidad: "UNAM — Fac. de Derecho",
    fechaInicio: "12/03/2026",
  },
  {
    id: "LEG-002",
    tipo: "Agresión / violencia",
    descripcion: "Menor quemado intencionalmente. Caso penal activo contra agresor.",
    estado: "EN_PROCESO",
    abogado: "Lic. Roberto Méndez (ITAM)",
    universidad: "ITAM — Clínica de Derecho",
    fechaInicio: "28/01/2026",
  },
  {
    id: "LEG-003",
    tipo: "Negligencia médica",
    descripcion: "Tratamiento inadecuado en primer hospital que empeoró las quemaduras.",
    estado: "RESUELTO",
    abogado: "Lic. Patricia Solís (UAM)",
    universidad: "UAM — Servicio Social",
    fechaInicio: "15/11/2025",
  },
  {
    id: "LEG-004",
    tipo: "Accidente laboral",
    descripcion: "Explosión de tanque de gas en restaurante. 3 empleados afectados, sin seguro.",
    estado: "EN_PROCESO",
    abogado: "Lic. Miguel Ángel Cruz (IPN)",
    universidad: "IPN — Bufete Jurídico Gratuito",
    fechaInicio: "05/05/2026",
  },
];

const universidades = [
  {
    nombre: "UNAM — Facultad de Derecho",
    tipo: "Clínica Jurídica",
    practicantes: 8,
    casosActivos: 3,
    especialidad: "Laboral, Penal, Civil",
    contacto: "clinica.derecho@unam.mx",
  },
  {
    nombre: "ITAM — Clínica Pro Bono",
    tipo: "Voluntariado profesional",
    practicantes: 4,
    casosActivos: 2,
    especialidad: "Penal, Derechos humanos",
    contacto: "probono@itam.mx",
  },
  {
    nombre: "UAM — Servicio Social Jurídico",
    tipo: "Servicio social",
    practicantes: 6,
    casosActivos: 2,
    especialidad: "Civil, Familiar",
    contacto: "servicio.juridico@uam.mx",
  },
  {
    nombre: "IPN — Bufete Jurídico Gratuito",
    tipo: "Bufete gratuito",
    practicantes: 5,
    casosActivos: 1,
    especialidad: "Laboral, Seguridad social",
    contacto: "bufete@ipn.mx",
  },
  {
    nombre: "Universidad Panamericana — Clínica Legal",
    tipo: "Clínica pro bono",
    practicantes: 3,
    casosActivos: 1,
    especialidad: "Penal, Civil, Mercantil",
    contacto: "clinicalegal@up.edu.mx",
  },
  {
    nombre: "Escuela Libre de Derecho",
    tipo: "Voluntariado de egresados",
    practicantes: 2,
    casosActivos: 1,
    especialidad: "Constitucional, Amparo",
    contacto: "voluntariado@eld.edu.mx",
  },
];

const tiposAyuda = [
  {
    titulo: "Accidente laboral",
    descripcion: "La quemadura ocurrió en el trabajo. El empleador puede ser responsable si no cumplió normas de seguridad (NOM-002-STPS).",
    icono: Building,
    acciones: ["Demanda laboral", "Indemnización", "Incapacidad permanente", "Pensión IMSS"],
  },
  {
    titulo: "Agresión o violencia",
    descripcion: "La quemadura fue causada intencionalmente por otra persona. Se abre un caso penal.",
    icono: Shield,
    acciones: ["Denuncia penal", "Orden de protección", "Reparación del daño", "Acompañamiento víctima"],
  },
  {
    titulo: "Negligencia médica",
    descripcion: "El tratamiento recibido empeoró la condición por mala praxis o descuido del personal médico.",
    icono: FileText,
    acciones: ["Queja ante CONAMED", "Demanda civil", "Dictamen pericial", "Indemnización"],
  },
  {
    titulo: "Producto defectuoso",
    descripcion: "Un producto (calentador, estufa, pirotecnia) causó la quemadura por defecto de fabricación.",
    icono: Scale,
    acciones: ["Queja ante PROFECO", "Demanda al fabricante", "Retiro del producto", "Daño moral"],
  },
];

function getEstadoColor(estado: string) {
  switch (estado) {
    case "EN_PROCESO": return "bg-blue-100 text-blue-700";
    case "RESUELTO": return "bg-green-100 text-green-700";
    case "PENDIENTE": return "bg-amber-100 text-amber-700";
    default: return "bg-gray-100 text-gray-700";
  }
}

export default function DefensaLegalPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy-800 md:text-2xl">Defensa Legal</h1>
        <p className="text-sm text-navy-500">
          Asesoría jurídica gratuita para víctimas de quemaduras — con apoyo de universidades
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card>
          <CardContent className="p-3 text-center">
            <Scale className="mx-auto h-5 w-5 text-navy-600" />
            <p className="mt-1 text-lg font-bold text-navy-800">{casosAtendidos.length}</p>
            <p className="text-[10px] text-navy-500">Casos activos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <GraduationCap className="mx-auto h-5 w-5 text-purple-500" />
            <p className="mt-1 text-lg font-bold text-navy-800">{universidades.length}</p>
            <p className="text-[10px] text-navy-500">Universidades aliadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Users className="mx-auto h-5 w-5 text-blue-500" />
            <p className="mt-1 text-lg font-bold text-navy-800">
              {universidades.reduce((sum, u) => sum + u.practicantes, 0)}
            </p>
            <p className="text-[10px] text-navy-500">Practicantes y voluntarios</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <HandHeart className="mx-auto h-5 w-5 text-green-500" />
            <p className="mt-1 text-lg font-bold text-navy-800">100%</p>
            <p className="text-[10px] text-navy-500">Servicio gratuito</p>
          </CardContent>
        </Card>
      </div>

      {/* Línea de ayuda */}
      <Card className="border-red-200 bg-red-50/30">
        <CardContent className="flex items-center gap-3 p-4">
          <Phone className="h-8 w-8 text-red-500 shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-medium text-red-700">Línea de asesoría legal gratuita</p>
            <p className="text-sm font-bold text-navy-800">800 000 XXXX ext. 3 — Lun a Vie, 9:00-18:00</p>
            <p className="text-[10px] text-navy-500">Un abogado voluntario atenderá tu consulta sin costo</p>
          </div>
        </CardContent>
      </Card>

      {/* Tipos de ayuda legal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-navy-600" />
            ¿En qué te podemos ayudar?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {tiposAyuda.map((tipo, i) => (
              <div key={i} className="rounded-lg border border-navy-100 p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <tipo.icono className="h-4 w-4 text-navy-600 shrink-0" />
                  <p className="text-sm font-semibold text-navy-800">{tipo.titulo}</p>
                </div>
                <p className="text-xs text-navy-600">{tipo.descripcion}</p>
                <div className="flex flex-wrap gap-1">
                  {tipo.acciones.map((accion, j) => (
                    <span key={j} className="rounded-full bg-navy-100 px-2 py-0.5 text-[10px] font-medium text-navy-600">
                      {accion}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Universidades aliadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-navy-600" />
            Universidades y Voluntariado Legal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-xs text-navy-500">
            Practicantes de derecho y abogados profesionales ofrecen su tiempo como voluntarios para defender a víctimas de quemaduras.
          </p>
          <div className="space-y-3">
            {universidades.map((uni, i) => (
              <div key={i} className="rounded-lg border border-navy-100 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-navy-800">{uni.nombre}</p>
                    <p className="text-xs text-navy-500">{uni.tipo} — Especialidad: {uni.especialidad}</p>
                    <div className="mt-1.5 flex items-center gap-3">
                      <span className="flex items-center gap-1 text-[10px] text-navy-500">
                        <Users className="h-3 w-3" /> {uni.practicantes} voluntarios
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-navy-500">
                        <FileText className="h-3 w-3" /> {uni.casosActivos} casos activos
                      </span>
                    </div>
                  </div>
                  <Badge className="bg-purple-100 text-purple-700 shrink-0">Pro bono</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Casos en proceso */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-navy-600" />
            Casos Atendidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {casosAtendidos.map((caso) => (
              <div key={caso.id} className="rounded-lg border border-navy-100 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-mono text-navy-400">{caso.id}</p>
                      <Badge className={getEstadoColor(caso.estado)}>
                        {caso.estado === "EN_PROCESO" ? "En proceso" : "Resuelto"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm font-medium text-navy-800">{caso.tipo}</p>
                    <p className="text-xs text-navy-600">{caso.descripcion}</p>
                    <div className="mt-1.5 flex items-center gap-3 text-[10px] text-navy-500">
                      <span>{caso.abogado}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="h-3 w-3" /> {caso.fechaInicio}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
