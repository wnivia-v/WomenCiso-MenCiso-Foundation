"use client";

import { useState } from "react";
import { Phone, X, AlertTriangle } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function BotonSOS() {
  const { usuario } = useAuth();
  const [mostrar, setMostrar] = useState(false);

  // Solo visible para el rol familiar
  if (!usuario || usuario.rol !== "familiar") return null;

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setMostrar(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-300 transition-all hover:bg-red-700 hover:scale-110 active:scale-95 animate-pulse"
        aria-label="Emergencia — llamar a la fundación"
      >
        <Phone className="h-6 w-6" />
      </button>

      {/* Modal de emergencia */}
      {mostrar && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h3 className="text-lg font-bold text-navy-800">Línea de Emergencia</h3>
              </div>
              <button
                onClick={() => setMostrar(false)}
                className="rounded-full p-1 text-navy-400 hover:bg-navy-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <a
                href="tel:8000000000"
                className="flex items-center gap-3 rounded-xl bg-red-50 border-2 border-red-200 p-4 transition-colors hover:bg-red-100 active:scale-[0.98]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-red-800">WomenCiso y MenCiso</p>
                  <p className="text-lg font-bold text-navy-800">800 000 XXXX</p>
                  <p className="text-[10px] text-navy-500">Disponible 24 horas, 7 días</p>
                </div>
              </a>

              <a
                href="tel:911"
                className="flex items-center gap-3 rounded-xl bg-navy-50 border border-navy-200 p-4 transition-colors hover:bg-navy-100 active:scale-[0.98]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-800">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-navy-800">Emergencias Nacional</p>
                  <p className="text-lg font-bold text-navy-800">911</p>
                  <p className="text-[10px] text-navy-500">Policía, bomberos, ambulancia</p>
                </div>
              </a>

              <p className="text-center text-xs text-navy-500">
                Si es una emergencia médica grave, llama al 911 primero.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
