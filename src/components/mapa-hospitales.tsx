"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Hospital {
  id: string;
  nombre: string;
  nombreCompleto: string;
  lat: number;
  lng: number;
  camasDisponibles: number;
  camasTotales: number;
  telefono: string;
  especialidad: string[];
}

const hospitalesConCoordenadas: Hospital[] = [
  {
    id: "1",
    nombre: "CENIAQ",
    nombreCompleto: "Centro Nacional de Investigación y Atención de Quemados",
    lat: 19.2866,
    lng: -99.1621,
    camasDisponibles: 3,
    camasTotales: 40,
    telefono: "55 0001-XXXX",
    especialidad: ["Quemaduras", "Cirugía reconstructiva", "Pediatría"],
  },
  {
    id: "2",
    nombre: "H. Traumatología IMSS",
    nombreCompleto: "Hospital de Traumatología Victorio de la Fuente Narváez",
    lat: 19.4823,
    lng: -99.1187,
    camasDisponibles: 5,
    camasTotales: 30,
    telefono: "55 0002-XXXX",
    especialidad: ["Quemaduras", "Traumatología"],
  },
  {
    id: "3",
    nombre: "H. Pediátrico Tacubaya",
    nombreCompleto: "Hospital Pediátrico de Tacubaya",
    lat: 19.4002,
    lng: -99.1893,
    camasDisponibles: 2,
    camasTotales: 15,
    telefono: "55 0003-XXXX",
    especialidad: ["Pediatría", "Quemaduras pediátricas"],
  },
  {
    id: "4",
    nombre: "H. Civil Guadalajara",
    nombreCompleto: "Hospital Civil de Guadalajara Fray Antonio Alcalde",
    lat: 20.6803,
    lng: -103.3474,
    camasDisponibles: 4,
    camasTotales: 25,
    telefono: "33 3942-4400",
    especialidad: ["Quemaduras", "Cirugía plástica"],
  },
  {
    id: "5",
    nombre: "H. General de México",
    nombreCompleto: "Hospital General de México Dr. Eduardo Liceaga",
    lat: 19.4113,
    lng: -99.1526,
    camasDisponibles: 1,
    camasTotales: 20,
    telefono: "55 2789-2000",
    especialidad: ["Quemaduras", "Cirugía reconstructiva"],
  },
  {
    id: "6",
    nombre: "H. Infantil Federico Gómez",
    nombreCompleto: "Hospital Infantil de México Federico Gómez",
    lat: 19.4218,
    lng: -99.1521,
    camasDisponibles: 0,
    camasTotales: 10,
    telefono: "55 5228-9917",
    especialidad: ["Pediatría", "Cirugía pediátrica"],
  },
  {
    id: "7",
    nombre: "H. para el Niño (IMIEM)",
    nombreCompleto: "Hospital para el Niño IMIEM",
    lat: 19.2925,
    lng: -99.6532,
    camasDisponibles: 3,
    camasTotales: 18,
    telefono: "722 217-5637",
    especialidad: ["Pediatría", "Quemaduras pediátricas"],
  },
  {
    id: "8",
    nombre: "Shriners Galveston",
    nombreCompleto: "Shriners Children's — Galveston (Internacional)",
    lat: 29.3105,
    lng: -94.7724,
    camasDisponibles: 5,
    camasTotales: 30,
    telefono: "+1 409-770-6600",
    especialidad: ["Quemaduras pediátricas", "Investigación"],
  },
];

// Ubicación simulada del paciente actual (CDMX centro)
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

export function MapaHospitales() {
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

  return (
    <div className="relative z-0 isolate h-72 w-full overflow-hidden rounded-lg border border-navy-200 md:h-80" role="img" aria-label="Mapa interactivo de la red hospitalaria. Muestra 8 hospitales especializados en quemaduras en México: CENIAQ con 3 camas disponibles, Hospital de Traumatología IMSS con 5 camas, Hospital Pediátrico Tacubaya con 2 camas, Hospital Civil Guadalajara con 4 camas, Hospital General de México con 1 cama, Hospital Infantil Federico Gómez sin camas, Hospital para el Niño IMIEM con 3 camas, y Shriners Galveston con 5 camas. También muestra la ubicación actual del paciente en Ciudad de México.">
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
        {hospitalesConCoordenadas.map((hospital) => (
          <Marker
            key={hospital.id}
            position={[hospital.lat, hospital.lng]}
            icon={crearIcono(hospital.camasDisponibles)}
          >
            <Popup>
              <div style={{ minWidth: 180 }}>
                <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{hospital.nombre}</p>
                <p style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>{hospital.nombreCompleto}</p>
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
