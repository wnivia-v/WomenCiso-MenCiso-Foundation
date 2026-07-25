"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { HospitalVista } from "@/lib/datos";

// Ubicación de referencia del paciente (centro de CDMX).
// En un despliegue real vendría del GPS capturado en el triage.
const ubicacionPaciente = { lat: 19.4326, lng: -99.1332 };

function crearIcono(camasDisponibles: number): L.DivIcon {
  let color = "#22c55e"; // verde
  if (camasDisponibles === 0) color = "#ef4444"; // rojo
  else if (camasDisponibles <= 2) color = "#eab308"; // amarillo

  return L.divIcon({
    className: "",
    html: `<div style="background:${color};width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
      <span style="color:white;font-size:11px;font-weight:700;">${camasDisponibles}</span>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

const iconoPaciente = L.divIcon({
  className: "",
  html: `<div style="background:#3b82f6;width:20px;height:20px;border-radius:50%;border:3px solid white;box-shadow:0 0 0 4px rgba(59,130,246,0.3);"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export function MapaHospitales({ hospitales }: { hospitales: HospitalVista[] }) {
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);
  }, []);

  if (!montado) {
    return (
      <div className="flex h-72 items-center justify-center rounded-lg bg-navy-50 border border-navy-200 md:h-80">
        <p className="text-sm text-navy-500">Cargando mapa...</p>
      </div>
    );
  }

  // La descripción para lectores de pantalla se construye a partir de los datos
  // reales, no de un texto fijo: si se desincroniza del contenido visible, una
  // persona ciega recibe información falsa sobre disponibilidad de camas.
  const descripcionAccesible =
    `Mapa interactivo de la red hospitalaria con ${hospitales.length} ` +
    `${hospitales.length === 1 ? "hospital" : "hospitales"} especializados en quemaduras. ` +
    hospitales
      .map(
        (h) =>
          `${h.nombreCorto}: ${
            h.camasDisponibles === 0
              ? "sin camas disponibles"
              : `${h.camasDisponibles} ${h.camasDisponibles === 1 ? "cama" : "camas"} disponibles`
          }`
      )
      .join(". ") +
    ". También muestra la ubicación de referencia del paciente.";

  return (
    <div
      className="relative z-0 isolate h-72 w-full overflow-hidden rounded-lg border border-navy-200 md:h-80"
      role="img"
      aria-label={descripcionAccesible}
    >
      <MapContainer
        center={[19.4326, -99.1332]}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marcadores de hospitales */}
        {hospitales.map((hospital) => (
          <Marker
            key={hospital.id}
            position={[hospital.latitud, hospital.longitud]}
            icon={crearIcono(hospital.camasDisponibles)}
          >
            <Popup>
              <div style={{ minWidth: 180 }}>
                <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{hospital.nombreCorto}</p>
                <p style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>{hospital.nombre}</p>
                <p style={{ fontSize: 12 }}>
                  <strong>Camas:</strong>{" "}
                  <span style={{ color: hospital.camasDisponibles > 0 ? "#16a34a" : "#dc2626" }}>
                    {hospital.camasDisponibles}
                  </span>
                  /{hospital.camasTotales}
                </p>
                <p style={{ fontSize: 11 }}><strong>Tel:</strong> {hospital.telefono}</p>
                <p style={{ fontSize: 11 }}><strong>Esp:</strong> {hospital.especialidad.join(", ")}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Ubicación del paciente */}
        <Marker position={[ubicacionPaciente.lat, ubicacionPaciente.lng]} icon={iconoPaciente}>
          <Popup>
            <p style={{ fontWeight: 700, fontSize: 12 }}>📍 Ubicación del paciente</p>
            <p style={{ fontSize: 11, color: "#666" }}>Última emergencia reportada</p>
          </Popup>
        </Marker>

        {/* Radio de cobertura alrededor del paciente */}
        <Circle
          center={[ubicacionPaciente.lat, ubicacionPaciente.lng]}
          radius={15000}
          pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.05, weight: 1 }}
        />
      </MapContainer>
    </div>
  );
}
