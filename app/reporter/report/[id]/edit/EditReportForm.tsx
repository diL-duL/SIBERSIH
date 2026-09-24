"use client";

import {
  UploadCloud,
  ArrowLeft,
  Eye,
  RefreshCw,
  Camera,
  ImageIcon,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useActionState, useRef } from "react";
import dynamic from "next/dynamic";
import { editLaporan } from "@/lib/actions";
import { SubmitButton } from "@/components/SubmitButton";
import ImageLightboxModal from "@/components/ImageLightboxModal";
import CameraCaptureModal from "@/components/CameraCaptureModal";
import { Button } from "@/components/ui/button";
import { compressImageClient } from "@/lib/clientImageCompressor";

interface ReportData {
  id: string;
  lokasi: string;
  deskripsi: string;
  fotoLaporanUrl: string;
  latitude: number | null;
  longitude: number | null;
}

type ActionState = { message: string | null; error: string | null };

const MapPicker = dynamic(() => import("@/components/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-sibersih-bg flex flex-col items-center justify-center text-sibersih-primary/50 text-xs gap-2">
      <MapPin className="animate-bounce text-sibersih-primary" size={24} />
      <span>Memuat peta interaktif...</span>
    </div>
  ),
});

export default function EditReportForm({ report }: { report: ReportData }) {
  const [previewUrl, setPreviewUrl] = useState<string>(report.fotoLaporanUrl);
  const [latitude, setLatitude] = useState<number | null>(report.latitude);
  const [longitude, setLongitude] = useState<number | null>(report.longitude);
  const [isDragging, setIsDragging] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const mainFileInputRef = useRef<HTMLInputElement>(null);

  const editActionWithId = async (
    prevState: ActionState,
    formData: FormData
  ): Promise<ActionState> => {
    try {
      await editLaporan(report.id, formData);
      return { message: "Laporan berhasil diperbarui", error: null };
    } catch (e: unknown) {
      const error = e as Error;
      if (error.message === "NEXT_REDIRECT") throw error;
      return {
        message: null,
        error: error.message || "Gagal memperbarui laporan",
      };
    }
  };

  const [state, dispatch] = useActionState(editActionWithId, {
    message: null,
    error: null,
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (rawFile) {
      const file = await compressImageClient(rawFile);
      if (mainFileInputRef.current && e.target !== mainFileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        mainFileInputRef.current.files = dataTransfer.files;
      }
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDesktopCameraClick = (e: React.MouseEvent) => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (!isMobile && window.isSecureContext) {
      e.preventDefault();
      e.stopPropagation();
      setIsCameraModalOpen(true);
    }
  };

  const handleCameraCapture = async (rawFile: File) => {
    const file = await compressImageClient(rawFile);
    if (mainFileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      mainFileInputRef.current.files = dataTransfer.files;
    }
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const rawFile = files[0];
      const file = await compressImageClient(rawFile);
      if (mainFileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        mainFileInputRef.current.files = dataTransfer.files;
      }
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const openLightbox = (src: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLightboxSrc(src);
    setIsLightboxOpen(true);
  };

  const defaultPosition: [number, number] | undefined =
    report.latitude && report.longitude
      ? [report.latitude, report.longitude]
      : undefined;

  return (
    <div className="min-h-screen bg-sibersih-bg/60 py-6 px-3 sm:px-6 lg:px-8 pb-16 sm:pb-24">
      <div className="max-w-2xl mx-auto w-full">
        {/* Header Back Button */}
        <Link
          href="/reporter"
          className="inline-flex items-center gap-2 text-sibersih-primary/60 hover:text-sibersih-primary font-medium text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Kembali ke Beranda
        </Link>

        {/* Form Card Container */}
        <div className="bg-white rounded-2xl shadow-md border border-sibersih-primary/10 overflow-hidden mb-12">
          {/* Card Header */}
          <div className="p-5 sm:p-6 border-b border-sibersih-primary/10 bg-sibersih-bg/30">
            <h1 className="text-lg sm:text-2xl font-bold text-sibersih-primary tracking-tight">
              Edit Laporan Kebersihan
            </h1>
            <p className="text-xs sm:text-sm text-sibersih-primary/70 mt-1">
              Ubah informasi lokasi, deskripsi, atau foto sebelum laporan diproses oleh petugas.
            </p>
          </div>

          <form action={dispatch} className="p-4 sm:p-6 space-y-6">
            {/* Primary Hidden Form Input for File Upload */}
            <input
              ref={mainFileInputRef}
              id="file-upload"
              name="file-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />

            {/* 1. Upload Foto Section */}
            <div className="space-y-2.5">
              <label className="text-xs sm:text-sm font-bold text-sibersih-primary flex items-center justify-between">
                <span>
                  1. Foto Bukti Laporan <span className="text-red-500">*</span>
                </span>
                {previewUrl && (
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={12} /> Foto Tersedia
                  </span>
                )}
              </label>

              <div
                className={`flex flex-col items-center justify-center p-5 sm:p-7 border border-dashed rounded-xl transition-all overflow-hidden bg-slate-50/50 dark:bg-slate-800/20 ${
                  isDragging
                    ? "border-sibersih-primary bg-sibersih-primary/5"
                    : "border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {previewUrl ? (
                  <div className="relative w-full h-56 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xs group">
                    <Image
                      src={previewUrl}
                      alt="Preview Foto Laporan"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/50 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5 p-2 backdrop-blur-[1px]">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={(e) => openLightbox(previewUrl, e)}
                        className="gap-1.5 text-xs font-semibold shadow-xs bg-white/95 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 hover:bg-white"
                      >
                        <Eye size={13} /> Lihat Foto Penuh
                      </Button>

                      <label
                        htmlFor="file-upload-change"
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-white/95 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xs hover:bg-white cursor-pointer transition-all"
                      >
                        <RefreshCw size={13} className="pointer-events-none" />
                        <span className="pointer-events-none">Ganti Foto</span>
                        <input
                          id="file-upload-change"
                          name="file-upload-change-input"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 text-center py-2 w-full flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center text-slate-500 dark:text-slate-400">
                      <UploadCloud className="h-6 w-6" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-sm">
                      <label
                        htmlFor="file-upload-camera"
                        onClick={handleDesktopCameraClick}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:border-slate-300 text-slate-700 dark:text-slate-200 active:scale-[0.98] rounded-xl text-xs sm:text-sm font-medium shadow-2xs transition-all cursor-pointer select-none"
                      >
                        <Camera size={16} className="pointer-events-none shrink-0 text-slate-500 dark:text-slate-400" />
                        <span className="pointer-events-none">Ambil Foto Baru</span>
                        <input
                          id="file-upload-camera"
                          name="file-upload-camera"
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>

                      <label
                        htmlFor="file-upload-gallery"
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:border-slate-300 text-slate-700 dark:text-slate-200 active:scale-[0.98] rounded-xl text-xs sm:text-sm font-medium shadow-2xs transition-all cursor-pointer select-none"
                      >
                        <ImageIcon size={16} className="pointer-events-none shrink-0 text-slate-500 dark:text-slate-400" />
                        <span className="pointer-events-none">Pilih dari Galeri</span>
                        <input
                          id="file-upload-gallery"
                          name="file-upload-gallery"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>

                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      Format PNG, JPG atau WEBP (Maksimal 5MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Detail Lokasi Input */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-bold text-sibersih-primary">
                2. Detail Lokasi / Nama Tempat <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lokasi"
                required
                defaultValue={report.lokasi}
                placeholder="Contoh: Samping Gedung Perpustakaan Lantai 1"
                className="w-full bg-white border border-sibersih-primary/20 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-sibersih-primary placeholder:text-sibersih-primary/40 focus:ring-2 focus:ring-sibersih-accent focus:border-sibersih-accent outline-none shadow-xs transition-all"
              />
            </div>

            {/* 3. Deskripsi Input */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-bold text-sibersih-primary">
                3. Deskripsi Kondisi <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                name="deskripsi"
                required
                defaultValue={report.deskripsi}
                placeholder="Jelaskan kondisi sampah secara rinci..."
                className="w-full bg-white border border-sibersih-primary/20 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-sibersih-primary placeholder:text-sibersih-primary/40 focus:ring-2 focus:ring-sibersih-accent focus:border-sibersih-accent outline-none shadow-xs resize-y transition-all"
              ></textarea>
            </div>

            {/* 4. Map Section */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-bold text-sibersih-primary flex items-center gap-1.5">
                <MapPin size={16} className="text-red-500" /> 4. Sesuaikan Lokasi di Peta
              </label>
              <div className="w-full h-56 sm:h-72 bg-sibersih-bg rounded-xl relative overflow-hidden border border-sibersih-primary/15 shadow-inner">
                <MapPicker
                  defaultPosition={defaultPosition}
                  onPositionChange={(lat, lng) => {
                    setLatitude(lat);
                    setLongitude(lng);
                  }}
                />
                <input type="hidden" name="latitude" value={latitude || ""} />
                <input type="hidden" name="longitude" value={longitude || ""} />
              </div>
              <p className="text-[11px] sm:text-xs text-sibersih-primary/60 italic">
                *Sentuh atau geser penanda di atas peta jika ingin mengubah titik koordinat.
              </p>
            </div>

            {/* Error Alert */}
            {state.error && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs sm:text-sm font-medium">
                {state.error}
              </div>
            )}

            {/* Submit & Cancel Actions */}
            <div className="pt-4 sm:pt-6 border-t border-sibersih-primary/10 flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pb-6 sm:pb-8">
              <Link
                href="/reporter"
                className="w-full sm:w-auto text-center px-5 py-3 border border-sibersih-primary/20 rounded-xl text-xs sm:text-sm font-bold text-sibersih-primary/80 hover:bg-sibersih-primary/5 transition-colors"
              >
                Batal
              </Link>
              <div className="w-full sm:w-auto">
                <SubmitButton>Simpan Perubahan</SubmitButton>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Lightbox Modal */}
      <ImageLightboxModal
        src={lightboxSrc}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={handleCameraCapture}
      />
    </div>
  );
}
