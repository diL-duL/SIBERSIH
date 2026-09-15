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
  ShieldCheck,
  Check,
  Pencil,
  CheckSquare,
} from "lucide-react";
import ImageLightboxModal from "@/components/ImageLightboxModal";
import { Badge } from "@/components/ui/badge";

export type StaffTaskData = {
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
  pelapor?: {
    nama?: string | null;
    email?: string | null;
  } | null;
};

interface StaffTaskCardProps {
  task: StaffTaskData;
  priorityImage?: boolean;
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

export default function StaffTaskCard({
  task,
  priorityImage = false,
  isOpen: controlledIsOpen,
  onToggle,
}: StaffTaskCardProps) {
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

  const isCompleted = task.status === "SELESAI";
  const isReviewing = task.status === "MENUNGGU_APPROVAL";
  const isPending = task.status === "LAPORAN_MASUK";

  const openLightbox = (src: string, alt: string) => {
    setLightbox({ isOpen: true, src, alt });
  };

  const closeLightbox = () => {
    setLightbox((prev) => ({ ...prev, isOpen: false }));
  };

  const displayThumbnail = isCompleted && task.fotoBuktiUrl
    ? task.fotoBuktiUrl
    : isReviewing && task.fotoBuktiUrl
    ? task.fotoBuktiUrl
    : task.fotoLaporanUrl;

  return (
    <>
      <div className="bg-white rounded-xl border border-sibersih-primary/10 shadow-sm hover:shadow-md hover:border-sibersih-primary/20 transition-[border-color,box-shadow] overflow-hidden flex flex-col shrink-0 w-full">
        {/* ROW UTAMA (RINGKASAN TUGAS) */}
        <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
          {/* FOTO & INFO SINGKAT */}
          <div className="flex flex-row gap-3 sm:gap-4 items-start sm:items-center flex-1 w-full min-w-0">
            <div
              className="relative w-20 h-20 sm:w-28 sm:h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0 group cursor-pointer border border-sibersih-primary/10 shadow-2xs"
              onClick={() =>
                openLightbox(
                  displayThumbnail,
                  `Foto Tugas ${task.lokasi}`
                )
              }
              title="Klik untuk memperbesar foto"
            >
              <Image
                src={displayThumbnail}
                alt={task.lokasi}
                fill
                sizes="(max-width: 640px) 80px, 112px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority={priorityImage}
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <ZoomIn size={18} />
              </div>
              {isCompleted && (
                <div className="absolute bottom-1 right-1 bg-emerald-600/90 text-[9px] sm:text-[10px] text-white font-semibold px-1 py-0.5 rounded shadow-sm">
                  Selesai
                </div>
              )}
              {isReviewing && (
                <div className="absolute bottom-1 right-1 bg-amber-600/90 text-[9px] sm:text-[10px] text-white font-semibold px-1 py-0.5 rounded shadow-sm">
                  Menunggu
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5 sm:mb-1">
                <h3 className="font-semibold text-sibersih-primary text-sm sm:text-base line-clamp-1">
                  {task.lokasi}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-sibersih-primary/70 line-clamp-2 leading-relaxed">
                {task.deskripsi}
              </p>

              <div className="mt-2 flex items-center gap-1.5 sm:gap-2 flex-wrap">
                {/* STATUS BADGE */}
                {isPending && (
                  <Badge
                    variant="outline"
                    className="gap-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 text-[11px] sm:text-xs py-0.5 px-2"
                  >
                    <Clock size={11} /> Tugas Baru
                  </Badge>
                )}
                {isReviewing && (
                  <Badge variant="warning" className="gap-1 text-[11px] sm:text-xs py-0.5 px-2">
                    <Hourglass size={11} /> Menunggu
                  </Badge>
                )}
                {isCompleted && (
                  <Badge variant="success" className="gap-1 text-[11px] sm:text-xs py-0.5 px-2">
                    <CheckCircle2 size={11} /> Selesai
                  </Badge>
                )}

                {/* TANGGAL DIBUAT */}
                <span className="flex items-center gap-1 text-[11px] sm:text-xs text-sibersih-primary/50">
                  <Calendar size={11} />
                  {formatDate(task.createdAt)}
                </span>

                {/* TOMBOL KERJAKAN TUGAS (JIKA BARU) */}
                {isPending && (
                  <Link
                    href={`/staff/${task.id}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-sibersih-primary text-white rounded-lg text-xs font-semibold hover:bg-sibersih-primary/90 shadow-2xs transition-all active:scale-95"
                  >
                    <CheckSquare size={12} />
                    <span>Kerjakan</span>
                  </Link>
                )}

                {/* TOMBOL EDIT LAPORAN / BUKTI (JIKA MENUNGGU APPROVAL DARI PIMPINAN) */}
                {isReviewing && (
                  <Link
                    href={`/staff/${task.id}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-lg text-xs font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/40 shadow-2xs transition-colors"
                    title="Edit Bukti Pengerjaan"
                  >
                    <Pencil size={12} />
                    <span>Edit Bukti</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* TOMBOL DROPDOWN DETAIL */}
          <div className="w-full sm:w-auto flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2.5 sm:pt-0 border-sibersih-primary/10 shrink-0">
            <button
              type="button"
              onClick={handleToggle}
              className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isOpen
                  ? "bg-sibersih-primary text-white shadow-sm"
                  : isCompleted
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
                  : isReviewing
                  ? "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 hover:bg-amber-100 dark:hover:bg-amber-900/40"
                  : "bg-sibersih-primary/10 text-sibersih-primary hover:bg-sibersih-primary/20 border border-sibersih-primary/15"
              }`}
              aria-expanded={isOpen}
            >
              <span>
                {isOpen
                  ? "Tutup Detail"
                  : isCompleted
                  ? "Lihat Hasil Akhir"
                  : isReviewing
                  ? "Lihat Progres"
                  : "Lihat Detail Tugas"}
              </span>
              {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </div>
        </div>

        {/* DROPDOWN EXPANDED CONTENT: PROGRES, EDIT & KOMPARASI FOTO */}
        {isOpen && (
          <div className="border-t border-sibersih-primary/10 bg-sibersih-bg/40 p-3.5 sm:p-5 flex flex-col gap-4 sm:gap-5 w-full min-w-0 animate-in fade-in-50 duration-200">
            {/* 1. STATUS HIGHLIGHT BANNER */}
            {isCompleted && (
              <div className="p-3.5 rounded-xl bg-transparent border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shrink-0 mt-0.5">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Tugas Selesai &amp; Divalidasi
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Penanganan kebersihan telah selesai dikerjakan dan telah disetujui serta divalidasi oleh pimpinan pada {formatDate(task.updatedAt)}.
                  </p>
                </div>
              </div>
            )}

            {isReviewing && (
              <div className="p-3.5 rounded-xl bg-transparent border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shrink-0 mt-0.5">
                    <Hourglass size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Pekerjaan Selesai, Menunggu Persetujuan Pimpinan
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                      Bukti hasil kerja telah diajukan dan sedang menunggu validasi pimpinan. Anda masih dapat memperbarui foto bukti atau catatan hasil kerja sebelum disetujui.
                    </p>
                  </div>
                </div>

                <Link
                  href={`/staff/${task.id}`}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors shrink-0 self-start sm:self-center"
                >
                  <Pencil size={13} />
                  <span>Edit Bukti Pengerjaan</span>
                </Link>
              </div>
            )}

            {isPending && (
              <div className="p-3.5 rounded-xl bg-transparent border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shrink-0 mt-0.5">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Tugas Baru Perlu Dikerjakan
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                      Laporan baru dari pelapor belum ditangani. Silakan menuju ke lokasi untuk pembersihan dan unggah foto bukti pengerjaan.
                    </p>
                  </div>
                </div>

                <Link
                  href={`/staff/${task.id}`}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-sibersih-primary hover:bg-sibersih-primary/90 text-white text-xs font-semibold rounded-lg transition-colors shrink-0 self-start sm:self-center shadow-xs"
                >
                  <CheckSquare size={13} />
                  <span>Kerjakan Tugas</span>
                </Link>
              </div>
            )}

            {/* 2. TIMELINE PROGRES ALUR PENANGANAN (3 TAHAP) */}
            <div className="bg-white dark:bg-black/20 rounded-xl p-4 border border-sibersih-primary/10">
              <h4 className="text-xs font-semibold text-sibersih-primary/80 uppercase tracking-wider mb-4">
                Tahapan Penanganan
              </h4>

              <div className="relative flex flex-col sm:flex-row items-start justify-between gap-5 sm:gap-2">
                {/* VERTICAL LINE CONNECTORS (MOBILE ONLY) */}
                <div
                  className={`sm:hidden absolute left-4 top-4 h-[42%] w-0.5 -translate-x-1/2 z-0 ${
                    isReviewing || isCompleted
                      ? "bg-emerald-500"
                      : "bg-slate-200 dark:bg-slate-800"
                  }`}
                />
                <div
                  className={`sm:hidden absolute left-4 top-[50%] h-[42%] w-0.5 -translate-x-1/2 z-0 ${
                    isCompleted
                      ? "bg-emerald-500"
                      : isReviewing
                      ? "bg-amber-400"
                      : "bg-slate-200 dark:bg-slate-800"
                  }`}
                />

                {/* STEP 1 */}
                <div className="flex sm:flex-col items-start sm:items-center text-left sm:text-center gap-3 sm:gap-2 flex-1 relative z-10 w-full">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5 sm:mt-0">
                    <Check size={16} className="stroke-[3]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-sibersih-primary">
                      1. Laporan Dikirim
                    </p>
                    <p className="text-[11px] text-sibersih-primary/60 mt-0.5">
                      {formatDate(task.createdAt)}
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
                <div className="flex sm:flex-col items-start sm:items-center text-left sm:text-center gap-3 sm:gap-2 flex-1 relative z-10 w-full">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-0.5 sm:mt-0 ${
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
                        : "Perlu tindakan"}
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
                      3. Validasi &amp; Persetujuan
                    </p>
                    <p className="text-[11px] text-sibersih-primary/60 mt-0.5">
                      {isCompleted
                        ? formatDate(task.updatedAt)
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
                      <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500" />
                      Sebelum (Laporan Awal Pelapor)
                    </span>
                  </div>
                  <div
                    className="relative w-full h-44 bg-gray-100 rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() =>
                      openLightbox(
                        task.fotoLaporanUrl,
                        `Kondisi Awal: ${task.lokasi}`
                      )
                    }
                  >
                    <Image
                      src={task.fotoLaporanUrl}
                      alt={`Sebelum - ${task.lokasi}`}
                      fill
                      sizes="(max-width: 640px) 100vw, 300px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-xs text-sibersih-primary/70 italic line-clamp-2">
                    &ldquo;{task.deskripsi}&rdquo;
                  </p>
                </div>

                {/* FOTO SESUDAH (HASIL PENGERJAAN PETUGAS) */}
                <div className="bg-white dark:bg-black/20 p-3 rounded-xl border border-sibersih-primary/10 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-sibersih-primary flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          task.fotoBuktiUrl ? "bg-emerald-500" : "bg-gray-400"
                        }`}
                      />
                      Sesudah (Bukti Hasil Petugas)
                    </span>
                    {isReviewing && (
                      <Link
                        href={`/staff/${task.id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 hover:underline"
                      >
                        <Pencil size={11} /> Edit
                      </Link>
                    )}
                  </div>

                  {task.fotoBuktiUrl ? (
                    <div
                      className="relative w-full h-44 bg-gray-100 rounded-lg overflow-hidden cursor-pointer group border border-emerald-200 dark:border-emerald-800"
                      onClick={() =>
                        openLightbox(
                          task.fotoBuktiUrl!,
                          `Hasil Akhir: ${task.lokasi}`
                        )
                      }
                    >
                      <Image
                        src={task.fotoBuktiUrl}
                        alt={`Sesudah - ${task.lokasi}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 300px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-44 rounded-lg border-2 border-dashed border-sibersih-primary/15 flex flex-col items-center justify-center p-4 text-center text-sibersih-primary/40 bg-sibersih-bg/20">
                      <Clock size={28} className="mb-2 opacity-50" />
                      <p className="text-xs font-semibold text-sibersih-primary/70">
                        Foto Bukti Belum Diunggah
                      </p>
                      <p className="text-[11px] text-sibersih-primary/50 mt-1 max-w-[200px]">
                        Lakukan pembersihan di lokasi dan unggah foto bukti pengerjaan.
                      </p>
                      <Link
                        href={`/staff/${task.id}`}
                        className="mt-2.5 inline-flex items-center gap-1 px-3 py-1 bg-sibersih-primary text-white text-xs font-semibold rounded-lg hover:bg-sibersih-primary/90 transition-colors shadow-2xs"
                      >
                        <CheckSquare size={12} /> Unggah Sekarang
                      </Link>
                    </div>
                  )}

                  {/* KETERANGAN FOTO SESUDAH */}
                  {task.deskripsiPetugas ? (
                    <div className="p-2 rounded bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-xs text-sibersih-primary">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-semibold text-[10px] uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                          Catatan Hasil Kerja Petugas:
                        </span>
                        {isReviewing && (
                          <Link
                            href={`/staff/${task.id}`}
                            className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-0.5"
                          >
                            <Pencil size={10} /> Ubah Catatan
                          </Link>
                        )}
                      </div>
                      <p className="text-xs text-sibersih-primary/80">
                        {task.deskripsiPetugas}
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
            {(task.latitude || task.longitude) && (
              <div className="flex items-center gap-2 text-xs text-sibersih-primary/60 pt-2 border-t border-sibersih-primary/10">
                <MapPin size={13} className="text-sibersih-primary/50" />
                <span>
                  Koordinat: {task.latitude?.toFixed(6)}, {task.longitude?.toFixed(6)}
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
