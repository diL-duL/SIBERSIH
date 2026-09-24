import Link from "next/link";
import Image from "next/image";
import { CheckSquare, Hourglass, ClipboardList, User } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DashboardMapClient from "@/components/DashboardMapClient";
import StaffDashboardTasks from "@/components/StaffDashboardTasks";

export default async function PetugasDashboard() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const [newTasks, processing, completed, recentTasks] = await Promise.all([
        prisma.report.count({ where: { status: "LAPORAN_MASUK" } }),
        prisma.report.count({ where: { status: "MENUNGGU_APPROVAL" } }),
        prisma.report.count({ where: { status: "SELESAI" } }),
        prisma.report.findMany({
            orderBy: { createdAt: "desc" },
            take: 5
        })
    ]);

    const userName = session.user.name || 'Petugas';

    return (
        <div className="pb-16 pt-6 sm:pt-8 min-h-screen bg-sibersih-bg flex flex-col max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 w-full">
            {/* HEADER */}
            <header className="flex flex-row justify-between items-center mb-5 sm:mb-8 gap-4 border-b border-sibersih-primary/10 pb-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shadow-2xs shrink-0 border border-sibersih-primary/10 bg-white">
                        <Image src="/sibersihLogo.webp" alt="SiBersih" fill className="object-contain" priority sizes="44px" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-lg sm:text-2xl font-bold text-sibersih-primary truncate">Halo, {userName}</h1>
                        <p className="text-xs sm:text-sm text-sibersih-primary/60 mt-0.5">Petugas Kebersihan</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <Link
                        href="/staff/profile"
                        className="p-2 sm:p-2.5 rounded-xl border border-sibersih-primary/10 bg-white hover:bg-sibersih-bg text-sibersih-primary transition-all duration-200 shadow-2xs hover:shadow-xs active:scale-95 flex items-center justify-center"
                        title="Profil Saya"
                        aria-label="Profil Saya"
                    >
                        <User size={18} className="text-sibersih-primary/80" />
                    </Link>
                    <Link href="/staff/tasks" className="hidden sm:flex items-center gap-2 bg-sibersih-primary text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-sibersih-primary/90 transition shadow-xs">
                        <ClipboardList size={16} /> Daftar Tugas
                    </Link>
                </div>
            </header>

            {/* RINGKASAN METRIK KHUSUS MOBILE (LINEAR DI ATAS) */}
            <div className="grid grid-cols-3 gap-2 sm:hidden mb-5">
                <div className="bg-white p-2.5 rounded-xl border border-sibersih-primary/10 shadow-2xs flex flex-col items-center text-center">
                    <ClipboardList size={16} className="text-slate-600 mb-1" />
                    <span className="text-[11px] text-slate-600 font-medium">Tugas Baru</span>
                    <span className="text-base font-bold text-slate-900">{newTasks}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-orange-200/80 shadow-2xs flex flex-col items-center text-center">
                    <Hourglass size={16} className="text-orange-500 mb-1" />
                    <span className="text-[11px] text-orange-700 font-medium">Persetujuan</span>
                    <span className="text-base font-bold text-orange-900">{processing}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-emerald-200/80 shadow-2xs flex flex-col items-center text-center">
                    <CheckSquare size={16} className="text-emerald-600 mb-1" />
                    <span className="text-[11px] text-emerald-700 font-medium">Selesai</span>
                    <span className="text-base font-bold text-emerald-900">{completed}</span>
                </div>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-5 sm:gap-6 flex-1">
                {/* KOLOM UTAMA (DESKTOP KIRI / MOBILE URUTAN KE-3: SETELAH PETA) */}
                <div className="order-2 lg:order-1 lg:col-span-2 flex flex-col min-h-0">
                    <StaffDashboardTasks
                        tasks={recentTasks}
                        newTasksCount={newTasks}
                        className="max-h-[500px] sm:max-h-[540px] lg:max-h-none lg:h-[580px]"
                    />
                </div>

                {/* KOLOM SEKUNDER (DESKTOP KANAN / MOBILE URUTAN KE-2: SEBELUM TUGAS) */}
                <div className="order-1 lg:order-2 lg:col-span-1 flex flex-col gap-5 sm:gap-6 lg:h-[580px]">
                    {/* STATISTIK KHUSUS DESKTOP */}
                    <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-sibersih-primary/10 overflow-hidden shrink-0">
                        <div className="p-4 border-b border-sibersih-primary/5 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-sibersih-primary">Ringkasan Tugas</h2>
                            <Link href="/staff/history" className="text-xs font-semibold text-sibersih-primary hover:underline">Riwayat</Link>
                        </div>
                        <div className="p-4 flex flex-col gap-3">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="flex items-center gap-3 text-slate-700">
                                    <ClipboardList size={18} className="text-slate-500" />
                                    <span className="text-sm font-medium">Tugas Baru</span>
                                </div>
                                <span className="font-semibold text-slate-900">{newTasks}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-orange-50/80 rounded-lg border border-orange-100">
                                <div className="flex items-center gap-3 text-orange-800">
                                    <Hourglass size={18} className="text-orange-500" />
                                    <span className="text-sm font-medium">Menunggu Persetujuan</span>
                                </div>
                                <span className="font-semibold text-orange-900">{processing}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-emerald-50/80 rounded-lg border border-emerald-100">
                                <div className="flex items-center gap-3 text-emerald-800">
                                    <CheckSquare size={18} className="text-emerald-600" />
                                    <span className="text-sm font-medium">Selesai</span>
                                </div>
                                <span className="font-semibold text-emerald-900">{completed}</span>
                            </div>
                        </div>
                    </div>

                    {/* MINIMAP FAKULTAS TEKNIK */}
                    <div className="bg-white rounded-xl shadow-sm border border-sibersih-primary/10 overflow-hidden flex flex-col h-[260px] sm:h-[300px] lg:h-auto lg:flex-1 lg:min-h-0">
                        <div className="p-3.5 sm:p-4 border-b border-sibersih-primary/5 flex justify-between items-center shrink-0">
                            <h2 className="text-xs sm:text-sm font-semibold text-sibersih-primary">Peta Area Tugas</h2>
                            <span className="text-[11px] text-sibersih-primary/50">Fakultas Teknik</span>
                        </div>
                        <div className="w-full h-full flex-1 relative z-0 min-h-[190px]">
                            <DashboardMapClient />
                        </div>
                    </div>
                </div>
            </div>

            {/* TOMBOL AKSI CEPAT MOBILE (LINEAR DI BAWAH TUGAS) */}
            <Link
                href="/staff/tasks"
                className="sm:hidden flex items-center justify-center gap-2 bg-sibersih-primary text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-sibersih-primary/90 active:scale-[0.99] transition shadow-sm mt-5"
            >
                <ClipboardList size={17} /> Buka Seluruh Daftar Tugas ({newTasks})
            </Link>
        </div>
    );
}