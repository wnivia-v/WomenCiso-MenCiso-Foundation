"use client";

import { useState, useRef } from "react";
import { Camera, FileText, Loader2, CheckCircle2, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DatosExtraidos {
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  fechaNacimiento?: string;
  genero?: string;
  curp?: string;
  estado?: string;
}

interface OCRDocumentoProps {
  onDatosExtraidos: (datos: DatosExtraidos) => void;
}

/**
 * Datos simulados que se "extraen" del documento para la demo.
 * En producción real, esto llamaría a una API de OCR/visión (GPT-4o, Claude, Google Vision).
 */
const DATOS_SIMULADOS: DatosExtraidos[] = [
  {
    nombre: "Sofía",
    apellidoPaterno: "García",
    apellidoMaterno: "López",
    fechaNacimiento: "2018-05-12",
    genero: "FEMENINO",
    curp: "GALS180512MDFRPF04",
    estado: "Ciudad de México",
  },
  {
    nombre: "Diego",
    apellidoPaterno: "Martínez",
    apellidoMaterno: "Reyes",
    fechaNacimiento: "2015-11-03",
    genero: "MASCULINO",
    curp: "MARD151103HMCRGY09",
    estado: "Estado de México",
  },
  {
    nombre: "Valentina",
    apellidoPaterno: "Hernández",
    apellidoMaterno: "Cruz",
    fechaNacimiento: "2020-02-28",
    genero: "FEMENINO",
    curp: "HECV200228MDFRNL07",
    estado: "Jalisco",
  },
];

export function OCRDocumento({ onDatosExtraidos }: OCRDocumentoProps) {
  const [estado, setEstado] = useState<"idle" | "preview" | "procesando" | "listo" | "error">("idle");
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const [datosEncontrados, setDatosEncontrados] = useState<DatosExtraidos | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFotoSeleccionada = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    e.target.value = "";
    if (!archivo || !archivo.type.startsWith("image/")) return;

    const lector = new FileReader();
    lector.onload = (ev) => {
      setImagenPreview(ev.target?.result as string);
      setEstado("preview");
      setDatosEncontrados(null);
    };
    lector.readAsDataURL(archivo);
  };

  const procesarDocumento = () => {
    setEstado("procesando");

    // Simulación de procesamiento OCR (1.5-2.5 segundos)
    const tiempoSimulado = 1500 + Math.random() * 1000;
    setTimeout(() => {
      // Selecciona datos aleatorios de los simulados
      const datos = DATOS_SIMULADOS[Math.floor(Math.random() * DATOS_SIMULADOS.length)];
      setDatosEncontrados(datos);
      setEstado("listo");
    }, tiempoSimulado);
  };

  const aplicarDatos = () => {
    if (datosEncontrados) {
      onDatosExtraidos(datosEncontrados);
    }
    resetear();
  };

  const resetear = () => {
    setEstado("idle");
    setImagenPreview(null);
    setDatosEncontrados(null);
  };

  return (
    <div className="rounded-xl border-2 border-dashed border-navy-200 bg-navy-50/30 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-gold-500" />
        <p className="text-sm font-semibold text-navy-700">Llenado rápido con foto de documento</p>
      </div>
      <p className="text-xs text-navy-500 mb-3">
        Toma una foto de la CURP, acta de nacimiento o credencial del paciente y los datos se llenarán automáticamente.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFotoSeleccionada}
      />

      {/* Estado: Esperando foto */}
      {estado === "idle" && (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => fileInputRef.current?.click()}
        >
          <Camera className="mr-2 h-4 w-4" />
          Tomar foto del documento
        </Button>
      )}

      {/* Estado: Preview de la foto */}
      {estado === "preview" && imagenPreview && (
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-lg border border-navy-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagenPreview} alt="Documento capturado" className="w-full max-h-48 object-contain bg-white" />
            <button
              type="button"
              onClick={resetear}
              className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
              aria-label="Quitar foto"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => fileInputRef.current?.click()}>
              Otra foto
            </Button>
            <Button type="button" className="flex-1" onClick={procesarDocumento}>
              <FileText className="mr-1.5 h-4 w-4" />
              Extraer datos
            </Button>
          </div>
        </div>
      )}

      {/* Estado: Procesando */}
      {estado === "procesando" && (
        <div className="flex flex-col items-center gap-3 py-4">
          <Loader2 className="h-8 w-8 animate-spin text-navy-600" />
          <div className="text-center">
            <p className="text-sm font-medium text-navy-700">Analizando documento...</p>
            <p className="text-xs text-navy-500">Extrayendo nombre, CURP, fecha de nacimiento</p>
          </div>
        </div>
      )}

      {/* Estado: Datos extraídos */}
      {estado === "listo" && datosEncontrados && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <p className="text-sm font-medium text-green-700">Datos extraídos correctamente</p>
          </div>
          <div className="rounded-lg bg-white border border-green-200 p-3 space-y-1.5">
            {datosEncontrados.nombre && (
              <p className="text-xs text-navy-600"><strong>Nombre:</strong> {datosEncontrados.nombre} {datosEncontrados.apellidoPaterno} {datosEncontrados.apellidoMaterno}</p>
            )}
            {datosEncontrados.curp && (
              <p className="text-xs text-navy-600"><strong>CURP:</strong> {datosEncontrados.curp}</p>
            )}
            {datosEncontrados.fechaNacimiento && (
              <p className="text-xs text-navy-600"><strong>Fecha nac.:</strong> {datosEncontrados.fechaNacimiento}</p>
            )}
            {datosEncontrados.genero && (
              <p className="text-xs text-navy-600"><strong>Género:</strong> {datosEncontrados.genero === "FEMENINO" ? "Femenino" : "Masculino"}</p>
            )}
            {datosEncontrados.estado && (
              <p className="text-xs text-navy-600"><strong>Estado:</strong> {datosEncontrados.estado}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" className="flex-1" onClick={resetear}>
              Cancelar
            </Button>
            <Button type="button" size="sm" className="flex-1" onClick={aplicarDatos}>
              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
              Aplicar al formulario
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
