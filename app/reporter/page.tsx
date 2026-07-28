import Link from "next/link";
import { Bell, CheckSquare, Hourglass, Megaphone, Plus } from "lucide-react";

export default function PelaporDashboard() {
    return (
        <div className="pb-32 pt-8 min-h-screen bg-zinc-50 flex flex-col max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            {/* HEADER */}
            <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 gap-4 border-b border-zinc-200 pb-4">
                <div>
                    <h1 className="text-2xl font-semibold text-zinc-900">Halo, bang</h1>
                    <p className="text-sm text-zinc-500 mt-1">Civitas Akademik</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-2 text-zinc-600 hover:bg-zinc-100 rounded-lg relative">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-zinc-50"></span>
                    </button>
                    <Link href="/reporter/report" className="hidden sm:flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition">
                        <Plus size={16} /> Buat Laporan
                    </Link>
                </div>
            </header>

            {/* KONTEN UTAMA */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
                {/* PETA */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-zinc-200 flex flex-col min-h-[400px]">
                    <div className="p-4 border-b border-zinc-100">
                        <h2 className="text-sm font-semibold text-zinc-800">Peta Lokasi</h2>
                    </div>
                    <div className="flex-1 bg-zinc-50 flex items-center justify-center text-sm text-zinc-400 p-4">
                        <div className="w-full max-w-[256px] h-32 border-4 border-dashed border-zinc-200 bg-white rounded-2xl flex items-center justify-center text-zinc-400 font-bold">
                            Area Peta Interaktif
                        </div>
                    </div>
                </div>

                {/* STATISTIK */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-zinc-200">
                        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-zinc-800">Ringkasan Laporan</h2>
                            <Link href="/reporter/history" className="text-xs font-medium text-blue-600 hover:underline">Riwayat</Link>
                        </div>
                        <div className="p-4 flex flex-col gap-3">
                            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                                <div className="flex items-center gap-3 text-zinc-700">
                                    <Megaphone size={18} className="text-zinc-500" />
                                    <span className="text-sm font-medium">Total Laporan</span>
                                </div>
                                <span className="font-semibold text-zinc-900">3</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100">
                                <div className="flex items-center gap-3 text-orange-800">
                                    <Hourglass size={18} className="text-orange-500" />
                                    <span className="text-sm font-medium">Sedang Diproses</span>
                                </div>
                                <span className="font-semibold text-orange-900">1</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                                <div className="flex items-center gap-3 text-green-800">
                                    <CheckSquare size={18} className="text-green-500" />
                                    <span className="text-sm font-medium">Selesai</span>
                                </div>
                                <span className="font-semibold text-green-900">2</span>
                            </div>
                        </div>
                    </div>

                    {/* Tombol Lapor Cepat di Mobile */}
                    <Link href="/reporter/report" className="sm:hidden flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl font-medium text-sm hover:bg-blue-700 transition">
                        <Plus size={16} /> Buat Laporan Baru
                    </Link>
                </div>
            </div>
        </div>
    );
}