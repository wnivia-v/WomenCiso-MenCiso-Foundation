"use client";

import { AuthProvider } from "@/lib/auth";
import { VozProvider } from "@/components/lector-voz";
import { ThemeProvider } from "@/lib/theme";
import { I18nProvider } from "@/lib/i18n";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <I18nProvider>
          <VozProvider>{children}</VozProvider>
        </I18nProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
