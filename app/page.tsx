import Link from "next/link";
import { User, ShieldCheck, Briefcase } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-zinc-50 px-6 pt-20 pb-40">
      <div className="max-w-xl w-full flex flex-col items-center text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-zinc-900 rounded-xl mb-6">
          <ShieldCheck size={28} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-3">
          SiBersih
        </h1>
        <p className="text-base text-zinc-500 font-medium">
          Sistem Informasi Kebersihan yang transparan dan efisien. Silakan pilih peran Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mb-20">
        {/* Card Pelapor */}
        <Link href="/reporter" className="flex flex-col items-center p-6 bg-white rounded-xl border border-zinc-200 hover:border-zinc-400 transition-colors shadow-sm">
          <div className="w-12 h-12 rounded-lg bg-zinc-100 flex items-center justify-center mb-4">
            <User size={24} className="text-zinc-700" />
          </div>
          <h2 className="text-lg font-semibold text-zinc-900 mb-1">Pelapor</h2>
          <p className="text-xs text-zinc-500 text-center">Laporkan masalah kebersihan</p>
        </Link>

        {/* Card Petugas */}
        <Link href="/staff" className="flex flex-col items-center p-6 bg-white rounded-xl border border-zinc-200 hover:border-zinc-400 transition-colors shadow-sm">
          <div className="w-12 h-12 rounded-lg bg-zinc-100 flex items-center justify-center mb-4">
            <Briefcase size={24} className="text-zinc-700" />
          </div>
          <h2 className="text-lg font-semibold text-zinc-900 mb-1">Petugas</h2>
          <p className="text-xs text-zinc-500 text-center">Lihat dan kerjakan tugas</p>
        </Link>

        {/* Card Pimpinan */}
        <Link href="/executive" className="flex flex-col items-center p-6 bg-white rounded-xl border border-zinc-200 hover:border-zinc-400 transition-colors shadow-sm">
          <div className="w-12 h-12 rounded-lg bg-zinc-100 flex items-center justify-center mb-4">
            <ShieldCheck size={24} className="text-zinc-700" />
          </div>
          <h2 className="text-lg font-semibold text-zinc-900 mb-1">Pimpinan</h2>
          <p className="text-xs text-zinc-500 text-center">Validasi kinerja</p>
        </Link>
      </div>
    </div>
  );
}
