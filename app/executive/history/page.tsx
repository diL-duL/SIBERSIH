import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import HistoryListClient from "@/components/HistoryListClient";

export default async function ExecutiveHistoryPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const allReports = await prisma.report.findMany({
        orderBy: { createdAt: "desc" },
        take: 200,
    });

    return (
        <div className="min-h-screen bg-sibersih-bg py-8 px-4 sm:px-6 lg:px-8 pb-16">
            <div className="max-w-3xl mx-auto w-full">
                <Link href="/executive" className="inline-flex items-center gap-2 text-sibersih-primary/60 hover:text-sibersih-primary font-medium text-sm mb-6 transition-colors">
                    <ArrowLeft size={16} /> Kembali ke Beranda
                </Link>

                <header className="mb-6">
                    <h1 className="text-2xl font-semibold text-sibersih-primary">Riwayat &amp; Pemantauan Laporan</h1>
                    <p className="text-sm text-sibersih-primary/60 mt-1">
                        Daftar dan pemantauan seluruh laporan kebersihan civitas akademika.
                    </p>
                </header>

                <HistoryListClient reports={allReports} role="PIMPINAN" />
            </div>
        </div>
    );
}
