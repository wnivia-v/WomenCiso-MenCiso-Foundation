import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Scale, Shield, Cookie, FileText } from "lucide-react";

const secciones = [
  { href: "/legal/privacidad", label: "Aviso de Privacidad", icono: Shield },
  { href: "/legal/cookies", label: "Política de Cookies", icono: Cookie },
  { href: "/legal/terminos", label: "Términos de Uso", icono: FileText },
];

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950">
      {/* Encabezado */}
      <header className="border-b border-navy-100 bg-white dark:border-navy-800 dark:bg-navy-900">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="relative h-9 w-9 shrink-0">
                <Image
                  src="/logo-womenciso-menciso-icon.png"
                  alt="WomenCiso y MenCiso Foundation"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-navy-800 dark:text-white">
                  WomenCiso y MenCiso Foundation
                </p>
                <p className="flex items-center gap-1 text-[11px] text-navy-500 dark:text-navy-400">
                  <Scale className="h-3 w-3" />
                  Marco legal y privacidad
                </p>
              </div>
            </div>

            <Link
              href="/"
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-navy-200 px-3 py-2 text-xs font-semibold text-navy-700 transition-colors hover:bg-navy-50 dark:border-navy-700 dark:text-navy-200 dark:hover:bg-navy-800"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Volver al sistema</span>
              <span className="sm:hidden">Volver</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Navegación entre documentos */}
      <nav
        aria-label="Documentos legales"
        className="border-b border-navy-100 bg-white dark:border-navy-800 dark:bg-navy-900"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto">
            {secciones.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="flex shrink-0 items-center gap-1.5 border-b-2 border-transparent px-3 py-3 text-xs font-medium text-navy-600 transition-colors hover:border-gold-400 hover:text-navy-900 dark:text-navy-300 dark:hover:text-white"
              >
                <s.icono className="h-3.5 w-3.5" />
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Contenido */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>

      {/* Pie */}
      <footer className="border-t border-navy-100 bg-white py-6 dark:border-navy-800 dark:bg-navy-900">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="text-[11px] text-navy-500 dark:text-navy-400">
            &copy; 2026 Wladimir Nivia — Ing. Informático. Todos los derechos reservados.
          </p>
          <p className="mt-1 text-[10px] text-navy-400 dark:text-navy-500">
            Sistema desarrollado para el Hackathon IA Masivo Online AWS · codigofacilito.com
          </p>
        </div>
      </footer>
    </div>
  );
}
