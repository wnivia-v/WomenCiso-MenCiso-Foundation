/**
 * Banners institucionales de la aplicación.
 *
 * BannerHackathon (superior): identifica el contexto del proyecto.
 *   z-30 — por debajo del sidebar (z-50) para no taparlo al abrirse en móvil.
 *
 * BannerDemo (inferior): aviso de datos ficticios + créditos de autoría.
 *   z-30 — mismo criterio.
 */

export function BannerHackathon() {
  return (
    <div
      role="banner"
      aria-label="Proyecto desarrollado para el Hackathon IA Masivo Online AWS de Código Facilito con Kiro y AWS"
      className="pointer-events-none fixed inset-x-0 top-0 z-30 border-b border-gold-400/20 bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 shadow-sm"
    >
      <div className="flex h-7 items-center justify-center gap-2 px-3">
        {/* Indicador */}
        <span className="hidden h-1.5 w-1.5 rounded-full bg-gold-400 sm:block" />

        <p className="flex items-center gap-1.5 truncate text-[10px] font-medium tracking-wide text-navy-200 sm:gap-2 sm:text-[11px]">
          <span className="hidden font-semibold uppercase tracking-widest text-gold-400 sm:inline">
            Hackathon IA Masivo AWS
          </span>
          <span className="hidden text-navy-600 sm:inline">·</span>
          <span className="text-navy-300">codigofacilito.com</span>
          <span className="text-navy-600">·</span>
          <span className="flex items-center gap-1">
            <span className="text-navy-400">Construido con</span>
            <span className="font-semibold text-white">Kiro</span>
            <span className="text-navy-600">+</span>
            <span className="font-semibold text-[#FF9900]">AWS</span>
          </span>
        </p>

        <span className="hidden h-1.5 w-1.5 rounded-full bg-gold-400 sm:block" />
      </div>
    </div>
  );
}

export function BannerDemo() {
  return (
    <div
      role="note"
      aria-label="Versión de demostración con datos ficticios. Todos los derechos reservados Wladimir Nivia 2026"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30 border-t border-navy-700/50 bg-navy-900/95 backdrop-blur-sm"
    >
      <div className="flex h-7 items-center justify-center gap-2 px-3 pr-20 sm:gap-3">
        {/* Etiqueta DEMO */}
        <span className="flex items-center gap-1 rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-400">
          <span className="h-1 w-1 animate-pulse rounded-full bg-amber-400" />
          Demo
        </span>

        <p className="truncate text-[10px] tracking-wide text-navy-400 sm:text-[11px]">
          <span className="hidden sm:inline">Datos ficticios</span>
          <span className="mx-1.5 hidden text-navy-600 sm:inline">·</span>
          <span className="text-navy-300">&copy; 2026</span>{" "}
          <span className="font-semibold text-white">Wladimir Nivia</span>
          <span className="mx-1.5 text-navy-600">·</span>
          <span className="hidden text-navy-400 sm:inline">Ing. Informático</span>
          <span className="ml-1.5 hidden text-navy-500 md:inline">
            — Todos los derechos reservados
          </span>
        </p>
      </div>
    </div>
  );
}
