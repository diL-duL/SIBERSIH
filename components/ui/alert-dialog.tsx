"use client";

import * as React from "react";
import { Button } from "./button";

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
}

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  variant = "default",
  onConfirm,
  isLoading = false,
}: AlertDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={() => !isLoading && onOpenChange(false)}
      />

      {/* Dialog content */}
      <div className="relative z-50 w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-sibersih-primary/10 animate-in zoom-in-95 duration-150 space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-sibersih-primary">{title}</h2>
          <p className="text-sm text-sibersih-primary/70 leading-relaxed">{description}</p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-sibersih-primary/10">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={variant}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Memproses..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
