"use client";

import { useState } from "react";
import Link from "next/link";
import { Inbox, ArrowRight } from "lucide-react";
import ReporterReportCard, { ReportCardData } from "@/components/ReporterReportCard";

interface ReporterDashboardReportsProps {
  reports: ReportCardData[];
  className?: string;
}

export default function ReporterDashboardReports({
  reports,
  className = "",
}: ReporterDashboardReportsProps) {
  // Menampilkan hingga 5 laporan terakhir (pada mobile disaring via CSS menjadi 2 laporan)
  const displayReports = reports.slice(0, 5);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-sibersih-primary/10 flex flex-col overflow-hidden ${className}`}>
      {/* HEADER CARD */}
      <div className="p-3.5 sm:p-4 border-b border-sibersih-primary/5 bg-gray-50/50 rounded-t-xl shrink-0 flex justify-between items-center gap-2">
        <div>
          <h2 className="text-sm font-semibold text-sibersih-primary">
            Laporan Terakhir Anda
          </h2>
          <p className="text-xs text-sibersih-primary/60 mt-0.5">
            Pantau tahapan penanganan laporan Anda
          </p>
        </div>
        <Link
          href="/reporter/history"
          className="text-xs font-semibold text-sibersih-primary hover:underline shrink-0 flex items-center gap-1"
        >
          <span>Riwayat</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* LIST LAPORAN (MOBILE: 2 LAPORAN, DESKTOP: HINGGA 5 LAPORAN) */}
      <div className="bg-sibersih-bg/30 p-3 sm:p-4 flex flex-col gap-3 sm:gap-4">
        {displayReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-sibersih-primary/40 gap-3 py-10">
            <div className="w-14 h-14 rounded-full bg-sibersih-primary/5 flex items-center justify-center">
              <Inbox size={28} className="opacity-50" />
            </div>
            <span className="font-semibold text-xs sm:text-sm">
              Belum ada laporan yang Anda buat.
            </span>
          </div>
        ) : (
          <>
            {displayReports.map((report, index) => (
              <div
                key={report.id}
                className={index >= 2 ? "hidden sm:block" : "block"}
              >
                <ReporterReportCard
                  report={report}
                  priorityImage={index === 0}
                  showDeleteButton={true}
                  isOpen={expandedId === report.id}
                  onToggle={() => handleToggle(report.id)}
                />
              </div>
            ))}

            {/* TOMBOL LIHAT LAINNYA */}
            <div className="pt-1">
              <Link
                href="/reporter/history"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-sibersih-primary/15 bg-white hover:bg-sibersih-bg text-sibersih-primary text-xs font-semibold shadow-2xs transition-colors"
              >
                <span>Lihat Lainnya</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

