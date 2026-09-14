import Link from "next/link";
import { CheckSquare, Hourglass, Megaphone, Plus, User } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DashboardMapClient from "@/components/DashboardMapClient";
import ReporterDashboardReports from "@/components/ReporterDashboardReports";

export default async function PelaporDashboard() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const [total, completed, recentReports] = await Promise.all([
        prisma.report.count({ where: { pelaporId: session.user.id } }),
        prisma.report.count({ where: { pelaporId: session.user.id, status: "SELESAI" } }),
        prisma.report.findMany({
            where: { pelaporId: session.user.id },
            orderBy: { createdAt: 'desc' },
            take: 3
        }),
    ]);
    const processing = Math.max(0, total - completed);
    const userName = session.user.name || 'Pengguna';

    return (
        <div className="pb-16 pt-8 min-h-screen bg-sibersih-bg flex flex-col max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            {/* HEADER */}
            <header className="flex flex-row justify-between items-center mb-6 sm:mb-8 gap-4 border-b border-sibersih-primary/10 pb-4">
                <div className="min-w-0 flex-1">
                    <h1 className="text-xl sm:text-2xl font-semibold text-sibersih-primary truncate">Halo, {userName}</h1>
                    <p className="text-xs sm:text-sm text-sibersih-primary/60 mt-0.5 sm:mt-1">Pelapor</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <Link
                        href="/reporter/profile"
                        className="p-2.5 rounded-xl border border-sibersih-primary/10 bg-white/70 hover:bg-white text-sibersih-primary transition-all duration-200 shadow-xs hover:shadow-sm active:scale-95 flex items-center justify-center"
                        title="Profil"
                        aria-label="Profil"
                    >
                        <User size={18} className="text-sibersih-primary/80" />
                    </Link>
                    <Link href="/reporter/report" className="hidden sm:flex items-center gap-2 bg-sibersih-primary text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-sibersih-primary/90 transition shadow-sm">
                        <Plus size={16} /> Buat Laporan
                    </Link>
                </div>
            </header>
            
            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 flex-1">
                {/* KOLOM KIRI (UTAMA) - DAFTAR LAPORAN & RIWAYAT */}
                <div className="contents lg:col-span-2 lg:flex lg:flex-col lg:gap-6">
                    <ReporterDashboardReports reports={recentReports} className="order-2 lg:order-none" />
                </div>

                {/* KOLOM KANAN (SEKUNDER) - STATISTIK & PETA */}
                <div className="contents lg:col-span-1 lg:flex lg:flex-col lg:gap-6">
                    {/* STATISTIK */}
                    <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-sibersih-primary/10">
                        <div className="p-4 border-b border-sibersih-primary/5 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-sibersih-primary">Ringkasan</h2>
                            <Link href="/reporter/history" className="text-xs font-medium text-sibersih-primary hover:underline">Riwayat</Link>
                        </div>
                        <div className="p-4 flex flex-col gap-3">
                            <div className="flex items-center justify-between p-3 bg-sibersih-bg rounded-lg border border-sibersih-primary/10">
                                <div className="flex items-center gap-3 text-sibersih-primary/80">
                                    <Megaphone size={18} className="text-sibersih-primary/60" />
                                    <span className="text-sm font-medium">Total Laporan</span>
                                </div>
                                <span className="font-semibold text-sibersih-primary">{total}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100">
                                <div className="flex items-center gap-3 text-orange-800">
                                    <Hourglass size={18} className="text-orange-500" />
                                    <span className="text-sm font-medium">Sedang Diproses</span>
                                </div>
                                <span className="font-semibold text-orange-900">{processing}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-sibersih-accent/20 rounded-lg border border-sibersih-accent/30">
                                <div className="flex items-center gap-3 text-sibersih-primary">
                                    <CheckSquare size={18} className="text-sibersih-primary" />
                                    <span className="text-sm font-medium">Selesai</span>
                                </div>
                                <span className="font-semibold text-sibersih-primary">{completed}</span>
                            </div>
                        </div>
                    </div>

                    {/* MINIMAP FAKULTAS TEKNIK */}
                    <div className="bg-white rounded-xl shadow-sm border border-sibersih-primary/10 overflow-hidden flex flex-col h-[280px] sm:h-[320px] lg:h-auto lg:flex-1 lg:min-h-[300px] order-1 lg:order-none">
                        <div className="p-4 border-b border-sibersih-primary/5 flex justify-between items-center">
                            <h2 className="text-sm font-semibold text-sibersih-primary">Peta Area Pengawasan</h2>
                        </div>
                        <div className="w-full h-full flex-1 relative z-0 min-h-[200px]">
                            <DashboardMapClient />
                        </div>
                    </div>

                    {/* Tombol Lapor Cepat di Mobile */}
                    <Link href="/reporter/report" className="sm:hidden flex items-center justify-center gap-2 bg-sibersih-primary text-white px-4 py-3 rounded-xl font-medium text-sm hover:bg-sibersih-primary/90 transition shadow-md order-3 lg:order-none">
                        <Plus size={16} /> Buat Laporan Baru
                    </Link>
                </div>
            </div>
        </div>
    );
}