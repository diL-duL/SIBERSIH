"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Clock, CheckCircle, Hourglass } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import ReporterReportCard from "@/components/ReporterReportCard";

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
};

interface HistoryListClientProps {
  reports: ReportItem[];
  itemHrefPrefix?: string; // Optional prefix if item is clickable (e.g. "/staff/")
}

export default function HistoryListClient({ reports, itemHrefPrefix }: HistoryListClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.lokasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.deskripsi.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || report.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "LAPORAN_MASUK":
        return (
          <Badge variant="outline" className="gap-1 bg-gray-50">
            <Clock size={12} /> Menunggu
          </Badge>
        );
      case "MENUNGGU_APPROVAL":
        return (
          <Badge variant="warning" className="gap-1">
            <Hourglass size={12} /> Diproses
          </Badge>
        );
      case "SELESAI":
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle size={12} /> Selesai
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sibersih-primary/40 size-4" />
          <input
            type="text"
            placeholder="Cari lokasi atau deskripsi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-sibersih-primary/15 rounded-xl text-sm outline-none focus:ring-2 focus:ring-sibersih-primary/20 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "ALL", label: "Semua" },
            { id: "LAPORAN_MASUK", label: "Menunggu" },
            { id: "MENUNGGU_APPROVAL", label: "Diproses" },
            { id: "SELESAI", label: "Selesai" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? "bg-sibersih-primary text-white shadow-sm"
                  : "bg-white text-sibersih-primary/70 hover:bg-sibersih-primary/5 border border-sibersih-primary/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* List Output */}
      <div className="flex flex-col gap-4">
        {filteredReports.length === 0 ? (
          <div className="py-12 bg-white rounded-xl border border-sibersih-primary/10 flex flex-col items-center justify-center text-sibersih-primary/40 font-medium text-center p-6">
            <Search size={40} className="mb-3 opacity-30" />
            <p className="text-sm">Tidak ada riwayat laporan yang cocok.</p>
          </div>
        ) : (
          filteredReports.map((item) => {
            const ContentNode = (
              <div className="flex flex-col sm:flex-row overflow-hidden">
                <div className="relative w-full sm:w-40 h-36 sm:h-auto bg-gray-100 shrink-0 overflow-hidden border-b sm:border-b-0 sm:border-r border-sibersih-primary/10">
                  <Image
                    src={item.fotoBuktiUrl || item.fotoLaporanUrl}
                    alt="Foto Laporan"
                    fill
                    sizes="(max-width: 640px) 100vw, 160px"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-5 flex flex-col justify-between flex-1 gap-3">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3 className="font-semibold text-sibersih-primary text-base sm:text-lg line-clamp-1">
                        {item.lokasi}
                      </h3>
                      {getStatusBadge(item.status)}
                    </div>
                    <p className="text-xs sm:text-sm text-sibersih-primary/70 line-clamp-2 leading-relaxed">
                      {item.deskripsi}
                    </p>
                    {item.deskripsiPetugas && (
                      <div className="mt-2 p-2 bg-sibersih-bg/50 border border-sibersih-primary/5 rounded text-xs text-sibersih-primary/80">
                        <span className="font-semibold block mb-0.5 text-[10px] uppercase tracking-wider text-sibersih-primary/60">Catatan Petugas:</span>
                        {item.deskripsiPetugas}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-sibersih-primary/50 font-medium pt-2 border-t border-sibersih-primary/5">
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} />
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

            if (itemHrefPrefix) {
              return (
                <Link key={item.id} href={`${itemHrefPrefix}${item.id}`} className="group">
                  <Card className="hover:border-sibersih-accent transition-all">{ContentNode}</Card>
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
    </div>
  );
}
