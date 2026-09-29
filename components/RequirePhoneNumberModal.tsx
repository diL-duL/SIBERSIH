"use client";

import { useState, useEffect, useActionState } from "react";
import { savePhoneNumberAction } from "@/app/actions/user";
import { SubmitButton } from "./SubmitButton";
import { Phone, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface RequirePhoneNumberModalProps {
  isOpen: boolean;
}

export default function RequirePhoneNumberModal({ isOpen }: RequirePhoneNumberModalProps) {
  const [closed, setClosed] = useState(false);
  const [state, formAction] = useActionState(savePhoneNumberAction, undefined);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.success);
      const timer = setTimeout(() => {
        setClosed(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [state?.success]);

  if (!isOpen || closed) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 relative">
        
        {/* Header Modal */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-sibersih-primary/10 text-sibersih-primary flex items-center justify-center shrink-0 border border-sibersih-primary/15">
            <Phone size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Lengkapi Nomor Handphone
            </h3>
            <p className="text-xs text-slate-500">
              Diperlukan untuk konfirmasi &amp; koordinasi pelaporan
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 bg-slate-50 border border-slate-200/80 rounded-lg p-3 mb-4 leading-relaxed">
          Mohon masukkan <strong>nomor HP/WhatsApp aktif</strong> Anda. Nomor ini digunakan petugas untuk verifikasi lokasi dan pembaruan tindak lanjut laporan.
        </p>

        {state?.success ? (
          <div className="py-6 flex flex-col items-center justify-center gap-2 text-center animate-in fade-in">
            <CheckCircle2 className="w-9 h-9 text-emerald-600" />
            <p className="text-sm font-semibold text-emerald-800">{state.success}</p>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label htmlFor="modalNomorHp" className="block text-xs font-semibold text-slate-700">
                Nomor HP / WhatsApp Aktif <span className="text-red-500">*</span>
              </label>
              <input
                id="modalNomorHp"
                name="nomorHp"
                type="tel"
                placeholder="Contoh: 081234567890"
                required
                autoFocus
                pattern="^(\+62|62|0)8[0-9]{8,12}$"
                className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sibersih-primary/20 focus-visible:border-sibersih-primary transition-all"
              />
              <p className="text-[11px] text-slate-500">
                Format: 08xx atau +628xx (10 - 15 digit angka).
              </p>
            </div>

            {state?.error && (
              <div className="p-2.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
                {state.error}
              </div>
            )}

            <div className="pt-1">
              <SubmitButton className="w-full h-10 rounded-lg text-xs font-semibold shadow-xs">
                Simpan &amp; Lanjutkan
              </SubmitButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
