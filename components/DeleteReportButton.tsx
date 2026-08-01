"use client";

import { Trash2 } from "lucide-react";
import { hapusLaporan } from "@/lib/actions";
import { useTransition } from "react";

export default function DeleteReportButton({ reportId }: { reportId: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (window.confirm("Apakah Anda yakin ingin membatalkan dan menghapus laporan ini?")) {
            startTransition(async () => {
                try {
                    await hapusLaporan(reportId);
                } catch (error: any) {
                    alert(error.message || "Gagal menghapus laporan");
                }
            });
        }
    };

    return (
        <button 
            onClick={handleDelete}
            disabled={isPending}
            className={`p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Hapus Laporan"
        >
            <Trash2 size={16} />
        </button>
    );
}
