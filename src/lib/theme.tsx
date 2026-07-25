"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Tema = "light" | "dark";

interface ThemeContextType {
  tema: Tema;
  toggleTema: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  tema: "light",
  toggleTema: () => {},
});

const THEME_STORAGE_KEY = "womenciso-tema";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>("light");
  const [montado, setMontado] = useState(false);

  // Restaurar tema guardado
  useEffect(() => {
    try {
      const guardado = localStorage.getItem(THEME_STORAGE_KEY) as Tema | null;
      if (guardado === "dark" || guardado === "light") {
        setTema(guardado);
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setTema("dark");
      }
    } catch {
      // localStorage puede no estar disponible
    }
    setMontado(true);
  }, []);

  // Aplicar clase al HTML
  useEffect(() => {
    if (!montado) return;
    const root = document.documentElement;
    if (tema === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, tema);
    } catch {
      // no crítico
    }
  }, [tema, montado]);

  const toggleTema = () => {
    setTema((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ tema, toggleTema }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTema() {
  return useContext(ThemeContext);
}
