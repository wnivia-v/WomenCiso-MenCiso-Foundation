"use client";

import { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { HospitalVista } from "@/lib/datos";

/**
 * Mapa de hospitales con geolocalización real.
 *
 * Al abrir la página:
 * 1. Pide permiso de ubicación al usuario
 * 2. Centra el mapa en su posición real
 * 3. Calcula la distancia a cada hospital
 * 4. Muestra un radio visual de cobertura
 * 5. Cada popup incluye distancia + links a Google Maps y Waze
 *
 * Si el usuario deniega la ubicación o el dispositivo no tiene GPS,
 * se usa la última posición conocida (CDMX centro como fallback).
 */

// Fallback: Ciudad de México centro
const UBICACION_DEFAULT = { lat: 19.4326, lng: -99.1332 };

/** Distancia Haversine entre dos puntos (km) */
function calcularDistanciaKm(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Formatea distancia para mostrar (km o m) */
function formatearDistancia(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

/** Tiempo estimado de llegada en auto (asumiendo 30 km/h en ciudad) */
function tiempoEstimado(km: number): string {
  const minutos = Math.round((km / 30) * 60);
  if (minutos < 1) return "< 1 min";
  if (minutos < 60) return `~${minutos} min`;
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  return `~${horas}h ${mins}min`;
}

function crearIcono(camasDisponibles: number): L.DivIcon {
  let color = "#22c55e";
  if (camasDisponibles === 0) color = "#ef4444";
  else if (camasDisponibles <= 2) color = "#eab308";

  return L.divIcon({
    className: "",
    html: `<div style="background:${color};width:32px;height:32px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;">
      <span style="color:white;font-size:12px;font-weight:800;">${camasDisponibles}</span>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

const iconoUsuario = L.divIcon({
  className: "",
  html: `<div style="position:relative;width:24px;height:24px;">
    <div style="position:absolute;inset:0;background:rgba(59,130,246,0.25);border-radius:50%;animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></div>
    <div style="position:absolute;inset:3px;background:#3b82f6;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>
  </div>
  <style>@keyframes ping{75%,100%{transform:scale(2);opacity:0}}</style>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

/** Componente interno que recentra el mapa cuando la ubicación cambia */
function CentrarMapa({ posicion }: { posicion: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    map.setView([posicion.lat, posicion.lng], 11, { animate: true });
  }, [map, posicion.lat, posicion.lng]);
  return null;
}

interface HospitalLocal {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  emergencia: boolean;
  latitud: number;
  longitud: number;
  tipo: string;
  fuente: string;
  distanciaKm?: number;
}

interface MapaHospitalesProps {
  hospitales: HospitalVista[];
}

export function MapaHospitales({ hospitales }: MapaHospitalesProps) {
  const [montado, setMontado] = useState(false);
  const [miUbicacion, setMiUbicacion] = useState(UBICACION_DEFAULT);
  const [ubicacionReal, setUbicacionReal] = useState(false);
  const [buscando, setBuscando] = useState(true);
  const [errorGPS, setErrorGPS] = useState("");
  const [hospitalesLocales, setHospitalesLocales] = useState<HospitalLocal[]>([]);
  const [buscandoHospitales, setBuscandoHospitales] = useState(false);

  const buscarHospitalesCercanos = useCallback(async (lat: number, lng: number) => {
    setBuscandoHospitales(true);
    try {
      const res = await fetch(`/api/hospitales-cercanos?lat=${lat}&lng=${lng}&radio=200`);
      if (res.ok) {
        const data = await res.json();
        if (data.hospitales && data.hospitales.length > 0) {
          const conDistancia = data.hospitales.map((h: HospitalLocal) => ({
            ...h,
            distanciaKm: calcularDistanciaKm(lat, lng, h.latitud, h.longitud),
          })).sort((a: HospitalLocal, b: HospitalLocal) => (a.distanciaKm || 0) - (b.distanciaKm || 0));
          setHospitalesLocales(conDistancia);
        }
      }
    } catch {
      // Si falla, se muestran solo los de la base de datos
    }
    setBuscandoHospitales(false);
  }, []);

  const obtenerUbicacion = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setErrorGPS("GPS no disponible en este dispositivo");
      setBuscando(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setMiUbicacion(coords);
        setUbicacionReal(true);
        setBuscando(false);
        buscarHospitalesCercanos(coords.lat, coords.lng);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setErrorGPS("Ubicación denegada — mostrando hospitales de la red");
        } else {
          setErrorGPS("No se pudo obtener ubicación");
        }
        setBuscando(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }, [buscarHospitalesCercanos]);

  useEffect(() => {
    setMontado(true);
    obtenerUbicacion();
  }, [obtenerUbicacion]);

  // Calcular distancias y ordenar
  const hospitalesConDistancia = hospitales
    .map((h) => ({
      ...h,
      distanciaKm: calcularDistanciaKm(miUbicacion.lat, miUbicacion.lng, h.latitud, h.longitud),
    }))
    .sort((a, b) => a.distanciaKm - b.distanciaKm);

  if (!montado) {
    return (
      <div className="flex h-72 items-center justify-center rounded-lg border border-navy-200 bg-navy-50 md:h-96">
        <p className="text-sm text-navy-500">Cargando mapa...</p>
      </div>
    );
  }

  const descripcionAccesible =
    `Mapa interactivo con tu ubicación real y ${hospitales.length} hospitales. ` +
    `Hospital más cercano: ${hospitalesConDistancia[0]?.nombreCorto || "—"} ` +
    `a ${hospitalesConDistancia[0] ? formatearDistancia(hospitalesConDistancia[0].distanciaKm) : "—"}.`;

  return (
    <div className="space-y-3">
      {/* Estado de ubicación */}
      <div className="flex items-center gap-2 text-xs">
        {buscando ? (
          <span className="flex items-center gap-1.5 text-navy-500">
            <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
            Buscando tu ubicación...
          </span>
        ) : ubicacionReal ? (
          <span className="flex items-center gap-1.5 text-green-700 dark:text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Ubicación real activa
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            {errorGPS}
          </span>
        )}
        {!ubicacionReal && !buscando && (
          <button
            onClick={() => { setBuscando(true); obtenerUbicacion(); }}
            className="rounded border border-navy-200 px-2 py-0.5 text-[10px] font-medium text-navy-600 hover:bg-navy-50 dark:border-navy-700 dark:text-navy-300"
          >
            Reintentar
          </button>
        )}
      </div>

      {/* Mapa */}
      <div
        className="relative z-0 isolate h-72 w-full overflow-hidden rounded-xl border border-navy-200 shadow-sm md:h-96"
        role="img"
        aria-label={descripcionAccesible}
      >
        <MapContainer
          center={[miUbicacion.lat, miUbicacion.lng]}
          zoom={11}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <CentrarMapa posicion={miUbicacion} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Marcadores de hospitales con popup completo */}
          {hospitalesConDistancia.map((hospital) => (
            <Marker
              key={hospital.id}
              position={[hospital.latitud, hospital.longitud]}
              icon={crearIcono(hospital.camasDisponibles)}
            >
              <Popup maxWidth={280}>
                <div style={{ minWidth: 220, fontFamily: "system-ui, sans-serif" }}>
                  <p style={{ fontWeight: 800, fontSize: 13, marginBottom: 2, color: "#1B2A4A" }}>
                    {hospital.nombreCorto}
                  </p>
                  <p style={{ fontSize: 10, color: "#666", marginBottom: 6 }}>{hospital.nombre}</p>

                  {/* Distancia y tiempo */}
                  <div style={{ background: "#f0f9ff", borderRadius: 6, padding: "6px 8px", marginBottom: 8 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#1e40af" }}>
                      📍 {formatearDistancia(hospital.distanciaKm)} — {tiempoEstimado(hospital.distanciaKm)}
                    </p>
                  </div>

                  {/* Info */}
                  <p style={{ fontSize: 11, marginBottom: 2 }}>
                    <strong>Camas:</strong>{" "}
                    <span style={{ color: hospital.camasDisponibles > 0 ? "#16a34a" : "#dc2626", fontWeight: 700 }}>
                      {hospital.camasDisponibles}
                    </span>
                    /{hospital.camasTotales}
                  </p>
                  <p style={{ fontSize: 11, marginBottom: 2 }}>
                    <strong>Tel:</strong> <a href={`tel:${hospital.telefono.replace(/\s/g, "")}`} style={{ color: "#1e40af" }}>{hospital.telefono}</a>
                  </p>
                  <p style={{ fontSize: 10, color: "#666", marginBottom: 8 }}>
                    {hospital.especialidad.join(" · ")}
                  </p>

                  {/* Botones de navegación */}
                  <div style={{ display: "flex", gap: 6 }}>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitud},${hospital.longitud}&travelmode=driving`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, background: "#2563eb", color: "white", borderRadius: 6, padding: "6px 8px", fontSize: 11, fontWeight: 700, textDecoration: "none" }}
                    >
                      Maps
                    </a>
                    <a
                      href={`https://waze.com/ul?ll=${hospital.latitud},${hospital.longitud}&navigate=yes`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, background: "#0ea5e9", color: "white", borderRadius: 6, padding: "6px 8px", fontSize: 11, fontWeight: 700, textDecoration: "none" }}
                    >
                      Waze
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Hospitales locales (OpenStreetMap — cualquier país) */}
          {hospitalesLocales.map((hospital) => (
            <Marker
              key={hospital.id}
              position={[hospital.latitud, hospital.longitud]}
              icon={L.divIcon({
                className: "",
                html: `<div style="background:#8b5cf6;width:26px;height:26px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
                  <span style="color:white;font-size:10px;font-weight:800;">H</span>
                </div>`,
                iconSize: [26, 26],
                iconAnchor: [13, 13],
              })}
            >
              <Popup maxWidth={280}>
                <div style={{ minWidth: 200, fontFamily: "system-ui, sans-serif" }}>
                  <p style={{ fontWeight: 800, fontSize: 13, marginBottom: 2, color: "#1B2A4A" }}>
                    {hospital.nombre}
                  </p>
                  {hospital.direccion && (
                    <p style={{ fontSize: 10, color: "#666", marginBottom: 4 }}>{hospital.direccion}</p>
                  )}
                  <div style={{ background: "#f5f3ff", borderRadius: 6, padding: "6px 8px", marginBottom: 8 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#6d28d9" }}>
                      📍 {formatearDistancia(hospital.distanciaKm || 0)} — {tiempoEstimado(hospital.distanciaKm || 0)}
                    </p>
                  </div>
                  {hospital.telefono && (
                    <p style={{ fontSize: 11, marginBottom: 4 }}>
                      <strong>Tel:</strong> <a href={`tel:${hospital.telefono}`} style={{ color: "#6d28d9" }}>{hospital.telefono}</a>
                    </p>
                  )}
                  {hospital.emergencia && (
                    <p style={{ fontSize: 10, color: "#dc2626", fontWeight: 700, marginBottom: 4 }}>🚨 Tiene urgencias</p>
                  )}
                  <div style={{ display: "flex", gap: 6 }}>
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitud},${hospital.longitud}&travelmode=driving`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#2563eb", color: "white", borderRadius: 6, padding: "6px 8px", fontSize: 11, fontWeight: 700, textDecoration: "none" }}>Maps</a>
                    <a href={`https://waze.com/ul?ll=${hospital.latitud},${hospital.longitud}&navigate=yes`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#0ea5e9", color: "white", borderRadius: 6, padding: "6px 8px", fontSize: 11, fontWeight: 700, textDecoration: "none" }}>Waze</a>
                  </div>
                  <p style={{ fontSize: 9, color: "#999", marginTop: 6, textAlign: "center" }}>Fuente: OpenStreetMap</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Mi ubicación */}
          <Marker position={[miUbicacion.lat, miUbicacion.lng]} icon={iconoUsuario}>
            <Popup>
              <div style={{ textAlign: "center", fontFamily: "system-ui, sans-serif" }}>
                <p style={{ fontWeight: 700, fontSize: 12, color: "#1B2A4A" }}>
                  📍 {ubicacionReal ? "Tu ubicación actual" : "Ubicación de referencia"}
                </p>
                <p style={{ fontSize: 10, color: "#666" }}>
                  {miUbicacion.lat.toFixed(5)}, {miUbicacion.lng.toFixed(5)}
                </p>
              </div>
            </Popup>
          </Marker>

          {/* Radio de cobertura (20 km) */}
          <Circle
            center={[miUbicacion.lat, miUbicacion.lng]}
            radius={20000}
            pathOptions={{
              color: "#3b82f6",
              fillColor: "#3b82f6",
              fillOpacity: 0.04,
              weight: 1.5,
              dashArray: "6 4",
            }}
          />
        </MapContainer>
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-navy-500 dark:text-navy-400">
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-full bg-green-500" /> Con camas (red)
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-full bg-yellow-500" /> Pocas camas
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-full bg-red-500" /> Sin camas
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-full bg-purple-500" /> Hospital local
        </span>
        <span className="flex items-center gap-1">
          <span className="relative inline-block h-3 w-3 rounded-full bg-blue-500" /> Tu ubicación
        </span>
      </div>

      {/* Hospitales locales (de la zona) */}
      {hospitalesLocales.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">
              Hospitales cerca de ti ({hospitalesLocales.length}):
            </p>
            {buscandoHospitales && (
              <span className="text-[10px] text-navy-500 animate-pulse">Buscando...</span>
            )}
          </div>
          {hospitalesLocales.slice(0, 10).map((h, i) => (
            <div
              key={h.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-purple-100 bg-purple-50/30 p-2.5 dark:border-purple-500/20 dark:bg-purple-500/5"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-[10px] font-bold text-purple-700 dark:bg-purple-500/20 dark:text-purple-300">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-navy-800 dark:text-white">
                    {h.nombre}
                  </p>
                  <p className="text-[10px] text-navy-500">
                    {formatearDistancia(h.distanciaKm || 0)} · {tiempoEstimado(h.distanciaKm || 0)}
                    {h.emergencia && <span className="ml-1 text-red-600">· Urgencias</span>}
                  </p>
                  {h.direccion && (
                    <p className="truncate text-[9px] text-navy-400">{h.direccion}</p>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${h.latitud},${h.longitud}&travelmode=driving`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-blue-600 px-2 py-1 text-[9px] font-bold text-white hover:bg-blue-700"
                >
                  Maps
                </a>
                <a
                  href={`https://waze.com/ul?ll=${h.latitud},${h.longitud}&navigate=yes`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-sky-500 px-2 py-1 text-[9px] font-bold text-white hover:bg-sky-600"
                >
                  Waze
                </a>
              </div>
            </div>
          ))}
          {hospitalesLocales.length > 10 && (
            <p className="text-center text-[10px] text-navy-500">
              y {hospitalesLocales.length - 10} hospitales más en tu zona
            </p>
          )}
        </div>
      )}

      {/* Lista de hospitales por cercanía */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-navy-700 dark:text-navy-200">
          Hospitales ordenados por cercanía:
        </p>
        {hospitalesConDistancia.map((h, i) => (
          <div
            key={h.id}
            className="flex items-center justify-between gap-2 rounded-lg border border-navy-100 p-2.5 dark:border-navy-800"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-100 text-[10px] font-bold text-navy-700 dark:bg-navy-800 dark:text-navy-200">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-navy-800 dark:text-white">
                  {h.nombreCorto}
                </p>
                <p className="text-[10px] text-navy-500">
                  {formatearDistancia(h.distanciaKm)} · {tiempoEstimado(h.distanciaKm)} ·{" "}
                  <span className={h.camasDisponibles > 0 ? "text-green-600" : "text-red-600"}>
                    {h.camasDisponibles} camas
                  </span>
                </p>
              </div>
            </div>
            <div className="flex shrink-0 gap-1">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${h.latitud},${h.longitud}&travelmode=driving`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-blue-600 px-2 py-1 text-[9px] font-bold text-white hover:bg-blue-700"
              >
                Maps
              </a>
              <a
                href={`https://waze.com/ul?ll=${h.latitud},${h.longitud}&navigate=yes`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-sky-500 px-2 py-1 text-[9px] font-bold text-white hover:bg-sky-600"
              >
                Waze
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
