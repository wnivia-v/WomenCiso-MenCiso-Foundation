import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Se aplica a TODO, no solo a las páginas HTML.
        // La metadata `robots` de `layout.tsx` solo cubre el HTML; esta cabecera
        // cubre además las imágenes y los assets estáticos, para que el logo y
        // las capturas no queden indexados por separado mientras la app se
        // comparte por un túnel público temporal.
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive, nosnippet, noimageindex",
          },
          // Evita que el contenido se interprete con un tipo distinto al declarado.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // No filtrar la URL del túnel a sitios externos vía cabecera Referer.
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
    ];
  },
};

export default nextConfig;
