import Image from "next/image";
import { User, Check } from "lucide-react";
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
        include: { pelapor: true }
    });

    return (
        <div className="pb-32 pt-8 min-h-screen bg-sibersih-bg flex flex-col max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {butuhApproval.map((item) => (
                    <Card key={item.id} className="overflow-hidden flex flex-col justify-between">
                        <div>
                            <CardHeader className="p-5 flex flex-row justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-lg text-sibersih-primary mb-2">
                                        {item.lokasi}
                                    </h3>
                                    <div className="flex flex-col gap-1 mt-2">
                                        <p className="text-sm text-sibersih-primary/70 flex items-start sm:items-center gap-2">
                                            <User size={14} className="text-sibersih-primary/40 mt-0.5 sm:mt-0 shrink-0" />
                                            <span className="text-sibersih-primary/60 w-20 shrink-0">Dilaporkan:</span>
                                            <span className="font-medium text-sibersih-primary break-words">{item.pelapor.nama}</span>
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="warning">Menunggu Review</Badge>
                            </CardHeader>

                            <CardContent className="p-5 grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <span className="text-xs font-semibold text-sibersih-primary/60 uppercase tracking-wider">Sebelum (Laporan)</span>
                                    <div className="relative w-full h-36 bg-gray-100 border border-sibersih-primary/10 rounded-lg overflow-hidden group">
                                        <Image src={item.fotoLaporanUrl} alt="Sebelum" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition-transform group-hover:scale-105" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-xs font-semibold text-sibersih-primary/60 uppercase tracking-wider">Sesudah (Hasil Kerja)</span>
                                    <div className="relative w-full h-36 bg-gray-100 border border-emerald-200 rounded-lg overflow-hidden group">
                                        <Image src={item.fotoBuktiUrl!} alt="Sesudah" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition-transform group-hover:scale-105" />
                                    </div>
                                </div>
                            </CardContent>
                        </div>

                        <CardFooter className="p-5 bg-sibersih-bg/50 border-t border-sibersih-primary/10">
                            <ApproveReportButton reportId={item.id} />
                        </CardFooter>
                    </Card>
                ))}
                </div>
            )}
        </div>
    );
}
