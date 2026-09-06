import Link from "next/link";
import Image from "next/image";
import { CheckSquare, Hourglass, ClipboardList, Inbox } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
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
            orderBy: { createdAt: "desc" }
        })
    ]);

    const currentUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { nama: true }
    });

    return (
        <div className="pb-32 pt-8 min-h-screen bg-sibersih-bg flex flex-col max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <header className="flex flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-sibersih-primary/10 pb-4">
                <div>
                    <h1 className="text-2xl font-semibold text-sibersih-primary">Halo, {currentUser?.nama || 'Petugas'}</h1>
                    <p className="text-sm text-sibersih-primary/60 mt-1">Petugas Kebersihan</p>
                </div>
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <Link href="/staff/tasks" className="hidden sm:flex items-center gap-2 bg-sibersih-primary text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-sibersih-primary/90 transition shadow-sm">
                        <ClipboardList size={16} /> Daftar Tugas
                    </Link>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
                {/* KOLOM KIRI (UTAMA) - DAFTAR TUGAS */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-sibersih-primary/10 flex flex-col h-full min-h-[500px]">
                        <div className="p-4 border-b border-sibersih-primary/5 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
                            <h2 className="text-sm font-semibold text-sibersih-primary">Tugas Baru Membutuhkan Tindakan</h2>
                            <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full">{newTasks} Pending</span>
                        </div>
                        <div className="flex-1 bg-sibersih-bg/30 p-4 flex flex-col gap-4 overflow-y-auto max-h-[600px]">
                        {newTasks === 0 ? (
                             <div className="flex-1 flex flex-col items-center justify-center text-sibersih-primary/40 gap-3">
                                <div className="w-16 h-16 rounded-full bg-sibersih-primary/5 flex items-center justify-center">
                                    <CheckSquare size={32} className="opacity-50 text-green-500" />
                                </div>
                                <span className="font-semibold text-sm">Semua tugas kebersihan telah diselesaikan!</span>
                             </div>
                        ) : (
                            recentTasks.map((report, index) => (
                                <div key={report.id} className="bg-white p-4 rounded-xl border border-sibersih-primary/10 shadow-sm hover:shadow-md hover:border-sibersih-primary/20 transition-all group flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                    <div className="relative w-full sm:w-28 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                        <Image src={report.fotoLaporanUrl} alt="Laporan" fill sizes="(max-width: 640px) 100vw, 112px" className="object-cover group-hover:scale-105 transition-transform duration-500" priority={index === 0} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-sibersih-primary line-clamp-1">{report.lokasi}</h3>
                                        <p className="text-sm text-sibersih-primary/60 mt-1 line-clamp-2">{report.deskripsi}</p>
                                        <Link href={`/staff/${report.id}`} className="mt-3 inline-block text-xs font-bold px-4 py-2 bg-sibersih-primary text-white rounded-lg hover:bg-sibersih-primary/90 shadow-sm transition-transform hover:scale-[1.02]">
                                            Kerjakan Tugas
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                        </div>
                    </div>
                </div>

                {/* KOLOM KANAN (SEKUNDER) - STATISTIK & PETA */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    {/* STATISTIK */}
                    <div className="bg-white rounded-xl shadow-sm border border-sibersih-primary/10">
                        <div className="p-4 border-b border-sibersih-primary/5 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-sibersih-primary">Ringkasan Tugas</h2>
                            <Link href="/staff/history" className="text-xs font-medium text-sibersih-primary hover:underline">Riwayat</Link>
                        </div>
                        <div className="p-4 flex flex-col gap-3">
                            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100">
                                <div className="flex items-center gap-3 text-orange-800">
                                    <ClipboardList size={18} className="text-orange-500" />
                                    <span className="text-sm font-medium">Tugas Baru</span>
                                </div>
                                <span className="font-semibold text-orange-900">{newTasks}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-sibersih-bg rounded-lg border border-sibersih-primary/10">
                                <div className="flex items-center gap-3 text-sibersih-primary/80">
                                    <Hourglass size={18} className="text-sibersih-primary/60" />
                                    <span className="text-sm font-medium">Menunggu Approval</span>
                                </div>
                                <span className="font-semibold text-sibersih-primary">{processing}</span>
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
                    <div className="bg-white rounded-xl shadow-sm border border-sibersih-primary/10 overflow-hidden flex-1 min-h-[300px] flex flex-col">
                        <div className="p-4 border-b border-sibersih-primary/5">
                            <h2 className="text-sm font-semibold text-sibersih-primary">Peta Area Tugas</h2>
                        </div>
                        <div className="w-full h-full flex-1 relative z-0">
                            <DashboardMapClient />
                        </div>
                    </div>

                    <Link href="/staff/tasks" className="sm:hidden flex items-center justify-center gap-2 bg-sibersih-primary text-white px-4 py-3 rounded-xl font-medium text-sm hover:bg-sibersih-primary/90 transition shadow-md">
                        <ClipboardList size={16} /> Lihat Daftar Tugas
                    </Link>
                </div>
            </div>
        </div>
    );
}