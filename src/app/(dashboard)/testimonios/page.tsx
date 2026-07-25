import { Heart, Star, Quote, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const testimonios = [
  {
    nombre: "Familia de Diego M.",
    edad: "9 años",
    historia: "Diego sufrió quemaduras de segundo grado por una escaldadura en la cocina. Gracias al triage rápido de la fundación, fue canalizado al hospital correcto en menos de 20 minutos. Hoy, después de 8 meses de seguimiento, sus cicatrices están sanando y regresó a la escuela.",
    fechaIngreso: "Noviembre 2025",
    estadoActual: "Recuperado — asistiendo a escuela normalmente",
    agradecimiento: "Sin la fundación no hubiéramos sabido a dónde llevarlo. El hospital más cercano no tenía unidad de quemados. Nos salvaron tiempo que a Diego le salvó la piel.",
    impacto: "Canalización inmediata al hospital correcto",
  },
  {
    nombre: "Mamá de Valentina R.",
    edad: "5 años",
    historia: "Valentina tocó una plancha encendida. La quemadura parecía pequeña pero afectó la palma de su mano — zona especial. El sistema del triage detectó la gravedad automáticamente y recomendó un centro especializado. La cirugía temprana evitó que perdiera movilidad.",
    fechaIngreso: "Febrero 2026",
    estadoActual: "En rehabilitación — recuperando movilidad total de la mano",
    agradecimiento: "Pensé que era una quemadura leve. Sin el sistema de clasificación de la fundación, habríamos esperado en urgencias generales y el daño hubiera sido permanente.",
    impacto: "Clasificación correcta de zona especial",
  },
  {
    nombre: "Padre de Carlos A.",
    edad: "14 años",
    historia: "Carlos sufrió quemaduras graves por pirotecnia en diciembre. Estuvo 3 semanas internado. La fundación no solo coordinó su atención médica sino que lo conectó con apoyo psicológico y ahora está tomando un curso de programación en línea de rehabilitación laboral.",
    fechaIngreso: "Diciembre 2025",
    estadoActual: "En curso de Desarrollo Web — futuro programador",
    agradecimiento: "Mi hijo pensaba que su vida se había acabado. La fundación le devolvió un futuro. Está aprendiendo a programar y quiere ayudar a otros cuando sea grande.",
    impacto: "Atención integral: médica + psicológica + laboral",
  },
  {
    nombre: "Familia de Sofía G.",
    edad: "8 años",
    historia: "Quemadura en una fábrica donde trabajaba la mamá — un accidente laboral donde no había protocolos de seguridad. La fundación no solo atendió a Sofía sino que conectó a la familia con el bufete jurídico de la UNAM para la demanda laboral. Ganaron la indemnización.",
    fechaIngreso: "Marzo 2026",
    estadoActual: "Recuperada — familia recibió indemnización laboral",
    agradecimiento: "No sabíamos que teníamos derechos. La fundación nos ayudó con la parte médica Y la legal. Mi hija está bien y la empresa pagó lo que nos debía.",
    impacto: "Defensa legal + atención médica coordinada",
  },
];

export default function TestimoniosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy-800 md:text-2xl">Testimonios</h1>
        <p className="text-sm text-navy-500">Historias reales de familias que han sido atendidas por la fundación</p>
      </div>

      {/* Contador */}
      <Card className="border-gold-200 bg-gold-50/30">
        <CardContent className="flex items-center justify-center gap-6 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-navy-800">146</p>
            <p className="text-[10px] text-navy-500">Pacientes atendidos</p>
          </div>
          <div className="h-10 w-px bg-navy-200" />
          <div className="text-center">
            <p className="text-2xl font-bold text-navy-800">92%</p>
            <p className="text-[10px] text-navy-500">Recuperación exitosa</p>
          </div>
          <div className="h-10 w-px bg-navy-200" />
          <div className="text-center">
            <p className="text-2xl font-bold text-navy-800">4.8</p>
            <p className="text-[10px] text-navy-500">Satisfacción (de 5)</p>
          </div>
        </CardContent>
      </Card>

      {/* Testimonios */}
      <div className="space-y-4">
        {testimonios.map((t, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-100">
                  <Heart className="h-5 w-5 text-gold-600" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-navy-800">{t.nombre}</p>
                      <p className="text-xs text-navy-500">Paciente de {t.edad} — Ingreso: {t.fechaIngreso}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className="h-3 w-3 fill-gold-400 text-gold-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-navy-700">{t.historia}</p>

                  <div className="rounded-lg bg-navy-50 p-3">
                    <div className="flex items-start gap-2">
                      <Quote className="h-4 w-4 shrink-0 text-gold-500 mt-0.5" />
                      <p className="text-sm italic text-navy-600">{t.agradecimiento}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span className="rounded-full bg-green-100 px-2.5 py-1 font-medium text-green-700">
                      {t.estadoActual}
                    </span>
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 font-medium text-blue-700">
                      {t.impacto}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
