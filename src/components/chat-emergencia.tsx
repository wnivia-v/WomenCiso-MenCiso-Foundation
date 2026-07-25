"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Clock } from "lucide-react";
import { useAuth } from "@/lib/auth";

const mensajesIniciales = [
  { id: 1, autor: "Coord. María López", rol: "coordinador", texto: "Paciente EMG-001 en camino. Escaldadura, 4 años, SCQ 15%, brazo der + torso. GRAVE.", hora: "10:32", esPropio: false },
  { id: 2, autor: "Dr. Ramírez (CENIAQ)", rol: "hospital", texto: "Recibido. Preparando sala de curaciones. ¿Tiene vía IV?", hora: "10:33", esPropio: false },
  { id: 3, autor: "Coord. María López", rol: "coordinador", texto: "Negativo. Paramédicos no pudieron canalizar. ETA 12 minutos.", hora: "10:34", esPropio: false },
  { id: 4, autor: "Dr. Ramírez (CENIAQ)", rol: "hospital", texto: "Entendido. Tendremos equipo de vía central listo. Puerta 3.", hora: "10:35", esPropio: false },
  { id: 5, autor: "Coord. María López", rol: "coordinador", texto: "Perfecto. Familia viene en auto particular detrás de la ambulancia.", hora: "10:36", esPropio: false },
];

export function ChatEmergencia() {
  const { usuario } = useAuth();
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState(mensajesIniciales);
  const [nuevoMensaje, setNuevoMensaje] = useState("");

  // Solo visible para coordinador y hospital
  if (!usuario || (usuario.rol !== "admin" && usuario.rol !== "coordinador" && usuario.rol !== "hospital")) return null;

  const enviarMensaje = () => {
    if (!nuevoMensaje.trim()) return;
    const ahora = new Date();
    setMensajes((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        autor: usuario.nombre,
        rol: usuario.rol,
        texto: nuevoMensaje.trim(),
        hora: `${ahora.getHours().toString().padStart(2, "0")}:${ahora.getMinutes().toString().padStart(2, "0")}`,
        esPropio: true,
      },
    ]);
    setNuevoMensaje("");
  };

  return (
    <>
      {/* Botón flotante del chat */}
      <button
        onClick={() => setAbierto(!abierto)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-navy-800 text-white shadow-lg transition-all hover:bg-navy-700 hover:scale-110 active:scale-95"
        aria-label="Chat de emergencia"
      >
        {abierto ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!abierto && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            !
          </span>
        )}
      </button>

      {/* Panel del chat */}
      {abierto && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[420px] w-80 flex-col rounded-2xl border border-navy-200 bg-white shadow-2xl sm:w-96">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl bg-navy-800 px-4 py-3">
            <div>
              <p className="text-sm font-bold text-white">Chat de Emergencia</p>
              <p className="text-[10px] text-navy-300">EMG-001 — María G., 4 años</p>
            </div>
            <div className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {mensajes.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.esPropio ? "items-end" : "items-start"}`}>
                <p className="text-[9px] text-navy-400 mb-0.5">{msg.autor}</p>
                <div
                  className={`max-w-[80%] rounded-xl px-3 py-2 ${
                    msg.esPropio
                      ? "bg-navy-800 text-white"
                      : msg.rol === "hospital"
                      ? "bg-green-50 border border-green-200 text-navy-800"
                      : "bg-navy-50 border border-navy-100 text-navy-800"
                  }`}
                >
                  <p className="text-xs">{msg.texto}</p>
                </div>
                <p className="mt-0.5 flex items-center gap-0.5 text-[9px] text-navy-400">
                  <Clock className="h-2 w-2" />{msg.hora}
                </p>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-navy-100 p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={nuevoMensaje}
                onChange={(e) => setNuevoMensaje(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
                placeholder="Escribir mensaje..."
                className="flex-1 rounded-lg border border-navy-200 px-3 py-2 text-xs placeholder:text-navy-400 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/30"
              />
              <button
                onClick={enviarMensaje}
                disabled={!nuevoMensaje.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-800 text-white transition-colors hover:bg-navy-700 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
