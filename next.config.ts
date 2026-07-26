import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Desactiva el header X-Powered-By que revela que el servidor es Next.js
  poweredByHeader: false,

  async headers() {
    return [
      {
        // Se aplica a TODO, no solo a las páginas HTML.
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive, nosnippet, noimageindex",
          },
          // Evita que el contenido se interprete con un tipo distinto al declarado.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // No filtrar la URL del túnel a sitios externos vía cabecera Referer.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Impide que la app sea embebida en un iframe de otro dominio (anti-clickjacking).
          { key: "X-Frame-Options", value: "DENY" },
          // Fuerza HTTPS durante 1 año (aplica cuando se despliega con TLS).
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          // Bloquea APIs del navegador que no se usan (reduce superficie de ataque).
          { key: "Permissions-Policy", value: "camera=(self), microphone=(), usb=(), payment=()" },
          // Content-Security-Policy.
          //
          // `unsafe-inline` y `unsafe-eval` en script-src son necesarios para el
          // runtime de Next.js, que inyecta scripts inline para la hidratación.
          // Debilitan la protección contra XSS, así que la defensa principal
          // sigue siendo que React escapa todo el contenido por defecto y que en
          // el código no hay dangerouslySetInnerHTML, eval ni innerHTML.
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              // data: y blob: se necesitan para las fotos capturadas con la
              // cámara, que se manejan en memoria antes de enviarse.
              "img-src 'self' data: blob: https://*.tile.openstreetmap.org",
              "font-src 'self'",
              "media-src 'self' blob:",
              "connect-src 'self' https://*.tile.openstreetmap.org",
              "frame-src 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              // Equivalente moderno de X-Frame-Options. Se declara además del
              // header porque CSP tiene precedencia en navegadores actuales y
              // X-Frame-Options no cubre todos los casos de anidamiento.
              "frame-ancestors 'none'",
              // Promueve cualquier subrecurso http:// a https:// en lugar de
              // bloquearlo, evitando contenido mixto.
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
      {
        // Las respuestas de la API no deben quedar en caché.
        //
        // /api/ocr devuelve datos extraídos de un documento de identidad. Sin
        // esta cabecera, un proxy intermedio o la caché del navegador podría
        // conservar la respuesta y servirla a otra persona en un equipo
        // compartido, que es justo el escenario de un puesto de urgencias.
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, max-age=0" },
          { key: "Pragma", value: "no-cache" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};

export default nextConfig;
