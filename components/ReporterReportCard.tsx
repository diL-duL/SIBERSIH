"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Hourglass,
  CheckCircle2,
  ZoomIn,
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
  Check,
  Pencil,
} from "lucide-react";
import DeleteReportButton from "@/components/DeleteReportButton";
import ImageLightboxModal from "@/components/ImageLightboxModal";
import { Badge } from "@/components/ui/badge";

export type ReportCardData = {
  id: string;
  lokasi: string;
  deskripsi: string;
  fotoLaporanUrl: string;
  fotoBuktiUrl?: string | null;
  deskripsiPetugas?: string | null;
  status: string; // "LAPORAN_MASUK" | "MENUNGGU_APPROVAL" | "SELESAI"
  createdAt: Date | string;
  updatedAt: Date | string;
  latitude?: number | null;
  longitude?: number | null;
};

interface ReporterReportCardProps {
  report: ReportCardData;
  priorityImage?: boolean;
  showDeleteButton?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ReporterReportCard({
  report,
  priorityImage = false,
  showDeleteButton = true,
  isOpen: controlledIsOpen,
  onToggle,
}: ReporterReportCardProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalIsOpen((prev) => !prev);
    }
  };
  const [lightbox, setLightbox] = useState<{
    isOpen: boolean;
    src: string | null;
    alt: string;
  }>({
    isOpen: false,
    src: null,
    alt: "",
  });

  const isCompleted = report.status === "SELESAI";
  const isReviewing = report.status === "MENUNGGU_APPROVAL";
  const isPending = report.status === "LAPORAN_MASUK";

  const openLightbox = (src: string, alt: string) => {
    setLightbox({ isOpen: true, src, alt });
  };

  const closeLightbox = () => {
    setLightbox((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-sibersih-primary/10 shadow-sm hover:shadow-md hover:border-sibersih-primary/20 transition-[border-color,box-shadow] overflow-hidden flex flex-col shrink-0 w-full">
        {/* ROW UTAMA (RINGKASAN LAPORAN) */}
        <div className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* FOTO & INFO SINGKAT */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1 w-full">
            <div
              className="relative w-full sm:w-28 h-28 sm:h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0 group cursor-pointer"
              onClick={() =>
                openLightbox(
                  isCompleted && report.fotoBuktiUrl
                    ? report.fotoBuktiUrl
                    : report.fotoLaporanUrl,
                  `Foto Laporan ${report.lokasi}`
                )
              }
              title="Klik untuk memperbesar foto"
            >
              <Image
                src={
                  isCompleted && report.fotoBuktiUrl
                    ? report.fotoBuktiUrl
                    : report.fotoLaporanUrl
                }
                alt={report.lokasi}
                fill
                sizes="(max-width: 640px) 100vw, 112px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority={priorityImage}
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <ZoomIn size={18} />
              </div>
              {isCompleted && report.fotoBuktiUrl && (
                <div className="absolute bottom-1 right-1 bg-emerald-600/90 text-[10px] text-white font-semibold px-1.5 py-0.5 rounded shadow-sm">
                  Hasil Akhir
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-semibold text-sibersih-primary text-base line-clamp-1">
                  {report.lokasi}
                </h3>
              </div>

              <p className="text-sm text-sibersih-primary/70 line-clamp-2 leading-relaxed">
                {report.deskripsi}
              </p>

              <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                {/* STATUS BADGE */}
                {isPending && (
                  <Badge
                    variant="outline"
                    className="gap-1 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800 text-xs py-0.5"
                  >
                    <Clock size={12} /> Menunggu Petugas
                  </Badge>
                )}
                {isReviewing && (
                  <Badge variant="warning" className="gap-1 text-xs py-0.5">
                    <Hourglass size={12} /> Menunggu Validasi
                  </Badge>
                )}
                {isCompleted && (
                  <Badge variant="success" className="gap-1 text-xs py-0.5">
                    <CheckCircle2 size={12} /> Selesai
                  </Badge>
                )}

                {/* TANGGAL DIBUAT */}
                <span className="flex items-center gap-1 text-xs text-sibersih-primary/50">
                  <Calendar size={12} />
                  {formatDate(report.createdAt)}
                </span>

                {/* TOMBOL EDIT & HAPUS (HANYA JIKA BELUM DIRESPON / MASIH MENUNGGU) */}
                {isPending && (
                  <Link
                    href={`/reporter/report/${report.id}/edit`}
                    className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors inline-flex items-center justify-center"
                    title="Edit Laporan"
                  >
                    <Pencil size={15} />
                  </Link>
                )}

                {/* TOMBOL HAPUS */}
                {isPending && showDeleteButton && (
                  <DeleteReportButton reportId={report.id} />
                )}
              </div>
            </div>
          </div>

          {/* TOMBOL DROPDOWN PROGRES / HASIL AKHIR */}
          <div className="w-full sm:w-auto flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-sibersih-primary/10 shrink-0">
            <button
              type="button"
              onClick={handleToggle}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isOpen
                  ? "bg-sibersih-primary text-white shadow-sm"
                  : isCompleted
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
                  : "bg-sibersih-primary/10 text-sibersih-primary hover:bg-sibersih-primary/20 border border-sibersih-primary/15"
              }`}
              aria-expanded={isOpen}
            >
              <span>
                {isOpen
                  ? "Tutup Detail"
                  : isCompleted
                  ? "Lihat Hasil Akhir"
                  : "Lihat Progres"}
              </span>
              {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </div>
        </div>

        {/* DROPDOWN EXPANDED CONTENT: PROGRES & HASIL AKHIR */}
        {isOpen && (
          <div className="border-t border-sibersih-primary/10 bg-sibersih-bg/40 p-4 sm:p-5 flex flex-col gap-5 w-full min-w-0 animate-in fade-in-50 duration-200">
            {/* 1. STATUS HIGHLIGHT BANNER */}
            {isCompleted && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-500 text-white shrink-0 mt-0.5">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                    Laporan Selesai & Terverifikasi
                  </h4>
                  <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 mt-0.5 leading-relaxed">
                    Penanganan kebersihan telah selesai dikerjakan oleh petugas dan telah disetujui serta divalidasi oleh pimpinan pada {formatDate(report.updatedAt)}.
                  </p>
                </div>
              </div>
            )}

            {isReviewing && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500 text-white shrink-0 mt-0.5">
                  <Hourglass size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                    Pekerjaan Selesai, Menunggu Validasi Pimpinan
                  </h4>
                  <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5 leading-relaxed">
                    Petugas kebersihan telah menyelesaikan penanganan di lokasi dan mengunggah foto bukti. Saat ini laporan sedang menunggu tinjauan dan konfirmasi dari pimpinan.
                  </p>
                </div>
              </div>
            )}

            {isPending && (
              <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-sky-600 text-white shrink-0 mt-0.5">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-sky-900 dark:text-sky-200">
                      Laporan Diterima &amp; Dalam Antrean
                    </h4>
                    <p className="text-xs text-sky-800/80 dark:text-sky-300/80 mt-0.5 leading-relaxed">
                      Laporan Anda belum direspon atau masih menunggu petugas. Anda masih dapat mengubah detail atau foto laporan ini.
                    </p>
                  </div>
                </div>

                <Link
                  href={`/reporter/report/${report.id}/edit`}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors shrink-0 self-start sm:self-center"
                >
                  <Pencil size={13} />
                  <span>Edit Laporan</span>
                </Link>
              </div>
            )}

            {/* 2. TIMELINE PROGRES ALUR PENANGANAN (3 TAHAP) */}
            <div className="bg-white dark:bg-black/20 rounded-xl p-4 border border-sibersih-primary/10">
              <h4 className="text-xs font-semibold text-sibersih-primary/80 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Sparkles size={14} className="text-sibersih-primary" />
                Tahapan Progres Penanganan
              </h4>

              <div className="relative flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-2">
                {/* STEP 1 */}
                <div className="flex sm:flex-col items-center sm:items-center text-left sm:text-center gap-3 sm:gap-2 flex-1 relative z-10 w-full">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Check size={16} className="stroke-[3]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-sibersih-primary">
                      1. Laporan Dikirim
                    </p>
                    <p className="text-[11px] text-sibersih-primary/60 mt-0.5">
                      {formatDate(report.createdAt)}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
                      Diterima Sistem
                    </span>
                  </div>
                </div>

                {/* LINE CONNECTOR 1-2 (SM+ SCREEN) */}
                <div
                  className={`hidden sm:block absolute top-4 left-[20%] right-[52%] h-0.5 -translate-y-1/2 z-0 ${
                    isReviewing || isCompleted
                      ? "bg-emerald-500"
                      : "bg-gray-200 dark:bg-gray-800"
                  }`}
                />

                {/* STEP 2 */}
                <div className="flex sm:flex-col items-center sm:items-center text-left sm:text-center gap-3 sm:gap-2 flex-1 relative z-10 w-full">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                      isReviewing || isCompleted
                        ? "bg-emerald-500 text-white"
                        : "bg-amber-500 text-white animate-pulse"
                    }`}
                  >
                    {isReviewing || isCompleted ? (
                      <Check size={16} className="stroke-[3]" />
                    ) : (
                      <Clock size={16} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-sibersih-primary">
                      2. Tindakan Petugas
                    </p>
                    <p className="text-[11px] text-sibersih-primary/60 mt-0.5">
                      {isReviewing || isCompleted
                        ? "Pembersihan selesai"
                        : "Menunggu petugas"}
                    </p>
                    <span
                      className={`inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded ${
                        isReviewing || isCompleted
                          ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50"
                          : "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50"
                      }`}
                    >
                      {isReviewing || isCompleted ? "Sudah Dikerjakan" : "Dalam Antrean"}
                    </span>
                  </div>
                </div>

                {/* LINE CONNECTOR 2-3 (SM+ SCREEN) */}
                <div
                  className={`hidden sm:block absolute top-4 left-[53%] right-[20%] h-0.5 -translate-y-1/2 z-0 ${
                    isCompleted
                      ? "bg-emerald-500"
                      : isReviewing
                      ? "bg-amber-400"
                      : "bg-gray-200 dark:bg-gray-800"
                  }`}
                />

                {/* STEP 3 */}
                <div className="flex sm:flex-col items-center sm:items-center text-left sm:text-center gap-3 sm:gap-2 flex-1 relative z-10 w-full">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                      isCompleted
                        ? "bg-emerald-500 text-white"
                        : isReviewing
                        ? "bg-amber-500 text-white animate-pulse"
                        : "bg-gray-200 dark:bg-gray-800 text-gray-500"
                    }`}
                  >
                    {isCompleted ? (
                      <ShieldCheck size={16} className="stroke-[2.5]" />
                    ) : isReviewing ? (
                      <Hourglass size={15} />
                    ) : (
                      <span className="text-xs font-bold">3</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-sibersih-primary">
                      3. Validasi & Hasil
                    </p>
                    <p className="text-[11px] text-sibersih-primary/60 mt-0.5">
                      {isCompleted
                        ? formatDate(report.updatedAt)
                        : isReviewing
                        ? "Tinjauan Pimpinan"
                        : "Menunggu tindakan"}
                    </p>
                    <span
                      className={`inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded ${
                        isCompleted
                          ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50"
                          : isReviewing
                          ? "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50"
                          : "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800"
                      }`}
                    >
                      {isCompleted
                        ? "Disetujui"
                        : isReviewing
                        ? "Proses Validasi"
                        : "Belum Diproses"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. DOKUMENTASI HASIL: KOMPARASI FOTO (SEBELUM VS SESUDAH) */}
            <div>
              <h4 className="text-xs font-semibold text-sibersih-primary/80 uppercase tracking-wider mb-3">
                Dokumentasi Lapangan
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* FOTO SEBELUM (AWAL LAPORAN) */}
                <div className="bg-white dark:bg-black/20 p-3 rounded-xl border border-sibersih-primary/10 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-sibersih-primary flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-orange-500" />
                      Sebelum (Laporan Awal)
                    </span>
                  </div>
                  <div
                    className="relative w-full h-44 bg-gray-100 rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() =>
                      openLightbox(
                        report.fotoLaporanUrl,
                        `Kondisi Awal: ${report.lokasi}`
                      )
                    }
                  >
                    <Image
                      src={report.fotoLaporanUrl}
                      alt={`Sebelum - ${report.lokasi}`}
                      fill
                      sizes="(max-width: 640px) 100vw, 300px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-xs text-sibersih-primary/70 italic line-clamp-2">
                    &ldquo;{report.deskripsi}&rdquo;
                  </p>
                </div>

                {/* FOTO SESUDAH (HASIL PENGERJAAN PETUGAS) */}
                <div className="bg-white dark:bg-black/20 p-3 rounded-xl border border-sibersih-primary/10 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-sibersih-primary flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          report.fotoBuktiUrl ? "bg-emerald-500" : "bg-gray-400"
                        }`}
                      />
                      Sesudah (Hasil Kerja Petugas)
                    </span>
                  </div>

                  {report.fotoBuktiUrl ? (
                    <div
                      className="relative w-full h-44 bg-gray-100 rounded-lg overflow-hidden cursor-pointer group border border-emerald-200 dark:border-emerald-800"
                      onClick={() =>
                        openLightbox(
                          report.fotoBuktiUrl!,
                          `Hasil Akhir: ${report.lokasi}`
                        )
                      }
                    >
                      <Image
                        src={report.fotoBuktiUrl}
                        alt={`Sesudah - ${report.lokasi}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 300px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-44 rounded-lg border-2 border-dashed border-sibersih-primary/15 flex flex-col items-center justify-center p-4 text-center text-sibersih-primary/40 bg-sibersih-bg/20">
                      <Clock size={28} className="mb-2 opacity-50" />
                      <p className="text-xs font-semibold text-sibersih-primary/70">
                        Foto Hasil Belum Tersedia
                      </p>
                      <p className="text-[11px] text-sibersih-primary/50 mt-1 max-w-[200px]">
                        Petugas kebersihan akan mengunggah foto bukti setelah pembersihan selesai.
                      </p>
                    </div>
                  )}

                  {/* KETERANGAN FOTO SESUDAH */}
                  {report.deskripsiPetugas ? (
                    <div className="p-2 rounded bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-xs text-sibersih-primary">
                      <span className="font-semibold text-[10px] uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block mb-0.5">
                        Keterangan Petugas:
                      </span>
                      <p className="text-xs text-sibersih-primary/80">
                        {report.deskripsiPetugas}
                      </p>
                    </div>
                  ) : isCompleted ? (
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                      Pembersihan selesai tanpa catatan khusus.
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            {/* 4. DETAIL LOKASI & KOORDINAT JIKA ADA */}
            {(report.latitude || report.longitude) && (
              <div className="flex items-center gap-2 text-xs text-sibersih-primary/60 pt-2 border-t border-sibersih-primary/10">
                <MapPin size={13} className="text-sibersih-primary/50" />
                <span>
                  Koordinat: {report.latitude?.toFixed(6)}, {report.longitude?.toFixed(6)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* LIGHTBOX MODAL */}
      <ImageLightboxModal
        src={lightbox.src}
        alt={lightbox.alt}
        isOpen={lightbox.isOpen}
        onClose={closeLightbox}
      />
    </>
  );
}
