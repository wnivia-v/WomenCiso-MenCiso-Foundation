/**
 * Banner superior: identifica el hackathon (siempre visible).
 * Banner inferior: créditos y aviso de demo.
 */

export function BannerHackathon() {
  return (
    <div
      role="banner"
      aria-label="Hackathon IA Masivo Online AWS por Código Facilito — desarrollado con Kiro y AWS"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex items-center justify-center bg-navy-800/95 px-3 py-1.5 backdrop-blur"
    >
      <p className="text-center text-[10px] font-medium leading-tight text-white sm:text-xs">
        <span className="mr-1.5 rounded bg-gold-400 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-navy-900 sm:text-[10px]">
          Hackathon 2026
        </span>
        Hackathon IA Masivo Online AWS — codigofacilito.com
        <span className="mx-1.5 text-navy-400">|</span>
        Desarrollado con <span className="font-bold text-gold-400">Kiro</span> + <span className="font-bold text-gold-400">AWS</span>
      </p>
    </div>
  );
}

export function BannerDemo() {
  return (
    <div
      role="note"
      aria-label="Aviso: esta es una versión de demostración — Todos los derechos reservados Wladimir Nivia"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex items-center justify-center border-t border-amber-300 bg-amber-100/95 px-3 py-1.5 pr-20 backdrop-blur"
    >
      <p className="text-center text-[10px] font-semibold leading-tight text-amber-900 sm:text-xs">
        <span className="mr-1.5 rounded bg-amber-800 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-50 sm:text-[10px]">
          Demo
        </span>
        Datos ficticios — Todos los derechos reservados &copy; 2026 Wladimir Nivia
        <span className="hidden sm:inline"> — Ing. Informatico</span>
      </p>
    </div>
  );
}
