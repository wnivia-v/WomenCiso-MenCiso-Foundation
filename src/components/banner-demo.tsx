/**
 * Marca de agua permanente que identifica la app como demostración.
 *
 * Por qué existe: la app muestra nombres de pacientes y diagnósticos clínicos
 * que parecen reales (son inventados). Cuando se comparte la URL por túnel para
 * recibir feedback, quien la recibe no tiene forma de saber que los datos son
 * ficticios — y una captura de pantalla circulando se vería como un expediente
 * médico filtrado. Este banner cierra ese riesgo.
 *
 * Decisiones de implementación:
 * - `pointer-events-none`: nunca intercepta clics, así no puede romper ningún
 *   botón ni formulario que quede debajo.
 * - NO es descartable a propósito. Si se pudiera cerrar, desaparecería justo en
 *   las capturas de pantalla, que es donde más importa que se vea.
 * - `z-40`: por encima del contenido, por debajo del modal del botón SOS
 *   (`z-[60]`) y del panel de notificaciones (`z-50`).
 * - `pr-20`: deja libre la esquina inferior derecha donde vive el botón SOS
 *   flotante, para que el texto no quede tapado.
 */
export function BannerDemo() {
  return (
    <div
      role="note"
      aria-label="Aviso: esta es una versión de demostración con datos ficticios"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex items-center justify-center border-t border-amber-300 bg-amber-100/95 px-3 py-1 pr-20 backdrop-blur"
    >
      <p className="text-center text-[10px] font-semibold leading-tight text-amber-900 sm:text-xs">
        <span className="mr-1.5 rounded bg-amber-800 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-50 sm:text-[10px]">
          Demo
        </span>
        Datos ficticios con fines de demostración. No son pacientes ni
        expedientes médicos reales.
      </p>
    </div>
  );
}
