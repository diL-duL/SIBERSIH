import Link from "next/link";
import { ArrowLeft, Clock, MapPin, CheckCircle, Hourglass, XCircle } from "lucide-react";

export default function ReporterHistoryPage() {
    const historyData = [
        {
            id: "RPT-003",
            lokasi: "Samping Gedung Perpustakaan",
            waktu: "12 Okt 2026, 14:30",
            status: "menunggu",
            deskripsi: "Ada tumpukan sampah plastik yang belum diangkut sejak kemarin sore."
        },
        {
            id: "RPT-002",
            lokasi: "Kantin Fakultas Teknik",
            waktu: "10 Okt 2026, 09:15",
            status: "diproses",
            deskripsi: "Wastafel tersumbat dan air meluap ke lantai."
        },
        {
            id: "RPT-001",
            lokasi: "Taman Rektorat",
            waktu: "05 Okt 2026, 08:00",
            status: "selesai",
            deskripsi: "Daun kering berserakan di sekitar bangku taman."
        }
    ];

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "menunggu":
                return {
                    label: "Menunggu",
                    icon: <Clock size={14} />,
                    classes: "bg-gray-100 text-gray-700 border-gray-200"
                };
            case "diproses":
                return {
                    label: "Diproses",
                    icon: <Hourglass size={14} />,
                    classes: "bg-orange-100 text-orange-700 border-orange-200"
                };
            case "selesai":
                return {
                    label: "Selesai",
                    icon: <CheckCircle size={14} />,
                    classes: "bg-sibersih-accent/20 text-sibersih-primary border-sibersih-accent/30"
                };
            default:
                return {
                    label: "Ditolak",
                    icon: <XCircle size={14} />,
                    classes: "bg-red-100 text-red-700 border-red-200"
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
                    {historyData.map((item) => {
                        const statusConfig = getStatusConfig(item.status);
                        return (
                            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-sibersih-primary/10 p-5 flex flex-col gap-3">
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
                                        <MapPin size={14} /> ID: {item.id}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock size={14} /> {item.waktu}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
