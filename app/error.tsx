"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("SiBersih Global Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-sibersih-bg flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white dark:bg-[#161b22] p-8 rounded-2xl border border-sibersih-primary/10 dark:border-white/10 shadow-sm space-y-6">
        <div className="w-14 h-14 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle size={28} />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-sibersih-primary dark:text-[#f0f6fc]">
            Terjadi Kendala Sistem
          </h2>
          <p className="text-sm text-sibersih-primary/70 dark:text-[#8b949e] leading-relaxed">
            Terjadi gangguan saat memuat data dari server. Silakan coba muat ulang atau kembali ke beranda.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-sibersih-primary dark:bg-[#238636] hover:bg-sibersih-primary/90 text-white rounded-xl font-medium text-sm transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <RotateCcw size={16} /> Coba Lagi
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-sibersih-primary dark:text-[#f0f6fc] rounded-xl font-medium text-sm transition-all"
          >
            <Home size={16} /> Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
