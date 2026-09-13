import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-sibersih-bg flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white dark:bg-[#161b22] p-8 rounded-2xl border border-sibersih-primary/10 dark:border-white/10 shadow-sm space-y-6">
        <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto">
          <FileQuestion size={28} />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-sibersih-primary dark:text-[#f0f6fc]">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-sm text-sibersih-primary/70 dark:text-[#8b949e] leading-relaxed">
            Halaman atau laporan yang Anda tuju tidak tersedia atau telah dipindahkan.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-sibersih-primary dark:bg-[#238636] hover:bg-sibersih-primary/90 text-white rounded-xl font-medium text-sm transition-all shadow-xs"
        >
          <Home size={16} /> Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
