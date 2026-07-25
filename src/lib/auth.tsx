"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Rol = "admin" | "coordinador" | "familiar" | "hospital";

export interface Usuario {
  nombre: string;
  rol: Rol;
  email: string;
  avatar: string; // iniciales
}

// Credenciales de prueba — NO son seguridad real, solo para demo
const CREDENCIALES: Record<string, { password: string; usuario: Usuario }> = {
  admin: {
    password: "admin",
    usuario: {
      nombre: "Carlos Pérez",
      rol: "admin",
      email: "admin@womenciso-menciso.org",
      avatar: "CP",
    },
  },
  coord: {
    password: "coord",
    usuario: {
      nombre: "María López",
      rol: "coordinador",
      email: "coord@womenciso-menciso.org",
      avatar: "ML",
    },
  },
  familia: {
    password: "familia",
    usuario: {
      nombre: "Ana García",
      rol: "familiar",
      email: "ana.garcia@email.com",
      avatar: "AG",
    },
  },
  hospital: {
    password: "hospital",
    usuario: {
      nombre: "Dr. Ramírez",
      rol: "hospital",
      email: "urgencias@ceniaq.gob.mx",
      avatar: "DR",
    },
  },
};

interface AuthContextType {
  usuario: Usuario | null;
  login: (user: string, pass: string) => string | null; // null = éxito, string = error
  logout: () => void;
  cargando: boolean;
}

const AuthContext = createContext<AuthContextType>({
  usuario: null,
  login: () => "No inicializado",
  logout: () => {},
  cargando: true,
});

const AUTH_STORAGE_KEY = "womenciso-menciso-sesion";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  // Restaurar sesión al cargar
  useEffect(() => {
    try {
      const guardado = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (guardado) {
        setUsuario(JSON.parse(guardado));
      }
    } catch {
      // sesión corrupta, se ignora
    } finally {
      setCargando(false);
    }
  }, []);

  const login = (user: string, pass: string): string | null => {
    const cred = CREDENCIALES[user.toLowerCase().trim()];
    if (!cred) return "Usuario no encontrado";
    if (cred.password !== pass) return "Contraseña incorrecta";
    setUsuario(cred.usuario);
    try {
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(cred.usuario));
    } catch { /* no crítico */ }
    return null;
  };

  const logout = () => {
    setUsuario(null);
    try {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch { /* no crítico */ }
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, cargando }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// Helper: qué rutas puede ver cada rol
export function getRutasPorRol(rol: Rol) {
  switch (rol) {
    case "admin":
      return [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Emergencias", href: "/emergencias" },
        { name: "Pacientes", href: "/pacientes" },
        { name: "Hospitales", href: "/hospitales" },
        { name: "Expedientes", href: "/expedientes" },
        { name: "Seguimiento", href: "/seguimiento" },
        { name: "Psicología", href: "/psicologia" },
        { name: "Rehabilitación", href: "/rehabilitacion" },
        { name: "Defensa Legal", href: "/defensa-legal" },
        { name: "Prevención", href: "/prevencion" },
        { name: "Testimonios", href: "/testimonios" },
        { name: "Donaciones", href: "/donaciones" },
        { name: "Costos", href: "/costos" },
      ];
    case "coordinador":
      return [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Emergencias", href: "/emergencias" },
        { name: "Pacientes", href: "/pacientes" },
        { name: "Hospitales", href: "/hospitales" },
        { name: "Seguimiento", href: "/seguimiento" },
        { name: "Rehabilitación", href: "/rehabilitacion" },
        { name: "Defensa Legal", href: "/defensa-legal" },
        { name: "Prevención", href: "/prevencion" },
      ];
    case "familiar":
      return [
        { name: "Mi Expediente", href: "/mi-expediente" },
        { name: "Seguimiento", href: "/seguimiento" },
        { name: "Rehabilitación", href: "/rehabilitacion" },
        { name: "Defensa Legal", href: "/defensa-legal" },
        { name: "Prevención", href: "/prevencion" },
        { name: "Testimonios", href: "/testimonios" },
        { name: "Donaciones", href: "/donaciones" },
      ];
    case "hospital":
      return [
        { name: "Emergencias", href: "/emergencias" },
        { name: "Pacientes Canalizados", href: "/pacientes" },
        { name: "Camas", href: "/hospitales" },
      ];
  }
}

// Helper: ruta de inicio por rol
export function getRutaInicio(rol: Rol): string {
  switch (rol) {
    case "admin": return "/dashboard";
    case "coordinador": return "/dashboard";
    case "familiar": return "/mi-expediente";
    case "hospital": return "/emergencias";
  }
}
