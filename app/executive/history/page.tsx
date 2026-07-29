import Link from "next/link";
import { ArrowLeft, Clock, MapPin, CheckCircle, XCircle, Image as ImageIcon } from "lucide-react";

export default function ExecutiveHistoryPage() {
    const historyData = [
        {
            id: "VAL-205",
            lokasi: "Taman Rektorat",
            pelapor: "Budi (Mahasiswa)",
            petugas: "Pak Yanto",
            waktuValidasi: "13 Okt 2026, 09:15",
            status: "disetujui"
        },
        {
            id: "VAL-204",
            lokasi: "Parkiran Motor Mahasiswa",
            pelapor: "Siti (Dosen)",
            petugas: "Mas Budi",
            waktuValidasi: "12 Okt 2026, 14:30",
            status: "ditolak"
        }
    ];

    return (
        <div className="min-h-screen bg-sibersih-bg py-8 px-4 sm:px-6 lg:px-8 pb-32">
            <div className="max-w-4xl mx-auto w-full">
                <Link href="/executive" className="inline-flex items-center gap-2 text-sibersih-primary/60 hover:text-sibersih-primary font-medium text-sm mb-6 transition-colors">
                    <ArrowLeft size={16} /> Kembali ke Validasi
                </Link>

                <header className="mb-8">
                    <h1 className="text-2xl font-semibold text-sibersih-primary">Riwayat Validasi</h1>
                    <p className="text-sm text-sibersih-primary/60 mt-1">
                        Daftar pekerjaan yang telah Anda setujui atau tolak.
                    </p>
                </header>

                <div className="flex flex-col gap-6">
                    {historyData.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl shadow-sm border border-sibersih-primary/10 overflow-hidden flex flex-col md:flex-row">
                            {/* Komparasi Foto di Kiri */}
                            <div className="w-full md:w-64 flex flex-col gap-2 p-4 bg-sibersih-bg/30 border-b md:border-b-0 md:border-r border-sibersih-primary/10">
                                <div className="flex gap-2">
                                    <div className="flex-1 flex flex-col gap-1">
                                        <span className="text-[10px] font-semibold text-sibersih-primary/60 uppercase tracking-wider text-center">Awal</span>
                                        <div className="h-20 bg-sibersih-primary/5 rounded border border-sibersih-primary/10 flex flex-col items-center justify-center text-sibersih-primary/40">
                                            <ImageIcon size={16} />
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col gap-1">
                                        <span className="text-[10px] font-semibold text-sibersih-primary/60 uppercase tracking-wider text-center">Bukti</span>
                                        <div className="h-20 bg-sibersih-primary/5 rounded border border-sibersih-primary/10 flex flex-col items-center justify-center text-sibersih-primary/40">
                                            <ImageIcon size={16} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Detail Informasi */}
                            <div className="p-5 flex flex-col justify-center flex-1">
                                <div className="flex items-start justify-between gap-4 mb-3">
                                    <h3 className="font-semibold text-sibersih-primary text-lg">{item.lokasi}</h3>
                                    {item.status === "disetujui" ? (
                                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md border bg-sibersih-accent/20 text-sibersih-primary border-sibersih-accent/30 shrink-0">
                                            <CheckCircle size={14} /> Disetujui
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md border bg-red-100 text-red-700 border-red-200 shrink-0">
                                            <XCircle size={14} /> Ditolak
                                        </span>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-4">
                                    <p className="text-sm text-sibersih-primary/70">
                                        <span className="text-sibersih-primary/50 text-xs">Pelapor:</span> {item.pelapor}
                                    </p>
                                    <p className="text-sm text-sibersih-primary/70">
                                        <span className="text-sibersih-primary/50 text-xs">Petugas:</span> {item.petugas}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-sibersih-primary/60 font-medium pt-3 border-t border-sibersih-primary/5 mt-auto">
                                    <span className="flex items-center gap-1.5">
                                        <MapPin size={14} /> ID: {item.id}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock size={14} /> Divalidasi: {item.waktuValidasi}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
