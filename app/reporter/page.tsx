import Link from "next/link";
import { CheckSquare, Hourglass, Megaphone, Plus } from "lucide-react";
import NotificationMenu from "@/components/NotificationMenu";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function PelaporDashboard() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const reports = await prisma.report.findMany({
        where: { pelaporId: session.user.id }
    });

    const notifications = await prisma.notification.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
    });

    const total = reports.length;
    const processing = reports.filter(r => r.status !== "SELESAI").length;
    const completed = reports.filter(r => r.status === "SELESAI").length;

    return (
        <div className="pb-32 pt-8 min-h-screen bg-sibersih-bg flex flex-col max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            {/* HEADER */}
            <header className="flex flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-sibersih-primary/10 pb-4">
                <div>
                    <h1 className="text-2xl font-semibold text-sibersih-primary">Halo, {session.user.name || 'Pengguna'}</h1>
                    <p className="text-sm text-sibersih-primary/60 mt-1">Pelapor</p>
                </div>
                <div className="flex items-center gap-3">
                    <NotificationMenu notifications={notifications} />
                    <Link href="/reporter/report" className="hidden sm:flex items-center gap-2 bg-sibersih-primary text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-sibersih-primary/90 transition">
                        <Plus size={16} /> Buat Laporan
                    </Link>
                </div>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
                {/* PETA & DAFTAR LAPORAN */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* MINIMAP FAKULTAS TEKNIK */}
                    <div className="bg-white rounded-xl shadow-sm border border-sibersih-primary/10 overflow-hidden">
                        <div className="p-4 border-b border-sibersih-primary/5">
                            <h2 className="text-sm font-semibold text-sibersih-primary">Peta Area Fakultas Teknik</h2>
                        </div>
                        <div className="w-full h-[300px]">
                            <iframe 
                                src="https://www.google.com/maps?q=Fakultas+Teknik+Universitas+Tadulako&output=embed" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }} 
                                allowFullScreen={false} 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>

                    {/* DAFTAR LAPORAN */}
                    <div className="bg-white rounded-xl shadow-sm border border-sibersih-primary/10 flex flex-col min-h-[400px]">
                        <div className="p-4 border-b border-sibersih-primary/5">
                            <h2 className="text-sm font-semibold text-sibersih-primary">Daftar Laporan Terakhir Anda</h2>
                        </div>
                        <div className="flex-1 bg-sibersih-bg p-4 flex flex-col gap-4 overflow-y-auto max-h-[500px]">
                        {reports.length === 0 ? (
                            <div className="flex-1 flex items-center justify-center text-sm text-sibersih-primary/40 font-bold">
                                Belum ada laporan.
                            </div>
                        ) : (
                            reports.map(report => (
                                <div key={report.id} className="bg-white p-4 rounded-xl border border-sibersih-primary/10 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                    <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                        <img src={report.fotoLaporanUrl} alt="Laporan" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-sibersih-primary line-clamp-1">{report.lokasi}</h3>
                                        <p className="text-sm text-sibersih-primary/60 mt-1 line-clamp-2">{report.deskripsi}</p>
                                        <div className="mt-2 text-xs font-medium px-2 py-1 bg-sibersih-primary/5 text-sibersih-primary rounded w-max">
                                            {report.status.replace('_', ' ')}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
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

                    {/* Tombol Lapor Cepat di Mobile */}
                    <Link href="/reporter/report" className="sm:hidden flex items-center justify-center gap-2 bg-sibersih-primary text-white px-4 py-3 rounded-xl font-medium text-sm hover:bg-sibersih-primary/90 transition">
                        <Plus size={16} /> Buat Laporan Baru
                    </Link>
                </div>
            </div>
        </div>
    );
}