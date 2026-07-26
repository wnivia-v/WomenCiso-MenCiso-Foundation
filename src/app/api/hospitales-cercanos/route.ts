import { NextRequest, NextResponse } from "next/server";
import { verificarLimite, obtenerIP } from "@/lib/limite-peticiones";

/**
 * API Route: GET /api/hospitales-cercanos?lat=X&lng=Y&radio=200
 *
 * Busca hospitales reales alrededor de una coordenada usando la Overpass API
 * de OpenStreetMap. Devuelve hospitales de cualquier parte del mundo.
 *
 * Overpass API es gratuita, sin API key, y contiene datos de hospitales
 * mapeados por la comunidad global de OpenStreetMap.
 *
 * El radio máximo es 200 km para evitar consultas excesivamente pesadas.
 */

const MAX_RADIO_KM = 200;
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

export async function GET(request: NextRequest) {
  const ip = obtenerIP(request.headers);
  const limite = verificarLimite(ip, 5, 60_000);
  if (!limite.permitido) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes." },
      { status: 429, headers: { "Retry-After": String(limite.reintentarEn) } }
    );
  }

  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") || "");
  const lng = parseFloat(searchParams.get("lng") || "");
  const radioKm = Math.min(parseFloat(searchParams.get("radio") || "50"), MAX_RADIO_KM);

  if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return NextResponse.json({ error: "Coordenadas inválidas." }, { status: 400 });
  }

  const radioMetros = radioKm * 1000;

  // Consulta Overpass: busca nodos y áreas con amenity=hospital en el radio
  const query = `
    [out:json][timeout:15];
    (
      node["amenity"="hospital"](around:${radioMetros},${lat},${lng});
      way["amenity"="hospital"](around:${radioMetros},${lat},${lng});
      relation["amenity"="hospital"](around:${radioMetros},${lat},${lng});
    );
    out center 50;
  `;

  try {
    const response = await fetch(OVERPASS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`,
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      return NextResponse.json({
        success: true,
        hospitales: [],
        error: "Overpass API no respondió correctamente.",
      });
    }

    const data = await response.json();

    const hospitales = (data.elements || [])
      .map((el: {
        id: number;
        lat?: number;
        lon?: number;
        center?: { lat: number; lon: number };
        tags?: Record<string, string>;
      }) => {
        const elLat = el.lat || el.center?.lat;
        const elLng = el.lon || el.center?.lon;
        if (!elLat || !elLng) return null;

        const tags = el.tags || {};
        const nombre = tags.name || tags["name:es"] || tags["name:en"] || "Hospital";

        return {
          id: `osm-${el.id}`,
          nombre,
          direccion: tags["addr:street"]
            ? `${tags["addr:street"]} ${tags["addr:housenumber"] || ""}, ${tags["addr:city"] || ""}`.trim()
            : tags["addr:full"] || tags["addr:city"] || "",
          telefono: tags.phone || tags["contact:phone"] || "",
          web: tags.website || tags["contact:website"] || "",
          emergencia: tags.emergency === "yes" || tags["healthcare:speciality"]?.includes("emergency"),
          latitud: elLat,
          longitud: elLng,
          tipo: tags["healthcare:speciality"] || tags.healthcare || "hospital",
          fuente: "OpenStreetMap",
        };
      })
      .filter(Boolean)
      .slice(0, 50); // Limitar a 50 resultados

    return NextResponse.json({
      success: true,
      hospitales,
      total: hospitales.length,
      centro: { lat, lng },
      radioKm,
    });
  } catch (error) {
    console.error("Error consultando Overpass:", (error as Error).message);
    return NextResponse.json({
      success: true,
      hospitales: [],
      error: "No se pudieron obtener hospitales de la zona.",
    });
  }
}
