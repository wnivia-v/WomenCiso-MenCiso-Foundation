"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, Shield, BarChart3, Settings2, Check, X } from "lucide-react";

/**
 * Banner de consentimiento de cookies con control granular.
 *
 * Cumple con los principios de consentimiento informado de la LFPDPPP (México)
 * y el RGPD europeo:
 * - No se activa ninguna categoría opcional por defecto
 * - El rechazo es tan accesible como la aceptación (mismo peso visual)
 * - Se puede revocar el consentimiento en cualquier momento
 * - Se explica el propósito de cada categoría
 *
 * Nota técnica: esta app de demostración solo usa almacenamiento estrictamente
 * necesario (sessionStorage para la sesión y el borrador del triage, localStorage
 * para tema e idioma). Las categorías de analítica y personalización se declaran
 * porque el sistema está preparado para integrarlas en producción.
 */

const CONSENTIMIENTO_KEY = "womenciso-consentimiento-cookies";
const VERSION_POLITICA = "1.0";

export interface PreferenciasCookies {
  version: string;
  fecha: string;
  necesarias: true; // siempre activas, no se pueden desactivar
  analitica: boolean;
  personalizacion: boolean;
}

const PREFERENCIAS_INICIALES: PreferenciasCookies = {
  version: VERSION_POLITICA,
  fecha: "",
  necesarias: true,
  analitica: false,
  personalizacion: false,
};

/** Lee las preferencias guardadas. Devuelve null si no hay consentimiento previo. */
export function leerConsentimiento(): PreferenciasCookies | null {
  try {
    const guardado = localStorage.getItem(CONSENTIMIENTO_KEY);
    if (!guardado) return null;
    const prefs = JSON.parse(guardado) as PreferenciasCookies;
    // Si la política cambió de versión, se vuelve a pedir consentimiento
    if (prefs.version !== VERSION_POLITICA) return null;
    return prefs;
  } catch {
    return null;
  }
}

const categorias = [
  {
    id: "necesarias" as const,
    icono: Shield,
    titulo: "Estrictamente necesarias",
    descripcion:
      "Mantienen tu sesión activa y conservan el borrador del triage para que no se pierda si la página se recarga durante una emergencia.",
    detalle: "sessionStorage: sesión de usuario, borrador de triage",
    obligatoria: true,
  },
  {
    id: "personalizacion" as const,
    icono: Settings2,
    titulo: "Preferencias",
    descripcion:
      "Recuerdan tu elección de idioma y de modo claro u oscuro entre visitas.",
    detalle: "localStorage: idioma, tema",
    obligatoria: false,
  },
  {
    id: "analitica" as const,
    icono: BarChart3,
    titulo: "Analítica",
    descripcion:
      "Métricas agregadas y anónimas sobre qué módulos se usan más, para priorizar mejoras. No se recolecta información que identifique a personas ni a pacientes.",
    detalle: "No activa en esta versión de demostración",
    obligatoria: false,
  },
];

