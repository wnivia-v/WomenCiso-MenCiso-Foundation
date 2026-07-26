"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { usePathname } from "next/navigation";

interface VozContextType {
  activo: boolean;
  toggleVoz: () => void;
  leer: (texto: string) => void;
  detener: () => void;
}

const VozContext = createContext<VozContextType>({
  activo: false,
  toggleVoz: () => {},
  leer: () => {},
  detener: () => {},
});

export function useVoz() {
  return useContext(VozContext);
}

// Descripciones de cada ruta para que el lector las anuncie al navegar
const descripcionesRuta: Record<string, string> = {
  "/dashboard": "Panel de control. Aquí puede ver estadísticas generales, emergencias recientes y próximas citas.",
  "/emergencias": "Lista de emergencias activas. Puede ver el estado de cada una y su nivel de gravedad.",
  "/emergencias/nueva": "Triage rápido. Formulario de 5 pasos para clasificar una emergencia. Paso 1: datos de quien reporta. Use el botón Siguiente para avanzar y Anterior para regresar.",
  "/emergencias/extrema": "Emergencia extrema. Formulario ultra rápido de una sola pantalla. Solo ingrese edad, porcentaje quemado, grado y zona. Presione Clasificar y Canalizar para obtener el hospital inmediatamente.",
  "/pacientes": "Lista de pacientes registrados. Puede buscar por nombre o ver sus expedientes.",
  "/pacientes/nuevo": "Registrar nuevo paciente. Puede tomar foto de un documento para llenar los datos automáticamente, o escribirlos manualmente.",
  "/hospitales": "Red de hospitales. Muestra hospitales especializados en quemaduras con camas disponibles y un mapa de ubicación.",
  "/expedientes": "Expedientes médicos completos de los pacientes.",
  "/seguimiento": "Seguimiento post-alta. Curaciones, terapia física y controles programados.",
  "/psicologia": "Sesiones de apoyo psicológico para pacientes y familias.",
  "/rehabilitacion": "Rehabilitación laboral. Cursos de capacitación, bolsa de trabajo y organizaciones aliadas para reincorporarse al mercado laboral.",
  "/defensa-legal": "Defensa legal gratuita. Asesoría jurídica para víctimas de quemaduras con apoyo de universidades voluntarias.",
  "/prevencion": "Prevención y educación. Consejos de seguridad para evitar quemaduras en el hogar.",
  "/donaciones": "Donaciones. Formas de ayudar a la fundación: dinero, especie, voluntariado o alianza empresarial.",
  "/testimonios": "Testimonios. Historias reales de familias que han sido atendidas.",
  "/costos": "Control de costos. Gastos médicos, cobertura y presupuesto.",
  "/mi-expediente": "Mi expediente. Aquí puede ver los datos de su paciente, próxima cita, historial de atención y generar el código QR para identificación en hospitales.",
};

