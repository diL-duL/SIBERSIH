"use client";

import { useState } from "react";
import Link from "next/link";
import { Inbox, Plus } from "lucide-react";
import ReporterReportCard, { ReportCardData } from "@/components/ReporterReportCard";

interface ReporterDashboardReportsProps {
  reports: ReportCardData[];
}

export default function ReporterDashboardReports({
  reports,
}: ReporterDashboardReportsProps) {
  // Hanya menampilkan maksimal 3 laporan terakhir
  const displayReports = reports.slice(0, 3);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-sibersih-primary/10 flex flex-col h-[550px] sm:h-[600px] lg:h-[650px] max-h-[85vh] overflow-hidden">
      {/* HEADER CARD (PINNED AT TOP) */}
      <div className="p-4 border-b border-sibersih-primary/5 bg-gray-50/50 rounded-t-xl shrink-0 flex justify-between items-center">
        <div>
          <h2 className="text-sm font-semibold text-sibersih-primary">
            Daftar Laporan Terakhir Anda
          </h2>
          <p className="text-xs text-sibersih-primary/60 mt-0.5">
            Menampilkan 3 laporan terbaru dengan fitur progres &amp; hasil akhir
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-sibersih-primary/5 text-sibersih-primary rounded-full shrink-0">
          {displayReports.length} Laporan
        </span>
      </div>

      {/* LIST 3 LAPORAN TERAKHIR DENGAN SCROLL MANDIRI */}
      <div className="flex-1 bg-sibersih-bg/30 p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar overscroll-contain">
        {displayReports.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-sibersih-primary/40 gap-3 py-12">
            <div className="w-16 h-16 rounded-full bg-sibersih-primary/5 flex items-center justify-center">
              <Inbox size={32} className="opacity-50" />
            </div>
            <span className="font-semibold text-sm">
              Belum ada laporan yang Anda buat.
            </span>
            <Link
              href="/reporter/report"
              className="mt-1 flex items-center gap-1.5 text-xs font-semibold bg-sibersih-primary text-white px-3.5 py-2 rounded-lg hover:bg-sibersih-primary/90 transition shadow-sm"
            >
              <Plus size={14} /> Buat Laporan Pertama
            </Link>
          </div>
        ) : (
          displayReports.map((report, index) => (
            <ReporterReportCard
              key={report.id}
              report={report}
              priorityImage={index === 0}
              showDeleteButton={true}
              isOpen={expandedId === report.id}
              onToggle={() => handleToggle(report.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
