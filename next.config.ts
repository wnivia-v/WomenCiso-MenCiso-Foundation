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
          // Content-Security-Policy: permite scripts inline (necesarios para Next.js),
          // pero bloquea frames externos, objetos, y restringe conexiones.
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https://*.tile.openstreetmap.org blob:",
              "font-src 'self'",
              "connect-src 'self' https://*.tile.openstreetmap.org",
              "frame-src 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
