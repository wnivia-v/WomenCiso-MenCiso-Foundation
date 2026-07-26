import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { BannerDemo, BannerHackathon } from "@/components/banner-demo";
import { ConsentimientoCookies } from "@/components/consentimiento-cookies";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WomenCiso y MenCiso Foundation - Sistema de Atención a Quemados",
  description:
    "Sistema integral de atención, triage, canalización y seguimiento para pacientes con quemaduras. Una plataforma de WomenCiso y MenCiso Foundation.",
  // Build de demostración: se comparte por túnel público para recibir feedback.
  // Se bloquea la indexación para que la URL temporal no aparezca en buscadores
  // ni quede en caché de resultados con datos que parecen clínicos.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1B2A4A" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/logo-womenciso-menciso-icon.png" />
      </head>
      <body className="min-h-full bg-gray-50">
        <Providers>{children}</Providers>
        <BannerHackathon />
        <BannerDemo />
        <ConsentimientoCookies />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
