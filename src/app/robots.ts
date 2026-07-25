import type { MetadataRoute } from "next";

/**
 * Bloqueo total de rastreadores.
 *
 * Este build se comparte por túnel público temporal para recibir feedback.
 * Sin esto, si alguien enlaza la URL desde cualquier sitio, los buscadores
 * pueden indexar pantallas con nombres de pacientes y diagnósticos que, aunque
 * son inventados, parecen datos clínicos reales.
 *
 * Al pasar a un despliegue real y definitivo, revisar esta regla.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
  };
}
