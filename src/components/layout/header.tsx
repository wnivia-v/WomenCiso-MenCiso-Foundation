"use client";

import { useState } from "react";
import Image from "next/image";
import { Bell, Menu, Search, X, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { BotonVoz } from "@/components/lector-voz";

const notificaciones = [
  {
    id: 1,
    tipo: "emergencia",
    titulo: "Nueva emergencia reportada",
    detalle: "María G., 4 años — Escaldadura GRAVE",
    tiempo: "Hace 15 min",
    leida: false,
  },
  {
    id: 2,
    tipo: "canalizacion",
    titulo: "Paciente canalizado exitosamente",
    detalle: "Carlos R. → Hospital Civil de Guadalajara",
    tiempo: "Hace 1 hora",
    leida: false,
  },
  {
    id: 3,
    tipo: "cita",
    titulo: "Recordatorio de cita",
    detalle: "Sofía T. — Psicología hoy 16:30",
    tiempo: "Hace 2 horas",
    leida: true,
  },
  {
    id: 4,
    tipo: "sistema",
    titulo: "Nuevo curso disponible",
    detalle: "Desarrollo Web Frontend — inscripciones abiertas",
    tiempo: "Hace 3 horas",
    leida: true,
  },
  {
    id: 5,
    tipo: "emergencia",
    titulo: "Triage completado",
    detalle: "Ana L., 12 años — Clasificada CRÍTICO → CENIAQ",
    tiempo: "Hace 4 horas",
    leida: true,
  },
];

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-navy-100 bg-white/95 px-4 backdrop-blur-sm md:h-16 md:px-6" role="banner" aria-label="Encabezado del sistema">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-navy-600 hover:bg-navy-50 active:bg-navy-100 md:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 md:hidden">
          <div className="relative h-7 w-7 shrink-0">
            <Image
              src="/logo-womenciso-menciso-icon.png"
              alt="WomenCiso y MenCiso Foundation"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-sm font-bold text-navy-800">WomenCiso y MenCiso</span>
        </div>

        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
          <input
            type="text"
            placeholder="Buscar paciente, hospital..."
            className="h-9 w-72 rounded-lg border border-navy-100 bg-navy-50/50 pl-9 pr-4 text-sm placeholder:text-navy-400 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/20 lg:w-80"
          />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          className="rounded-lg p-2 text-navy-400 hover:bg-navy-50 md:hidden"
          aria-label="Buscar"
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Botón de lectura por voz */}
        <BotonVoz />

        {/* Notificaciones */}
        <div className="relative">
          <button
            onClick={() => setMostrarNotificaciones(!mostrarNotificaciones)}
            className="relative rounded-lg p-2 text-navy-400 hover:bg-navy-50 hover:text-navy-600"
            aria-label="Notificaciones"
          >
            <Bell className="h-5 w-5" />
            {noLeidas > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                {noLeidas}
              </span>
            )}
          </button>

          {/* Panel de notificaciones */}
          {mostrarNotificaciones && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMostrarNotificaciones(false)}
              />
              <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-navy-100 bg-white shadow-xl sm:w-96">
                <div className="flex items-center justify-between border-b border-navy-100 px-4 py-3">
                  <p className="text-sm font-semibold text-navy-800">Notificaciones</p>
                  <button
                    onClick={() => setMostrarNotificaciones(false)}
                    className="rounded-md p-1 text-navy-400 hover:bg-navy-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notificaciones.map((n) => (
                    <div
                      key={n.id}
                      className={`flex items-start gap-3 border-b border-navy-50 px-4 py-3 last:border-b-0 ${
                        !n.leida ? "bg-blue-50/50" : ""
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {n.tipo === "emergencia" ? (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        ) : n.tipo === "canalizacion" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <Bell className="h-4 w-4 text-navy-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs ${!n.leida ? "font-semibold text-navy-800" : "text-navy-700"}`}>
                          {n.titulo}
                        </p>
                        <p className="text-[10px] text-navy-500 truncate">{n.detalle}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-[10px] text-navy-400">
                          <Clock className="h-2.5 w-2.5" />{n.tiempo}
                        </p>
                      </div>
                      {!n.leida && (
                        <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="border-t border-navy-100 px-4 py-2.5 text-center">
                  <button className="text-xs font-medium text-gold-600 hover:text-gold-700">
                    Ver todas las notificaciones
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
