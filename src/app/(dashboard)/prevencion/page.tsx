import { ShieldCheck, Baby, Flame, Zap, AlertTriangle, BookOpen, Video, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const consejos = [
  {
    titulo: "En la cocina",
    icono: Flame,
    color: "text-orange-500",
    items: [
      "Girar las asas de ollas y sartenes hacia la pared",
      "No cargar al niño/a mientras se cocina",
      "Usar las hornillas traseras de preferencia",
      "Mantener líquidos calientes lejos del borde de mesas y estufas",
      "No dejar cucharas dentro de ollas calientes",
    ],
  },
  {
    titulo: "Agua caliente",
    icono: Baby,
    color: "text-blue-500",
    items: [
      "Verificar la temperatura del agua ANTES de bañar al niño/a (37°C máximo)",
      "No dejar al niño/a solo en la tina — ni un segundo",
      "Ajustar el calentador a máximo 50°C",
      "Abrir primero el agua fría, después la caliente",
      "No dejar tazas con té, café o sopas al alcance de los niños",
    ],
  },
  {
    titulo: "Electricidad",
    icono: Zap,
    color: "text-yellow-600",
    items: [
      "Tapar todos los enchufes con protectores",
      "No dejar cables pelados o extensiones en el suelo",
      "Enseñar al niño/a que no deben meter objetos en los enchufes",
      "Revisar que las instalaciones estén en buen estado",
      "No sobrecargar multicontactos",
    ],
  },
  {
    titulo: "Pirotecnia y fuego",
    icono: AlertTriangle,
    color: "text-red-500",
    items: [
      "Los niños NUNCA deben manipular pirotecnia, ni con supervisión",
      "Mantener encendedores y cerillos bajo llave",
      "Enseñar que el fuego NO es un juguete",
      "Tener extintor en casa y saber usarlo",
      "Practicar un plan de evacuación familiar",
    ],
  },
];

const recursos = [
  { tipo: "Video", titulo: "Primeros auxilios en quemaduras — Cruz Roja", duracion: "5 min" },
  { tipo: "Video", titulo: "Cómo hacer tu hogar seguro para niños", duracion: "8 min" },
  { tipo: "Guía", titulo: "Checklist de seguridad en el hogar (PDF)", duracion: "2 páginas" },
  { tipo: "Infografía", titulo: "Regla de la palma — estimar % de quemadura", duracion: "1 imagen" },
  { tipo: "Video", titulo: "Qué hacer y qué NO hacer ante una quemadura", duracion: "4 min" },
  { tipo: "Guía", titulo: "Plan de evacuación familiar paso a paso", duracion: "3 páginas" },
];

export default function PrevencionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy-800 md:text-2xl">Prevención y Educación</h1>
        <p className="text-sm text-navy-500">Evitar quemaduras es mejor que tratarlas — comparte esta información</p>
      </div>

      {/* Estadística impactante */}
      <Card className="border-red-200 bg-red-50/30">
        <CardContent className="p-4 text-center">
          <p className="text-3xl font-bold text-red-700">70%</p>
          <p className="text-sm text-navy-700 mt-1">de las quemaduras en niños ocurren <strong>en el hogar</strong> y son <strong>prevenibles</strong></p>
          <p className="text-xs text-navy-500 mt-1">Fuente: OMS, 2024</p>
        </CardContent>
      </Card>

      {/* Consejos por área */}
      <div className="grid gap-4 md:grid-cols-2">
        {consejos.map((seccion) => (
          <Card key={seccion.titulo}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <seccion.icono className={`h-4 w-4 ${seccion.color}`} />
                {seccion.titulo}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {seccion.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-green-500 mt-0.5" />
                    <span className="text-sm text-navy-700">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recursos educativos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-navy-600" />
            Material Educativo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recursos.map((rec, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-navy-100 p-3">
                <div className="flex items-center gap-2">
                  {rec.tipo === "Video" ? (
                    <Video className="h-4 w-4 text-red-500 shrink-0" />
                  ) : (
                    <BookOpen className="h-4 w-4 text-blue-500 shrink-0" />
                  )}
                  <span className="text-sm text-navy-700">{rec.titulo}</span>
                </div>
                <span className="text-xs text-navy-400 shrink-0">{rec.duracion}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alcance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gold-500" />
            Impacto del Programa de Prevención
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-lg bg-navy-50 p-3 text-center">
              <p className="text-xl font-bold text-navy-800">23,400+</p>
              <p className="text-[10px] text-navy-500">Personas capacitadas</p>
            </div>
            <div className="rounded-lg bg-navy-50 p-3 text-center">
              <p className="text-xl font-bold text-navy-800">142</p>
              <p className="text-[10px] text-navy-500">Talleres impartidos</p>
            </div>
            <div className="rounded-lg bg-navy-50 p-3 text-center">
              <p className="text-xl font-bold text-navy-800">45</p>
              <p className="text-[10px] text-navy-500">Escuelas visitadas</p>
            </div>
            <div className="rounded-lg bg-navy-50 p-3 text-center">
              <p className="text-xl font-bold text-navy-800">8</p>
              <p className="text-[10px] text-navy-500">Estados alcanzados</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
