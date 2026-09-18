"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { tolakLaporanPalsu } from "@/lib/actions";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface RejectReportButtonProps {
  reportId: string;
  reportLocation?: string;
  variant?: "compact" | "validation" | "full";
  className?: string;
}

export default function RejectReportButton({
  reportId,
  reportLocation,
  variant = "compact",
  className = "",
}: RejectReportButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirmReject = () => {
    startTransition(async () => {
      try {
        await tolakLaporanPalsu(reportId);
        toast.success("Laporan berhasil ditolak dan dihapus permanen dari sistem.");
        setOpen(false);
      } catch (err: unknown) {
        const error = err as Error;
        toast.error(error.message || "Gagal menolak laporan.");
      }
    });
  };

  return (
    <>
      {variant === "compact" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          title="Tolak & Hapus Laporan Palsu"
          className={`inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 hover:text-red-700 bg-red-50/80 hover:bg-red-100/80 border border-red-200/70 px-2 py-1 rounded-md transition-colors active:scale-95 cursor-pointer ${className}`}
        >
          <Trash2 size={12} className="shrink-0" />
          <span>Tolak</span>
        </button>
      ) : variant === "validation" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          title="Tolak & Hapus Laporan Palsu"
          className={`h-10 px-3.5 sm:px-4 bg-white hover:bg-red-50 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs sm:text-sm shadow-2xs active:scale-[0.98] cursor-pointer shrink-0 ${className}`}
        >
          <Trash2 size={15} className="shrink-0 text-red-500" />
          <span>Tolak<span className="hidden sm:inline"> Laporan</span></span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`w-full h-10 bg-white hover:bg-red-50 text-red-600 hover:text-red-700 border border-red-200/80 font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-2xs active:scale-[0.98] cursor-pointer ${className}`}
        >
          <Trash2 size={15} />
          <span>Tolak Laporan Palsu</span>
        </button>
      )}

      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        title="Tolak & Hapus Laporan Palsu?"
        description={`Laporan ${
          reportLocation ? `di "${reportLocation}" ` : ""
        }akan dihapus secara permanen dari sistem, termasuk seluruh file foto yang tersimpan di cloud storage. Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus Laporan"
        cancelText="Batal"
        variant="destructive"
        isLoading={isPending}
        onConfirm={handleConfirmReject}
      />
    </>
  );
}
