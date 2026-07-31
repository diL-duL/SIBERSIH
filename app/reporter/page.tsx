import Link from "next/link";
import { CheckSquare, Hourglass, Megaphone, Plus } from "lucide-react";
import NotificationMenu from "@/components/NotificationMenu";

export default function PelaporDashboard() {
    return (
        <div className="pb-32 pt-8 min-h-screen bg-sibersih-bg flex flex-col max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            {/* HEADER */}
            <header className="flex flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-sibersih-primary/10 pb-4">
                <div>
                    <h1 className="text-2xl font-semibold text-sibersih-primary">Halo, bang</h1>
                    <p className="text-sm text-sibersih-primary/60 mt-1">Civitas Akademik</p>
                </div>
                <div className="flex items-center gap-3">
                    <NotificationMenu />
                    <Link href="/reporter/report" className="hidden sm:flex items-center gap-2 bg-sibersih-primary text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-sibersih-primary/90 transition">
                        <Plus size={16} /> Buat Laporan
                    </Link>
                </div>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
                {/* PETA */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-sibersih-primary/10 flex flex-col min-h-[400px]">
                    <div className="p-4 border-b border-sibersih-primary/5">
                        <h2 className="text-sm font-semibold text-sibersih-primary">Peta Lokasi</h2>
                    </div>
                    <div className="flex-1 bg-sibersih-bg flex items-center justify-center text-sm text-sibersih-primary/40 p-4">
                        <div className="w-full max-w-[256px] h-32 border-4 border-dashed border-sibersih-primary/20 bg-white rounded-2xl flex items-center justify-center text-sibersih-primary/40 font-bold">
                            Area Peta Interaktif
                        </div>
                    </div>
                </div>

                {/* STATISTIK */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-sibersih-primary/10">
                        <div className="p-4 border-b border-sibersih-primary/5 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-sibersih-primary">Ringkasan Laporan</h2>
                            <Link href="/reporter/history" className="text-xs font-medium text-sibersih-primary hover:underline">Riwayat</Link>
                        </div>
                        <div className="p-4 flex flex-col gap-3">
                            <div className="flex items-center justify-between p-3 bg-sibersih-bg rounded-lg border border-sibersih-primary/10">
                                <div className="flex items-center gap-3 text-sibersih-primary/80">
                                    <Megaphone size={18} className="text-sibersih-primary/60" />
                                    <span className="text-sm font-medium">Total Laporan</span>
                                </div>
                                <span className="font-semibold text-sibersih-primary">3</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100">
                                <div className="flex items-center gap-3 text-orange-800">
                                    <Hourglass size={18} className="text-orange-500" />
                                    <span className="text-sm font-medium">Sedang Diproses</span>
                                </div>
                                <span className="font-semibold text-orange-900">1</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-sibersih-accent/20 rounded-lg border border-sibersih-accent/30">
                                <div className="flex items-center gap-3 text-sibersih-primary">
                                    <CheckSquare size={18} className="text-sibersih-primary" />
                                    <span className="text-sm font-medium">Selesai</span>
                                </div>
                                <span className="font-semibold text-sibersih-primary">2</span>
                            </div>
                        </div>
                    </div>

                    {/* Tombol Lapor Cepat di Mobile */}
                    <Link href="/reporter/report" className="sm:hidden flex items-center justify-center gap-2 bg-sibersih-primary text-white px-4 py-3 rounded-xl font-medium text-sm hover:bg-sibersih-primary/90 transition">
                        <Plus size={16} /> Buat Laporan Baru
                    </Link>
                </div>
            </div>
        </div>
    );
}