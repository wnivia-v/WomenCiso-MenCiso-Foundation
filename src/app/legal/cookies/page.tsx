import type { Metadata } from "next";
import { Cookie, Shield, Settings2, BarChart3, Info } from "lucide-react";
import { BotonRevocarConsentimiento } from "@/components/consentimiento-cookies";

export const metadata: Metadata = {
  title: "Política de Cookies — WomenCiso y MenCiso Foundation",
  description:
    "Detalle del almacenamiento local utilizado por el Sistema Integral de Atención a Quemados.",
};

const inventario = [
  {
    clave: "womenciso-menciso-sesion",
    tipo: "sessionStorage",
    categoria: "Necesaria",
    proposito:
      "Mantiene la sesión del usuario y su rol activo mientras la pestaña permanece abierta.",
    duracion: "Se elimina al cerrar la pestaña",
  },
  {
    clave: "triage-rapido-borrador",
    tipo: "sessionStorage",
    categoria: "Necesaria",
    proposito:
      "Conserva el progreso del formulario de triage. Si la página se recarga a mitad de una emergencia, los datos capturados no se pierden.",
    duracion: "Se elimina al cerrar la pestaña o al finalizar el triage",
  },
  {
    clave: "womenciso-tema",
    tipo: "localStorage",
    categoria: "Preferencias",
    proposito: "Recuerda si elegiste modo claro u oscuro.",
    duracion: "Persistente hasta que se borre",
  },
  {
    clave: "womenciso-idioma",
    tipo: "localStorage",
    categoria: "Preferencias",
    proposito: "Recuerda el idioma seleccionado (español o inglés).",
    duracion: "Persistente hasta que se borre",
  },
  {
    clave: "womenciso-consentimiento-cookies",
    tipo: "localStorage",
    categoria: "Necesaria",
    proposito:
      "Guarda tu decisión sobre esta política, para no volver a preguntarte en cada visita.",
    duracion: "Persistente hasta que se revoque",
  },
];

const categorias = [
  {
    icono: Shield,
    nombre: "Estrictamente necesarias",
    color: "text-navy-600 dark:text-navy-300",
    fondo: "bg-navy-50 dark:bg-navy-800",
    descripcion:
      "Sin este almacenamiento el sistema no puede funcionar: se perdería la sesión al navegar entre módulos y el borrador del triage se borraría ante cualquier recarga. No requieren consentimiento porque son indispensables para prestar el servicio solicitado.",
  },
  {
    icono: Settings2,
    nombre: "Preferencias",
    color: "text-blue-600 dark:text-blue-300",
    fondo: "bg-blue-50 dark:bg-blue-500/10",
    descripcion:
      "Recuerdan tus elecciones de interfaz. Si las rechazas, el sistema sigue funcionando con normalidad, pero volverá al idioma y tema predeterminados en cada visita.",
  },
  {
    icono: BarChart3,
    nombre: "Analítica",
    color: "text-purple-600 dark:text-purple-300",
    fondo: "bg-purple-50 dark:bg-purple-500/10",
    descripcion:
      "Métricas agregadas sobre uso de módulos, para priorizar el desarrollo. No están activas en esta versión de demostración. Si se habilitan en producción, no incluirán información que permita identificar a personas ni datos clínicos.",
  },
];

