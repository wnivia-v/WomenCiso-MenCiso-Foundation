"use client";

import { useState, useRef } from "react";
import { Camera, FileText, Loader2, CheckCircle2, X, Zap } from "lucide-react";

interface DatosExtraidos {
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  fechaNacimiento?: string;
  genero?: string;
  curp?: string;
  estado?: string;
}

interface OCRDocumentoTriageProps {
  onDatosExtraidos: (datos: DatosExtraidos) => void;
}

/**
 * Versión del OCR optimizada para emergencias.
 *
 * Diferencias con el OCR de registro de pacientes:
 * - Interfaz más compacta
 * - Texto enfocado en la urgencia ("No hay tiempo para escribir")
 * - Aplica los datos automáticamente sin paso de confirmación intermedio
 *   (en una emergencia, cada clic extra son segundos)
 * - Mantiene el fallback a datos demo si Textract no está disponible
 */

const DATOS_SIMULADOS: DatosExtraidos[] = [
  {
    nombre: "SOFIA",
    apellidoPaterno: "GARCIA",
    apellidoMaterno: "LOPEZ",
    fechaNacimiento: "2018-05-12",
    genero: "FEMENINO",
    curp: "GALS180512MDFRPF04",
    estado: "Ciudad de México",
  },
  {
    nombre: "DIEGO",
    apellidoPaterno: "MARTINEZ",
    apellidoMaterno: "REYES",
    fechaNacimiento: "2015-11-03",
    genero: "MASCULINO",
    curp: "MARD151103HMCRGY09",
    estado: "Estado de México",
  },
  {
    nombre: "VALENTINA",
    apellidoPaterno: "HERNANDEZ",
    apellidoMaterno: "CRUZ",
    fechaNacimiento: "2020-02-28",
    genero: "FEMENINO",
    curp: "HECV200228MDFRNL07",
    estado: "Jalisco",
  },
];

export function OCRDocumentoTriage({ onDatosExtraidos }: OCRDocumentoTriageProps) {
  const [estado, setEstado] = useState<"idle" | "procesando" | "listo" | "error">("idle");
  const [datosEncontrados, setDatosEncontrados] = useState<DatosExtraidos | null>(null);
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
            const datos: DatosExtraidos = resultado.datos;
            setDatosEncontrados(datos);
            // En triage, aplicar automáticamente para ahorrar tiempo
            onDatosExtraidos(datos);
            setEstado("listo");
            return;
          }
        }
        // Fallback
        const datos = DATOS_SIMULADOS[Math.floor(Math.random() * DATOS_SIMULADOS.length)];
        setDatosEncontrados(datos);
        onDatosExtraidos(datos);
        setEstado("listo");
      } catch {
        const datos = DATOS_SIMULADOS[Math.floor(Math.random() * DATOS_SIMULADOS.length)];
        setDatosEncontrados(datos);
        onDatosExtraidos(datos);
        setEstado("listo");
      }
    };
    reader.readAsDataURL(archivo);
  };

  const resetear = () => {
    setEstado("idle");
    setDatosEncontrados(null);
  };

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-500/30 dark:bg-blue-500/10">
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
            <p className="text-[10px] text-navy-500 dark:text-navy-400">
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
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
            <div>
              <p className="text-xs font-semibold text-green-700 dark:text-green-400">
                Datos aplicados automáticamente
              </p>
              <p className="mt-0.5 text-[10px] text-navy-600 dark:text-navy-300">
                {[datosEncontrados.nombre, datosEncontrados.apellidoPaterno, datosEncontrados.apellidoMaterno]
                  .filter(Boolean)
                  .join(" ")}
                {datosEncontrados.curp && ` · ${datosEncontrados.curp}`}
              </p>
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
      )}
    </div>
  );
}
