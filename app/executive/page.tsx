import Link from "next/link";
import Image from "next/image";
import { CheckSquare, Hourglass, CheckCircle, UserPlus, User, ArrowRight } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DashboardMapClient from "@/components/DashboardMapClient";

export default async function PimpinanDashboard() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const [pending, completed, recentReports] = await Promise.all([
        prisma.report.count({ where: { status: "MENUNGGU_APPROVAL" } }),
        prisma.report.count({ where: { status: "SELESAI" } }),
        prisma.report.findMany({
            orderBy: { createdAt: "desc" },
            take: 3
        })
    ]);

    const userName = session.user.name || 'Pimpinan';

    return (
        <div className="pb-16 pt-6 sm:pt-8 min-h-screen bg-sibersih-bg flex flex-col max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 w-full">
            {/* HEADER */}
            <header className="flex flex-row justify-between items-center mb-5 sm:mb-8 gap-4 border-b border-sibersih-primary/10 pb-4">
                <div className="min-w-0 flex-1">
                    <h1 className="text-lg sm:text-2xl font-bold text-sibersih-primary truncate">Halo, {userName}</h1>
                    <p className="text-xs sm:text-sm text-sibersih-primary/60 mt-0.5">Pimpinan / Executive</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <Link
                        href="/executive/profile"
                        className="p-2 sm:p-2.5 rounded-xl border border-sibersih-primary/10 bg-white hover:bg-sibersih-bg text-sibersih-primary transition-all duration-200 shadow-2xs hover:shadow-xs active:scale-95 flex items-center justify-center"
                        title="Profil Saya"
                        aria-label="Profil Saya"
                    >
                        <User size={18} className="text-sibersih-primary/80" />
                    </Link>
                    <Link href="/executive/validations" className="hidden sm:flex items-center gap-2 bg-sibersih-primary text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-sibersih-primary/90 transition shadow-xs">
                        <CheckCircle size={16} /> Validasi Laporan
                    </Link>
                </div>
            </header>

            {/* RINGKASAN METRIK KHUSUS MOBILE (LINEAR DI ATAS) */}
            <div className="grid grid-cols-2 gap-2.5 sm:hidden mb-5">
                <div className="bg-white p-3 rounded-xl border border-orange-200/80 shadow-2xs flex items-center justify-between">
                    <div>
                        <span className="text-[11px] text-orange-700 font-medium block">Butuh Review</span>
                        <span className="text-lg font-bold text-orange-900">{pending}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-orange-50 text-orange-500">
                        <Hourglass size={18} />
                    </div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-emerald-200/80 shadow-2xs flex items-center justify-between">
                    <div>
                        <span className="text-[11px] text-emerald-700 font-medium block">Telah Disetujui</span>
                        <span className="text-lg font-bold text-emerald-900">{completed}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                        <CheckSquare size={18} />
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-5 sm:gap-6 flex-1">
                {/* KOLOM UTAMA (DESKTOP KIRI / MOBILE URUTAN KE-3: SETELAH PETA) */}
                <div className="order-2 lg:order-1 lg:col-span-2 flex flex-col min-h-0">
                    <div className="bg-white rounded-xl shadow-sm border border-sibersih-primary/10 flex flex-col overflow-hidden max-h-[500px] sm:max-h-[540px] lg:max-h-none lg:h-[580px]">
                        <div className="p-3.5 sm:p-4 border-b border-sibersih-primary/5 flex justify-between items-center gap-2 bg-gray-50/50 rounded-t-xl shrink-0">
                            <div>
                                <h2 className="text-sm font-semibold text-sibersih-primary">Daftar Laporan Terakhir</h2>
                                <p className="text-xs text-sibersih-primary/60 mt-0.5">Pantau progres dan hasil penanganan kebersihan</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full">{pending} Review</span>
                            </div>
                        </div>

                        <div className="bg-sibersih-bg/30 p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 flex-1 overflow-y-auto min-h-0 custom-scrollbar">
                         {recentReports.length === 0 ? (
                             <div className="flex flex-col items-center justify-center text-sibersih-primary/40 gap-3 py-10 flex-1">
                                <div className="w-14 h-14 rounded-full bg-sibersih-primary/5 flex items-center justify-center">
                                    <CheckSquare size={28} className="opacity-50 text-green-500" />
                                </div>
                                <span className="font-semibold text-xs sm:text-sm">Belum ada laporan kebersihan saat ini.</span>
                             </div>
                        ) : (
                            <>
                                {recentReports.map((report, index) => (
                                    <div
                                        key={report.id}
                                        className="bg-white p-3 sm:p-4 rounded-xl border border-sibersih-primary/10 shadow-2xs hover:shadow-xs transition-all flex flex-row gap-3 sm:gap-4 items-start sm:items-center"
                                    >
                                        <div className="relative w-20 h-20 sm:w-28 sm:h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-orange-200 shadow-2xs">
                                            <Image 
                                                src={report.fotoBuktiUrl || report.fotoLaporanUrl} 
                                                alt="Bukti Kerja" 
                                                fill 
                                                sizes="(max-width: 640px) 80px, 112px" 
                                                className="object-cover group-hover:scale-105 transition-transform duration-500" 
                                                priority={index === 0} 
                                            />
                                            {report.fotoBuktiUrl && (
                                                <div className="absolute top-1 right-1 bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold text-orange-600 uppercase">
                                                    Bukti
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 w-full flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between gap-2">
                                                    <h3 className="font-semibold text-sibersih-primary text-sm sm:text-base line-clamp-1">{report.lokasi}</h3>
                                                    <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md shrink-0 ${
                                                        report.status === "SELESAI"
                                                            ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                                                            : report.status === "MENUNGGU_APPROVAL"
                                                            ? "text-orange-700 bg-orange-50 border border-orange-200"
                                                            : "text-slate-700 bg-slate-100 border border-slate-200"
                                                    }`}>
                                                        {report.status === "SELESAI" ? "Selesai" : report.status === "MENUNGGU_APPROVAL" ? "Butuh Review" : "Baru"}
                                                    </span>
                                                </div>
                                                <p className="text-xs sm:text-sm text-sibersih-primary/60 mt-0.5 sm:mt-1 line-clamp-2">{report.deskripsi}</p>
                                            </div>
                                            <div className="mt-2.5 flex items-center justify-between gap-2">
                                                {report.status === "MENUNGGU_APPROVAL" ? (
                                                    <Link href="/executive/validations" className="text-xs font-bold px-3.5 py-1.5 bg-sibersih-primary text-white rounded-lg hover:bg-sibersih-primary/90 shadow-2xs transition-transform active:scale-95 inline-flex items-center justify-center">
                                                        Review &amp; Setujui
                                                    </Link>
                                                ) : report.status === "SELESAI" ? (
                                                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                                                        <CheckSquare size={12} /> Tervalidasi
                                                    </span>
                                                ) : (
                                                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                                                        Dalam Antrean
                                                    </span>
                                                )}
                                                <span className="text-[11px] text-sibersih-primary/40 hidden sm:inline">
                                                    {new Date(report.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* TOMBOL LIHAT LAINNYA (KHUSUS MOBILE, DISEMBUNYIKAN DI DESKTOP) */}
                                <div className="pt-1 shrink-0 lg:hidden">
                                    <Link
                                        href="/executive/history"
                                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-sibersih-primary/15 bg-white hover:bg-sibersih-bg text-sibersih-primary text-xs font-semibold shadow-2xs transition-colors"
                                    >
                                        <span>Lihat Lainnya</span>
                                        <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </>
                        )}
                        </div>
                    </div>
                </div>

                {/* KOLOM SEKUNDER (DESKTOP KANAN / MOBILE URUTAN KE-2: SEBELUM DAFTAR VALIDASI) */}
                <div className="order-1 lg:order-2 lg:col-span-1 flex flex-col gap-5 sm:gap-6 lg:h-[580px]">
                    {/* STATISTIK KHUSUS DESKTOP */}
                    <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-sibersih-primary/10 overflow-hidden shrink-0">
                        <div className="p-4 border-b border-sibersih-primary/5 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-sibersih-primary">Ringkasan Validasi</h2>
                            <Link href="/executive/history" className="text-xs font-semibold text-sibersih-primary hover:underline">Riwayat</Link>
                        </div>
                        <div className="p-4 flex flex-col gap-3">
                            <div className="flex items-center justify-between p-3 bg-orange-50/80 rounded-lg border border-orange-100">
                                <div className="flex items-center gap-3 text-orange-800">
                                    <Hourglass size={18} className="text-orange-500" />
                                    <span className="text-sm font-medium">Butuh Review</span>
                                </div>
                                <span className="font-semibold text-orange-900">{pending}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-emerald-50/80 rounded-lg border border-emerald-100">
                                <div className="flex items-center gap-3 text-emerald-800">
                                    <CheckSquare size={18} className="text-emerald-600" />
                                    <span className="text-sm font-medium">Telah Disetujui</span>
                                </div>
                                <span className="font-semibold text-emerald-900">{completed}</span>
                            </div>
                        </div>
                    </div>

                    {/* MANAJEMEN PETUGAS DESKTOP */}
                    <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-sibersih-primary/10 overflow-hidden shrink-0">
                        <div className="p-4 border-b border-sibersih-primary/5">
                            <h2 className="text-sm font-semibold text-sibersih-primary">Manajemen Petugas</h2>
                        </div>
                        <div className="p-4 flex flex-col gap-3">
                            <p className="text-xs text-sibersih-primary/60 leading-relaxed">Kelola akun petugas kebersihan, tambah akun baru atau cabut akses ke sistem.</p>
                            <Link href="/executive/staff-management" className="flex items-center justify-center gap-2 bg-sibersih-accent/20 text-sibersih-primary px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-sibersih-accent/40 transition">
                                <UserPlus size={16} /> Kelola Petugas
                            </Link>
                        </div>
                    </div>

                    {/* MINIMAP FAKULTAS TEKNIK */}
                    <div className="bg-white rounded-xl shadow-sm border border-sibersih-primary/10 overflow-hidden flex flex-col h-[260px] sm:h-[300px] lg:h-auto lg:flex-1 lg:min-h-0">
                        <div className="p-3.5 sm:p-4 border-b border-sibersih-primary/5 flex justify-between items-center shrink-0">
                            <h2 className="text-xs sm:text-sm font-semibold text-sibersih-primary">Peta Pengawasan Wilayah</h2>
                            <span className="text-[11px] text-sibersih-primary/50">Fakultas Teknik</span>
                        </div>
                        <div className="w-full h-full flex-1 relative z-0 min-h-[190px]">
                            <DashboardMapClient />
                        </div>
                    </div>
                </div>
            </div>

            {/* TOMBOL AKSI CEPAT MOBILE (LINEAR DI BAWAH DAFTAR) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:hidden mt-5">
                <Link
                    href="/executive/validations"
                    className="flex items-center justify-center gap-2 bg-sibersih-primary text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-sibersih-primary/90 active:scale-[0.99] transition shadow-sm"
                >
                    <CheckCircle size={17} /> Buka Panel Validasi ({pending})
                </Link>
                <Link
                    href="/executive/staff-management"
                    className="flex items-center justify-center gap-2 bg-white border border-sibersih-primary/15 text-sibersih-primary px-4 py-2.5 rounded-xl font-semibold text-xs hover:bg-sibersih-bg transition shadow-2xs"
                >
                    <UserPlus size={15} /> Kelola Akun Petugas
                </Link>
            </div>
        </div>
    );
}