"use client";

import { useState, useEffect, useActionState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { setPasswordDirectAction } from "@/app/actions/user";
import { SubmitButton } from "./SubmitButton";
import { KeyRound, Eye, EyeOff, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

function SetPasswordModalContent() {
  const searchParams = useSearchParams();
  const [dismissed, setDismissed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction] = useActionState(setPasswordDirectAction, undefined);

  const isOpen = !dismissed && searchParams.get("auth_provider") === "google";

  const handleClose = () => {
    setDismissed(true);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("auth_provider");
      window.history.replaceState(
        {},
        "",
        url.pathname + (url.searchParams.toString() ? `?${url.searchParams.toString()}` : "")
      );
    }
  };

  useEffect(() => {
    if (state?.success) {
      toast.success(state.success);
      const timer = setTimeout(() => {
        handleClose();
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [state?.success]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-sibersih-primary/10 shadow-xl max-w-md w-full p-6 sm:p-7 relative animate-in zoom-in-95 duration-200">
        {/* Tombol Tutup */}
        <button
          onClick={handleClose}
          type="button"
          className="absolute top-4 right-4 p-1.5 rounded-full text-sibersih-primary/40 hover:text-sibersih-primary hover:bg-sibersih-primary/5 transition-colors"
          aria-label="Tutup"
        >
          <X size={18} />
        </button>

        {/* Header Modal */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-11 h-11 rounded-xl bg-sibersih-primary/5 text-sibersih-primary flex items-center justify-center shrink-0 border border-sibersih-primary/10">
            <KeyRound className="w-5 h-5 text-sibersih-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-sibersih-primary tracking-tight">
              Atur Kata Sandi (Opsional)
            </h3>
            <p className="text-xs text-sibersih-primary/60">
              Masuk melalui Akun Google
            </p>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-sibersih-primary/70 mb-5 bg-sibersih-primary/5 p-3 rounded-xl border border-sibersih-primary/5">
          Anda dapat membuat kata sandi sekarang agar bisa masuk menggunakan <strong>Email & Sandi</strong> di masa mendatang, atau lewati langkah ini jika hanya ingin masuk lewat Google.
        </p>

        {state?.success ? (
          <div className="py-6 flex flex-col items-center justify-center gap-2 text-center animate-in fade-in">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 animate-bounce" />
            <p className="text-sm font-semibold text-emerald-700">{state.success}</p>
            <p className="text-xs text-sibersih-primary/50">Menutup jendela...</p>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            {/* Input Kata Sandi Baru */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="modalNewPassword" className="block text-xs font-semibold text-sibersih-primary/80">
                Kata Sandi Baru
              </label>
              <div className="relative flex items-center">
                <input
                  id="modalNewPassword"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 6 karakter"
                  required
                  minLength={6}
                  className="flex h-11 w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-3.5 pr-10 py-2 text-sm text-sibersih-primary placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sibersih-primary/20 focus-visible:border-sibersih-primary focus-visible:bg-white transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-sibersih-primary/40 hover:text-sibersih-primary transition-colors"
                  aria-label="Tampilkan sandi"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Input Konfirmasi Kata Sandi */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="modalConfirmPassword" className="block text-xs font-semibold text-sibersih-primary/80">
                Konfirmasi Kata Sandi Baru
              </label>
              <input
                id="modalConfirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Ulangi kata sandi baru"
                required
                minLength={6}
                className="flex h-11 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-sm text-sibersih-primary placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sibersih-primary/20 focus-visible:border-sibersih-primary focus-visible:bg-white transition-all duration-200"
              />
            </div>

            {state?.error && (
              <div className="p-2.5 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 animate-in fade-in">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                <span>{state.error}</span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 h-11 rounded-full border border-sibersih-primary/15 text-sibersih-primary/70 hover:text-sibersih-primary hover:bg-sibersih-primary/5 text-xs font-semibold transition-colors duration-200 cursor-pointer"
              >
                Nanti Saja / Lewati
              </button>
              <SubmitButton className="flex-1 h-11 rounded-full text-xs font-semibold shadow-xs">
                Simpan Sandi
              </SubmitButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function SetPasswordModal() {
  return (
    <Suspense fallback={null}>
      <SetPasswordModalContent />
    </Suspense>
  );
}
