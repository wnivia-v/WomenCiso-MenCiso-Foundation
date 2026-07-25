"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight, ArrowLeft, MapPin, User, Flame, Camera, X, LocateFixed, Loader2, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calcularGravedad } from "@/lib/utils";
import { OCRDocumentoTriage } from "@/components/ocr-triage";

const zonasCoporales = [
  "cabeza", "cara", "cuello", "torso_anterior", "torso_posterior",
  "brazo_derecho", "brazo_izquierdo", "mano_derecha", "mano_izquierda",
  "pierna_derecha", "pierna_izquierda", "pie_derecho", "pie_izquierdo",
  "genitales", "vias_respiratorias", "articulaciones",
];

const zonasLabels: Record<string, string> = {
  cabeza: "Cabeza", cara: "Cara", cuello: "Cuello",
  torso_anterior: "Torso (frente)", torso_posterior: "Torso (espalda)",
  brazo_derecho: "Brazo der.", brazo_izquierdo: "Brazo izq.",
  mano_derecha: "Mano der.", mano_izquierda: "Mano izq.",
  pierna_derecha: "Pierna der.", pierna_izquierda: "Pierna izq.",
  pie_derecho: "Pie der.", pie_izquierdo: "Pie izq.",
  genitales: "Genitales", vias_respiratorias: "Vías resp.",
  articulaciones: "Articulaciones",
};

const TRIAGE_STORAGE_KEY = "triage-rapido-borrador";

const formInicial = {
  reportadoPor: "", telefonoReportante: "", parentescoReportante: "",
  nombrePaciente: "", edadPaciente: "", generoPaciente: "",
  causaQuemadura: "", gradoQuemadura: "", superficieCorporal: "",
  zonasAfectadas: [] as string[], tiempoTranscurrido: "", primerAuxilio: "",
  fotos: [] as string[],
  ubicacionIncidente: "", observaciones: "",
  ubicacionGPS: null as { lat: number; lng: number } | null,
};

const MAX_FOTOS = 6;

/**
 * Comprime una imagen a un ancho máximo y calidad JPEG reducida antes de
 * convertirla a data URL — así varias fotos no saturan sessionStorage ni la
 * conexión al enviarlas al hospital.
 */
function comprimirImagen(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const ANCHO_MAX = 900;
        const escala = Math.min(1, ANCHO_MAX / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * escala);
        canvas.height = Math.round(img.height * escala);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("No se pudo procesar la imagen"));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.6));
      };
      img.onerror = () => reject(new Error("Imagen inválida"));
      img.src = e.target?.result as string;
    };
    lector.onerror = () => reject(new Error("No se pudo leer el archivo"));
    lector.readAsDataURL(file);
  });
}