export function ConsentimientoCookies() {
  const [visible, setVisible] = useState(false);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [prefs, setPrefs] = useState<PreferenciasCookies>(PREFERENCIAS_INICIALES);

  useEffect(() => {
    // Solo se muestra si no hay consentimiento previo para esta versión
    if (leerConsentimiento() === null) {
      // Pequeño retraso para no competir con la carga inicial de la página
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const guardar = (preferencias: Omit<PreferenciasCookies, "version" | "fecha" | "necesarias">) => {
    const aGuardar: PreferenciasCookies = {
      version: VERSION_POLITICA,
      fecha: new Date().toISOString(),
      necesarias: true,
      ...preferencias,
    };
    try {
      localStorage.setItem(CONSENTIMIENTO_KEY, JSON.stringify(aGuardar));
    } catch {
      // Si localStorage no está disponible (navegación privada), se respeta
      // la decisión solo durante esta sesión.
    }
    setVisible(false);
  };

  const aceptarTodo = () => guardar({ analitica: true, personalizacion: true });
  const soloNecesarias = () => guardar({ analitica: false, personalizacion: false });
  const guardarSeleccion = () =>
    guardar({ analitica: prefs.analitica, personalizacion: prefs.personalizacion });

  if (!visible) return null;

  return (
    <>
      {/* Velo de fondo — no bloquea el triage de emergencia, solo atenúa */}
      <div
        className="fixed inset-0 z-[95] bg-navy-950/40 backdrop-blur-[2px]"
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-cookies"
        aria-describedby="descripcion-cookies"
        className="fixed inset-x-0 bottom-0 z-[96] mx-auto w-full max-w-2xl p-3 sm:p-4"
      >
        <div className="overflow-hidden rounded-2xl border border-navy-200 bg-white shadow-2xl dark:border-navy-700 dark:bg-navy-900">
          {/* Encabezado */}
          <div className="flex items-start gap-3 border-b border-navy-100 p-4 dark:border-navy-800 sm:p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-50 dark:bg-gold-500/10">
              <Cookie className="h-5 w-5 text-gold-600" />
            </div>
            <div className="min-w-0">
              <h2
                id="titulo-cookies"
                className="text-sm font-bold text-navy-800 dark:text-white sm:text-base"
              >
                Tu privacidad, tu decisión
              </h2>
              <p
                id="descripcion-cookies"
                className="mt-0.5 text-xs leading-relaxed text-navy-600 dark:text-navy-300"
              >
                Usamos almacenamiento local para que el sistema funcione y para
                recordar tus preferencias. Nada se comparte con terceros. Puedes
                elegir qué permitir.
              </p>
            </div>
          </div>

          {/* Panel de categorías (colapsable) */}
          {mostrarDetalle && (
            <div className="max-h-64 space-y-2 overflow-y-auto border-b border-navy-100 p-4 dark:border-navy-800 sm:p-5">
              {categorias.map((cat) => {
                const activa = cat.obligatoria || prefs[cat.id];
                return (
                  <div
                    key={cat.id}
                    className="rounded-xl border border-navy-100 p-3 dark:border-navy-800"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-2.5">
                        <cat.icono className="mt-0.5 h-4 w-4 shrink-0 text-navy-500 dark:text-navy-400" />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <p className="text-xs font-semibold text-navy-800 dark:text-white">
                              {cat.titulo}
                            </p>
                            {cat.obligatoria && (
                              <span className="rounded bg-navy-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-navy-600 dark:bg-navy-800 dark:text-navy-300">
                                Siempre activa
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-[11px] leading-relaxed text-navy-600 dark:text-navy-400">
                            {cat.descripcion}
                          </p>
                          <p className="mt-1 font-mono text-[10px] text-navy-400 dark:text-navy-500">
                            {cat.detalle}
                          </p>
                        </div>
                      </div>

                      {/* Interruptor */}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={activa}
                        aria-label={`${cat.titulo}: ${activa ? "activada" : "desactivada"}`}
                        disabled={cat.obligatoria}
                        onClick={() =>
                          !cat.obligatoria &&
                          setPrefs((p) => ({ ...p, [cat.id]: !p[cat.id] }))
                        }
                        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
                          activa ? "bg-green-500" : "bg-navy-200 dark:bg-navy-700"
                        } ${cat.obligatoria ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                      >
                        <span
                          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                            activa ? "translate-x-4.5" : "translate-x-0.5"
                          }`}
                          style={{ transform: activa ? "translateX(18px)" : "translateX(2px)" }}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Acciones */}
          <div className="space-y-2.5 p-4 sm:p-5">
            <div className="flex flex-col gap-2 sm:flex-row">
              {/* Rechazar y aceptar tienen el mismo peso visual a propósito:
                  un rechazo escondido no es consentimiento libre. */}
              <button
                onClick={soloNecesarias}
                className="flex-1 rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-xs font-semibold text-navy-700 transition-colors hover:bg-navy-50 active:scale-[0.98] dark:border-navy-700 dark:bg-navy-800 dark:text-navy-200 dark:hover:bg-navy-700"
              >
                <X className="mr-1.5 inline h-3.5 w-3.5" />
                Solo las necesarias
              </button>

              {mostrarDetalle ? (
                <button
                  onClick={guardarSeleccion}
                  className="flex-1 rounded-xl bg-navy-800 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-navy-700 active:scale-[0.98]"
                >
                  <Check className="mr-1.5 inline h-3.5 w-3.5" />
                  Guardar mi selección
                </button>
              ) : (
                <button
                  onClick={aceptarTodo}
                  className="flex-1 rounded-xl bg-navy-800 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-navy-700 active:scale-[0.98]"
                >
                  <Check className="mr-1.5 inline h-3.5 w-3.5" />
                  Aceptar todas
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px]">
              <button
                onClick={() => setMostrarDetalle((v) => !v)}
                className="font-semibold text-navy-600 underline decoration-navy-300 underline-offset-2 hover:text-navy-800 dark:text-navy-300 dark:hover:text-white"
              >
                {mostrarDetalle ? "Ocultar opciones" : "Personalizar"}
              </button>
              <span className="text-navy-300 dark:text-navy-700">·</span>
              <Link
                href="/legal/privacidad"
                className="text-navy-500 underline decoration-navy-200 underline-offset-2 hover:text-navy-700 dark:text-navy-400 dark:hover:text-navy-200"
              >
                Aviso de privacidad
              </Link>
              <span className="text-navy-300 dark:text-navy-700">·</span>
              <Link
                href="/legal/cookies"
                className="text-navy-500 underline decoration-navy-200 underline-offset-2 hover:text-navy-700 dark:text-navy-400 dark:hover:text-navy-200"
              >
                Política de cookies
              </Link>
              <span className="text-navy-300 dark:text-navy-700">·</span>
              <Link
                href="/legal/terminos"
                className="text-navy-500 underline decoration-navy-200 underline-offset-2 hover:text-navy-700 dark:text-navy-400 dark:hover:text-navy-200"
              >
                Términos de uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Botón para revocar o cambiar el consentimiento en cualquier momento.
 * Se coloca en las páginas legales — el consentimiento no es irreversible.
 */
export function BotonRevocarConsentimiento() {
  const [revocado, setRevocado] = useState(false);

  const revocar = () => {
    try {
      localStorage.removeItem(CONSENTIMIENTO_KEY);
      setRevocado(true);
    } catch {
      // no crítico
    }
  };

  if (revocado) {
    return (
      <p className="rounded-lg bg-green-50 p-3 text-xs font-medium text-green-700">
        Consentimiento revocado. Recarga la página para volver a elegir tus preferencias.
      </p>
    );
  }

  return (
    <button
      onClick={revocar}
      className="rounded-lg border border-navy-200 bg-white px-4 py-2 text-xs font-semibold text-navy-700 transition-colors hover:bg-navy-50 dark:border-navy-700 dark:bg-navy-800 dark:text-navy-200"
    >
      <Cookie className="mr-1.5 inline h-3.5 w-3.5" />
      Cambiar mis preferencias de cookies
    </button>
  );
}
