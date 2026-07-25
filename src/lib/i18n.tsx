"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Idioma = "es" | "en";

interface I18nContextType {
  idioma: Idioma;
  setIdioma: (idioma: Idioma) => void;
  toggleIdioma: () => void;
  t: (clave: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  idioma: "es",
  setIdioma: () => {},
  toggleIdioma: () => {},
  t: (clave) => clave,
});

const IDIOMA_STORAGE_KEY = "womenciso-idioma";

// Traducciones principales de la interfaz
const traducciones: Record<string, Record<Idioma, string>> = {
  // Navegación
  "nav.dashboard": { es: "Panel de Control", en: "Dashboard" },
  "nav.emergencias": { es: "Emergencias", en: "Emergencies" },
  "nav.pacientes": { es: "Pacientes", en: "Patients" },
  "nav.hospitales": { es: "Hospitales", en: "Hospitals" },
  "nav.expedientes": { es: "Expedientes", en: "Records" },
  "nav.seguimiento": { es: "Seguimiento", en: "Follow-up" },
  "nav.psicologia": { es: "Psicología", en: "Psychology" },
  "nav.rehabilitacion": { es: "Rehabilitación", en: "Rehabilitation" },
  "nav.defensa-legal": { es: "Defensa Legal", en: "Legal Aid" },
  "nav.prevencion": { es: "Prevención", en: "Prevention" },
  "nav.testimonios": { es: "Testimonios", en: "Testimonials" },
  "nav.donaciones": { es: "Donaciones", en: "Donations" },
  "nav.costos": { es: "Costos", en: "Costs" },
  "nav.mi-expediente": { es: "Mi Expediente", en: "My Record" },
  "nav.camas": { es: "Camas", en: "Beds" },
  "nav.pacientes-canalizados": { es: "Pacientes Canalizados", en: "Referred Patients" },

  // Login
  "login.titulo": { es: "Iniciar Sesión", en: "Sign In" },
  "login.credenciales": { es: "Ingrese sus credenciales", en: "Enter your credentials" },
  "login.usuario": { es: "Usuario", en: "Username" },
  "login.contrasena": { es: "Contraseña", en: "Password" },
  "login.ingresar": { es: "Ingresar", en: "Sign In" },
  "login.ingresando": { es: "Ingresando...", en: "Signing in..." },
  "login.acceso-rapido": { es: "Acceso rápido (demo):", en: "Quick access (demo):" },
  "login.administrador": { es: "Administrador", en: "Administrator" },
  "login.coordinador": { es: "Coordinador", en: "Coordinator" },
  "login.familiar": { es: "Familiar", en: "Family Member" },
  "login.hospital": { es: "Hospital", en: "Hospital" },
  "login.todo-sistema": { es: "Todo el sistema", en: "Full system" },
  "login.triage-pacientes": { es: "Triage y pacientes", en: "Triage and patients" },
  "login.mi-expediente": { es: "Mi expediente", en: "My record" },
  "login.emergencias-canalizadas": { es: "Emergencias canalizadas", en: "Referred emergencies" },

  // Triage
  "triage.titulo": { es: "Triage Rápido", en: "Quick Triage" },
  "triage.clasificar": { es: "Clasifique y canalice al paciente", en: "Classify and refer the patient" },
  "triage.quien-reporta": { es: "¿Quién reporta?", en: "Who is reporting?" },
  "triage.datos-paciente": { es: "Datos del Paciente", en: "Patient Data" },
  "triage.datos-quemadura": { es: "Datos de la Quemadura", en: "Burn Data" },
  "triage.ubicacion": { es: "Ubicación", en: "Location" },
  "triage.siguiente": { es: "Siguiente", en: "Next" },
  "triage.anterior": { es: "Previous", en: "Previous" },
  "triage.calcular": { es: "Calcular Triage", en: "Calculate Triage" },
  "triage.emergencia-extrema": { es: "EMERGENCIA EXTREMA", en: "EXTREME EMERGENCY" },
  "triage.rapido": { es: "Triage Rápido", en: "Quick Triage" },
  "triage.sin-cuenta": { es: "Formulario completo de 5 pasos — no requiere cuenta", en: "Complete 5-step form — no account required" },

  // Dashboard
  "dashboard.titulo": { es: "Panel de Control", en: "Dashboard" },
  "dashboard.vista-general": { es: "Vista general — WomenCiso y MenCiso Foundation", en: "Overview — WomenCiso y MenCiso Foundation" },
  "dashboard.pacientes-activos": { es: "Pacientes Activos", en: "Active Patients" },
  "dashboard.emergencias-hoy": { es: "Emergencias Hoy", en: "Emergencies Today" },
  "dashboard.hospitales-conectados": { es: "Hospitales Conectados", en: "Connected Hospitals" },
  "dashboard.en-seguimiento": { es: "En Seguimiento", en: "In Follow-up" },

  // General
  "general.cerrar-sesion": { es: "Cerrar sesión", en: "Sign out" },
  "general.buscar": { es: "Buscar paciente, hospital...", en: "Search patient, hospital..." },
  "general.notificaciones": { es: "Notificaciones", en: "Notifications" },
  "general.modulos": { es: "Módulos", en: "Modules" },
  "general.sistema-atencion": { es: "Sistema de Atención", en: "Care System" },

  // Gravedad
  "gravedad.critico": { es: "CRÍTICO", en: "CRITICAL" },
  "gravedad.grave": { es: "GRAVE", en: "SEVERE" },
  "gravedad.moderado": { es: "MODERADO", en: "MODERATE" },
  "gravedad.leve": { es: "LEVE", en: "MILD" },

  // OCR
  "ocr.titulo": { es: "Llenado rápido con foto de documento", en: "Quick fill from document photo" },
  "ocr.descripcion": { es: "Toma una foto de la CURP, acta de nacimiento o credencial del paciente y los datos se llenarán automáticamente.", en: "Take a photo of the CURP, birth certificate or patient ID and the data will be filled automatically." },
  "ocr.tomar-foto": { es: "Tomar foto del documento", en: "Take document photo" },
  "ocr.extraer": { es: "Extraer datos", en: "Extract data" },
  "ocr.aplicar": { es: "Aplicar al formulario", en: "Apply to form" },
  "ocr.analizando": { es: "Analizando documento...", en: "Analyzing document..." },
  "ocr.exito": { es: "Datos extraídos correctamente", en: "Data extracted successfully" },

  // Tema
  "tema.claro": { es: "Modo claro", en: "Light mode" },
  "tema.oscuro": { es: "Modo oscuro", en: "Dark mode" },
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [idioma, setIdioma] = useState<Idioma>("es");

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(IDIOMA_STORAGE_KEY) as Idioma | null;
      if (guardado === "es" || guardado === "en") {
        setIdioma(guardado);
      }
    } catch {
      // no crítico
    }
  }, []);

  const toggleIdioma = () => {
    setIdioma((prev) => {
      const nuevo = prev === "es" ? "en" : "es";
      try {
        localStorage.setItem(IDIOMA_STORAGE_KEY, nuevo);
      } catch {
        // no crítico
      }
      return nuevo;
    });
  };

  const cambiarIdioma = (nuevoIdioma: Idioma) => {
    setIdioma(nuevoIdioma);
    try {
      localStorage.setItem(IDIOMA_STORAGE_KEY, nuevoIdioma);
    } catch {
      // no crítico
    }
  };

  const t = (clave: string): string => {
    const traduccion = traducciones[clave];
    if (!traduccion) return clave;
    return traduccion[idioma];
  };

  return (
    <I18nContext.Provider value={{ idioma, setIdioma: cambiarIdioma, toggleIdioma, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
