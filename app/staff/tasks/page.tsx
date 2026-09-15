import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import StaffTaskCard from "@/components/StaffTaskCard";

export default async function PetugasTasks() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const tugasMasuk = await prisma.report.findMany({
        where: { status: "LAPORAN_MASUK" },
        orderBy: { createdAt: "desc" },
        take: 30,
    });

    return (
        <div className="pb-16 pt-8 min-h-screen bg-sibersih-bg flex flex-col max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <Link href="/staff" className="inline-flex items-center gap-2 text-sibersih-primary/60 hover:text-sibersih-primary font-medium text-sm mb-6 transition-colors">
                <ArrowLeft size={16} /> Kembali ke Beranda
            </Link>

            <header className="mb-8 border-b border-sibersih-primary/10 pb-4 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-semibold text-sibersih-primary">Daftar Tugas</h1>
                    <p className="text-sm text-sibersih-primary/60 mt-1">Area kerja Anda hari ini</p>
                </div>
                <Link href="/staff/history" className="text-xs font-medium text-sibersih-primary hover:underline">Riwayat Tugas</Link>
            </header>

            <div className="flex flex-col gap-3.5 sm:gap-4">
                {tugasMasuk.length === 0 ? (
                    <div className="py-12 bg-white rounded-xl border border-sibersih-primary/10 flex flex-col items-center justify-center text-sibersih-primary/40">
                        <AlertCircle size={48} className="mb-4 opacity-50" />
                        <p className="font-medium">Tidak ada tugas baru saat ini.</p>
                    </div>
                ) : (
                    tugasMasuk.map((tugas) => (
                        <StaffTaskCard key={tugas.id} task={tugas} />
                    ))
                )}
            </div>
        </div>
    );
}
