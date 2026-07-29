import Link from "next/link";
import { ArrowLeft, Clock, MapPin, CheckCircle, Image as ImageIcon } from "lucide-react";

export default function StaffHistoryPage() {
    const completedTasks = [
        {
            id: "TSK-102",
            lokasi: "Lobby Utama Rektorat",
            waktuSelesai: "12 Okt 2026, 15:00",
            status: "selesai"
        },
        {
            id: "TSK-101",
            lokasi: "Toilet Lantai 2 FT",
            waktuSelesai: "11 Okt 2026, 11:30",
            status: "selesai"
        }
    ];

    return (
        <div className="min-h-screen bg-sibersih-bg py-8 px-4 sm:px-6 lg:px-8 pb-32">
            <div className="max-w-3xl mx-auto w-full">
                <Link href="/staff" className="inline-flex items-center gap-2 text-sibersih-primary/60 hover:text-sibersih-primary font-medium text-sm mb-6 transition-colors">
                    <ArrowLeft size={16} /> Kembali ke Daftar Tugas
                </Link>

                <header className="mb-8">
                    <h1 className="text-2xl font-semibold text-sibersih-primary">Riwayat Pekerjaan</h1>
                    <p className="text-sm text-sibersih-primary/60 mt-1">
                        Daftar tugas kebersihan yang telah Anda selesaikan.
                    </p>
                </header>

                <div className="flex flex-col gap-4">
                    {completedTasks.map((tugas) => (
                        <div key={tugas.id} className="bg-white rounded-xl shadow-sm border border-sibersih-primary/10 overflow-hidden flex flex-col sm:flex-row">
                            <div className="w-full sm:w-40 h-32 sm:h-auto bg-sibersih-primary/5 flex flex-col items-center justify-center text-sibersih-primary/40 gap-2 shrink-0 border-b sm:border-b-0 sm:border-r border-sibersih-primary/10">
                                <ImageIcon size={24} />
                                <span className="text-xs font-medium uppercase tracking-wider">Foto Bukti</span>
                            </div>
                            
                            <div className="p-5 flex flex-col justify-center flex-1">
                                <div className="flex items-start justify-between gap-4 mb-2">
                                    <h3 className="font-semibold text-sibersih-primary text-lg">{tugas.lokasi}</h3>
                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md border bg-sibersih-accent/20 text-sibersih-primary border-sibersih-accent/30 shrink-0">
                                        <CheckCircle size={14} /> Selesai
                                    </span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-sibersih-primary/60 font-medium">
                                    <span className="flex items-center gap-1.5">
                                        <MapPin size={14} /> ID: {tugas.id}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock size={14} /> Diselesaikan: {tugas.waktuSelesai}
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
