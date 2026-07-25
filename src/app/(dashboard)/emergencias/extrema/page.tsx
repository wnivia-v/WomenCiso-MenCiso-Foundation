"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Phone, Zap, MapPin, LocateFixed, Loader2, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calcularGravedad } from "@/lib/utils";

const zonasRapidas = [
  { value: "cara", label: "Cara" },
  { value: "vias_respiratorias", label: "Vías respiratorias" },
  { value: "torso_anterior", label: "Torso" },
  { value: "brazo_derecho", label: "Brazos" },
  { value: "pierna_derecha", label: "Piernas" },
  { value: "mano_derecha", label: "Manos" },
  { value: "genitales", label: "Genitales" },
  { value: "cuello", label: "Cuello" },
];

export default function TriageExtremaPage() {
  const router = useRouter();
  const [resultado, setResultado] = useState<{ nivelGravedad: string; prioridad: string } | null>(null);
  const [buscandoGPS, setBuscandoGPS] = useState(false);
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [sinIdentificacion, setSinIdentificacion] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [registroGuardado, setRegistroGuardado] = useState(false);
  const [dibujando, setDibujando] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [intervencion, setIntervencion] = useState({
    nombreResponsable: "",
    cargoResponsable: "",
    ambulanciaUnidad: "",
    ambulanciaParamedico: "",
    hospitalDestino: "",
    horaDespacho: "",
    observacionesTraslado: "",
    ubicacionFirma: "",
  });

  const updateIntervencion = (campo: string, valor: string) => {
    setIntervencion((prev) => ({ ...prev, [campo]: valor }));
  };

  // Funciones del canvas de firma
  const iniciarTrazo = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setDibujando(true);
    ctx.beginPath();
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.moveTo(x, y);
  };

  const dibujar = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!dibujando) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1B2A4A";
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const terminarTrazo = () => setDibujando(false);

  const limpiarFirma = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const guardarRegistro = () => {
    // Registrar hora exacta del sistema (no editable por el usuario)
    const ahora = new Date();
    const horaExacta = `${ahora.getHours().toString().padStart(2, "0")}:${ahora.getMinutes().toString().padStart(2, "0")}:${ahora.getSeconds().toString().padStart(2, "0")}`;
    setIntervencion((prev) => ({ ...prev, horaDespacho: horaExacta }));

    // Capturar ubicación automática al momento de firmar
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIntervencion((prev) => ({
            ...prev,
            ubicacionFirma: `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`,
          }));
        },
        () => {
          setIntervencion((prev) => ({ ...prev, ubicacionFirma: "No disponible" }));
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setIntervencion((prev) => ({ ...prev, ubicacionFirma: "No soportado" }));
    }

    setRegistroGuardado(true);
    // En producción: enviar datos + firma (canvas.toDataURL()) + hora + GPS al backend
  };

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    telefono: "",
    telefonoEmergencia: "",
    nombreFamiliar: "",
    seguro: "",
    gradoQuemadura: "",
    scq: "",
    zonaAfectada: "",
  });

  const update = (campo: string, valor: string) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const toggleSinID = () => {
    setSinIdentificacion((prev) => {
      if (!prev) {
        // Limpiar campos de identificación al marcar "Sin identificación"
        setForm((f) => ({ ...f, nombre: "", apellido: "", telefono: "", telefonoEmergencia: "", nombreFamiliar: "", seguro: "" }));
      }
      return !prev;
    });
  };

  const calcular = () => {
    const edad = parseInt(form.edad) || 0;
    const scq = parseFloat(form.scq) || 0;
    const zonas = form.zonaAfectada ? [form.zonaAfectada] : [];
    const res = calcularGravedad(form.gradoQuemadura, scq, zonas, edad);
    setResultado(res);

    // Leer en voz alta si está activa
    setTimeout(() => {
      try {
        const vozActiva = document.querySelector('[aria-label="Desactivar lectura por voz"]');
        if (vozActiva && window.speechSynthesis) {
          const msg = new SpeechSynthesisUtterance(
            `Emergencia extrema clasificada. Gravedad: ${res.nivelGravedad}. Prioridad: ${res.prioridad}. Canalizar inmediatamente.`
          );
          msg.lang = "es-MX";
          msg.rate = 1.0;
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(msg);
        }
      } catch { /* no crítico */ }
    }, 200);
  };

  const obtenerGPS = () => {
    if (!("geolocation" in navigator)) return;
    setBuscandoGPS(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setBuscandoGPS(false);
      },
      () => setBuscandoGPS(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const getColor = (gravedad: string) => {
    switch (gravedad) {
      case "CRITICO": return "bg-red-600 text-white";
      case "GRAVE": return "bg-orange-500 text-white";
      case "MODERADO": return "bg-yellow-400 text-navy-900";
      default: return "bg-green-500 text-white";
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-4">
      {/* Header de emergencia */}
      <div className="rounded-xl bg-red-600 p-4 text-center text-white shadow-lg">
        <div className="flex items-center justify-center gap-2">
          <Zap className="h-6 w-6" />
          <h1 className="text-xl font-bold">EMERGENCIA EXTREMA</h1>
          <Zap className="h-6 w-6" />
        </div>
        <p className="mt-1 text-sm opacity-90">Solo datos mínimos para canalizar YA</p>
      </div>

      {!resultado ? (
        <>
          {/* Formulario ultra-rápido — todo en una pantalla */}
          <Card>
            <CardContent className="space-y-3 p-4">
              {/* Toggle sin identificación */}
              <label className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sinIdentificacion}
                  onChange={toggleSinID}
                  className="h-4 w-4 rounded border-navy-300 text-amber-600 focus:ring-amber-400"
                />
                <div>
                  <span className="text-sm font-medium text-amber-800">Sin identificación</span>
                  <p className="text-[10px] text-amber-600">Persona desconocida, accidente masivo, o no hay quien informe</p>
                </div>
              </label>

              {/* Datos de identificación — se ocultan si marca "sin identificación" */}
              {!sinIdentificacion && (
                <div className="space-y-3 rounded-lg border border-navy-100 bg-white p-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="Nombre"
                      placeholder="Nombre"
                      value={form.nombre}
                      onChange={(e) => update("nombre", e.target.value)}
                    />
                    <Input
                      label="Apellido"
                      placeholder="Apellido"
                      value={form.apellido}
                      onChange={(e) => update("apellido", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="Tel. contacto"
                      type="tel"
                      placeholder="55 1234 5678"
                      value={form.telefono}
                      onChange={(e) => update("telefono", e.target.value)}
                    />
                    <Input
                      label="Tel. emergencia familiar"
                      type="tel"
                      placeholder="55 8765 4321"
                      value={form.telefonoEmergencia}
                      onChange={(e) => update("telefonoEmergencia", e.target.value)}
                    />
                  </div>
                  <Input
                    label="Nombre del familiar"
                    placeholder="Mamá, papá, tutor..."
                    value={form.nombreFamiliar}
                    onChange={(e) => update("nombreFamiliar", e.target.value)}
                  />
                  <Select
                    label="¿Tiene seguro médico?"
                    placeholder="Seleccione..."
                    options={[
                      { value: "IMSS", label: "IMSS" },
                      { value: "ISSSTE", label: "ISSSTE" },
                      { value: "SEGURO_POPULAR", label: "Seguro Popular / INSABI" },
                      { value: "PRIVADO", label: "Seguro privado (GNP, Metlife, AXA...)" },
                      { value: "NINGUNO", label: "Sin seguro" },
                      { value: "NO_SABE", label: "No se sabe" },
                    ]}
                    value={form.seguro}
                    onChange={(e) => update("seguro", e.target.value)}
                  />
                </div>
              )}

              {sinIdentificacion && (
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-center">
                  <p className="text-xs text-amber-700 font-medium">⚠️ Paciente sin identificar</p>
                  <p className="text-[10px] text-amber-600">Se registrará como NN. Los datos se completarán después cuando sea posible.</p>
                </div>
              )}

              {/* Datos clínicos mínimos */}
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Edad (aprox.)"
                  type="number"
                  placeholder="Años"
                  min="0"
                  max="100"
                  value={form.edad}
                  onChange={(e) => update("edad", e.target.value)}
                />
                <Input
                  label="% Quemado (SCQ)"
                  type="number"
                  placeholder="Ej: 20"
                  min="1"
                  max="100"
                  value={form.scq}
                  onChange={(e) => update("scq", e.target.value)}
                />
              </div>

              <Select
                label="Grado de quemadura (el peor visible)"
                placeholder="Seleccione rápido..."
                options={[
                  { value: "SEGUNDO_GRADO_SUPERFICIAL", label: "2° — Ampollas" },
                  { value: "SEGUNDO_GRADO_PROFUNDO", label: "2° Profundo — Blancuzco" },
                  { value: "TERCER_GRADO", label: "3° — Blanca/negra, sin dolor" },
                  { value: "CUARTO_GRADO", label: "4° — Músculo/hueso" },
                ]}
                value={form.gradoQuemadura}
                onChange={(e) => update("gradoQuemadura", e.target.value)}
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-navy-700">Zona más grave</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {zonasRapidas.map((z) => (
                    <button
                      key={z.value}
                      type="button"
                      onClick={() => update("zonaAfectada", z.value)}
                      className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors active:scale-95 ${
                        form.zonaAfectada === z.value
                          ? "border-red-400 bg-red-50 text-red-800"
                          : "border-navy-200 text-navy-600"
                      }`}
                    >
                      {z.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* GPS rápido */}
              <div className="flex items-center gap-2">
                {!gps ? (
                  <button
                    type="button"
                    onClick={obtenerGPS}
                    disabled={buscandoGPS}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-navy-200 bg-white py-2.5 text-xs font-medium text-navy-700 transition-colors hover:bg-navy-50 disabled:opacity-50"
                  >
                    {buscandoGPS ? (
                      <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Ubicando...</>
                    ) : (
                      <><LocateFixed className="h-3.5 w-3.5" /> Enviar mi ubicación</>
                    )}
                  </button>
                ) : (
                  <div className="flex flex-1 items-center gap-1.5 rounded-lg bg-green-50 border border-green-200 px-3 py-2.5 text-xs text-green-700">
                    <MapPin className="h-3.5 w-3.5" />
                    Ubicación capturada ✓
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Botón CLASIFICAR gigante */}
          <Button
            onClick={calcular}
            disabled={!form.gradoQuemadura || !form.scq}
            size="lg"
            className="w-full bg-red-600 py-6 text-lg font-bold hover:bg-red-700 disabled:opacity-50"
          >
            <AlertTriangle className="mr-2 h-5 w-5" />
            CLASIFICAR Y CANALIZAR
          </Button>
        </>
      ) : (
        <>
          {/* Resultado inmediato */}
          <div aria-live="assertive">
            <Card className={`border-2 ${getColor(resultado.nivelGravedad)}`}>
              <CardContent className="p-6 text-center">
                <AlertTriangle className="mx-auto h-12 w-12" />
                <h2 className="mt-2 text-3xl font-black">{resultado.nivelGravedad}</h2>
                <p className="mt-1 text-lg font-semibold">Prioridad: {resultado.prioridad}</p>
                {form.edad && <p className="mt-2 text-sm opacity-90">
                  {sinIdentificacion ? "Paciente NN (sin identificar)" : `${form.nombre} ${form.apellido}`.trim() || "Paciente"} — {form.edad} años — SCQ {form.scq}%
                </p>}
              </CardContent>
            </Card>
          </div>

          {/* Hospital inmediato */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <p className="text-sm font-bold text-navy-800">Canalizar AHORA a:</p>
              {(resultado.nivelGravedad === "CRITICO" || resultado.nivelGravedad === "GRAVE") && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg bg-red-50 p-3">
                    <div>
                      <p className="text-sm font-bold text-navy-800">CENIAQ</p>
                      <p className="text-xs text-navy-500">Centro Nacional de Quemados — CDMX</p>
                    </div>
                    <a href="tel:5500010000" className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-xs font-bold text-white active:scale-95">
                      <Phone className="h-3.5 w-3.5" /> Llamar
                    </a>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-navy-50 p-3">
                    <div>
                      <p className="text-sm font-bold text-navy-800">H. Traumatología IMSS</p>
                      <p className="text-xs text-navy-500">Magdalena de las Salinas — CDMX</p>
                    </div>
                    <a href="tel:5500020000" className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-xs font-bold text-white active:scale-95">
                      <Phone className="h-3.5 w-3.5" /> Llamar
                    </a>
                  </div>
                </div>
              )}
              {resultado.nivelGravedad === "MODERADO" && (
                <div className="rounded-lg bg-yellow-50 p-3">
                  <p className="text-sm font-bold text-navy-800">Hospital General más cercano</p>
                  <p className="text-xs text-navy-500">O Cruz Roja local</p>
                </div>
              )}
              {resultado.nivelGravedad === "LEVE" && (
                <div className="rounded-lg bg-green-50 p-3">
                  <p className="text-sm font-bold text-navy-800">Centro de salud o consulta</p>
                  <p className="text-xs text-navy-500">No requiere centro especializado</p>
                </div>
              )}

              {/* Emergencia nacional */}
              <a
                href="tel:911"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy-800 py-3 text-sm font-bold text-white active:scale-95"
              >
                <Phone className="h-4 w-4" /> Llamar 911
              </a>
            </CardContent>
          </Card>

          {/* Registro de intervención — se llena camino al hospital */}
          {!mostrarRegistro && !registroGuardado && (
            <Button
              variant="outline"
              className="w-full border-navy-300"
              onClick={() => {
                setMostrarRegistro(true);
                // Capturar hora del sistema al abrir el registro
                const ahora = new Date();
                const horaExacta = `${ahora.getHours().toString().padStart(2, "0")}:${ahora.getMinutes().toString().padStart(2, "0")}:${ahora.getSeconds().toString().padStart(2, "0")}`;
                setIntervencion((prev) => ({ ...prev, horaDespacho: horaExacta }));
              }}
            >
              <PenTool className="mr-1.5 h-4 w-4" />
              Registrar intervención y firmar
            </Button>
          )}

          {mostrarRegistro && !registroGuardado && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <PenTool className="h-4 w-4 text-navy-600" />
                  Registro de Intervención
                </CardTitle>
                <p className="text-[10px] text-navy-500">Llenar camino al hospital — quién intervino, ambulancia y firma</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Responsable */}
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Nombre del responsable"
                    placeholder="Quien llenó este triage"
                    value={intervencion.nombreResponsable}
                    onChange={(e) => updateIntervencion("nombreResponsable", e.target.value)}
                  />
                  <Select
                    label="Cargo"
                    placeholder="Seleccione..."
                    options={[
                      { value: "COORDINADOR", label: "Coordinador Fundación" },
                      { value: "PARAMEDICO", label: "Paramédico" },
                      { value: "BOMBERO", label: "Bombero" },
                      { value: "MEDICO", label: "Médico" },
                      { value: "ENFERMERO", label: "Enfermero/a" },
                      { value: "VOLUNTARIO", label: "Voluntario" },
                      { value: "FAMILIAR", label: "Familiar" },
                      { value: "TESTIGO", label: "Testigo/ciudadano" },
                    ]}
                    value={intervencion.cargoResponsable}
                    onChange={(e) => updateIntervencion("cargoResponsable", e.target.value)}
                  />
                </div>

                {/* Ambulancia */}
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Unidad/Ambulancia"
                    placeholder="Ej: Cruz Roja U-45"
                    value={intervencion.ambulanciaUnidad}
                    onChange={(e) => updateIntervencion("ambulanciaUnidad", e.target.value)}
                  />
                  <Input
                    label="Paramédico a cargo"
                    placeholder="Nombre del paramédico"
                    value={intervencion.ambulanciaParamedico}
                    onChange={(e) => updateIntervencion("ambulanciaParamedico", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Hospital destino"
                    placeholder="A dónde se canaliza"
                    value={intervencion.hospitalDestino}
                    onChange={(e) => updateIntervencion("hospitalDestino", e.target.value)}
                  />
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-navy-700">Hora (automática)</label>
                    <div className="flex h-[42px] items-center rounded-lg border border-navy-200 bg-navy-50 px-3 text-sm font-medium text-navy-800">
                      {intervencion.horaDespacho || "—"}
                    </div>
                    <p className="text-[10px] text-navy-400">Registrada del sistema — no editable</p>
                  </div>
                </div>

                {/* Ubicación automática */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-navy-700">Ubicación al firmar (automática)</label>
                  {intervencion.ubicacionFirma ? (
                    <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-xs text-green-700">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span>Capturada: {intervencion.ubicacionFirma}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-lg border border-navy-200 bg-navy-50 px-3 py-2.5 text-xs text-navy-500">
                      <LocateFixed className="h-3.5 w-3.5 shrink-0" />
                      <span>Se capturará al guardar el registro</span>
                    </div>
                  )}
                  <p className="text-[10px] text-navy-400">Se registra automáticamente para evitar fraudes</p>
                </div>

                <Textarea
                  label="Observaciones del traslado"
                  placeholder="Estado del paciente, procedimientos en ruta, cambios de estado..."
                  rows={2}
                  value={intervencion.observacionesTraslado}
                  onChange={(e) => updateIntervencion("observacionesTraslado", e.target.value)}
                />

                {/* Firma digital */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-navy-700">
                    Firma del responsable
                  </label>
                  <div className="relative rounded-lg border-2 border-navy-200 bg-white">
                    <canvas
                      ref={canvasRef}
                      width={320}
                      height={120}
                      className="w-full touch-none cursor-crosshair"
                      onMouseDown={iniciarTrazo}
                      onMouseMove={dibujar}
                      onMouseUp={terminarTrazo}
                      onMouseLeave={terminarTrazo}
                      onTouchStart={iniciarTrazo}
                      onTouchMove={dibujar}
                      onTouchEnd={terminarTrazo}
                    />
                    <button
                      type="button"
                      onClick={limpiarFirma}
                      className="absolute right-2 top-2 rounded bg-navy-100 px-2 py-0.5 text-[10px] font-medium text-navy-600 hover:bg-navy-200"
                    >
                      Limpiar
                    </button>
                  </div>
                  <p className="text-[10px] text-navy-400">Dibuje su firma con el dedo o mouse</p>
                </div>

                <Button onClick={guardarRegistro} className="w-full">
                  Guardar Registro de Intervención
                </Button>
              </CardContent>
            </Card>
          )}

          {registroGuardado && (
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-200">
                    <PenTool className="h-4 w-4 text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-800">Registro guardado ✓</p>
                    <p className="text-[10px] text-green-600">
                      {intervencion.nombreResponsable || "Responsable"} ({intervencion.cargoResponsable || "—"}) — {intervencion.ambulanciaUnidad || "Sin ambulancia"} → {intervencion.hospitalDestino || "Hospital"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 text-[10px] text-navy-500 border-t border-green-200 pt-2 mt-2">
                  <span>🕐 Hora: <strong>{intervencion.horaDespacho}</strong></span>
                  {intervencion.ubicacionFirma && (
                    <span>📍 GPS: <strong>{intervencion.ubicacionFirma}</strong></span>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Acciones */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => { setResultado(null); setForm({ nombre: "", apellido: "", edad: "", telefono: "", telefonoEmergencia: "", nombreFamiliar: "", seguro: "", gradoQuemadura: "", scq: "", zonaAfectada: "" }); setGps(null); setSinIdentificacion(false); setMostrarRegistro(false); setRegistroGuardado(false); setIntervencion({ nombreResponsable: "", cargoResponsable: "", ambulanciaUnidad: "", ambulanciaParamedico: "", hospitalDestino: "", horaDespacho: "", observacionesTraslado: "", ubicacionFirma: "" }); }}
            >
              Nueva Emergencia
            </Button>
            <Button onClick={() => router.push("/emergencias/nueva")}>
              Triage Completo →
            </Button>
          </div>
        </>
      )}

      {/* Nota al pie */}
      <p className="text-center text-[10px] text-navy-400">
        Este triage extremo es para canalizaciones inmediatas. Para un registro completo con fotos, ubicación y datos del reportante, use el Triage Rápido estándar.
      </p>
    </div>
  );
}
