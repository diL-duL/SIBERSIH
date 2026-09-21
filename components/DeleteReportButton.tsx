"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { hapusLaporan } from "@/lib/actions";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface DeleteReportButtonProps {
  reportId: string;
  showText?: boolean;
  className?: string;
  size?: number;
}

export default function DeleteReportButton({
  reportId,
  showText = false,
  className = "",
  size = 14,
}: DeleteReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirmDelete = () => {
    startTransition(async () => {
      try {
        await hapusLaporan(reportId);
        toast.success("Laporan berhasil dibatalkan dan dihapus");
        setIsOpen(false);
      } catch (e: unknown) {
        const error = e as Error;
        toast.error(error.message || "Gagal menghapus laporan");
      }
    });
  };

  return (
    <>
      {showText ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          disabled={isPending}
          className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            isPending ? "opacity-50 cursor-not-allowed" : ""
          } ${className}`}
          title="Hapus Laporan"
        >
          <Trash2 size={13} />
          <span>Hapus Laporan</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          disabled={isPending}
          className={`p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors inline-flex items-center justify-center cursor-pointer ${
            isPending ? "opacity-50 cursor-not-allowed" : ""
          } ${className}`}
          title="Hapus Laporan"
        >
          <Trash2 size={size} />
        </button>
      )}

      <AlertDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Batalkan & Hapus Laporan?"
        description="Apakah Anda yakin ingin membatalkan laporan kebersihan ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus Laporan"
        cancelText="Batal"
        variant="destructive"
        onConfirm={handleConfirmDelete}
        isLoading={isPending}
      />
    </>
  );
}