export default function CookiesPage() {
  return (
    <article className="space-y-6">
      <header>
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-50 dark:bg-gold-500/10">
            <Cookie className="h-5 w-5 text-gold-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-navy-800 dark:text-white sm:text-2xl">
              Política de Cookies
            </h1>
            <p className="text-xs text-navy-500 dark:text-navy-400">
              Última actualización: 25 de julio de 2026 · Versión 1.0
            </p>
          </div>
        </div>
      </header>

      {/* Nota técnica honesta */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-500/30 dark:bg-blue-500/10">
        <div className="flex items-start gap-2.5">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
          <div>
            <p className="text-sm font-bold text-blue-800 dark:text-blue-300">
              Este sistema no usa cookies en sentido estricto
            </p>
            <p className="mt-1 text-xs leading-relaxed text-blue-700 dark:text-blue-200">
              No se emiten cookies HTTP ni identificadores de seguimiento. El
              sistema utiliza <code className="font-mono font-semibold">sessionStorage</code>{" "}
              y <code className="font-mono font-semibold">localStorage</code>, que
              son mecanismos de almacenamiento del propio navegador y no se envían
              automáticamente al servidor en cada petición. Se documentan aquí con
              el mismo rigor porque, desde la perspectiva de tu privacidad, lo
              relevante es qué se guarda en tu dispositivo, no la etiqueta técnica.
            </p>
          </div>
        </div>
      </div>

      {/* Categorías */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-navy-800 dark:text-white">
          Categorías de almacenamiento
        </h2>
        {categorias.map((cat) => (
          <div
            key={cat.nombre}
            className="rounded-xl border border-navy-100 bg-white p-4 dark:border-navy-800 dark:bg-navy-900"
          >
            <div className="flex items-start gap-3">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${cat.fondo}`}>
                <cat.icono className={`h-4 w-4 ${cat.color}`} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-navy-800 dark:text-white">
                  {cat.nombre}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-navy-600 dark:text-navy-300">
                  {cat.descripcion}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Inventario detallado */}
      <section className="rounded-xl border border-navy-100 bg-white p-5 dark:border-navy-800 dark:bg-navy-900">
        <h2 className="text-base font-bold text-navy-800 dark:text-white">
          Inventario completo
        </h2>
        <p className="mb-4 mt-1 text-xs text-navy-500 dark:text-navy-400">
          Cada elemento que este sistema guarda en tu navegador, sin excepción.
        </p>

        {/* Tabla en escritorio */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-navy-100 dark:border-navy-800">
                <th className="pb-2 pr-3 text-[11px] font-semibold uppercase tracking-wide text-navy-500 dark:text-navy-400">
                  Clave
                </th>
                <th className="pb-2 pr-3 text-[11px] font-semibold uppercase tracking-wide text-navy-500 dark:text-navy-400">
                  Tipo
                </th>
                <th className="pb-2 pr-3 text-[11px] font-semibold uppercase tracking-wide text-navy-500 dark:text-navy-400">
                  Categoría
                </th>
                <th className="pb-2 pr-3 text-[11px] font-semibold uppercase tracking-wide text-navy-500 dark:text-navy-400">
                  Propósito
                </th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wide text-navy-500 dark:text-navy-400">
                  Duración
                </th>
              </tr>
            </thead>
            <tbody>
              {inventario.map((item) => (
                <tr
                  key={item.clave}
                  className="border-b border-navy-50 last:border-0 dark:border-navy-800/50"
                >
                  <td className="py-3 pr-3 align-top">
                    <code className="font-mono text-[11px] text-navy-800 dark:text-navy-200">
                      {item.clave}
                    </code>
                  </td>
                  <td className="py-3 pr-3 align-top text-[11px] text-navy-600 dark:text-navy-400">
                    {item.tipo}
                  </td>
                  <td className="py-3 pr-3 align-top">
                    <span className="rounded bg-navy-100 px-1.5 py-0.5 text-[10px] font-semibold text-navy-700 dark:bg-navy-800 dark:text-navy-300">
                      {item.categoria}
                    </span>
                  </td>
                  <td className="py-3 pr-3 align-top text-xs leading-relaxed text-navy-600 dark:text-navy-300">
                    {item.proposito}
                  </td>
                  <td className="py-3 align-top text-[11px] text-navy-500 dark:text-navy-400">
                    {item.duracion}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tarjetas en móvil */}
        <div className="space-y-3 md:hidden">
          {inventario.map((item) => (
            <div
              key={item.clave}
              className="rounded-lg border border-navy-100 p-3 dark:border-navy-800"
            >
              <div className="flex flex-wrap items-center gap-1.5">
                <code className="font-mono text-[11px] font-semibold text-navy-800 dark:text-navy-200">
                  {item.clave}
                </code>
                <span className="rounded bg-navy-100 px-1.5 py-0.5 text-[9px] font-semibold text-navy-700 dark:bg-navy-800 dark:text-navy-300">
                  {item.categoria}
                </span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-navy-600 dark:text-navy-300">
                {item.proposito}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-3 text-[10px] text-navy-500 dark:text-navy-400">
                <span>{item.tipo}</span>
                <span>·</span>
                <span>{item.duracion}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cómo controlarlo */}
      <section className="rounded-xl border border-navy-100 bg-white p-5 dark:border-navy-800 dark:bg-navy-900">
        <h2 className="mb-3 text-base font-bold text-navy-800 dark:text-white">
          Cómo controlar este almacenamiento
        </h2>
        <div className="space-y-3 text-sm leading-relaxed text-navy-700 dark:text-navy-300">
          <p>
            <strong className="text-navy-800 dark:text-white">Desde el sistema:</strong>{" "}
            usa el botón al final de esta página para revocar tu consentimiento. Al
            recargar volverás a ver el panel de preferencias.
          </p>
          <p>
            <strong className="text-navy-800 dark:text-white">Desde el navegador:</strong>{" "}
            puedes borrar el almacenamiento del sitio en la configuración de
            privacidad de tu navegador, o navegar en modo privado para que nada
            persista al cerrar la ventana.
          </p>
          <div className="rounded-lg border-l-4 border-amber-400 bg-amber-50 p-3 dark:bg-amber-500/10">
            <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-200">
              <strong>Ten en cuenta:</strong> si bloqueas el almacenamiento
              estrictamente necesario, el sistema seguirá abriéndose pero perderás la
              sesión al cambiar de módulo y el borrador del triage no se conservará
              ante una recarga. En una emergencia real, eso puede significar
              recapturar datos.
            </p>
          </div>
        </div>
      </section>

      {/* Revocación */}
      <section className="rounded-xl border border-navy-200 bg-white p-5 dark:border-navy-700 dark:bg-navy-900">
        <h2 className="text-sm font-bold text-navy-800 dark:text-white">
          Revocar mi consentimiento
        </h2>
        <p className="mb-3 mt-1 text-xs text-navy-600 dark:text-navy-300">
          Tu decisión no es definitiva. Puedes cambiarla cuando quieras.
        </p>
        <BotonRevocarConsentimiento />
      </section>
    </article>
  );
}
