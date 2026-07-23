import Link from "next/link";
import { MapPin, Clock, AlertCircle } from "lucide-react";

export default function PetugasDashboard() {
    // Data dummy untuk tampilan
    const tugasMasuk = [
        { id: "1", lokasi: "Belakang Gedung Dekanat FT", waktu: "2 Jam yang lalu", status: "menunggu" },
        { id: "2", lokasi: "Parkiran Motor Mahasiswa", waktu: "5 Jam yang lalu", status: "menunggu" }
    ];

    return (
        <div className="pb-32 pt-8 min-h-screen bg-zinc-50 flex flex-col max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <header className="mb-8 border-b border-zinc-200 pb-4">
                <h1 className="text-2xl font-semibold text-zinc-900">Daftar Tugas</h1>
                <p className="text-sm text-zinc-500 mt-1">Area kerja Anda hari ini</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tugasMasuk.map((tugas) => (
                    <div key={tugas.id} className="bg-white rounded-xl shadow-sm border border-zinc-200 flex flex-col overflow-hidden">
                        <div className="w-full h-32 bg-zinc-100 border-b border-zinc-200 flex items-center justify-center text-zinc-500 text-sm">
                            [Foto Laporan Awal]
                        </div>

                        <div className="p-4 flex flex-col flex-1">
                            <div className="flex items-start justify-between gap-2 mb-3">
                                <h3 className="font-semibold text-zinc-900 leading-tight">
                                    {tugas.lokasi}
                                </h3>
                                <span className="inline-flex items-center text-[10px] font-semibold text-orange-700 bg-orange-100 px-2 py-1 rounded">
                                    Pending
                                </span>
                            </div>

                            <div className="flex flex-col gap-2 mt-auto mb-4">
                                <p className="text-xs text-zinc-600 flex items-center gap-2">
                                    <MapPin size={14} className="text-zinc-400" /> 
                                    Detail Lokasi
                                </p>
                                <p className="text-xs text-zinc-600 flex items-center gap-2">
                                    <Clock size={14} className="text-zinc-400" /> 
                                    {tugas.waktu}
                                </p>
                            </div>

                            <Link href={`/staff/${tugas.id}`} className="w-full text-center bg-zinc-900 text-white font-medium text-sm py-2.5 rounded-lg hover:bg-zinc-800 transition-colors">
                                Kerjakan Tugas
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}