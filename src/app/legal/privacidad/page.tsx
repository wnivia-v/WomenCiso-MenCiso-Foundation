import type { Metadata } from "next";
import { Shield, AlertTriangle, Lock, UserCheck, Database, Globe2 } from "lucide-react";
import { BotonRevocarConsentimiento } from "@/components/consentimiento-cookies";

export const metadata: Metadata = {
  title: "Aviso de Privacidad — WomenCiso y MenCiso Foundation",
  description:
    "Aviso de privacidad del Sistema Integral de Atención a Quemados, conforme a la LFPDPPP.",
};

export default function PrivacidadPage() {
  return (
    <article className="space-y-6">
      {/* Encabezado */}
      <header>
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-100 dark:bg-navy-800">
            <Shield className="h-5 w-5 text-navy-700 dark:text-navy-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-navy-800 dark:text-white sm:text-2xl">
              Aviso de Privacidad
            </h1>
            <p className="text-xs text-navy-500 dark:text-navy-400">
              Última actualización: 25 de julio de 2026 · Versión 1.0
            </p>
          </div>
        </div>
      </header>

      {/* Aviso de demostración */}
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
              Versión de demostración
            </p>
            <p className="mt-1 text-xs leading-relaxed text-amber-700 dark:text-amber-200">
              Este sistema es un prototipo presentado en un hackathon. No recolecta
              ni almacena datos reales de pacientes. Todos los nombres, expedientes
              y diagnósticos visibles son ficticios. Este aviso describe el
              tratamiento de datos que aplicaría en un despliegue productivo, y se
              publica para que el marco de privacidad sea revisable desde ahora.
            </p>
          </div>
        </div>
      </div>

      <Seccion titulo="1. Responsable del tratamiento" icono={UserCheck}>
        <p>
          El responsable del tratamiento de los datos personales recabados a través
          de este sistema es <strong>WomenCiso y MenCiso Foundation</strong>, en
          conjunto con la fundación u organización sanitaria que despliegue la
          plataforma en su propia infraestructura.
        </p>
        <p>
          El desarrollo técnico corresponde a Wladimir Nivia, Ing. Informático,
          quien no funge como responsable ni encargado del tratamiento de datos en
          producción.
        </p>
        <p className="rounded-lg bg-navy-50 p-3 text-xs dark:bg-navy-800">
          Para ejercer tus derechos o resolver dudas sobre este aviso:{" "}
          <span className="font-mono font-semibold">privacidad@womenciso-menciso.org</span>
        </p>
      </Seccion>

      <Seccion titulo="2. Datos personales que se recaban" icono={Database}>
        <p>
          En un despliegue productivo, el sistema trataría las siguientes categorías
          de datos:
        </p>
        <Lista
          items={[
            {
              t: "Datos identificativos del paciente",
              d: "Nombre, apellidos, fecha de nacimiento, CURP, sexo, domicilio, teléfono.",
            },
            {
              t: "Datos de salud (sensibles)",
              d: "Diagnóstico de quemadura, grado, superficie corporal afectada, zonas comprometidas, fotografías clínicas, historial de cirugías, medicación, evolución, notas de seguimiento psicológico.",
            },
            {
              t: "Datos del reportante",
              d: "Nombre, teléfono y parentesco de quien reporta la emergencia.",
            },
            {
              t: "Datos de geolocalización",
              d: "Coordenadas del lugar del incidente, capturadas únicamente con autorización expresa del usuario y con el fin de reducir el tiempo de traslado.",
            },
            {
              t: "Datos de acceso",
              d: "Identificador de usuario, rol asignado y registro de accesos al expediente.",
            },
          ]}
        />
        <div className="rounded-xl border-l-4 border-red-400 bg-red-50 p-3 dark:bg-red-500/10">
          <p className="text-xs font-semibold text-red-800 dark:text-red-300">
            Datos sensibles y personas menores de edad
          </p>
          <p className="mt-1 text-xs leading-relaxed text-red-700 dark:text-red-200">
            Los datos de salud son datos personales sensibles conforme al artículo 3
            de la LFPDPPP, y la mayoría de los titulares en este sistema son niñas,
            niños y adolescentes. Su tratamiento exige consentimiento expreso y por
            escrito de quien ejerce la patria potestad o tutela, salvo en los
            supuestos de urgencia médica descritos en la sección 4.
          </p>
        </div>
      </Seccion>

      <Seccion titulo="3. Finalidades del tratamiento" icono={Shield}>
        <p className="font-semibold text-navy-800 dark:text-white">
          Finalidades primarias (necesarias para el servicio):
        </p>
        <Lista
          items={[
            { t: "Clasificar la gravedad de la emergencia", d: "Determinar el nivel de urgencia mediante criterios clínicos." },
            { t: "Canalizar al hospital adecuado", d: "Identificar el centro con capacidad y especialidad correspondientes." },
            { t: "Integrar el expediente clínico", d: "Dar continuidad al tratamiento entre instituciones." },
            { t: "Dar seguimiento post-alta", d: "Programar curaciones, terapia y acompañamiento psicológico." },
            { t: "Gestionar apoyos", d: "Administrar cobertura de costos médicos y asesoría legal gratuita." },
          ]}
        />
        <p className="mt-4 font-semibold text-navy-800 dark:text-white">
          Finalidades secundarias (opcionales, requieren consentimiento adicional):
        </p>
        <Lista
          items={[
            { t: "Estadística e investigación", d: "Elaboración de reportes agregados y anonimizados sobre incidencia de quemaduras pediátricas." },
            { t: "Difusión institucional", d: "Uso de testimonios o imágenes, únicamente con autorización expresa y revocable." },
          ]}
        />
        <p className="text-xs">
          La negativa a las finalidades secundarias no condiciona ni limita en
          ningún caso la atención médica ni el acceso a los servicios de la
          fundación.
        </p>
      </Seccion>

      <Seccion titulo="4. Tratamiento en situaciones de urgencia médica" icono={AlertTriangle}>
        <p>
          El artículo 10 de la LFPDPPP permite tratar datos personales sin
          consentimiento cuando exista una situación de emergencia que pueda dañar a
          la persona titular en su integridad o salud.
        </p>
        <p>
          Con base en ello, el módulo de triage es accesible sin credenciales y
          permite registrar una emergencia antes de obtener consentimiento formal.
          Esta decisión de diseño responde a una razón concreta: exigir usuario y
          contraseña a una madre cuyo hijo acaba de sufrir una quemadura introduce
          una barrera que cuesta minutos, y en una quemadura extensa los minutos
          determinan el pronóstico.
        </p>
        <p>
          El consentimiento se recaba en cuanto la situación lo permita, y el
          titular o su representante conserva íntegros sus derechos de acceso,
          rectificación, cancelación y oposición sobre lo registrado.
        </p>
      </Seccion>

      <Seccion titulo="5. Transferencias de datos" icono={Globe2}>
        <p>Los datos podrán transferirse, sin requerir consentimiento adicional, a:</p>
        <Lista
          items={[
            { t: "Hospitales de la red", d: "Exclusivamente el centro receptor del paciente, para preparar la atención antes de su llegada." },
            { t: "Personal sanitario tratante", d: "Médicos, enfermería y psicología directamente responsables del caso." },
            { t: "Autoridades competentes", d: "Cuando exista requerimiento fundado y motivado conforme a la legislación aplicable." },
          ]}
        />
        <p>
          No se comercializan, arriendan ni ceden datos a terceros con fines
          publicitarios o comerciales, bajo ninguna circunstancia.
        </p>
        <p className="rounded-lg bg-navy-50 p-3 text-xs dark:bg-navy-800">
          <strong>Infraestructura:</strong> en producción, los datos residirían en
          servicios de Amazon Web Services. La región de despliegue se selecciona
          para mantener los datos dentro del territorio nacional cuando la
          normativa sanitaria aplicable lo requiera.
        </p>
      </Seccion>

      <Seccion titulo="6. Medidas de seguridad" icono={Lock}>
        <p>
          Se aplican medidas administrativas, técnicas y físicas para proteger los
          datos contra daño, pérdida, alteración, destrucción o uso no autorizado:
        </p>
        <Lista
          items={[
            { t: "Cifrado en tránsito", d: "Todo el tráfico se transmite sobre HTTPS con HSTS activo." },
            { t: "Cifrado en reposo", d: "En producción, cifrado a nivel de base de datos y de campo para datos sensibles." },
            { t: "Control de acceso por rol", d: "Cada perfil accede únicamente a los módulos que su función requiere." },
            { t: "Registro de auditoría", d: "Trazabilidad de cada acceso y modificación del expediente." },
            { t: "Endurecimiento del navegador", d: "Content-Security-Policy, X-Frame-Options y Permissions-Policy restrictivas." },
            { t: "Auditoría de código", d: "Revisión de seguridad documentada y versionada en el repositorio del proyecto." },
          ]}
        />
      </Seccion>

      <Seccion titulo="7. Derechos ARCO" icono={UserCheck}>
        <p>
          Como titular, o como representante legal de una persona menor de edad,
          puedes ejercer en cualquier momento los siguientes derechos:
        </p>
        <Lista
          items={[
            { t: "Acceso", d: "Conocer qué datos se tratan y con qué finalidad." },
            { t: "Rectificación", d: "Corregir datos inexactos o incompletos." },
            { t: "Cancelación", d: "Solicitar la supresión, con las reservas que imponga la normativa de conservación del expediente clínico." },
            { t: "Oposición", d: "Oponerse al tratamiento para finalidades determinadas." },
          ]}
        />
        <p>
          La solicitud debe dirigirse a{" "}
          <span className="font-mono font-semibold">privacidad@womenciso-menciso.org</span>{" "}
          e incluir identificación oficial del titular o acreditación de la
          representación, junto con la descripción clara del derecho que se ejerce.
          La respuesta se emite en un plazo máximo de 20 días hábiles.
        </p>
        <p className="text-xs">
          El expediente clínico está sujeto a plazos mínimos de conservación
          conforme a la NOM-004-SSA3-2012, por lo que una solicitud de cancelación
          puede resultar improcedente respecto de esa información específica. En tal
          caso se te informará el fundamento de la negativa.
        </p>
      </Seccion>

      <Seccion titulo="8. Marco normativo aplicable" icono={Shield}>
        <Lista
          items={[
            { t: "LFPDPPP", d: "Ley Federal de Protección de Datos Personales en Posesión de los Particulares y su Reglamento." },
            { t: "NOM-004-SSA3-2012", d: "Norma Oficial Mexicana del expediente clínico." },
            { t: "Ley General de los Derechos de Niñas, Niños y Adolescentes", d: "Protección reforzada del interés superior de la niñez." },
            { t: "Ley General de Salud", d: "Disposiciones sobre atención médica y confidencialidad." },
          ]}
        />
      </Seccion>

      <Seccion titulo="9. Cambios a este aviso" icono={Shield}>
        <p>
          Cualquier modificación se publicará en esta misma dirección con su fecha
          de actualización y número de versión. Si el cambio afecta las finalidades
          del tratamiento, se solicitará nuevamente el consentimiento antes de
          aplicarlo.
        </p>
      </Seccion>

      {/* Revocación */}
      <section className="rounded-xl border border-navy-200 bg-white p-5 dark:border-navy-700 dark:bg-navy-900">
        <h2 className="text-sm font-bold text-navy-800 dark:text-white">
          Preferencias de almacenamiento local
        </h2>
        <p className="mb-3 mt-1 text-xs text-navy-600 dark:text-navy-300">
          Puedes revisar o retirar tu consentimiento sobre el almacenamiento en el
          navegador en cualquier momento.
        </p>
        <BotonRevocarConsentimiento />
      </section>
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

function Lista({ items }: { items: { t: string; d: string }[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.t} className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
          <span className="text-sm">
            <strong className="text-navy-800 dark:text-white">{item.t}:</strong>{" "}
            <span className="text-navy-600 dark:text-navy-300">{item.d}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
