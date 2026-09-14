import Link from "next/link";
import Image from "next/image";
import { CheckSquare, Hourglass, ClipboardList, User } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DashboardMapClient from "@/components/DashboardMapClient";

export default async function PetugasDashboard() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const [newTasks, processing, completed, recentTasks] = await Promise.all([
        prisma.report.count({ where: { status: "LAPORAN_MASUK" } }),
        prisma.report.count({ where: { status: "MENUNGGU_APPROVAL" } }),
        prisma.report.count({ where: { status: "SELESAI" } }),
        prisma.report.findMany({
            where: { status: "LAPORAN_MASUK" },
            orderBy: { createdAt: "desc" },
            take: 10
        })
    ]);

    const userName = session.user.name || 'Petugas';

    return (
        <div className="pb-16 pt-6 sm:pt-8 min-h-screen bg-sibersih-bg flex flex-col max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 w-full">
            {/* HEADER */}
            <header className="flex flex-row justify-between items-center mb-5 sm:mb-8 gap-4 border-b border-sibersih-primary/10 pb-4">
                <div className="min-w-0 flex-1">
                    <h1 className="text-lg sm:text-2xl font-bold text-sibersih-primary truncate">Halo, {userName}</h1>
                    <p className="text-xs sm:text-sm text-sibersih-primary/60 mt-0.5">Petugas Kebersihan</p>
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
            <div className="grid grid-cols-3 gap-2 sm:hidden mb-4">
                <div className="bg-white p-2.5 rounded-xl border border-sibersih-primary/10 shadow-2xs flex flex-col items-center text-center">
                    <ClipboardList size={16} className="text-slate-600 mb-1" />
                    <span className="text-[11px] text-slate-600 font-medium">Tugas Baru</span>
                    <span className="text-base font-bold text-slate-900">{newTasks}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-orange-200/80 shadow-2xs flex flex-col items-center text-center">
                    <Hourglass size={16} className="text-orange-500 mb-1" />
                    <span className="text-[11px] text-orange-700 font-medium">Approval</span>
                    <span className="text-base font-bold text-orange-900">{processing}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-emerald-200/80 shadow-2xs flex flex-col items-center text-center">
                    <CheckSquare size={16} className="text-emerald-600 mb-1" />
                    <span className="text-[11px] text-emerald-700 font-medium">Selesai</span>
                    <span className="text-base font-bold text-emerald-900">{completed}</span>
                </div>
            </div>

            {/* TOMBOL AKSI CEPAT MOBILE (LINEAR DI BAWAH STATISTIK) */}
            <Link
                href="/staff/tasks"
                className="sm:hidden flex items-center justify-center gap-2 bg-sibersih-primary text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-sibersih-primary/90 active:scale-[0.99] transition shadow-sm mb-5"
            >
                <ClipboardList size={17} /> Buka Seluruh Daftar Tugas ({newTasks})
            </Link>

            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-5 sm:gap-6 flex-1">
                {/* KOLOM UTAMA (DESKTOP KIRI / MOBILE TENGAH) */}
                <div className="lg:col-span-2 flex flex-col gap-5 sm:gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-sibersih-primary/10 flex flex-col overflow-hidden">
                        <div className="p-3.5 sm:p-4 border-b border-sibersih-primary/5 flex justify-between items-center gap-2 bg-gray-50/50 rounded-t-xl">
                            <div>
                                <h2 className="text-sm font-semibold text-sibersih-primary">Tugas Baru Membutuhkan Tindakan</h2>
                                <p className="text-xs text-sibersih-primary/60 mt-0.5">Daftar sampah kampus yang perlu dibersihkan</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <Link href="/staff/tasks" className="text-xs font-semibold text-sibersih-primary hover:underline">Semua</Link>
                                <span className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">{newTasks} Antrean</span>
                            </div>
                        </div>

                        <div className="bg-sibersih-bg/30 p-3 sm:p-4 flex flex-col gap-3 sm:gap-4">
                        {newTasks === 0 ? (
                             <div className="flex flex-col items-center justify-center text-sibersih-primary/40 gap-3 py-10">
                                <div className="w-14 h-14 rounded-full bg-sibersih-primary/5 flex items-center justify-center">
                                    <CheckSquare size={28} className="opacity-50 text-green-500" />
                                </div>
                                <span className="font-semibold text-xs sm:text-sm">Semua tugas kebersihan telah diselesaikan!</span>
                             </div>
                        ) : (
                            <>
                                {recentTasks.map((report, index) => (
                                    <div
                                        key={report.id}
                                        className={`bg-white p-3 sm:p-4 rounded-xl border border-sibersih-primary/10 shadow-2xs hover:shadow-xs transition-all flex flex-row gap-3 sm:gap-4 items-start sm:items-center ${
                                            index >= 3 ? "hidden sm:flex" : "flex"
                                        }`}
                                    >
                                        <div className="relative w-20 h-20 sm:w-28 sm:h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-sibersih-primary/10 shadow-2xs">
                                            <Image src={report.fotoLaporanUrl} alt="Laporan" fill sizes="(max-width: 640px) 80px, 112px" className="object-cover group-hover:scale-105 transition-transform duration-500" priority={index === 0} />
                                        </div>
                                        <div className="flex-1 min-w-0 w-full flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-semibold text-sibersih-primary text-sm sm:text-base line-clamp-1">{report.lokasi}</h3>
                                                <p className="text-xs sm:text-sm text-sibersih-primary/60 mt-0.5 sm:mt-1 line-clamp-2">{report.deskripsi}</p>
                                            </div>
                                            <div className="mt-2.5 flex items-center justify-between gap-2">
                                                <Link href={`/staff/${report.id}`} className="text-xs font-bold px-3.5 py-1.5 bg-sibersih-primary text-white rounded-lg hover:bg-sibersih-primary/90 shadow-2xs transition-transform active:scale-95 inline-flex items-center justify-center">
                                                    Kerjakan Tugas
                                                </Link>
                                                <span className="text-[11px] text-sibersih-primary/40 hidden sm:inline">
                                                    {new Date(report.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* TOMBOL LIHAT DAFTAR TUGAS LENGKAP */}
                                <div className="pt-1">
                                    <Link
                                        href="/staff/tasks"
                                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-sibersih-primary/15 bg-white hover:bg-sibersih-bg text-sibersih-primary text-xs font-semibold shadow-2xs transition-colors"
                                    >
                                        <span>Buka Seluruh Antrean Tugas ({newTasks})</span>
                                        <ClipboardList size={14} />
                                    </Link>
                                </div>
                            </>
                        )}
                        </div>
                    </div>
                </div>

                {/* KOLOM SEKUNDER (DESKTOP KANAN / MOBILE BAWAH) */}
                <div className="lg:col-span-1 flex flex-col gap-5 sm:gap-6">
                    {/* STATISTIK KHUSUS DESKTOP */}
                    <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-sibersih-primary/10 overflow-hidden">
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
                                    <span className="text-sm font-medium">Menunggu Approval</span>
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
                    <div className="bg-white rounded-xl shadow-sm border border-sibersih-primary/10 overflow-hidden flex flex-col h-[260px] sm:h-[300px] lg:h-auto lg:flex-1 lg:min-h-[280px]">
                        <div className="p-3.5 sm:p-4 border-b border-sibersih-primary/5 flex justify-between items-center">
                            <h2 className="text-xs sm:text-sm font-semibold text-sibersih-primary">Peta Area Tugas</h2>
                            <span className="text-[11px] text-sibersih-primary/50">Fakultas Teknik</span>
                        </div>
                        <div className="w-full h-full flex-1 relative z-0 min-h-[190px]">
                            <DashboardMapClient />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}