"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth, getRutasPorRol, type Rol } from "@/lib/auth";
import {
  AlertTriangle,
  Users,
  Building2,
  FileText,
  Heart,
  Brain,
  DollarSign,
  LayoutDashboard,
  X,
  LogOut,
  Zap,
  GraduationCap,
  Briefcase,
  Scale,
  ShieldCheck,
  HandHeart,
  MessageCircle,
} from "lucide-react";

const iconosPorRuta: Record<string, typeof LayoutDashboard> = {
  "/dashboard": LayoutDashboard,
  "/emergencias": AlertTriangle,
  "/pacientes": Users,
  "/hospitales": Building2,
  "/expedientes": FileText,
  "/seguimiento": Heart,
  "/psicologia": Brain,
  "/costos": DollarSign,
  "/rehabilitacion": GraduationCap,
  "/mi-expediente": Briefcase,
  "/defensa-legal": Scale,
  "/prevencion": ShieldCheck,
  "/testimonios": MessageCircle,
  "/donaciones": HandHeart,
};

const rolLabels: Record<Rol, { label: string; color: string }> = {
  admin: { label: "Administrador", color: "bg-purple-100 text-purple-700" },
  coordinador: { label: "Coordinador", color: "bg-blue-100 text-blue-700" },
  familiar: { label: "Familiar", color: "bg-green-100 text-green-700" },
  hospital: { label: "Hospital", color: "bg-orange-100 text-orange-700" },
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { usuario, logout } = useAuth();

  const rutas = usuario ? getRutasPorRol(usuario.rol) : [];
  const rolInfo = usuario ? rolLabels[usuario.rol] : null;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white border-r border-gray-200 shadow-lg transition-transform duration-300 ease-in-out md:w-64 md:translate-x-0 md:shadow-sm",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="navigation"
        aria-label="Menú principal de navegación"
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4">
          <div className="flex items-center gap-2.5">
            <div className="relative h-9 w-9 shrink-0">
              <Image
                src="/logo-womenciso-menciso-icon.png"
                alt="WomenCiso y MenCiso Foundation"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-sm font-bold text-navy-800">WomenCiso y MenCiso</h1>
              <p className="text-[10px] text-navy-500">Sistema de Atención</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 md:hidden"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Badge de rol */}
        {rolInfo && (
          <div className="px-4 pt-3 pb-1">
            <span className={cn("inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold", rolInfo.color)}>
              {rolInfo.label}
            </span>
          </div>
        )}

        {/* Botones de Triage - solo admin y coordinador */}
        {usuario && (usuario.rol === "admin" || usuario.rol === "coordinador") && (
          <div className="px-3 pt-3 pb-2 space-y-2">
            <Link
              href="/emergencias/nueva"
              onClick={onClose}
              className="flex items-center gap-2.5 rounded-xl bg-red-600 px-4 py-2.5 text-white shadow-md transition-all hover:bg-red-700 hover:shadow-lg active:scale-[0.98]"
            >
              <Zap className="h-4 w-4" />
              <span className="text-sm font-bold">Triage Rápido</span>
            </Link>
            <Link
              href="/emergencias/extrema"
              onClick={onClose}
              className="flex items-center gap-2.5 rounded-xl bg-red-800 px-4 py-2.5 text-white shadow-md transition-all hover:bg-red-900 hover:shadow-lg active:scale-[0.98]"
            >
              <AlertTriangle className="h-4 w-4 animate-pulse" />
              <span className="text-sm font-bold">Emergencia Extrema</span>
            </Link>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Módulos
          </p>
          {rutas.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = iconosPorRuta[item.href] || LayoutDashboard;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-navy-800 text-white shadow-sm"
                    : "text-navy-700 hover:bg-gray-100 hover:text-navy-900 active:bg-gray-200"
                )}
              >
                <Icon
                  className={cn(
                    "h-[18px] w-[18px] shrink-0",
                    isActive ? "text-gold-400" : "text-navy-500"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer con usuario */}
        <div className="border-t border-gray-100 p-3">
          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-800">
                <span className="text-xs font-bold text-gold-400">{usuario?.avatar || "?"}</span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-navy-800">{usuario?.nombre || "Usuario"}</p>
                <p className="truncate text-[10px] text-gray-500">{usuario?.email || ""}</p>
              </div>
            </div>
            <button
              onClick={() => { logout(); onClose(); router.push("/"); }}
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-200 hover:text-navy-700"
              aria-label="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
