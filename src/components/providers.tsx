"use client";

import { AuthProvider } from "@/lib/auth";
import { VozProvider } from "@/components/lector-voz";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <VozProvider>{children}</VozProvider>
    </AuthProvider>
  );
}
