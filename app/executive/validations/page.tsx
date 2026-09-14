import Image from "next/image";
import { User, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ApproveReportButton from "@/components/ApproveReportButton";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

export default async function PimpinanValidations() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const butuhApproval = await prisma.report.findMany({
        where: { status: "MENUNGGU_APPROVAL" },
        include: {
            pelapor: {
                select: { id: true, nama: true, email: true }
            },
            petugas: {
                select: { id: true, nama: true }
            }
        },
        orderBy: { updatedAt: "desc" },
        take: 50,
    });

    return (
        <div className="pb-16 pt-8 min-h-screen bg-sibersih-bg flex flex-col max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <Link href="/executive" className="inline-flex items-center gap-2 text-sibersih-primary/60 hover:text-sibersih-primary font-medium text-sm mb-6 transition-colors">
                <ArrowLeft size={16} /> Kembali ke Dashboard
            </Link>

            <header className="mb-8 border-b border-sibersih-primary/10 pb-4 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-semibold text-sibersih-primary">Validasi Pekerjaan</h1>
                    <p className="text-sm text-sibersih-primary/60 mt-1">Laporan yang membutuhkan persetujuan Anda</p>
                </div>
                <Link href="/executive/history" className="text-xs font-medium text-sibersih-primary hover:underline">Riwayat Validasi</Link>
            </header>

            {butuhApproval.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-sibersih-primary/10 p-12 text-center flex flex-col items-center justify-center">
                    <Check className="w-12 h-12 text-sibersih-primary/20 mb-4" />
                    <h3 className="text-lg font-semibold text-sibersih-primary mb-1">Semua Selesai!</h3>
                    <p className="text-sm text-sibersih-primary/60">Tidak ada laporan yang perlu divalidasi saat ini.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {butuhApproval.map((item) => (
                    <Card key={item.id} className="overflow-hidden flex flex-col justify-between shadow-2xs border-sibersih-primary/10">
                        <div>
                            <CardHeader className="p-4 sm:p-5 flex flex-row justify-between items-start gap-2">
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-bold text-base sm:text-lg text-sibersih-primary mb-1 line-clamp-1">
                                        {item.lokasi}
                                    </h3>
                                    <div className="flex flex-col gap-1 mt-1.5">
                                        <p className="text-xs sm:text-sm text-sibersih-primary/70 flex items-center gap-1.5 truncate">
                                            <User size={13} className="text-sibersih-primary/40 shrink-0" />
                                            <span className="text-sibersih-primary/60 shrink-0">Pelapor:</span>
                                            <span className="font-semibold text-sibersih-primary truncate">{item.pelapor.nama}</span>
                                        </p>
                                        <p className="text-xs sm:text-sm text-sibersih-primary/70 flex items-center gap-1.5 truncate">
                                            <User size={13} className="text-emerald-600/70 shrink-0" />
                                            <span className="text-sibersih-primary/60 shrink-0">Petugas:</span>
                                            <span className="font-semibold text-sibersih-primary truncate">{item.petugas?.nama || 'Petugas Kebersihan'}</span>
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="warning" className="text-[11px] shrink-0">Butuh Review</Badge>
                            </CardHeader>

                            <CardContent className="p-4 sm:p-5 pt-0 sm:pt-0 flex flex-col gap-3.5 sm:gap-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[11px] font-semibold text-sibersih-primary/60 uppercase tracking-wider flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Sebelum (Laporan)
                                        </span>
                                        <div className="relative w-full h-44 sm:h-36 bg-gray-100 border border-sibersih-primary/10 rounded-xl overflow-hidden group shadow-2xs">
                                            <Image src={item.fotoLaporanUrl} alt="Sebelum" fill sizes="(max-width: 640px) 100vw, 250px" className="object-cover transition-transform group-hover:scale-105" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Sesudah (Hasil Petugas)
                                        </span>
                                        <div className="relative w-full h-44 sm:h-36 bg-gray-100 border border-emerald-300/80 rounded-xl overflow-hidden group shadow-2xs">
                                            <Image src={item.fotoBuktiUrl!} alt="Sesudah" fill sizes="(max-width: 640px) 100vw, 250px" className="object-cover transition-transform group-hover:scale-105" />
                                        </div>
                                    </div>
                                </div>
                                {item.deskripsiPetugas && (
                                    <div className="bg-sibersih-bg/70 p-3 rounded-xl border border-sibersih-primary/10">
                                        <span className="text-[10px] font-semibold text-sibersih-primary/60 uppercase tracking-wider block mb-0.5">Catatan Petugas:</span>
                                        <p className="text-xs sm:text-sm text-sibersih-primary leading-relaxed">{item.deskripsiPetugas}</p>
                                    </div>
                                )}
                            </CardContent>
                        </div>

                        <CardFooter className="p-4 sm:p-5 bg-sibersih-bg/40 border-t border-sibersih-primary/10">
                            <ApproveReportButton reportId={item.id} />
                        </CardFooter>
                    </Card>
                ))}
                </div>
            )}
        </div>
    );
}
