import { MapPin, User, Check, X } from "lucide-react";

export default function PimpinanDashboard() {
    const butuhApproval = [
        { id: "1", lokasi: "Belakang Gedung Dekanat FT", pelapor: "Andi (Mahasiswa)", petugas: "Pak Joko" }
    ];

    return (
        <div className="pb-32 pt-8 min-h-screen bg-zinc-50 flex flex-col max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <header className="mb-8 border-b border-zinc-200 pb-4">
                <h1 className="text-2xl font-semibold text-zinc-900">Validasi Pekerjaan</h1>
                <p className="text-sm text-zinc-500 mt-1">Laporan yang membutuhkan persetujuan Anda</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {butuhApproval.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
                        <div className="p-5 border-b border-zinc-100 flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-lg text-zinc-900 mb-2">
                                    {item.lokasi}
                                </h3>
                                <div className="flex flex-col gap-1 mt-2">
                                    <p className="text-sm text-zinc-600 flex items-start sm:items-center gap-2">
                                        <User size={14} className="text-zinc-400 mt-0.5 sm:mt-0 shrink-0" />
                                        <span className="text-zinc-500 w-20 shrink-0">Dilaporkan:</span>
                                        <span className="font-medium text-zinc-900 break-words">{item.pelapor}</span>
                                    </p>
                                    <p className="text-sm text-zinc-600 flex items-start sm:items-center gap-2">
                                        <User size={14} className="text-zinc-400 mt-0.5 sm:mt-0 shrink-0" />
                                        <span className="text-zinc-500 w-20 shrink-0">Petugas:</span>
                                        <span className="font-medium text-zinc-900 break-words">{item.petugas}</span>
                                    </p>
                                </div>
                            </div>
                            <span className="inline-flex items-center text-xs font-semibold text-orange-700 bg-orange-100 px-2.5 py-1 rounded">
                                Menunggu Review
                            </span>
                        </div>

                        {/* Komparasi Foto Sebelum vs Sesudah */}
                        <div className="p-5 grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Kondisi Awal</span>
                                <div className="w-full h-32 bg-zinc-100 border border-zinc-200 rounded-lg flex items-center justify-center text-sm text-zinc-500">
                                    [Foto Awal]
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Hasil Kerja</span>
                                <div className="w-full h-32 bg-zinc-100 border border-zinc-200 rounded-lg flex items-center justify-center text-sm text-zinc-500">
                                    [Foto Bukti]
                                </div>
                            </div>
                        </div>

                        {/* Tombol Aksi Pimpinan */}
                        <div className="p-5 bg-zinc-50/50 border-t border-zinc-100 flex gap-3">
                            <button className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                                <Check size={16} /> Setujui
                            </button>
                            <button className="px-6 bg-white hover:bg-zinc-50 text-red-600 font-medium py-2.5 rounded-lg border border-zinc-300 transition-colors flex items-center justify-center gap-2 text-sm">
                                <X size={16} /> Tolak
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}