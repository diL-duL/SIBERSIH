import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle, Hourglass, Megaphone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ReporterHistoryPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const historyData = await prisma.report.findMany({
        where: { pelaporId: session.user.id },
        orderBy: { createdAt: "desc" }
    });

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "LAPORAN_MASUK":
                return {
                    label: "Menunggu",
                    icon: <Clock size={14} />,
                    classes: "bg-gray-100 text-gray-700 border-gray-200"
                };
            case "MENUNGGU_APPROVAL":
                return {
                    label: "Diproses",
                    icon: <Hourglass size={14} />,
                    classes: "bg-orange-100 text-orange-700 border-orange-200"
                };
            case "SELESAI":
                return {
                    label: "Selesai",
                    icon: <CheckCircle size={14} />,
                    classes: "bg-sibersih-accent/20 text-sibersih-primary border-sibersih-accent/30"
                };
            default:
                return {
                    label: "Menunggu",
                    icon: <Clock size={14} />,
                    classes: "bg-gray-100 text-gray-700 border-gray-200"
                };
        }
    };

    return (
        <div className="min-h-screen bg-sibersih-bg py-8 px-4 sm:px-6 lg:px-8 pb-32">
            <div className="max-w-3xl mx-auto w-full">
                <Link href="/reporter" className="inline-flex items-center gap-2 text-sibersih-primary/60 hover:text-sibersih-primary font-medium text-sm mb-6 transition-colors">
                    <ArrowLeft size={16} /> Kembali ke Dashboard
                </Link>

                <header className="mb-8">
                    <h1 className="text-2xl font-semibold text-sibersih-primary">Riwayat Laporan</h1>
                    <p className="text-sm text-sibersih-primary/60 mt-1">
                        Daftar laporan kebersihan yang telah Anda buat.
                    </p>
                </header>

                <div className="flex flex-col gap-4">
                    {historyData.length === 0 ? (
                        <div className="py-12 flex flex-col items-center justify-center text-sibersih-primary/40 font-medium">
                            <Megaphone size={48} className="mb-4 opacity-50" />
                            Belum ada riwayat laporan.
                        </div>
                    ) : (
                        historyData.map((item) => {
                            const statusConfig = getStatusConfig(item.status);
                            return (
                                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-sibersih-primary/10 p-5 flex flex-col gap-3 hover:border-sibersih-accent transition-colors">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="font-semibold text-sibersih-primary text-lg">{item.lokasi}</h3>
                                            <p className="text-sm text-sibersih-primary/70 mt-1">{item.deskripsi}</p>
                                        </div>
                                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md border ${statusConfig.classes} shrink-0`}>
                                            {statusConfig.icon} {statusConfig.label}
                                        </span>
                                    </div>
                                    <div className="mt-2 flex items-center gap-4 text-xs text-sibersih-primary/60 font-medium">
                                        <span className="flex items-center gap-1.5">
                                            <Clock size={14} /> {new Date(item.createdAt).toLocaleDateString("id-ID", {
                                                day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                                            })}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
