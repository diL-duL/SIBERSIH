"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#ffffff",
          color: "#1F4B2C",
          border: "1px solid rgba(31, 75, 44, 0.15)",
          borderRadius: "12px",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
        },
      }}
    />
  );
}
