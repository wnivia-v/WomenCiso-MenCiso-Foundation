import type { Metadata } from "next";
import {
  FileText,
  AlertTriangle,
  Stethoscope,
  Copyright,
  Ban,
  Scale,
  ShieldAlert,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Términos de Uso — WomenCiso y MenCiso Foundation",
  description:
    "Términos y condiciones de uso del Sistema Integral de Atención a Quemados.",
};

export default function TerminosPage() {
  return (
    <article className="space-y-6">
      <header>
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-100 dark:bg-navy-800">
            <FileText className="h-5 w-5 text-navy-700 dark:text-navy-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-navy-800 dark:text-white sm:text-2xl">
              Términos de Uso
            </h1>
            <p className="text-xs text-navy-500 dark:text-navy-400">
              Última actualización: 25 de julio de 2026 · Versión 1.0
            </p>
          </div>
        </div>
      </header>

      {/* Advertencia médica — lo más importante primero */}
      <div className="rounded-xl border-2 border-red-400 bg-red-50 p-4 dark:border-red-500/40 dark:bg-red-500/10">
        <div className="flex items-start gap-3">
          <Stethoscope className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
          <div>
            <p className="text-sm font-bold text-red-800 dark:text-red-300">
              Esta herramienta no sustituye la atención médica
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-red-700 dark:text-red-200">
              La clasificación de gravedad que genera el sistema es una{" "}
              <strong>orientación</strong> basada en criterios de la American Burn
              Association adaptados a población pediátrica. No constituye un
              diagnóstico médico ni reemplaza la valoración de personal sanitario
              calificado.
            </p>
            <p className="mt-2 text-xs font-semibold leading-relaxed text-red-800 dark:text-red-200">
              Ante una emergencia, llama al 911 primero. Usa este sistema como apoyo
              para canalizar, nunca en lugar de solicitar auxilio médico.
            </p>
          </div>
        </div>
      </div>

      <Seccion titulo="1. Objeto y aceptación" icono={FileText}>
        <p>
          Estos términos regulan el acceso y uso del Sistema Integral de Atención a
          Quemados (en adelante, el Sistema), plataforma destinada a apoyar el
          triage, la canalización hospitalaria y el seguimiento de niñas, niños y
          adolescentes con quemaduras.
        </p>
        <p>
          El acceso al Sistema implica la aceptación plena de estos términos. Si no
          estás de acuerdo con alguna disposición, debes abstenerte de utilizarlo.
        </p>
      </Seccion>

      <Seccion titulo="2. Naturaleza de esta versión" icono={AlertTriangle}>
        <div className="rounded-lg border-l-4 border-amber-400 bg-amber-50 p-3 dark:bg-amber-500/10">
          <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-200">
            La versión publicada es un <strong>prototipo de demostración</strong>{" "}
            desarrollado para el Hackathon IA Masivo Online AWS de Código Facilito.
            No está conectada a un entorno productivo, no persiste información en
            base de datos y todos los registros visibles son ficticios. No debe
            utilizarse para gestionar casos reales.
          </p>
        </div>
      </Seccion>

      <Seccion titulo="3. Uso permitido" icono={FileText}>
        <p>El Sistema puede utilizarse para:</p>
        <Lista
          items={[
            "Reportar y clasificar emergencias por quemadura con fines de canalización.",
            "Consultar la red de hospitales con capacidad de atención especializada.",
            "Dar seguimiento a expedientes, terapias y apoyos de pacientes atendidos por la fundación.",
            "Consultar material educativo de prevención y recursos de orientación legal.",
          ]}
        />
      </Seccion>

      <Seccion titulo="4. Conductas prohibidas" icono={Ban}>
        <p>Queda expresamente prohibido:</p>
        <Lista
          items={[
            "Registrar información falsa, especialmente emergencias inexistentes: una canalización falsa puede desviar recursos que otra persona necesita.",
            "Acceder a expedientes de pacientes sin relación con tus funciones asignadas.",
            "Extraer, copiar o divulgar datos personales o clínicos de terceros.",
            "Intentar vulnerar los controles de acceso, realizar ingeniería inversa o explotar defectos del Sistema.",
            "Automatizar peticiones masivas que degraden la disponibilidad del servicio.",
            "Suplantar la identidad de personal sanitario, coordinadores o familiares.",
            "Reproducir, distribuir o comercializar el software sin autorización escrita del titular.",
          ]}
        />
        <p className="text-xs">
          El incumplimiento faculta a suspender el acceso de forma inmediata y sin
          previo aviso, y puede dar lugar a las acciones civiles y penales que
          correspondan.
        </p>
      </Seccion>

      <Seccion titulo="5. Obligaciones de las personas usuarias" icono={ShieldAlert}>
        <Lista
          items={[
            "Proporcionar información veraz y actualizada al registrar una emergencia o un paciente.",
            "Resguardar la confidencialidad de tus credenciales de acceso y no compartirlas.",
            "Notificar de inmediato cualquier acceso no autorizado del que tengas conocimiento.",
            "Tratar la información clínica a la que accedas conforme al deber de secreto profesional.",
            "Obtener el consentimiento del titular o de su representante legal cuando la normativa lo exija.",
          ]}
        />
      </Seccion>

      <Seccion titulo="6. Propiedad intelectual" icono={Copyright}>
        <p>
          El código fuente, la arquitectura, el diseño de interfaz, la lógica de
          clasificación y la documentación del Sistema son propiedad de{" "}
          <strong>Wladimir Nivia, Ing. Informático</strong>. Todos los derechos
          reservados.
        </p>
        <p>
          No se concede licencia alguna de uso, reproducción, modificación,
          distribución ni explotación comercial. La ausencia de un archivo de
          licencia en el repositorio público debe interpretarse como reserva íntegra
          de derechos, no como liberación al dominio público.
        </p>
        <p className="rounded-lg bg-navy-50 p-3 text-xs dark:bg-navy-800">
          Las marcas, logotipos y denominaciones de WomenCiso y MenCiso Foundation,
          Código Facilito, Amazon Web Services y Kiro pertenecen a sus respectivos
          titulares y se mencionan únicamente con fines identificativos y de
          atribución.
        </p>
      </Seccion>

      <Seccion titulo="7. Limitación de responsabilidad" icono={Scale}>
        <p>
          El Sistema se proporciona <strong>&ldquo;tal cual&rdquo;</strong>, sin
          garantías de ningún tipo, expresas o implícitas, incluyendo sin limitación
          las de idoneidad para un propósito particular, disponibilidad continua o
          ausencia de errores.
        </p>
        <p>En la máxima medida permitida por la legislación aplicable, el titular no responde por:</p>
        <Lista
          items={[
            "Decisiones clínicas adoptadas con base en la clasificación orientativa del Sistema.",
            "Interrupciones, latencia o pérdida de datos derivadas de fallas de red, del proveedor de infraestructura o de causas de fuerza mayor.",
            "Daños indirectos, incidentales o consecuenciales derivados del uso o de la imposibilidad de uso.",
            "Actos u omisiones de terceros, incluidos hospitales, personal sanitario u otras personas usuarias.",
            "Uso del Sistema en contravención de estos términos.",
          ]}
        />
        <p className="text-xs">
          Nada en esta cláusula excluye responsabilidades que la ley declare
          indisponibles, ni limita los derechos que la normativa de protección de
          datos reconoce a los titulares.
        </p>
      </Seccion>

      <Seccion titulo="8. Disponibilidad y modificaciones" icono={FileText}>
        <p>
          No se garantiza disponibilidad ininterrumpida. El servicio puede
          suspenderse por mantenimiento, actualizaciones o causas técnicas.
        </p>
        <p>
          El titular puede modificar estos términos en cualquier momento. Las
          modificaciones se publican en esta dirección con su fecha de actualización.
          El uso continuado tras la publicación implica aceptación de la versión
          vigente.
        </p>
      </Seccion>

      <Seccion titulo="9. Protección de datos" icono={ShieldAlert}>
        <p>
          El tratamiento de datos personales se rige por el{" "}
          <a
            href="/legal/privacidad"
            className="font-semibold text-navy-800 underline decoration-gold-400 underline-offset-2 dark:text-white"
          >
            Aviso de Privacidad
          </a>
          , que forma parte integrante de estos términos.
        </p>
      </Seccion>

      <Seccion titulo="10. Legislación aplicable y jurisdicción" icono={Scale}>
        <p>
          Estos términos se rigen por la legislación de los Estados Unidos
          Mexicanos. Cualquier controversia se someterá a los tribunales competentes
          de la Ciudad de México, salvo que una norma de orden público disponga un
          fuero distinto en favor de la parte consumidora o del titular de los datos.
        </p>
      </Seccion>

      <Seccion titulo="11. Contacto" icono={FileText}>
        <p>Para consultas sobre estos términos:</p>
        <div className="space-y-1 rounded-lg bg-navy-50 p-3 text-xs dark:bg-navy-800">
          <p>
            <strong>Legal:</strong>{" "}
            <span className="font-mono">legal@womenciso-menciso.org</span>
          </p>
          <p>
            <strong>Privacidad:</strong>{" "}
            <span className="font-mono">privacidad@womenciso-menciso.org</span>
          </p>
          <p>
            <strong>Soporte técnico:</strong>{" "}
            <span className="font-mono">soporte@womenciso-menciso.org</span>
          </p>
        </div>
        <p className="text-[11px] text-navy-500 dark:text-navy-400">
          Las direcciones anteriores son de referencia para el prototipo. Cada
          organización que despliegue el Sistema debe sustituirlas por sus canales
          reales de atención.
        </p>
      </Seccion>
    </article>
  );
}

/* --- Componentes de presentación --- */

function Seccion({
  titulo,
  icono: Icono,
  children,
}: {
  titulo: string;
  icono: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-navy-100 bg-white p-5 dark:border-navy-800 dark:bg-navy-900">
      <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-navy-800 dark:text-white">
        <Icono className="h-4 w-4 shrink-0 text-gold-500" />
        {titulo}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed text-navy-700 dark:text-navy-300">
        {children}
      </div>
    </section>
  );
}

function Lista({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
          <span className="text-sm text-navy-600 dark:text-navy-300">{item}</span>
        </li>
      ))}
    </ul>
  );
}