export default function NuevaEmergenciaPage() {
  const router = useRouter();
  const [paso, setPaso] = useState(1);
  const [resultado, setResultado] = useState<{
    nivelGravedad: string;
    prioridad: string;
  } | null>(null);
  const [form, setForm] = useState(formInicial);
  const [cargado, setCargado] = useState(false);
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [errorFoto, setErrorFoto] = useState("");
  const [buscandoUbicacion, setBuscandoUbicacion] = useState(false);
  const [errorUbicacion, setErrorUbicacion] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Recupera el borrador guardado si el usuario sale y vuelve a esta página
  // (evita perder datos al navegar a otra sección y regresar)
  useEffect(() => {
    try {
      const guardado = sessionStorage.getItem(TRIAGE_STORAGE_KEY);
      if (guardado) {
        const datos = JSON.parse(guardado);
        if (datos.form) setForm(datos.form);
        // El paso 5 (resultado) solo tiene sentido si también se guardó el
        // resultado calculado. Si falta, es un borrador viejo o corrupto —
        // se regresa al paso 4 en vez de mostrar una pantalla vacía sin
        // forma de retroceder.
        if (datos.paso === 5 && datos.resultado) {
          setResultado(datos.resultado);
          setPaso(5);
        } else if (datos.paso && datos.paso !== 5) {
          setPaso(datos.paso);
        } else if (datos.paso === 5) {
          setPaso(4);
        }
      }
    } catch {
      // Si el borrador está corrupto, se ignora y se empieza limpio
    } finally {
      setCargado(true);
    }
  }, []);

  // Guarda el progreso en cada cambio, para no perder nada al salir y volver
  useEffect(() => {
    if (!cargado) return;
    try {
      sessionStorage.setItem(TRIAGE_STORAGE_KEY, JSON.stringify({ form, paso, resultado }));
    } catch {
      // sessionStorage puede fallar en modos de navegación privada; no es crítico
    }
  }, [form, paso, resultado, cargado]);

  const updateForm = (field: string, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const limpiarBorrador = () => {
    try {
      sessionStorage.removeItem(TRIAGE_STORAGE_KEY);
    } catch {
      // no crítico
    }
  };

  const toggleZona = (zona: string) => {
    setForm((prev) => ({
      ...prev,
      zonasAfectadas: prev.zonasAfectadas.includes(zona)
        ? prev.zonasAfectadas.filter((z) => z !== zona)
        : [...prev.zonasAfectadas, zona],
    }));
  };

  const handleFotosSeleccionadas = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivos = Array.from(e.target.files || []);
    e.target.value = ""; // permite volver a elegir el mismo archivo después
    if (archivos.length === 0) return;

    setErrorFoto("");
    const espacioDisponible = MAX_FOTOS - form.fotos.length;
    if (espacioDisponible <= 0) {
      setErrorFoto(`Máximo ${MAX_FOTOS} fotos por triage.`);
      return;
    }

    const aProcesar = archivos.slice(0, espacioDisponible);
    setSubiendoFoto(true);
    try {
      const nuevasFotos: string[] = [];
      for (const archivo of aProcesar) {
        if (!archivo.type.startsWith("image/")) continue;
        try {
          nuevasFotos.push(await comprimirImagen(archivo));
        } catch {
          setErrorFoto("Una de las fotos no se pudo procesar y se omitió.");
        }
      }
      setForm((prev) => ({ ...prev, fotos: [...prev.fotos, ...nuevasFotos] }));
    } finally {
      setSubiendoFoto(false);
    }
  };

  const eliminarFoto = (index: number) => {
    setForm((prev) => ({ ...prev, fotos: prev.fotos.filter((_, i) => i !== index) }));
  };

  const obtenerUbicacionGPS = () => {
    setErrorUbicacion("");
    if (!("geolocation" in navigator)) {
      setErrorUbicacion("Este dispositivo o navegador no soporta ubicación GPS. Usa la dirección escrita.");
      return;
    }
    setBuscandoUbicacion(true);
    navigator.geolocation.getCurrentPosition(
      (posicion) => {
        setForm((prev) => ({
          ...prev,
          ubicacionGPS: {
            lat: posicion.coords.latitude,
            lng: posicion.coords.longitude,
          },
        }));
        setBuscandoUbicacion(false);
      },
      (err) => {
        setBuscandoUbicacion(false);
        if (err.code === err.PERMISSION_DENIED) {
          setErrorUbicacion("Permiso de ubicación denegado. Puedes escribir la dirección manualmente.");
        } else {
          setErrorUbicacion("No se pudo obtener la ubicación. Intenta de nuevo o escribe la dirección.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const quitarUbicacionGPS = () => {
    setForm((prev) => ({ ...prev, ubicacionGPS: null }));
    setErrorUbicacion("");
  };

  const calcularResultado = () => {
    const edad = parseInt(form.edadPaciente) || 0;
    const scq = parseFloat(form.superficieCorporal) || 0;
    const res = calcularGravedad(form.gradoQuemadura, scq, form.zonasAfectadas, edad);
    setResultado(res);
    setPaso(5);
    // Leer resultado en voz alta si la función de voz está activa
    // Se usa setTimeout para esperar a que el DOM se actualice
    setTimeout(() => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        // Solo lee si hay una sesión de voz activa (revisamos si el estado está guardado)
        try {
          const vozActiva = document.querySelector('[aria-label="Desactivar lectura por voz"]');
          if (vozActiva) {
            const texto = `Resultado del triage: nivel de gravedad ${res.nivelGravedad}, prioridad ${res.prioridad}. Paciente ${form.nombrePaciente || "sin nombre"}, ${form.edadPaciente || "edad no especificada"} años. Superficie corporal quemada: ${form.superficieCorporal || "no especificada"} por ciento.`;
            const msg = new SpeechSynthesisUtterance(texto);
            msg.lang = "es-MX";
            msg.rate = 0.9;
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(msg);
          }
        } catch { /* no crítico */ }
      }
    }, 300);
  };

  const getGravedadColor = (gravedad: string) => {
    switch (gravedad) {
      case "CRITICO": return "bg-red-50 border-red-500 text-red-800";
      case "GRAVE": return "bg-orange-50 border-orange-500 text-orange-800";
      case "MODERADO": return "bg-yellow-50 border-yellow-500 text-yellow-800";
      default: return "bg-green-50 border-green-500 text-green-800";
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-red-100 p-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-navy-800 md:text-2xl">
            Triage Rápido
          </h1>
          <p className="text-xs text-navy-500 md:text-sm">
            Clasifique y canalice al paciente
          </p>
        </div>
      </div>

      {/* Indicador de pasos */}
      <div className="flex items-center justify-center gap-1.5" role="progressbar" aria-valuenow={paso} aria-valuemin={1} aria-valuemax={5} aria-label={`Paso ${paso} de 5 del triage rápido`}>
        {[1, 2, 3, 4, 5].map((p) => (
          <div key={p} className="flex items-center gap-1.5">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold md:h-8 md:w-8 md:text-sm ${
                p === paso
                  ? "bg-navy-800 text-white"
                  : p < paso
                  ? "bg-gold-400 text-navy-900"
                  : "bg-navy-100 text-navy-400"
              }`}
            >
              {p}
            </div>
            {p < 5 && (
              <div className={`h-0.5 w-4 md:w-6 ${p < paso ? "bg-gold-400" : "bg-navy-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Paso 1: Reportante */}
      {paso === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-4 w-4 text-navy-600" />
              ¿Quién reporta?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Nombre de quien reporta"
              placeholder="Nombre completo"
              value={form.reportadoPor}
              onChange={(e) => updateForm("reportadoPor", e.target.value)}
            />
            <Input
              label="Teléfono de contacto"
              type="tel"
              placeholder="55 1234 5678"
              value={form.telefonoReportante}
              onChange={(e) => updateForm("telefonoReportante", e.target.value)}
            />
            <Select
              label="Parentesco con el paciente"
              placeholder="Seleccione..."
              options={[
                { value: "madre", label: "Madre" },
                { value: "padre", label: "Padre" },
                { value: "tutor", label: "Tutor legal" },
                { value: "familiar", label: "Otro familiar" },
                { value: "vecino", label: "Vecino" },
                { value: "maestro", label: "Maestro/a" },
                { value: "paramedico", label: "Paramédico" },
                { value: "otro", label: "Otro" },
              ]}
              value={form.parentescoReportante}
              onChange={(e) => updateForm("parentescoReportante", e.target.value)}
            />
            <div className="flex justify-end pt-2">
              <Button onClick={() => setPaso(2)}>
                Siguiente <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paso 2: Paciente */}
      {paso === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-4 w-4 text-navy-600" />
              Datos del Paciente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* OCR para llenado rápido desde documento */}
            <OCRDocumentoTriage
              onDatosExtraidos={(datos) => {
                if (datos.nombre) {
                  const nombreCompleto = [datos.nombre, datos.apellidoPaterno, datos.apellidoMaterno].filter(Boolean).join(" ");
                  updateForm("nombrePaciente", nombreCompleto);
                }
                if (datos.genero) updateForm("generoPaciente", datos.genero);
                if (datos.fechaNacimiento) {
                  // Calcular edad a partir de fecha de nacimiento
                  const nacimiento = new Date(datos.fechaNacimiento);
                  const hoy = new Date();
                  let edad = hoy.getFullYear() - nacimiento.getFullYear();
                  const mes = hoy.getMonth() - nacimiento.getMonth();
                  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
                  updateForm("edadPaciente", String(Math.max(0, edad)));
                }
              }}
            />

            {/* Botón NN (paciente sin identificación) */}
            {!form.nombrePaciente && (
              <button
                type="button"
                onClick={() => {
                  const ahora = new Date();
                  const anio = ahora.getFullYear();
                  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
                  const dia = String(ahora.getDate()).padStart(2, "0");
                  const hora = String(ahora.getHours()).padStart(2, "0");
                  const min = String(ahora.getMinutes()).padStart(2, "0");
                  const idNN = `NN-${anio}${mes}${dia}-${hora}${min}`;
                  updateForm("nombrePaciente", idNN);
                }}
                className="flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-navy-300 bg-navy-50/50 px-4 py-3 text-left transition-all hover:border-navy-400 hover:bg-navy-100 active:scale-[0.98]"
              >
                <UserX className="h-5 w-5 text-navy-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-navy-700">Paciente sin identificación (NN)</p>
                  <p className="text-[10px] text-navy-500">Asigna ID temporal con fecha y hora. Se coteja después con documentos o biometría.</p>
                </div>
              </button>
            )}

            {/* Si es NN, mostrar el badge */}
            {form.nombrePaciente.startsWith("NN-") && (
              <div className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 p-2.5">
                <UserX className="h-4 w-4 text-amber-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-amber-800">Paciente No Identificado</p>
                  <p className="font-mono text-sm font-bold text-amber-900">{form.nombrePaciente}</p>
                  <p className="text-[10px] text-amber-600">Se cotejarán datos cuando estén disponibles (documento, huella, familiar).</p>
                </div>
                <button
                  type="button"
                  onClick={() => updateForm("nombrePaciente", "")}
                  className="shrink-0 rounded-md p-1 text-amber-600 hover:bg-amber-100"
                  aria-label="Quitar identificación NN"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Campos manuales (si no es NN, o para agregar edad/género al NN) */}
            {!form.nombrePaciente.startsWith("NN-") && (
              <Input
                label="Nombre del paciente"
                placeholder="Nombre completo"
                value={form.nombrePaciente}
                onChange={(e) => updateForm("nombrePaciente", e.target.value)}
              />
            )}
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Edad (años)"
                type="number"
                min="0"
                max="18"
                placeholder="0"
                value={form.edadPaciente}
                onChange={(e) => updateForm("edadPaciente", e.target.value)}
              />
              <Select
                label="Género"
                placeholder="Seleccione..."
                options={[
                  { value: "MASCULINO", label: "Masculino" },
                  { value: "FEMENINO", label: "Femenino" },
                  { value: "OTRO", label: "Otro" },
                ]}
                value={form.generoPaciente}
                onChange={(e) => updateForm("generoPaciente", e.target.value)}
              />
            </div>
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setPaso(1)}>
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Anterior
              </Button>
              <Button onClick={() => setPaso(3)}>
                Siguiente <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paso 3: Quemadura */}
      {paso === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-gold-500" />
              Datos de la Quemadura
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              label="Causa"
              placeholder="¿Qué causó la quemadura?"
              options={[
                { value: "LIQUIDO_CALIENTE", label: "Líquido caliente (escaldadura)" },
                { value: "FUEGO_DIRECTO", label: "Fuego directo / llama" },
                { value: "ELECTRICA", label: "Eléctrica" },
                { value: "QUIMICA", label: "Química (ácidos, bases)" },
                { value: "RADIACION", label: "Radiación" },
                { value: "FRICCION", label: "Fricción" },
                { value: "CONGELAMIENTO", label: "Congelamiento" },
                { value: "OTRA", label: "Otra" },
              ]}
              value={form.causaQuemadura}
              onChange={(e) => updateForm("causaQuemadura", e.target.value)}
            />
            <Select
              label="Grado estimado"
              placeholder="Seleccione el peor caso visible"
              options={[
                { value: "PRIMER_GRADO", label: "1° — Enrojecimiento, dolor" },
                { value: "SEGUNDO_GRADO_SUPERFICIAL", label: "2° Superficial — Ampollas, rosa" },
                { value: "SEGUNDO_GRADO_PROFUNDO", label: "2° Profundo — Blancuzco, menos dolor" },
                { value: "TERCER_GRADO", label: "3° — Blanca/negra, sin dolor" },
                { value: "CUARTO_GRADO", label: "4° — Músculo/hueso expuesto" },
              ]}
              value={form.gradoQuemadura}
              onChange={(e) => updateForm("gradoQuemadura", e.target.value)}
            />
            <Input
              label="% Superficie Corporal Quemada (SCQ)"
              type="number"
              min="1"
              max="100"
              placeholder="Ej: 15"
              value={form.superficieCorporal}
              onChange={(e) => updateForm("superficieCorporal", e.target.value)}
            />
            <p className="rounded-lg bg-navy-50 p-2 text-xs text-navy-600">
              💡 Regla de la palma: la palma del paciente ≈ 1% de su superficie corporal.
            </p>

            {/* Zonas afectadas - grid táctil */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-navy-700">
                Zonas afectadas
              </label>
              <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
                {zonasCoporales.map((zona) => (
                  <button
                    key={zona}
                    type="button"
                    onClick={() => toggleZona(zona)}
                    className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors active:scale-95 ${
                      form.zonasAfectadas.includes(zona)
                        ? "border-gold-400 bg-gold-50 text-gold-800"
                        : "border-navy-200 text-navy-600 hover:border-navy-300"
                    }`}
                  >
                    {zonasLabels[zona]}
                  </button>
                ))}
              </div>
              {(form.zonasAfectadas.includes("cara") ||
                form.zonasAfectadas.includes("vias_respiratorias") ||
                form.zonasAfectadas.includes("genitales")) && (
                <p className="rounded-lg bg-red-50 p-2 text-xs font-medium text-red-700">
                  ⚠️ Zona especial — Prioridad alta automática
                </p>
              )}
            </div>

            <Input
              label="Tiempo desde la quemadura"
              placeholder="Ej: 30 minutos, 1 hora"
              value={form.tiempoTranscurrido}
              onChange={(e) => updateForm("tiempoTranscurrido", e.target.value)}
            />

            <Textarea
              label="¿Se aplicó primer auxilio?"
              placeholder="Agua fría, compresas, nada..."
              rows={2}
              value={form.primerAuxilio}
              onChange={(e) => updateForm("primerAuxilio", e.target.value)}
            />

            {/* Fotos de la quemadura - opcional */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-navy-700">
                Fotos de la quemadura <span className="font-normal text-navy-400">(opcional)</span>
              </label>
              <p className="text-xs text-navy-500">
                Ayuda al hospital a prepararse antes de que llegue el paciente. Nadie está obligado a tomarlas.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                className="hidden"
                onChange={handleFotosSeleccionadas}
              />

              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {form.fotos.map((foto, i) => (
                  <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-navy-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={foto} alt={`Foto de la quemadura ${i + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => eliminarFoto(i)}
                      aria-label={`Quitar foto ${i + 1}`}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white active:scale-95"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}

                {form.fotos.length < MAX_FOTOS && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={subiendoFoto}
                    className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-navy-300 text-navy-500 transition-colors hover:border-gold-400 hover:text-gold-600 disabled:opacity-50"
                  >
                    {subiendoFoto ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Camera className="h-5 w-5" />
                        <span className="text-[10px] font-medium">Agregar foto</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {form.fotos.length > 0 && (
                <p className="text-xs text-navy-400">{form.fotos.length} de {MAX_FOTOS} fotos agregadas</p>
              )}
              {errorFoto && (
                <p className="rounded-lg bg-red-50 p-2 text-xs font-medium text-red-700">{errorFoto}</p>
              )}
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setPaso(2)}>
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Anterior
              </Button>
              <Button onClick={() => setPaso(4)}>
                Siguiente <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paso 4: Ubicación */}
      {paso === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              Ubicación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Ubicación GPS exacta - opcional, más rápido que escribir dirección */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-navy-700">
                Ubicación GPS exacta <span className="font-normal text-navy-400">(opcional, más rápido)</span>
              </label>

              {!form.ubicacionGPS ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={obtenerUbicacionGPS}
                    disabled={buscandoUbicacion}
                  >
                    {buscandoUbicacion ? (
                      <>
                        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Obteniendo ubicación...
                      </>
                    ) : (
                      <>
                        <LocateFixed className="mr-1.5 h-4 w-4" /> Usar mi ubicación actual
                      </>
                    )}
                  </Button>
                  {errorUbicacion && (
                    <p className="rounded-lg bg-red-50 p-2 text-xs font-medium text-red-700">{errorUbicacion}</p>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-between gap-2 rounded-lg border border-green-300 bg-green-50 p-3">
                  <div className="flex items-center gap-2 text-sm text-green-800">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span>
                      Ubicación capturada ({form.ubicacionGPS.lat.toFixed(5)}, {form.ubicacionGPS.lng.toFixed(5)})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={quitarUbicacionGPS}
                    aria-label="Quitar ubicación GPS"
                    className="shrink-0 rounded-md p-1 text-green-700 hover:bg-green-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              <p className="text-xs text-navy-500">
                Captura tus coordenadas exactas para que la ambulancia u hospital lleguen más rápido. Si no está disponible, escribe la dirección abajo.
              </p>
            </div>

            <Textarea
              label="Dirección del paciente"
              placeholder="Calle, número, colonia, municipio, estado..."
              rows={3}
              value={form.ubicacionIncidente}
              onChange={(e) => updateForm("ubicacionIncidente", e.target.value)}
            />
            <Textarea
              label="Observaciones"
              placeholder="Estado de consciencia, dificultad para respirar, etc."
              rows={3}
              value={form.observaciones}
              onChange={(e) => updateForm("observaciones", e.target.value)}
            />
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setPaso(3)}>
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Anterior
              </Button>
              <Button variant="secondary" onClick={calcularResultado}>
                Calcular Triage
                <AlertTriangle className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Respaldo: si por algún borrador viejo se llega al paso 5 sin resultado calculado,
          no se muestra una pantalla en blanco sin salida — se ofrece volver al paso 4 */}
      {paso === 5 && !resultado && (
        <Card>
          <CardContent className="space-y-4 p-5 text-center">
            <p className="text-sm text-navy-600">
              No se encontró el resultado del cálculo. Vuelve al paso anterior para recalcularlo.
            </p>
            <Button onClick={() => setPaso(4)}>
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Volver a Ubicación
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Paso 5: Resultado — aria-live para que lectores de pantalla lo anuncien */}
      <div aria-live="assertive" aria-atomic="true">
      {paso === 5 && resultado && (
        <div className="space-y-4">
          <Card className={`border-2 ${getGravedadColor(resultado.nivelGravedad)}`}>
            <CardContent className="p-5 text-center md:p-6">
              <AlertTriangle className="mx-auto h-10 w-10 md:h-12 md:w-12" />
              <h2 className="mt-3 text-xl font-bold md:text-2xl">
                {resultado.nivelGravedad}
              </h2>
              <p className="mt-1 text-sm font-medium">
                Prioridad: {resultado.prioridad}
              </p>
              <div className="mt-3 space-y-0.5 text-xs md:text-sm">
                <p><strong>Paciente:</strong> {form.nombrePaciente}, {form.edadPaciente} años</p>
                <p><strong>SCQ:</strong> {form.superficieCorporal}%</p>
                <p><strong>Zonas:</strong> {form.zonasAfectadas.map(z => zonasLabels[z]).join(", ")}</p>
                {form.ubicacionGPS && (
                  <p><strong>GPS:</strong> {form.ubicacionGPS.lat.toFixed(5)}, {form.ubicacionGPS.lng.toFixed(5)}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Fotos compartidas con el hospital */}
          {form.fotos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-navy-600" />
                  Fotos para el hospital ({form.fotos.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-xs text-navy-500">
                  Se enviarán junto con el reporte para que el equipo médico prepare todo antes de que llegue el paciente.
                </p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {form.fotos.map((foto, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={foto}
                      alt={`Foto de la quemadura ${i + 1}`}
                      className="aspect-square rounded-lg border border-navy-200 object-cover"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Checklist de Primeros Auxilios — qué hacer mientras llega ayuda */}
          <Card className="border-blue-200 bg-blue-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <AlertTriangle className="h-4 w-4" />
                Mientras llega la ayuda — Primeros Auxilios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-200 text-[10px] font-bold text-blue-800">1</span>
                  <p className="text-sm text-navy-700"><strong>Enfriar la zona</strong> — agua corriente limpia (NO hielo) durante 10-20 minutos.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-200 text-[10px] font-bold text-blue-800">2</span>
                  <p className="text-sm text-navy-700"><strong>Retirar ropa y accesorios</strong> — solo si NO están pegados a la piel.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-200 text-[10px] font-bold text-blue-800">3</span>
                  <p className="text-sm text-navy-700"><strong>Cubrir con tela limpia</strong> — sábana o gasa húmeda, sin apretar.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-200 text-[10px] font-bold text-blue-800">4</span>
                  <p className="text-sm text-navy-700"><strong>NO aplicar</strong> — pasta de dientes, mantequilla, aceite, remedios caseros.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-200 text-[10px] font-bold text-blue-800">5</span>
                  <p className="text-sm text-navy-700"><strong>NO reventar ampollas</strong> — protegen la piel y previenen infección.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-200 text-[10px] font-bold text-blue-800">6</span>
                  <p className="text-sm text-navy-700"><strong>Elevar la zona</strong> — si es posible, mantener por encima del corazón para reducir hinchazón.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-200 text-[10px] font-bold text-blue-800">7</span>
                  <p className="text-sm text-navy-700"><strong>Mantener calmado al niño/a</strong> — hablarle, no dejarlo solo.</p>
                </div>
              </div>
              <p className="mt-3 rounded-lg bg-red-100 p-2 text-xs font-medium text-red-700">
                ⚠️ Si hay dificultad para respirar, quemaduras en cara/cuello, o el niño pierde consciencia: llamar al 911 inmediatamente.
              </p>
            </CardContent>
          </Card>

          {/* Recomendación */}
          <Card>
            <CardHeader>
              <CardTitle>Hospital Recomendado</CardTitle>
            </CardHeader>
            <CardContent>
              {resultado.nivelGravedad === "CRITICO" && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-red-700">
                    🚨 Centro de quemados TERCER NIVEL inmediato
                  </p>
                  <div className="space-y-1.5">
                    <div className="rounded-lg bg-navy-50 p-2.5 text-sm">1. CENIAQ — CDMX</div>
                    <div className="rounded-lg bg-navy-50 p-2.5 text-sm">2. Hospital Victorio de la Fuente Narváez — CDMX</div>
                    <div className="rounded-lg bg-navy-50 p-2.5 text-sm">3. Shriners Galveston (internacional)</div>
                  </div>
                </div>
              )}
              {resultado.nivelGravedad === "GRAVE" && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-orange-700">
                    ⚠️ Hospital con unidad de quemados
                  </p>
                  <div className="space-y-1.5">
                    <div className="rounded-lg bg-navy-50 p-2.5 text-sm">1. Hospital Civil de Guadalajara</div>
                    <div className="rounded-lg bg-navy-50 p-2.5 text-sm">2. Hospital Pediátrico de Tacubaya</div>
                    <div className="rounded-lg bg-navy-50 p-2.5 text-sm">3. Hospital General de México</div>
                  </div>
                </div>
              )}
              {resultado.nivelGravedad === "MODERADO" && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-yellow-700">
                    Hospital general con experiencia en quemaduras
                  </p>
                  <div className="space-y-1.5">
                    <div className="rounded-lg bg-navy-50 p-2.5 text-sm">1. Hospital General más cercano</div>
                    <div className="rounded-lg bg-navy-50 p-2.5 text-sm">2. Cruz Roja local</div>
                  </div>
                </div>
              )}
              {resultado.nivelGravedad === "LEVE" && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-green-700">
                    Atención ambulatoria
                  </p>
                  <p className="text-sm text-navy-600">Centro de salud o consulta de la fundación.</p>
                </div>
              )}

              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => setPaso(4)}
                >
                  <ArrowLeft className="mr-1.5 h-4 w-4" /> Anterior — Corregir datos
                </Button>
                <Button
                  className="w-full sm:w-auto"
                  onClick={() => {
                    limpiarBorrador();
                    router.push("/emergencias");
                  }}
                >
                  Registrar y Canalizar
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    limpiarBorrador();
                    setForm(formInicial);
                    setResultado(null);
                    setErrorFoto("");
                    setErrorUbicacion("");
                    setPaso(1);
                  }}
                >
                  Nuevo Triage
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      </div>
    </div>
  );
}
