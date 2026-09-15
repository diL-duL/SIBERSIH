"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Clock, CheckCircle, Hourglass, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import ReporterReportCard from "@/components/ReporterReportCard";
import StaffTaskCard from "@/components/StaffTaskCard";

export type ReportItem = {
  id: string;
  lokasi: string;
  deskripsi: string;
  deskripsiPetugas?: string | null;
  fotoLaporanUrl: string;
  fotoBuktiUrl?: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  latitude?: number | null;
  longitude?: number | null;
};

interface HistoryListClientProps {
  reports: ReportItem[];
  itemHrefPrefix?: string; // Optional prefix if item is clickable (e.g. "/staff/")
  pageSize?: number;
  role?: "PELAPOR" | "PETUGAS" | "PIMPINAN";
}

export default function HistoryListClient({
  reports,
  itemHrefPrefix,
  pageSize = 5,
  role,
}: HistoryListClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const term = searchTerm.trim().toLowerCase();

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch =
        !term ||
        report.lokasi.toLowerCase().includes(term) ||
        report.deskripsi.toLowerCase().includes(term) ||
        Boolean(report.deskripsiPetugas && report.deskripsiPetugas.toLowerCase().includes(term));

      const matchesStatus =
        statusFilter === "ALL" || report.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reports, term, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedReports = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * pageSize;
    return filteredReports.slice(startIndex, startIndex + pageSize);
  }, [filteredReports, validCurrentPage, pageSize]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "LAPORAN_MASUK":
        return (
          <Badge variant="outline" className="gap-1 bg-slate-100 text-slate-700 text-[11px] py-0.5">
            <Clock size={11} /> Menunggu
          </Badge>
        );
      case "MENUNGGU_APPROVAL":
        return (
          <Badge variant="warning" className="gap-1 text-[11px] py-0.5">
            <Hourglass size={11} /> Diproses
          </Badge>
        );
      case "SELESAI":
        return (
          <Badge variant="success" className="gap-1 text-[11px] py-0.5">
            <CheckCircle size={11} /> Selesai
          </Badge>
        );
      default:
        return <Badge variant="outline" className="text-[11px] py-0.5">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sibersih-primary/40 size-4" />
          <input
            type="text"
            placeholder="Cari lokasi atau deskripsi..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-white border border-sibersih-primary/15 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-sibersih-primary/20 transition-all shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {[
            { id: "ALL", label: "Semua" },
            { id: "LAPORAN_MASUK", label: "Menunggu" },
            { id: "MENUNGGU_APPROVAL", label: "Diproses" },
            { id: "SELESAI", label: "Selesai" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setStatusFilter(tab.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-sibersih-primary text-white shadow-2xs"
                  : "bg-white text-sibersih-primary/70 hover:bg-sibersih-primary/5 border border-sibersih-primary/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Info Jumlah Hasil */}
      <div className="flex items-center justify-between text-xs text-sibersih-primary/60 px-1">
        <span>Menampilkan {filteredReports.length} laporan</span>
        {totalPages > 1 && (
          <span>Halaman {validCurrentPage} dari {totalPages}</span>
        )}
      </div>

      {/* List Output */}
      <div className="flex flex-col gap-3.5 sm:gap-4">
        {filteredReports.length === 0 ? (
          <div className="py-12 bg-white rounded-xl border border-sibersih-primary/10 flex flex-col items-center justify-center text-sibersih-primary/40 font-medium text-center p-6">
            <Search size={36} className="mb-3 opacity-30" />
            <p className="text-xs sm:text-sm">Tidak ada riwayat laporan yang cocok.</p>
          </div>
        ) : (
          paginatedReports.map((item) => {
            const ContentNode = (
              <div className="flex flex-row p-3 sm:p-4 gap-3 sm:gap-4 items-start sm:items-center overflow-hidden">
                <div className="relative w-20 h-20 sm:w-28 sm:h-24 rounded-xl bg-gray-100 shrink-0 overflow-hidden border border-sibersih-primary/10 shadow-2xs">
                  <Image
                    src={item.fotoBuktiUrl || item.fotoLaporanUrl}
                    alt="Foto Laporan"
                    fill
                    sizes="(max-width: 640px) 80px, 112px"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-between flex-1 min-w-0 gap-1.5 sm:gap-2">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-sibersih-primary text-sm sm:text-base line-clamp-1">
                        {item.lokasi}
                      </h3>
                      {getStatusBadge(item.status)}
                    </div>
                    <p className="text-xs sm:text-sm text-sibersih-primary/70 line-clamp-2 leading-relaxed">
                      {item.deskripsi}
                    </p>
                    {item.deskripsiPetugas && (
                      <div className="mt-1.5 p-1.5 sm:p-2 bg-sibersih-bg/60 border border-sibersih-primary/10 rounded-lg text-xs text-sibersih-primary/80">
                        <span className="font-semibold block text-[10px] uppercase tracking-wider text-sibersih-primary/60">Catatan Petugas:</span>
                        <p className="line-clamp-2">{item.deskripsiPetugas}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-[11px] sm:text-xs text-sibersih-primary/50 font-medium pt-1">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );

            if (role === "PETUGAS") {
              return (
                <StaffTaskCard
                  key={item.id}
                  task={item}
                />
              );
            }

            if (itemHrefPrefix) {
              return (
                <Link key={item.id} href={`${itemHrefPrefix}${item.id}`} className="group">
                  <Card className="hover:border-sibersih-accent transition-all shadow-2xs hover:shadow-xs">{ContentNode}</Card>
                </Link>
              );
            }

            return (
              <ReporterReportCard
                key={item.id}
                report={item}
                showDeleteButton={false}
              />
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pt-3 flex items-center justify-between gap-2 border-t border-sibersih-primary/10">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={validCurrentPage === 1}
            className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg border border-sibersih-primary/15 bg-white hover:bg-sibersih-bg disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer shadow-2xs"
          >
            <ChevronLeft size={14} />
            <span className="hidden sm:inline">Sebelumnya</span>
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Menampilkan maksimal 5 nomor halaman agar rapi di layar ponsel
              if (
                totalPages > 5 &&
                Math.abs(page - validCurrentPage) > 2 &&
                page !== 1 &&
                page !== totalPages
              ) {
                if (Math.abs(page - validCurrentPage) === 3) {
                  return <span key={page} className="px-1 text-xs text-sibersih-primary/40">...</span>;
                }
                return null;
              }

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    page === validCurrentPage
                      ? "bg-sibersih-primary text-white shadow-2xs"
                      : "bg-white hover:bg-sibersih-bg text-sibersih-primary/70 border border-sibersih-primary/10"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={validCurrentPage === totalPages}
            className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg border border-sibersih-primary/15 bg-white hover:bg-sibersih-bg disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer shadow-2xs"
          >
            <span className="hidden sm:inline">Berikutnya</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

