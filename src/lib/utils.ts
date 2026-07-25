import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calcula el nivel de gravedad basado en el grado de quemadura y % SCQ
 * Regla de la American Burn Association (ABA) adaptada a pediatría
 */
export function calcularGravedad(
  grado: string,
  superficieCorporal: number,
  zonasAfectadas: string[],
  edadAnios: number
): { nivelGravedad: string; prioridad: string } {
  const zonasEspeciales = ["cara", "manos", "pies", "genitales", "articulaciones", "vias_respiratorias"];
  const tieneZonaEspecial = zonasAfectadas.some((z) => zonasEspeciales.includes(z));
  const esMenorDe5 = edadAnios < 5;

  // Criterios de gravedad basados en ABA
  if (
    grado === "CUARTO_GRADO" ||
    grado === "TERCER_GRADO" && superficieCorporal > 10 ||
    superficieCorporal > 40 ||
    (tieneZonaEspecial && grado !== "PRIMER_GRADO") ||
    zonasAfectadas.includes("vias_respiratorias")
  ) {
    return { nivelGravedad: "CRITICO", prioridad: "CRITICA" };
  }

  if (
    (grado === "SEGUNDO_GRADO_PROFUNDO" && superficieCorporal > 10) ||
    (grado === "TERCER_GRADO" && superficieCorporal <= 10) ||
    superficieCorporal > 20 ||
    (esMenorDe5 && superficieCorporal > 10)
  ) {
    return { nivelGravedad: "GRAVE", prioridad: "ALTA" };
  }

  if (
    (grado === "SEGUNDO_GRADO_SUPERFICIAL" && superficieCorporal > 10) ||
    (grado === "SEGUNDO_GRADO_PROFUNDO" && superficieCorporal <= 10) ||
    (esMenorDe5 && superficieCorporal > 5)
  ) {
    return { nivelGravedad: "MODERADO", prioridad: "MEDIA" };
  }

  return { nivelGravedad: "LEVE", prioridad: "BAJA" };
}

/**
 * Calcula distancia entre dos puntos geográficos (fórmula Haversine)
 * Retorna distancia en kilómetros
 */
export function calcularDistanciaKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Formatea fecha para mostrar en la UI
 */
export function formatearFecha(fecha: Date | string): string {
  const d = new Date(fecha);
  return d.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Calcula edad a partir de fecha de nacimiento
 */
export function calcularEdad(fechaNacimiento: Date | string): number {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}
