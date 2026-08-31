"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { hapusLaporan } from "@/lib/actions";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function DeleteReportButton({ reportId }: { reportId: string }) {
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
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        disabled={isPending}
        className={`p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors ${
          isPending ? "opacity-50 cursor-not-allowed" : ""
        }`}
        title="Hapus Laporan"
      >
        <Trash2 size={16} />
      </button>

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
