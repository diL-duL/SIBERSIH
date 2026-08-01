import { User, Check, X, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { approveLaporan } from "@/lib/actions";

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
                {butuhApproval.map((item: any) => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-sibersih-primary/10 overflow-hidden">
                        <div className="p-5 border-b border-sibersih-primary/5 flex justify-between items-start">
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
                            <span className="inline-flex items-center text-xs font-semibold text-orange-700 bg-orange-100 px-2.5 py-1 rounded">
                                Menunggu Review
                            </span>
                        </div>

                        <div className="p-5 grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-semibold text-sibersih-primary/60 uppercase tracking-wider">Kondisi Awal</span>
                                <div className="w-full h-32 bg-gray-100 border border-sibersih-primary/10 rounded-lg flex flex-col items-center justify-center gap-2 relative overflow-hidden">
                                    <img src={item.fotoLaporanUrl} alt="Awal" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-semibold text-sibersih-primary/60 uppercase tracking-wider">Hasil Kerja</span>
                                <div className="w-full h-32 bg-gray-100 border border-green-200 rounded-lg flex flex-col items-center justify-center gap-2 relative overflow-hidden">
                                    <img src={item.fotoBuktiUrl!} alt="Akhir" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>

                        <div className="p-5 bg-sibersih-bg/50 border-t border-sibersih-primary/10 flex gap-3">
                            <form action={async () => {
                                "use server";
                                await approveLaporan(item.id);
                            }} className="flex-1">
                                <button type="submit" className="w-full bg-sibersih-primary hover:bg-sibersih-primary/90 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                                    <Check size={16} /> Setujui
                                </button>
                            </form>
                        </div>
                    </div>
                ))}
                </div>
            )}
        </div>
    );
}
