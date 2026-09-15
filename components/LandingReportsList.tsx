"use client";

import { useState } from "react";
import { Clock, MapPin, ArrowRight, ChevronUp } from "lucide-react";

export interface LandingReportItem {
  id: string;
  lokasi: string;
  deskripsi: string;
  deskripsiPetugas?: string | null;
  status: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  pelapor?: {
    nama: string;
  } | null;
  petugas?: {
    nama: string;
  } | null;
}

interface LandingReportsListProps {
  reports: LandingReportItem[];
}

function getStatusBadge(status: string) {
  switch (status) {
    case "SELESAI":
      return (
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Selesai
        </span>
      );
    case "MENUNGGU_APPROVAL":
      return (
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Menunggu Validasi
        </span>
      );
    case "LAPORAN_MASUK":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Laporan Masuk
        </span>
      );
  }
}

export default function LandingReportsList({ reports }: LandingReportsListProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedReports = showAll ? reports : reports.slice(0, 3);

  if (reports.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-sibersih-primary/50 bg-white rounded-xl border border-dashed border-sibersih-primary/15">
        Belum ada laporan kebersihan saat ini.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {displayedReports.map((report) => {
          const pelaporNama = report.pelapor?.nama || "Civitas Akademika";
          const petugasNama = report.petugas?.nama || "Belum Ditugaskan";

          return (
            <div
              key={report.id}
              className="bg-white rounded-xl border border-sibersih-primary/10 shadow-xs hover:shadow-sm transition-all p-4 sm:p-5 flex flex-col justify-between"
            >
              <div>
                {/* Lokasi & Status */}
                <div className="flex items-start justify-between gap-2.5 mb-2.5">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-mono font-medium text-sibersih-primary/50 bg-sibersih-primary/5 px-1.5 py-0.5 rounded border border-sibersih-primary/10 inline-block mb-1">
                      #{report.id.substring(0, 8)}
                    </span>
                    <h3 className="font-bold text-sibersih-primary text-sm sm:text-base line-clamp-1 flex items-center gap-1.5">
                      <MapPin size={14} className="text-sibersih-primary/50 shrink-0" />
                      <span className="truncate">{report.lokasi}</span>
                    </h3>
                  </div>
                  {getStatusBadge(report.status)}
                </div>

                {/* Detail Laporan & Catatan Petugas */}
                <div className="space-y-2.5 mb-4">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-sibersih-primary/50 block">
                      Deskripsi Laporan:
                    </span>
                    <p className="text-xs sm:text-sm text-sibersih-primary/80 leading-relaxed mt-0.5">
                      {report.deskripsi}
                    </p>
                  </div>

                  {report.deskripsiPetugas && (
                    <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 block mb-0.5">
                        Catatan Petugas:
                      </span>
                      <p className="text-emerald-950/80 leading-relaxed">
                        {report.deskripsiPetugas}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Metadata: Pelapor, Petugas, dan Waktu */}
              <div className="pt-3 border-t border-sibersih-primary/10 flex flex-col gap-1.5 text-xs text-sibersih-primary/60">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate">
                    Pelapor: <strong className="text-sibersih-primary font-medium">{pelaporNama}</strong>
                  </span>
                  <span className="truncate text-right">
                    Petugas: <strong className="text-sibersih-primary font-medium">{petugasNama}</strong>
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-sibersih-primary/5 text-[11px] text-sibersih-primary/50">
                  <span className="flex items-center gap-1">
                    <Clock size={12} className="shrink-0" />
                    {new Date(report.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {report.status === "SELESAI" && (
                    <span className="text-emerald-700 font-medium">
                      Selesai:{" "}
                      {new Date(report.updatedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tombol Lihat Semua Laporan */}
      {reports.length > 3 && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-sibersih-primary/15 bg-white hover:bg-sibersih-bg text-sibersih-primary font-semibold text-xs sm:text-sm shadow-2xs hover:shadow-xs active:scale-[0.99] transition-all cursor-pointer"
          >
            <span>
              {showAll ? "Tampilkan Lebih Sedikit" : "Lihat Semua Laporan"}
            </span>
            {showAll ? <ChevronUp size={15} /> : <ArrowRight size={15} />}
          </button>
        </div>
      )}
    </div>
  );
}
