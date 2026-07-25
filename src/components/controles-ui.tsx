"use client";

import { Moon, Sun, Globe } from "lucide-react";
import { useTema } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";

interface ControlesUIProps {
  /** Variante de estilo: "claro" para fondos oscuros, "oscuro" para fondos claros */
  variante?: "claro" | "oscuro";
}

/**
 * Controles de tema (claro/oscuro) e idioma (ES/EN).
 * Reutilizable en login y header del dashboard.
 */
export function ControlesUI({ variante = "oscuro" }: ControlesUIProps) {
  const { tema, toggleTema } = useTema();
  const { idioma, toggleIdioma } = useI18n();

  const estiloBoton =
    variante === "claro"
      ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
      : "border-navy-200 bg-white text-navy-600 hover:bg-navy-50 dark:border-navy-700 dark:bg-navy-800 dark:text-navy-200";

  return (
    <div className="flex items-center gap-1.5">
      {/* Idioma */}
      <button
        onClick={toggleIdioma}
        className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all active:scale-95 ${estiloBoton}`}
        aria-label={idioma === "es" ? "Switch to English" : "Cambiar a Español"}
        title={idioma === "es" ? "Switch to English" : "Cambiar a Español"}
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="font-semibold">{idioma === "es" ? "ES" : "EN"}</span>
      </button>

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
