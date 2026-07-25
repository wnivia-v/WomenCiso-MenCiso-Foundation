import { Heart, Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const seguimientos = [
  { id: "1", paciente: "María García López", edad: 4, tipo: "CURACION", descripcion: "Curación con sulfadiazina de plata.", evolucion: "Tejido de granulación presente. Buena evolución.", responsable: "Enf. Patricia López", fecha: "24 Jul", proximaCita: "26 Jul" },
  { id: "2", paciente: "Carlos Ramírez Soto", edad: 7, tipo: "REHABILITACION", descripcion: "Terapia física mano izquierda.", evolucion: "Recuperó 70% rango de movimiento.", responsable: "Lic. FT Alejandro Ruiz", fecha: "23 Jul", proximaCita: "28 Jul" },
  { id: "3", paciente: "Sofía Hernández Torres", edad: 6, tipo: "REVISION_MEDICA", descripcion: "Revisión evolución quemaduras en torso.", evolucion: "Epitelización al 60%. No requiere injerto.", responsable: "Dr. Miguel Sánchez", fecha: "22 Jul", proximaCita: "29 Jul" },
  { id: "4", paciente: "Diego Martínez Pérez", edad: 9, tipo: "CONTROL", descripcion: "Control post-quirúrgico injerto mano.", evolucion: "90% prendimiento. Iniciar presoterapia.", responsable: "Dra. Carmen Flores", fecha: "21 Jul", proximaCita: "28 Jul" },
  { id: "5", paciente: "Luis Fernando Pérez", edad: 11, tipo: "TERAPIA_FISICA", descripcion: "Presoterapia y estiramiento contractura cuello.", evolucion: "Mejoría gradual. Rango mejoró 5°.", responsable: "Lic. FT Roberto García", fecha: "20 Jul", proximaCita: "27 Jul" },
];

const citasProximas = [
  { paciente: "María G.", tipo: "Curación", fecha: "26 Jul", hora: "10:00" },
  { paciente: "Luis F.", tipo: "Terapia física", fecha: "27 Jul", hora: "09:00" },
  { paciente: "Carlos R.", tipo: "Rehabilitación", fecha: "28 Jul", hora: "11:00" },
  { paciente: "Diego M.", tipo: "Control injerto", fecha: "28 Jul", hora: "14:00" },
  { paciente: "Sofía H.", tipo: "Revisión", fecha: "29 Jul", hora: "10:00" },
];

function getTipoColor(tipo: string) {
  switch (tipo) {
    case "CURACION": return "bg-pink-50 text-pink-700";
    case "REVISION_MEDICA": return "bg-blue-50 text-blue-700";
    case "REHABILITACION": return "bg-purple-50 text-purple-700";
    case "TERAPIA_FISICA": return "bg-green-50 text-green-700";
    case "CONTROL": return "bg-amber-50 text-amber-700";
    default: return "bg-navy-50 text-navy-700";
  }
}

function getTipoLabel(tipo: string) {
  const labels: Record<string, string> = { CURACION: "Curación", REVISION_MEDICA: "Revisión", REHABILITACION: "Rehabilitación", TERAPIA_FISICA: "Terapia física", CONTROL: "Control" };
  return labels[tipo] || tipo;
}

export default function SeguimientoPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-navy-800 md:text-2xl">Seguimiento</h1>
        <p className="text-sm text-navy-500">Curaciones, rehabilitación y evolución</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Historial */}
        <div className="space-y-3 lg:col-span-2">
          {seguimientos.map((seg) => (
            <Card key={seg.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`shrink-0 rounded-lg p-2 ${getTipoColor(seg.tipo)}`}>
                    <Heart className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-sm font-medium text-navy-800">{seg.paciente}</span>
                        <span className="text-xs text-navy-500">({seg.edad} años)</span>
                      </div>
                      <span className="shrink-0 text-[10px] text-navy-400">{seg.fecha}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>{getTipoLabel(seg.tipo)}</Badge>
                      <span className="text-[11px] text-navy-500">{seg.responsable}</span>
                    </div>
                    <p className="text-xs text-navy-600">{seg.descripcion}</p>
                    <div className="rounded-md bg-green-50 p-2">
                      <p className="text-[11px] font-medium text-green-800">Evolución:</p>
                      <p className="text-[11px] text-green-700">{seg.evolucion}</p>
                    </div>
                    <p className="flex items-center gap-1 text-[11px] text-gold-600">
                      <Calendar className="h-3 w-3" /> Próxima: {seg.proximaCita}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Próximas citas */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gold-500" />
              Próximas Citas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {citasProximas.map((cita, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-navy-100 p-2.5">
                  <div className="text-center">
                    <p className="text-xs font-bold text-gold-600">{cita.fecha}</p>
                    <p className="text-[10px] text-navy-500">{cita.hora}</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-navy-800">{cita.paciente}</p>
                    <p className="text-[10px] text-navy-500">{cita.tipo}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
