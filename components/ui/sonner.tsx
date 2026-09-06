"use client";

import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "next-themes";

export function Toaster() {
  const { resolvedTheme } = useTheme();

  return (
    <SonnerToaster
      position="top-right"
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      toastOptions={{
        className: "rounded-xl border shadow-lg text-sm font-medium",
      }}
    />
  );
}
