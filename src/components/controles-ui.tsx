"use client";

import { useState, useRef, useEffect } from "react";
import { Moon, Sun, Globe, Check } from "lucide-react";
import { useTema } from "@/lib/theme";
import { useI18n, type Idioma } from "@/lib/i18n";

interface ControlesUIProps {
  /** Variante de estilo: "claro" para fondos oscuros, "oscuro" para fondos claros */
  variante?: "claro" | "oscuro";
}

const idiomas: { value: Idioma; label: string; bandera: string }[] = [
  { value: "es", label: "Español", bandera: "🇲🇽" },
  { value: "en", label: "English", bandera: "🇺🇸" },
];

/**
 * Controles de tema (claro/oscuro) e idioma (ES/EN).
 * Reutilizable en login y header del dashboard.
 */
export function ControlesUI({ variante = "oscuro" }: ControlesUIProps) {
  const { tema, toggleTema } = useTema();
  const { idioma, setIdioma } = useI18n();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    if (!menuAbierto) return;
    const handleClickFuera = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, [menuAbierto]);

  const estiloBoton =
    variante === "claro"
      ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
      : "border-navy-200 bg-white text-navy-600 hover:bg-navy-50 dark:border-navy-700 dark:bg-navy-800 dark:text-navy-200";

  const idiomaActual = idiomas.find((i) => i.value === idioma) || idiomas[0];

  return (
    <div className="flex items-center gap-1.5">
      {/* Idioma — dropdown */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all active:scale-95 ${estiloBoton}`}
          aria-label="Cambiar idioma"
          aria-expanded={menuAbierto}
          aria-haspopup="listbox"
        >
          <Globe className="h-3.5 w-3.5" />
          <span className="font-semibold">{idiomaActual.bandera} {idiomaActual.value.toUpperCase()}</span>
        </button>

        {/* Menú desplegable */}
        {menuAbierto && (
          <div
            role="listbox"
            aria-label="Seleccionar idioma"
            className="absolute right-0 top-full z-[60] mt-1.5 w-44 overflow-hidden rounded-xl border border-navy-200 bg-white shadow-xl dark:border-navy-700 dark:bg-navy-800"
          >
            <div className="p-1.5">
              <p className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-navy-400 dark:text-navy-500">
                Idioma / Language
              </p>
              {idiomas.map((item) => (
                <button
                  key={item.value}
                  role="option"
                  aria-selected={idioma === item.value}
                  onClick={() => {
                    setIdioma(item.value);
                    setMenuAbierto(false);
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                    idioma === item.value
                      ? "bg-gold-50 font-semibold text-navy-800 dark:bg-gold-500/10 dark:text-white"
                      : "text-navy-600 hover:bg-navy-50 dark:text-navy-300 dark:hover:bg-navy-700"
                  }`}
                >
                  <span className="text-base">{item.bandera}</span>
                  <span className="flex-1">{item.label}</span>
                  {idioma === item.value && (
                    <Check className="h-4 w-4 text-gold-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tema */}
      <button
        onClick={toggleTema}
        className={`flex items-center justify-center rounded-lg border p-1.5 transition-all active:scale-95 ${estiloBoton}`}
        aria-label={tema === "light" ? "Activar modo oscuro" : "Activar modo claro"}
        title={tema === "light" ? "Modo oscuro" : "Modo claro"}
      >
        {tema === "light" ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4 text-amber-400" />
        )}
      </button>
    </div>
  );
}