export function VozProvider({ children }: { children: ReactNode }) {
  const [activo, setActivo] = useState(false);
  const [soportado, setSoportado] = useState(false);
  const pathname = usePathname();
  const ultimaRutaLeida = useRef("");

  useEffect(() => {
    setSoportado("speechSynthesis" in window);
    // Cargar voces
    if ("speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Audio element para reproducir el MP3 de Polly
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const leer = useCallback(
    async (texto: string) => {
      if (!activo || !soportado) return;

      // Detener cualquier reproducción anterior
      window.speechSynthesis.cancel();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Intentar con Amazon Polly (voz neural, suena humana)
      try {
        abortControllerRef.current = new AbortController();
        const idioma = localStorage.getItem("womenciso-idioma") || "es";

        const response = await fetch("/api/voz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texto: texto.slice(0, 1000), idioma }),
          signal: abortControllerRef.current.signal,
        });

        if (response.ok && response.headers.get("content-type")?.includes("audio")) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audioRef.current = audio;
          audio.onended = () => URL.revokeObjectURL(url);
          await audio.play();
          return; // Polly funcionó, no usar fallback
        }
      } catch {
        // Si Polly no está disponible, continuar con fallback
      }

      // Fallback: voz del navegador (menos natural pero siempre disponible)
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = "es-MX";
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      const voces = window.speechSynthesis.getVoices();
      const vozEspanol = voces.find(
        (v) => v.lang.startsWith("es") && v.localService
      ) || voces.find((v) => v.lang.startsWith("es"));
      if (vozEspanol) utterance.voice = vozEspanol;
      window.speechSynthesis.speak(utterance);
    },
    [activo, soportado]
  );

  const detener = useCallback(() => {
    if (soportado) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, [soportado]);

  const toggleVoz = useCallback(() => {
    setActivo((prev) => {
      const nuevo = !prev;
      if (!nuevo && soportado) {
        window.speechSynthesis.cancel();
      }
      if (nuevo && soportado) {
        window.speechSynthesis.cancel();
        const ruta = window.location.pathname;
        const desc = descripcionesRuta[ruta] || "Página cargada.";
        const msg = new SpeechSynthesisUtterance(
          `Lectura por voz activada. ${desc} Para desactivar la voz, presione el botón de bocina en la parte superior derecha.`
        );
        msg.lang = "es-MX";
        msg.rate = 1.0;
        const voces = window.speechSynthesis.getVoices();
        const vozEspanol = voces.find((v) => v.lang.startsWith("es"));
        if (vozEspanol) msg.voice = vozEspanol;
        window.speechSynthesis.speak(msg);
        ultimaRutaLeida.current = ruta;
      }
      return nuevo;
    });
  }, [soportado]);

  // Leer automáticamente cuando cambia de página
  useEffect(() => {
    if (!activo || !soportado) return;
    if (pathname === ultimaRutaLeida.current) return;
    ultimaRutaLeida.current = pathname;

    // Esperar un momento para que la página se renderice
    const timer = setTimeout(() => {
      const desc = descripcionesRuta[pathname];
      if (desc) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(desc);
        msg.lang = "es-MX";
        msg.rate = 1.0;
        const voces = window.speechSynthesis.getVoices();
        const vozEspanol = voces.find((v) => v.lang.startsWith("es"));
        if (vozEspanol) msg.voice = vozEspanol;
        window.speechSynthesis.speak(msg);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname, activo, soportado]);

  // Leer botones y links al enfocar con teclado (Tab) cuando la voz está activa
  useEffect(() => {
    if (!activo || !soportado) return;

    const handleFocus = (e: FocusEvent) => {
      const el = e.target as HTMLElement;
      if (!el) return;

      // Solo leer si fue con teclado (focus-visible)
      if (!el.matches(":focus-visible")) return;

      let texto = "";
      const ariaLabel = el.getAttribute("aria-label");
      const innerText = el.textContent?.trim();

      if (ariaLabel) {
        texto = ariaLabel;
      } else if (el.tagName === "BUTTON" || el.tagName === "A") {
        texto = `Botón: ${innerText || "sin nombre"}`;
      } else if (el.tagName === "INPUT") {
        const input = el as HTMLInputElement;
        const label = el.closest(".space-y-1\\.5")?.querySelector("label")?.textContent;
        texto = `Campo: ${label || input.placeholder || input.type}`;
      } else if (el.tagName === "SELECT") {
        const label = el.closest(".space-y-1\\.5")?.querySelector("label")?.textContent;
        texto = `Seleccionar: ${label || "opción"}`;
      }

      if (texto) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(texto);
        msg.lang = "es-MX";
        msg.rate = 1.1;
        const voces = window.speechSynthesis.getVoices();
        const vozEspanol = voces.find((v) => v.lang.startsWith("es"));
        if (vozEspanol) msg.voice = vozEspanol;
        window.speechSynthesis.speak(msg);
      }
    };

    document.addEventListener("focusin", handleFocus);
    return () => document.removeEventListener("focusin", handleFocus);
  }, [activo, soportado]);

  return (
    <VozContext.Provider value={{ activo, toggleVoz, leer, detener }}>
      {children}
    </VozContext.Provider>
  );
}

/**
 * Botón para activar/desactivar la lectura por voz.
 */
export function BotonVoz() {
  const { activo, toggleVoz } = useVoz();
  const [soportado, setSoportado] = useState(false);

  useEffect(() => {
    setSoportado("speechSynthesis" in window);
  }, []);

  if (!soportado) return null;

  return (
    <button
      onClick={toggleVoz}
      className={`relative rounded-lg p-2 transition-colors ${
        activo
          ? "bg-green-100 text-green-700 hover:bg-green-200"
          : "text-navy-400 hover:bg-navy-50 hover:text-navy-600"
      }`}
      aria-label={activo ? "Desactivar lectura por voz" : "Activar lectura por voz para personas con discapacidad visual"}
      title={activo ? "Voz activada — clic para desactivar" : "Activar lectura por voz"}
    >
      {activo ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
      {activo && (
        <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
        </span>
      )}
    </button>
  );
}
