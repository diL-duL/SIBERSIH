"use client";

import { useTransition } from "react";
import { Check } from "lucide-react";
import { approveLaporan } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ApproveReportButton({ reportId }: { reportId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      try {
        await approveLaporan(reportId);
        toast.success("Laporan berhasil disetujui & diselesaikan!");
      } catch (e: unknown) {
        const error = e as Error;
        toast.error(error.message || "Gagal menyetujui laporan");
      }
    });
  };

  return (
    <Button
      type="button"
      onClick={handleApprove}
      disabled={isPending}
      className="w-full bg-sibersih-primary hover:bg-sibersih-primary/90 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
    >
      <Check size={16} />
      {isPending ? "Memproses..." : "Setujui Pekerjaan"}
    </Button>
  );
}
