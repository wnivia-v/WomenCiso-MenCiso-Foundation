"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { BotonSOS } from "@/components/boton-sos";
import { ChatEmergencia } from "@/components/chat-emergencia";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip link — invisible visualmente, lo detecta el lector de pantalla al presionar Tab */}
      <a
        href="#contenido-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-navy-800 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
      >
        Saltar al contenido principal
      </a>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="md:pl-64">
        <Header onMenuToggle={() => setSidebarOpen(true)} />
        <main
          id="contenido-principal"
          role="main"
          aria-label="Contenido principal"
          className="p-4 md:p-6"
        >
          {children}
        </main>
      </div>
      <BotonSOS />
      <ChatEmergencia />
    </div>
  );
}
