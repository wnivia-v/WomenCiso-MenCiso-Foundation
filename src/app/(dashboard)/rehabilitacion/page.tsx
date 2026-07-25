"use client";

import { GraduationCap, Briefcase, Building, Users, ExternalLink, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const cursos = [
  {
    id: "1",
    nombre: "Computación Básica y Office",
    organizacion: "DIF Nacional",
    duracion: "3 meses",
    modalidad: "Presencial / En línea",
    estado: "DISPONIBLE",
    cupo: 15,
    descripcion: "Word, Excel, PowerPoint e internet para reincorporación laboral.",
  },
  {
    id: "2",
    nombre: "Panadería y Repostería",
    organizacion: "CONALEP",
    duracion: "4 meses",
    modalidad: "Presencial",
    estado: "DISPONIBLE",
    cupo: 10,
    descripcion: "Capacitación para iniciar negocio propio de panadería.",
  },
  {
    id: "3",
    nombre: "Costura y Diseño Textil",
    organizacion: "INADEM",
    duracion: "6 meses",
    modalidad: "Presencial",
    estado: "PROXIMO",
    cupo: 12,
    descripcion: "Diseño, corte y confección para emprendimiento textil.",
  },
  {
    id: "4",
    nombre: "Barbería Profesional",
    organizacion: "CANACO",
    duracion: "2 meses",
    modalidad: "Presencial",
    estado: "DISPONIBLE",
    cupo: 8,
    descripcion: "Cortes, rasurado y atención al cliente para trabajo inmediato.",
  },
  {
    id: "5",
    nombre: "Marketing Digital y Redes Sociales",
    organizacion: "Google / WomenCiso y MenCiso",
    duracion: "2 meses",
    modalidad: "En línea",
    estado: "DISPONIBLE",
    cupo: 30,
    descripcion: "Manejo de redes, publicidad digital y creación de contenido.",
  },
  {
    id: "6",
    nombre: "Mecánica Automotriz Básica",
    organizacion: "CECATI",
    duracion: "5 meses",
    modalidad: "Presencial",
    estado: "EN_CURSO",
    cupo: 0,
    descripcion: "Diagnóstico, mantenimiento preventivo y correctivo.",
  },
  {
    id: "7",
    nombre: "Soporte Técnico y Help Desk",
    organizacion: "Microsoft / WomenCiso y MenCiso",
    duracion: "3 meses",
    modalidad: "En línea",
    estado: "DISPONIBLE",
    cupo: 25,
    descripcion: "Soporte TI nivel 1, resolución de problemas, atención remota. Ideal para teletrabajo desde casa.",
  },
  {
    id: "8",
    nombre: "Desarrollo Web Frontend",
    organizacion: "Platzi / WomenCiso y MenCiso",
    duracion: "6 meses",
    modalidad: "En línea",
    estado: "DISPONIBLE",
    cupo: 20,
    descripcion: "HTML, CSS, JavaScript y React. Trabajo 100% remoto, alta demanda laboral.",
  },
  {
    id: "9",
    nombre: "Asistente Virtual y Gestión Administrativa Remota",
    organizacion: "Bedu",
    duracion: "2 meses",
    modalidad: "En línea",
    estado: "DISPONIBLE",
    cupo: 30,
    descripcion: "Email, agenda, CRM, facturación. Teletrabajo inmediato como asistente virtual freelance.",
  },
  {
    id: "10",
    nombre: "Diseño Gráfico y Canva Pro",
    organizacion: "Domestika / WomenCiso y MenCiso",
    duracion: "3 meses",
    modalidad: "En línea",
    estado: "PROXIMO",
    cupo: 20,
    descripcion: "Diseño para redes sociales, logos, presentaciones. Freelance remoto desde casa.",
  },
  {
    id: "11",
    nombre: "Introducción a la Programación (Python)",
    organizacion: "Google.org / UNAM",
    duracion: "4 meses",
    modalidad: "En línea",
    estado: "DISPONIBLE",
    cupo: 40,
    descripcion: "Lógica de programación, automatización y análisis de datos. Base para carrera en TI remota.",
  },
  {
    id: "12",
    nombre: "Data Entry y Transcripción Digital",
    organizacion: "INADEM",
    duracion: "1 mes",
    modalidad: "En línea",
    estado: "DISPONIBLE",
    cupo: 50,
    descripcion: "Captura de datos, digitalización, transcripción. El curso más rápido para empezar a ganar desde casa.",
  },
];

const organizaciones = [
  { nombre: "DIF Nacional", tipo: "Gobierno", alianzaDesde: "2024", cursosActivos: 3 },
  { nombre: "CONALEP", tipo: "Educativo", alianzaDesde: "2025", cursosActivos: 2 },
  { nombre: "INADEM", tipo: "Gobierno", alianzaDesde: "2025", cursosActivos: 2 },
  { nombre: "CANACO", tipo: "Privado", alianzaDesde: "2026", cursosActivos: 2 },
  { nombre: "Google.org", tipo: "Privado", alianzaDesde: "2026", cursosActivos: 2 },
  { nombre: "CECATI", tipo: "Educativo", alianzaDesde: "2024", cursosActivos: 4 },
  { nombre: "Microsoft Philanthropies", tipo: "Privado", alianzaDesde: "2026", cursosActivos: 1 },
  { nombre: "Platzi", tipo: "EdTech", alianzaDesde: "2026", cursosActivos: 1 },
  { nombre: "Bedu", tipo: "EdTech", alianzaDesde: "2026", cursosActivos: 1 },
  { nombre: "UNAM (Fac. Ciencias)", tipo: "Universidad", alianzaDesde: "2025", cursosActivos: 1 },
  { nombre: "Domestika", tipo: "EdTech", alianzaDesde: "2026", cursosActivos: 1 },
];

const bolsaTrabajo = [
  { puesto: "Auxiliar administrativo", empresa: "Grupo Bimbo", ubicacion: "CDMX", tipo: "Tiempo completo" },
  { puesto: "Panadero/a", empresa: "La Esperanza", ubicacion: "Edo. Méx", tipo: "Medio tiempo" },
  { puesto: "Community Manager Jr.", empresa: "Agencia Creativa MX", ubicacion: "Remoto", tipo: "Tiempo completo" },
  { puesto: "Costurero/a industrial", empresa: "Textiles del Valle", ubicacion: "Puebla", tipo: "Tiempo completo" },
  { puesto: "Soporte técnico nivel 1", empresa: "Teleperformance", ubicacion: "Remoto", tipo: "Tiempo completo" },
  { puesto: "Asistente virtual", empresa: "Beliveo", ubicacion: "Remoto", tipo: "Freelance" },
  { puesto: "Capturista de datos", empresa: "Grupo Salinas", ubicacion: "Remoto", tipo: "Medio tiempo" },
  { puesto: "Diseñador/a redes sociales", empresa: "Freelancer.com", ubicacion: "Remoto", tipo: "Freelance" },
  { puesto: "Desarrollador web Jr.", empresa: "Código Facilito", ubicacion: "Remoto", tipo: "Tiempo completo" },
];

function getEstadoColor(estado: string) {
  switch (estado) {
    case "DISPONIBLE": return "bg-green-100 text-green-700";
    case "PROXIMO": return "bg-blue-100 text-blue-700";
    case "EN_CURSO": return "bg-gold-100 text-gold-700";
    default: return "bg-gray-100 text-gray-700";
  }
}

function getEstadoLabel(estado: string) {
  switch (estado) {
    case "DISPONIBLE": return "Inscripciones abiertas";
    case "PROXIMO": return "Próximamente";
    case "EN_CURSO": return "En curso (sin cupo)";
    default: return estado;
  }
}

export default function RehabilitacionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy-800 md:text-2xl">Rehabilitación Laboral</h1>
        <p className="text-sm text-navy-500">Cursos, capacitación y reincorporación al mercado laboral</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card>
          <CardContent className="p-3 text-center">
            <GraduationCap className="mx-auto h-5 w-5 text-gold-500" />
            <p className="mt-1 text-lg font-bold text-navy-800">{cursos.length}</p>
            <p className="text-[10px] text-navy-500">Cursos disponibles</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Building className="mx-auto h-5 w-5 text-blue-500" />
            <p className="mt-1 text-lg font-bold text-navy-800">{organizaciones.length}</p>
            <p className="text-[10px] text-navy-500">Organizaciones aliadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Briefcase className="mx-auto h-5 w-5 text-green-500" />
            <p className="mt-1 text-lg font-bold text-navy-800">{bolsaTrabajo.length}</p>
            <p className="text-[10px] text-navy-500">Ofertas de trabajo</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Users className="mx-auto h-5 w-5 text-purple-500" />
            <p className="mt-1 text-lg font-bold text-navy-800">34</p>
            <p className="text-[10px] text-navy-500">Graduados 2026</p>
          </CardContent>
        </Card>
      </div>

      {/* Catálogo de cursos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-navy-600" />
            Cursos de Capacitación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cursos.map((curso) => (
              <div key={curso.id} className="rounded-lg border border-navy-100 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-navy-800">{curso.nombre}</p>
                    <p className="text-xs text-navy-500">{curso.organizacion}</p>
                    <p className="mt-1 text-xs text-navy-600">{curso.descripcion}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1 text-[10px] text-navy-500">
                        <Clock className="h-3 w-3" /> {curso.duracion}
                      </span>
                      <span className="text-[10px] text-navy-400">•</span>
                      <span className="text-[10px] text-navy-500">{curso.modalidad}</span>
                      {curso.cupo > 0 && (
                        <>
                          <span className="text-[10px] text-navy-400">•</span>
                          <span className="text-[10px] text-navy-500">{curso.cupo} lugares</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Badge className={getEstadoColor(curso.estado)}>
                    {getEstadoLabel(curso.estado)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bolsa de trabajo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-navy-600" />
            Bolsa de Trabajo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bolsaTrabajo.map((oferta, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-navy-100 p-3">
                <div>
                  <p className="text-sm font-semibold text-navy-800">{oferta.puesto}</p>
                  <p className="text-xs text-navy-500">{oferta.empresa} — {oferta.ubicacion}</p>
                </div>
                <Badge variant="info">{oferta.tipo}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Organizaciones aliadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-4 w-4 text-navy-600" />
            Organizaciones Aliadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            {organizaciones.map((org, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-navy-50/50 p-3">
                <div>
                  <p className="text-sm font-medium text-navy-800">{org.nombre}</p>
                  <p className="text-[10px] text-navy-500">{org.tipo} — Alianza desde {org.alianzaDesde}</p>
                </div>
                <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-medium text-gold-700">
                  {org.cursosActivos} cursos
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
