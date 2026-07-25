"use client";

import { useState, useRef } from "react";
import { Camera, FileText, Loader2, CheckCircle2, X, Sparkles, AlertTriangle } from "lucide-react";
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
 * Los datos de relleno viven en el servidor (src/app/api/ocr/route.ts).
 * Mantenerlos allí evita que el cliente pueda presentar datos inventados sin
 * que el servidor lo sepa, y garantiza que la marca de "modo demo" viaje
 * siempre junto a los datos.
 */

export function OCRDocumento({ onDatosExtraidos }: OCRDocumentoProps) {
  const [estado, setEstado] = useState<"idle" | "preview" | "procesando" | "listo" | "error">("idle");
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const [datosEncontrados, setDatosEncontrados] = useState<DatosExtraidos | null>(null);
  const [modoDemo, setModoDemo] = useState(false);
  const [diagnostico, setDiagnostico] = useState<{ tipo?: string; mensaje?: string } | null>(null);
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

  const procesarDocumento = async () => {
    setEstado("procesando");

    try {
      // Llamar a la API de OCR con Amazon Textract
      const response = await fetch("/api/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: imagenPreview }),
      });

      if (!response.ok) {
        throw new Error("Error en el servidor");
      }

      const resultado = await response.json();

      if (resultado.success && resultado.datos) {
        setModoDemo(resultado.mode === "demo");
        setDiagnostico(resultado.diagnostico || null);
        setDatosEncontrados(resultado.datos as DatosExtraidos);
        setEstado("listo");
      } else {
        setEstado("error");
      }
    } catch {
      setEstado("error");
    }
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
    setModoDemo(false);
    setDiagnostico(null);
  };

  return (
    <div className="rounded-xl border-2 border-dashed border-navy-200 bg-navy-50/30 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-gold-500" />
        <p className="text-sm font-semibold text-navy-700">Llenado rápido con foto de documento</p>
      </div>
      <p className="text-xs text-navy-500 mb-3">
        Toma una foto de la CURP, acta de nacimiento o credencial del paciente y los datos se llenarán automáticamente.
        <span className="inline-flex items-center gap-1 ml-1 text-[10px] font-medium text-gold-600">
          Powered by Amazon Textract
        </span>
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
          {/* Si los datos no salieron del documento, se dice sin rodeos. */}
          {modoDemo && (
            <div className="rounded-lg border border-amber-400 bg-amber-50 p-2.5">
              <p className="flex items-start gap-1.5 text-xs font-bold text-amber-900">
                <AlertTriangle className="mt-px h-4 w-4 shrink-0" />
                Datos de ejemplo — NO son del documento fotografiado
              </p>
              <p className="mt-1 pl-5 text-[11px] leading-relaxed text-amber-800">
                Amazon Textract no respondió. Revisa cada campo antes de aplicarlo
                al formulario.
              </p>
              {diagnostico?.tipo && (
                <p className="mt-1 pl-5 font-mono text-[9px] text-amber-700">
                  {diagnostico.tipo}
                  {diagnostico.mensaje ? `: ${diagnostico.mensaje.slice(0, 90)}` : ""}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            {modoDemo ? (
              <>
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <p className="text-sm font-medium text-amber-800">Datos de relleno</p>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <p className="text-sm font-medium text-green-700">Datos leídos del documento</p>
              </>
            )}
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

      {/* Estado: error */}
      {estado === "error" && (
        <div className="space-y-3">
          <div className="rounded-lg border border-red-300 bg-red-50 p-3">
            <p className="flex items-start gap-1.5 text-xs font-semibold text-red-800">
              <AlertTriangle className="mt-px h-4 w-4 shrink-0" />
              No se pudo procesar el documento
            </p>
            <p className="mt-1 pl-5 text-[11px] leading-relaxed text-red-700">
              Intenta con otra foto (mejor iluminación, documento completo en el
              encuadre) o escribe los datos manualmente en el formulario.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" className="w-full" onClick={resetear}>
            Intentar de nuevo
          </Button>
        </div>
      )}
    </div>
  );
}
