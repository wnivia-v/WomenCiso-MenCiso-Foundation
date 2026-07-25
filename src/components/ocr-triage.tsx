"use client";

import { useState, useRef } from "react";
import { Camera, Loader2, CheckCircle2, X, Zap, AlertTriangle } from "lucide-react";

interface DatosExtraidos {
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  fechaNacimiento?: string;
  genero?: string;
  curp?: string;
  estado?: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
  paisEmision?: string;
  nacionalidad?: string;
  edadEstimada?: string;
}

interface OCRDocumentoTriageProps {
  onDatosExtraidos: (datos: DatosExtraidos) => void;
  onFotoRostro?: (imageBase64: string, boundingBox: { top: number; left: number; width: number; height: number }) => void;
}

/**
 * Versión del OCR optimizada para emergencias.
 *
 * Diferencias con el OCR de registro de pacientes:
 * - Interfaz más compacta
 * - Texto enfocado en la urgencia ("No hay tiempo para escribir")
 * - Aplica los datos automáticamente sin paso de confirmación intermedio
 *   (en una emergencia, cada clic extra son segundos)
 * - El servidor decide si usar Textract real o datos demo según el entorno
 */

export function OCRDocumentoTriage({ onDatosExtraidos, onFotoRostro }: OCRDocumentoTriageProps) {
  const [estado, setEstado] = useState<"idle" | "procesando" | "listo" | "error">("idle");
  const [datosEncontrados, setDatosEncontrados] = useState<DatosExtraidos | null>(null);
  const [rostroDetectado, setRostroDetectado] = useState(false);
  const [modoDemo, setModoDemo] = useState(false);
  const [diagnostico, setDiagnostico] = useState<{ tipo?: string; mensaje?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    e.target.value = "";
    if (!archivo || !archivo.type.startsWith("image/")) return;

    setEstado("procesando");

    // Convertir a base64
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const imageBase64 = ev.target?.result as string;

      try {
        const response = await fetch("/api/ocr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64 }),
        });

        if (response.ok) {
          const resultado = await response.json();
          if (resultado.success && resultado.datos) {
            const esDemo = resultado.mode === "demo";
            setModoDemo(esDemo);
            setDiagnostico(resultado.diagnostico || null);

            const datos: DatosExtraidos = resultado.datos;
            setDatosEncontrados(datos);
            onDatosExtraidos(datos);

            // Si se detectó un rostro, notificar al componente padre
            if (resultado.fotoRostro?.detectado && resultado.fotoRostro.boundingBox && onFotoRostro) {
              onFotoRostro(imageBase64, resultado.fotoRostro.boundingBox);
              setRostroDetectado(true);
            }

            // Si Rekognition estimó la edad y no tenemos fecha, usar esa estimación
            if (resultado.fotoRostro?.edad && !datos.fechaNacimiento) {
              const edadPromedio = Math.round((resultado.fotoRostro.edad.min + resultado.fotoRostro.edad.max) / 2);
              datos.edadEstimada = String(edadPromedio);
              onDatosExtraidos(datos);
            }

            // Si Rekognition detectó género y no lo tenemos del texto
            if (resultado.fotoRostro?.generoDetectado && !datos.genero) {
              datos.genero = resultado.fotoRostro.generoDetectado;
              onDatosExtraidos(datos);
            }

            setEstado("listo");
            return;
          }
        }
        // Si la respuesta no fue ok
        setEstado("error");
      } catch {
        setEstado("error");
      }
    };
    reader.readAsDataURL(archivo);
  };

  const resetear = () => {
    setEstado("idle");
    setDatosEncontrados(null);
    setRostroDetectado(false);
    setModoDemo(false);
    setDiagnostico(null);
  };

  return (
    <div className="rounded-xl border-2 border-blue-300 bg-blue-50 p-3 dark:border-blue-500/40 dark:bg-blue-500/10">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFoto}
      />

      {estado === "idle" && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full items-center gap-3 text-left transition-all active:scale-[0.98]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/20">
            <Camera className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-navy-800 dark:text-white">
              <Zap className="mr-1 inline h-3.5 w-3.5 text-blue-500" />
              Identificar con foto de documento
            </p>
            <p className="text-[10px] text-blue-700 dark:text-navy-400">
              CURP, acta o credencial — extrae nombre y edad en segundos. Powered by Amazon Textract.
            </p>
          </div>
        </button>
      )}

      {estado === "procesando" && (
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          <div>
            <p className="text-sm font-medium text-navy-700 dark:text-navy-200">Extrayendo datos...</p>
            <p className="text-[10px] text-navy-500">Amazon Textract analizando documento</p>
          </div>
        </div>
      )}

      {estado === "listo" && datosEncontrados && (
        <div className="space-y-2">
          {/* Aviso destacado cuando los datos NO vienen del documento.
              Es deliberadamente visible: unos datos inventados presentados como
              lectura real serían peor que un error, porque nadie los cuestiona. */}
          {modoDemo && (
            <div className="rounded-lg border border-amber-400 bg-amber-50 p-2 dark:border-amber-500/50 dark:bg-amber-500/10">
              <p className="flex items-start gap-1.5 text-[11px] font-bold text-amber-900 dark:text-amber-200">
                <AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0" />
                Datos de ejemplo — NO corresponden al documento fotografiado
              </p>
              <p className="mt-1 pl-5 text-[10px] leading-relaxed text-amber-800 dark:text-amber-300">
                Amazon Textract no respondió, así que se muestran datos de relleno.
                Verifica y corrige los campos manualmente antes de continuar.
              </p>
              {diagnostico?.tipo && (
                <p className="mt-1 pl-5 font-mono text-[9px] text-amber-700 dark:text-amber-400">
                  {diagnostico.tipo}
                  {diagnostico.mensaje ? `: ${diagnostico.mensaje.slice(0, 90)}` : ""}
                </p>
              )}
            </div>
          )}

          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              {modoDemo ? (
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              ) : (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              )}
              <div>
                <p
                  className={`text-xs font-semibold ${
                    modoDemo
                      ? "text-amber-800 dark:text-amber-300"
                      : "text-green-700 dark:text-green-400"
                  }`}
                >
                  {modoDemo ? "Datos de relleno aplicados" : "Datos leídos del documento"}
                </p>
                <p className="mt-0.5 text-[10px] text-navy-600 dark:text-navy-300">
                  {[datosEncontrados.nombre, datosEncontrados.apellidoPaterno, datosEncontrados.apellidoMaterno]
                    .filter(Boolean)
                    .join(" ")}
                  {datosEncontrados.curp && ` · ${datosEncontrados.curp}`}
                  {datosEncontrados.numeroDocumento && ` · ${datosEncontrados.numeroDocumento}`}
                </p>
                {datosEncontrados.tipoDocumento && (
                  <p className="mt-0.5 text-[9px] font-medium text-navy-500 dark:text-navy-400">
                    Tipo: {datosEncontrados.tipoDocumento}
                    {datosEncontrados.paisEmision && ` · ${datosEncontrados.paisEmision}`}
                    {datosEncontrados.nacionalidad && ` · ${datosEncontrados.nacionalidad}`}
                    {rostroDetectado && (
                      <span className="ml-1.5 inline-flex items-center gap-0.5 rounded bg-green-100 px-1.5 py-0.5 text-green-700 dark:bg-green-500/20 dark:text-green-300">
                        Rostro detectado
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={resetear}
              className="shrink-0 rounded-md p-1 text-navy-400 hover:bg-navy-100 dark:hover:bg-navy-800"
              aria-label="Leer otro documento"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {estado === "error" && (
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <X className="h-4 w-4 text-red-500" />
            <p className="text-xs text-red-700 dark:text-red-300">
              No se pudo procesar. Intenta otra foto o escribe los datos manualmente.
            </p>
          </div>
          <button
            type="button"
            onClick={resetear}
            className="shrink-0 rounded-md border border-navy-200 px-2 py-1 text-[10px] font-medium text-navy-600 hover:bg-navy-50 dark:border-navy-700 dark:text-navy-300"
          >
            Reintentar
          </button>
        </div>
      )}
    </div>
  );
}
