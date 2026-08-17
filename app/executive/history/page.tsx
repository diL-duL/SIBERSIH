import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, MapPin, CheckCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ExecutiveHistoryPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const completedTasks = await prisma.report.findMany({
        where: { status: "SELESAI" },
        orderBy: { updatedAt: "desc" }
    });

    return (
        <div className="min-h-screen bg-sibersih-bg py-8 px-4 sm:px-6 lg:px-8 pb-32">
            <div className="max-w-3xl mx-auto w-full">
                <Link href="/executive" className="inline-flex items-center gap-2 text-sibersih-primary/60 hover:text-sibersih-primary font-medium text-sm mb-6 transition-colors">
                    <ArrowLeft size={16} /> Kembali ke Dashboard
                </Link>

                <header className="mb-8">
                    <h1 className="text-2xl font-semibold text-sibersih-primary">Riwayat Validasi</h1>
                    <p className="text-sm text-sibersih-primary/60 mt-1">
                        Daftar laporan kebersihan yang telah disetujui.
                    </p>
                </header>

                <div className="flex flex-col gap-4">
                    {completedTasks.length === 0 ? (
                        <div className="py-12 flex items-center justify-center text-sibersih-primary/40 font-medium">
                            Belum ada riwayat validasi.
                        </div>
                    ) : (
                        completedTasks.map((tugas) => (
                            <div key={tugas.id} className="bg-white rounded-xl shadow-sm border border-sibersih-primary/10 overflow-hidden flex flex-col sm:flex-row hover:border-sibersih-accent transition-colors">
                                <div className="relative w-full sm:w-40 h-32 sm:h-auto bg-gray-100 flex flex-col items-center justify-center shrink-0 border-b sm:border-b-0 sm:border-r border-sibersih-primary/10 overflow-hidden">
                                    <Image src={tugas.fotoBuktiUrl || tugas.fotoLaporanUrl} alt="Bukti" fill sizes="(max-width: 640px) 100vw, 160px" className="object-cover" />
                                </div>
                                
                                <div className="p-5 flex flex-col justify-center flex-1">
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <h3 className="font-semibold text-sibersih-primary text-lg line-clamp-1">{tugas.lokasi}</h3>
                                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md border shrink-0 bg-sibersih-accent/20 text-sibersih-primary border-sibersih-accent/30">
                                            <CheckCircle size={14} /> Selesai
                                        </span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-sibersih-primary/60 font-medium">
                                        <span className="flex items-center gap-1.5 line-clamp-1">
                                            <MapPin size={14} /> {tugas.deskripsi}
                                        </span>
                                        <span className="flex items-center gap-1.5 shrink-0">
                                            <Clock size={14} /> {new Date(tugas.updatedAt).toLocaleDateString("id-ID", {
                                                day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
