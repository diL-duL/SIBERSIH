import Link from "next/link";
import { MapPin, Clock, AlertCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function PetugasTasks() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const tugasMasuk = await prisma.report.findMany({
        where: { status: "LAPORAN_MASUK" },
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="pb-32 pt-8 min-h-screen bg-sibersih-bg flex flex-col max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <header className="mb-8 border-b border-sibersih-primary/10 pb-4 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-semibold text-sibersih-primary">Daftar Tugas</h1>
                    <p className="text-sm text-sibersih-primary/60 mt-1">Area kerja Anda hari ini</p>
                </div>
                <Link href="/staff/history" className="text-xs font-medium text-sibersih-primary hover:underline">Riwayat Tugas</Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tugasMasuk.length === 0 ? (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-sibersih-primary/40">
                        <AlertCircle size={48} className="mb-4 opacity-50" />
                        <p className="font-medium">Tidak ada tugas baru saat ini.</p>
                    </div>
                ) : (
                    tugasMasuk.map((tugas) => (
                        <div key={tugas.id} className="bg-white rounded-xl shadow-sm border border-sibersih-primary/10 flex flex-col overflow-hidden">
                            <div className="w-full h-32 bg-gray-100 overflow-hidden">
                                <img src={tugas.fotoLaporanUrl} alt="Laporan" className="w-full h-full object-cover" />
                            </div>

                            <div className="p-4 flex flex-col flex-1">
                                <div className="flex items-start justify-between gap-2 mb-3">
                                    <h3 className="font-semibold text-sibersih-primary leading-tight line-clamp-1">
                                        {tugas.lokasi}
                                    </h3>
                                    <span className="inline-flex items-center text-[10px] font-semibold text-orange-700 bg-orange-100 px-2 py-1 rounded">
                                        Baru
                                    </span>
                                </div>

                                <div className="flex flex-col gap-2 mt-auto mb-4">
                                    <p className="text-xs text-sibersih-primary/70 flex items-center gap-2 line-clamp-1">
                                        <MapPin size={14} className="text-sibersih-primary/40 shrink-0" /> 
                                        {tugas.deskripsi}
                                    </p>
                                    <p className="text-xs text-sibersih-primary/70 flex items-center gap-2">
                                        <Clock size={14} className="text-sibersih-primary/40" /> 
                                        {new Date(tugas.createdAt).toLocaleDateString("id-ID", {
                                            day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                                        })}
                                    </p>
                                </div>

                                <Link href={`/staff/${tugas.id}`} className="w-full text-center bg-sibersih-primary text-white font-medium text-sm py-2.5 rounded-lg hover:bg-sibersih-primary/90 transition-colors">
                                    Kerjakan Tugas
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
