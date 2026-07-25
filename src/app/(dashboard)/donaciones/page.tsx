import { Heart, DollarSign, Gift, CreditCard, Building, Users, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const formasDeAyudar = [
  {
    titulo: "Donación monetaria",
    descripcion: "Tu aportación cubre tratamientos, cirugías y rehabilitación de niños con quemaduras.",
    icono: DollarSign,
    color: "bg-green-50 border-green-200",
    detalles: [
      "$200 MXN — cubre materiales de curación por 1 semana",
      "$500 MXN — 1 sesión de terapia psicológica",
      "$2,000 MXN — 1 mes de prendas compresivas",
      "$5,000 MXN — cirugía reconstructiva parcial",
    ],
  },
  {
    titulo: "Donación en especie",
    descripcion: "Materiales médicos, ropa, medicamentos y más que los pacientes necesitan.",
    icono: Gift,
    color: "bg-blue-50 border-blue-200",
    detalles: [
      "Prendas compresivas (tallas pediátricas)",
      "Medicamentos dermatológicos (previa consulta)",
      "Material de curación (gasas, vendas, antisépticos)",
      "Ropa cómoda de algodón para pacientes",
    ],
  },
  {
    titulo: "Voluntariado",
    descripcion: "Dona tu tiempo y habilidades. Necesitamos profesionales y estudiantes.",
    icono: Users,
    color: "bg-purple-50 border-purple-200",
    detalles: [
      "Médicos y enfermeras (turnos de consulta)",
      "Psicólogos (acompañamiento familiar)",
      "Abogados (defensa legal pro bono)",
      "Terapeutas físicos y ocupacionales",
      "Estudiantes de medicina (servicio social)",
    ],
  },
  {
    titulo: "Empresa aliada",
    descripcion: "Tu empresa puede patrocinar tratamientos, ofrecer empleo o donar equipo.",
    icono: Building,
    color: "bg-gold-50 border-gold-200",
    detalles: [
      "Patrocinio de tratamientos completos",
      "Bolsa de empleo para pacientes rehabilitados",
      "Donación de equipo médico o tecnológico",
      "Programa de nómina redondeo",
    ],
  },
];

export default function DonacionesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy-800 md:text-2xl">Donaciones — Cómo Ayudar</h1>
        <p className="text-sm text-navy-500">Cada aportación transforma la vida de un niño con quemaduras</p>
      </div>

      {/* Impacto */}
      <Card className="border-gold-200 bg-gold-50/30">
        <CardContent className="p-5 text-center">
          <Heart className="mx-auto h-8 w-8 text-red-500" />
          <p className="mt-2 text-2xl font-bold text-navy-800">146 niños atendidos en 2026</p>
          <p className="text-sm text-navy-600 mt-1">Gracias a personas como tú que hacen posible cada tratamiento</p>
          <p className="text-xs text-navy-500 mt-2">WomenCiso y MenCiso Foundation — RFC: WMF-XXXXXXXXXX — Recibo deducible de impuestos</p>
        </CardContent>
      </Card>

      {/* Formas de ayudar */}
      <div className="grid gap-4 md:grid-cols-2">
        {formasDeAyudar.map((forma) => (
          <Card key={forma.titulo} className={`border ${forma.color}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <forma.icono className="h-5 w-5 text-navy-600" />
                {forma.titulo}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-navy-600">{forma.descripcion}</p>
              <ul className="space-y-1.5">
                {forma.detalles.map((detalle, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-navy-400" />
                    <span className="text-xs text-navy-700">{detalle}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Datos bancarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-navy-600" />
            Datos para Transferencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Aviso: los datos bancarios son de demostración.
              Las terminaciones en XXXXX indican que NO son cuentas reales. */}
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs font-semibold text-amber-800">
              Datos de demostración — no son cuentas reales
            </p>
            <p className="mt-0.5 text-xs text-amber-700">
              Los números terminados en XXXXX son ficticios. Antes del despliegue, cada
              fundación debe reemplazarlos por sus datos bancarios verificados.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-navy-50 p-4 space-y-1.5">
              <p className="text-xs font-semibold text-navy-500">BBVA México</p>
              <p className="text-sm text-navy-800"><strong>Cuenta:</strong> 01234XXXXX</p>
              <p className="text-sm text-navy-800"><strong>CLABE:</strong> 012 180 001234 XXXXX</p>
              <p className="text-sm text-navy-800"><strong>A nombre de:</strong> WomenCiso y MenCiso Foundation</p>
            </div>
            <div className="rounded-lg bg-navy-50 p-4 space-y-1.5">
              <p className="text-xs font-semibold text-navy-500">Banorte</p>
              <p className="text-sm text-navy-800"><strong>Cuenta:</strong> 98765XXXXX</p>
              <p className="text-sm text-navy-800"><strong>CLABE:</strong> 072 180 098765 XXXXX</p>
              <p className="text-sm text-navy-800"><strong>A nombre de:</strong> WomenCiso y MenCiso Foundation</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-navy-500">
            Todas las donaciones son deducibles de impuestos. Envía tu comprobante a donaciones@womenciso-menciso.org para recibir tu recibo fiscal.
          </p>
        </CardContent>
      </Card>

      {/* Contacto */}
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <Phone className="h-5 w-5 text-navy-500 shrink-0" />
          <div>
            <p className="text-xs text-navy-400">¿Preguntas sobre donaciones?</p>
            <p className="text-sm font-semibold text-navy-800">donaciones@womenciso-menciso.org — 55 0000 XXXXX</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
