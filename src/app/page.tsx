"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Shield, Heart, Clock, Building2, ArrowRight, AlertTriangle, LogIn } from "lucide-react";
import { useAuth, getRutaInicio } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ControlesUI } from "@/components/controles-ui";

const rolesRapidos = [
  { user: "admin", pass: "admin", label: "Administrador", emoji: "👑", desc: "Todo el sistema" },
  { user: "coord", pass: "coord", label: "Coordinador", emoji: "👩‍💼", desc: "Triage y pacientes" },
  { user: "familia", pass: "familia", label: "Familiar", emoji: "👨‍👩‍👧", desc: "Mi expediente" },
  { user: "hospital", pass: "hospital", label: "Hospital", emoji: "🏥", desc: "Emergencias canalizadas" },
];

export default function LoginPage() {
  const router = useRouter();
  const { usuario, login, cargando } = useAuth();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Si ya hay sesión activa, redirigir al dashboard correspondiente
  useEffect(() => {
    if (!cargando && usuario) {
      router.push(getRutaInicio(usuario.rol));
    }
  }, [usuario, cargando, router]);

  const handleLogin = (u: string, p: string) => {
    setError("");
    setLoading(true);
    // Pequeña pausa visual para que se sienta que "procesa"
    setTimeout(() => {
      const err = login(u, p);
      if (err) {
        setError(err);
        setLoading(false);
      } else {
        // El useEffect de arriba detecta el cambio y redirige
      }
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(user, pass);
  };

  if (cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-navy-200 border-t-navy-800" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Panel izquierdo - Branding */}
      <div className="relative flex flex-col justify-between bg-navy-800 px-6 py-8 lg:w-1/2 lg:px-12 lg:py-12">
        <div className="absolute inset-0 opacity-20">
          <Image src="/bg-banner.jpg" alt="" fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-navy-800/70" />

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 lg:h-16 lg:w-16">
                <Image
                  src="/logo-womenciso-menciso-icon.png"
                  alt="WomenCiso y MenCiso Foundation"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white lg:text-xl">WomenCiso y MenCiso Foundation</h1>
                <p className="text-xs text-gold-400 lg:text-sm">Tecnología y ciberseguridad al servicio humanitario</p>
              </div>
            </div>
            {/* Controles de tema e idioma */}
            <div className="shrink-0">
              <ControlesUI variante="claro" />
            </div>
          </div>

          <div className="mt-10 hidden lg:block">
            <h2 className="text-3xl font-bold leading-tight text-white">
              Sistema Integral de<br />
              <span className="text-gold-400">Atención a Quemados</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-navy-200">
              Plataforma de triage, canalización hospitalaria y seguimiento
              para niños y adolescentes con quemaduras.
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-8 hidden grid-cols-2 gap-4 lg:grid">
          <div className="rounded-xl bg-navy-700/50 p-4 backdrop-blur">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-gold-400" />
              <span className="text-2xl font-bold text-white">146+</span>
            </div>
            <p className="mt-1 text-xs text-navy-300">Pacientes atendidos</p>
          </div>
          <div className="rounded-xl bg-navy-700/50 p-4 backdrop-blur">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-gold-400" />
              <span className="text-2xl font-bold text-white">8</span>
            </div>
            <p className="mt-1 text-xs text-navy-300">Hospitales conectados</p>
          </div>
          <div className="rounded-xl bg-navy-700/50 p-4 backdrop-blur">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gold-400" />
              <span className="text-2xl font-bold text-white">&lt;5 min</span>
            </div>
            <p className="mt-1 text-xs text-navy-300">Triage promedio</p>
          </div>
          <div className="rounded-xl bg-navy-700/50 p-4 backdrop-blur">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-gold-400" />
              <span className="text-2xl font-bold text-white">23K+</span>
            </div>
            <p className="mt-1 text-xs text-navy-300">Beneficiados prevención</p>
          </div>
        </div>

        <div className="relative z-10 mt-4 lg:hidden">
          <p className="text-sm text-navy-200">Sistema de triage y canalización para pacientes con quemaduras</p>
        </div>
      </div>

      {/* Panel derecho - Login */}
      <div className="flex flex-1 flex-col justify-center px-6 py-10 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-6 flex justify-center lg:hidden">
            <Image
              src="/logo-womenciso-menciso-icon.png"
              alt="WomenCiso y MenCiso Foundation"
              width={56}
              height={56}
            />
          </div>

          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-navy-800">Iniciar Sesión</h2>
            <p className="mt-1 text-sm text-navy-500">Ingrese sus credenciales</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Usuario"
              placeholder="admin, coord, familia, hospital"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              autoComplete="username"
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              autoComplete="current-password"
            />
            {error && (
              <p className="rounded-lg bg-red-50 p-2 text-xs font-medium text-red-700">{error}</p>
            )}
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Ingresando...
                </span>
              ) : (
                <>
                  <LogIn className="mr-1.5 h-4 w-4" /> Ingresar
                </>
              )}
            </Button>
          </form>

          {/* Acceso rápido por rol */}
          <div className="mt-6 rounded-xl border border-navy-100 bg-navy-50/50 p-4">
            <p className="text-xs font-medium text-navy-600 mb-3">Acceso rápido (demo):</p>
            <div className="grid grid-cols-2 gap-2">
              {rolesRapidos.map((r) => (
                <button
                  key={r.user}
                  onClick={() => handleLogin(r.user, r.pass)}
                  disabled={loading}
                  className="rounded-lg border border-navy-200 bg-white px-3 py-2.5 text-left transition-colors hover:border-gold-400 hover:bg-gold-50 active:scale-95 disabled:opacity-50"
                >
                  <span className="text-sm font-medium text-navy-700">{r.emoji} {r.label}</span>
                  <p className="text-[10px] text-navy-400">{r.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Triage de emergencia - acceso sin login */}
          <div className="mt-4 space-y-2">
            <button
              onClick={() => router.push("/emergencias/nueva")}
              className="flex w-full items-center gap-3 rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-left transition-all hover:border-red-400 hover:bg-red-100 active:scale-[0.98]"
            >
              <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-800">🚨 Triage Rápido</p>
                <p className="text-[10px] text-red-600">Formulario completo de 5 pasos — no requiere cuenta</p>
              </div>
            </button>
            <button
              onClick={() => router.push("/emergencias/extrema")}
              className="flex w-full items-center gap-3 rounded-xl border-2 border-red-400 bg-red-600 px-4 py-3 text-left transition-all hover:bg-red-700 active:scale-[0.98]"
            >
              <AlertTriangle className="h-5 w-5 text-white shrink-0 animate-pulse" />
              <div>
                <p className="text-sm font-bold text-white">⚡ EMERGENCIA EXTREMA</p>
                <p className="text-[10px] text-red-100">Solo datos mínimos — canalizar en segundos</p>
              </div>
            </button>
          </div>

          <div className="mt-6 space-y-2 text-center">
            {/* Enlaces legales */}
            <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[10px]">
              <Link
                href="/legal/privacidad"
                className="text-navy-500 underline decoration-navy-200 underline-offset-2 transition-colors hover:text-navy-700"
              >
                Aviso de Privacidad
              </Link>
              <span className="text-navy-300">·</span>
              <Link
                href="/legal/cookies"
                className="text-navy-500 underline decoration-navy-200 underline-offset-2 transition-colors hover:text-navy-700"
              >
                Cookies
              </Link>
              <span className="text-navy-300">·</span>
              <Link
                href="/legal/terminos"
                className="text-navy-500 underline decoration-navy-200 underline-offset-2 transition-colors hover:text-navy-700"
              >
                Términos de Uso
              </Link>
            </div>

            <div>
              <p className="text-xs text-navy-400">
                &copy; 2026 Wladimir Nivia — Todos los derechos reservados
              </p>
              <p className="mt-0.5 text-[10px] text-navy-400">
                Hackathon IA Masivo Online AWS · codigofacilito.com · Kiro + AWS
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
