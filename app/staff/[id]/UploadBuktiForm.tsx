"use client";

import { UploadCloud, ArrowLeft, MapPin, Eye, RefreshCw, Camera, ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useActionState, useRef, useEffect } from "react";
import { ajukanPenyelesaian } from "@/lib/actions";
import { SubmitButton } from "@/components/SubmitButton";
import ImageLightboxModal from "@/components/ImageLightboxModal";
import CameraCaptureModal from "@/components/CameraCaptureModal";
import { Button } from "@/components/ui/button";
import { compressImageClient } from "@/lib/clientImageCompressor";

type ActionState = { message: string | null; error: string | null };

async function formAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    try {
        const reportId = formData.get("reportId") as string;
        await ajukanPenyelesaian(reportId, formData);
        return { message: "Bukti berhasil diajukan", error: null };
    } catch (e: unknown) {
        const error = e as Error;
        if (error.message === "NEXT_REDIRECT") throw error;
        return { message: null, error: error.message || "Gagal mengajukan bukti" };
    }
}

export default function UploadBuktiForm({ report }: { report: { id: string; lokasi: string; deskripsi: string; fotoLaporanUrl: string; fotoBuktiUrl: string | null; deskripsiPetugas: string | null; status: string; } }) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(report.fotoBuktiUrl || null);
    const [isDragging, setIsDragging] = useState(false);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

    const mainFileInputRef = useRef<HTMLInputElement>(null);
    const [state, dispatch] = useActionState(formAction, { message: null, error: null });

    const updatePreview = (file: File) => {
        setPreviewUrl((prev) => {
            if (prev && prev.startsWith("blob:")) {
                URL.revokeObjectURL(prev);
            }
            return URL.createObjectURL(file);
        });
    };

    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawFile = e.target.files?.[0];
        if (rawFile) {
            const file = await compressImageClient(rawFile);
            if (mainFileInputRef.current && e.target !== mainFileInputRef.current) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                mainFileInputRef.current.files = dataTransfer.files;
            }
            updatePreview(file);
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
        updatePreview(file);
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
            updatePreview(file);
        }
    };

    const openLightbox = (src: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setLightboxSrc(src);
        setIsLightboxOpen(true);
    };

    const isSubmitted = report.status === "SELESAI";

    return (
        <div className="min-h-screen bg-sibersih-bg/60 py-6 px-3 sm:px-6 lg:px-8 pb-16 sm:pb-24">
            <div className="max-w-2xl mx-auto w-full">
                {/* Header Back Link */}
                <Link 
                    href="/staff/tasks" 
                    className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium text-xs sm:text-sm mb-4 transition-colors px-3 py-1.5 rounded-lg bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 shadow-2xs"
                >
                    <ArrowLeft size={15} /> Kembali ke Daftar Tugas
                </Link>

                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-800 overflow-hidden mb-12">
                    {/* Header Info */}
                    <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-700/60 px-2.5 py-0.5 rounded-md">
                                ID #{report.id.substring(0, 8)}
                            </span>
                            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1.5 tracking-tight">
                                Penyelesaian Tugas Pembersihan
                            </h1>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border w-fit ${
                            report.status === "SELESAI" 
                                ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 
                            report.status === "MENUNGGU_APPROVAL" 
                                ? 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/20' : 
                                'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                        }`}>
                            {report.status === "SELESAI" ? (
                                <><CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" /> Divalidasi / Selesai</>
                            ) : report.status === "MENUNGGU_APPROVAL" ? (
                                <><CheckCircle2 size={13} className="text-amber-600 dark:text-amber-400" /> Menunggu Validasi</>
                            ) : (
                                <><span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500" /> Menunggu Tindakan</>
                            )}
                        </span>
                    </div>

                    {/* Report Information Details */}
                    <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 space-y-5">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                                    Foto Kondisi Awal (Sebelum Dibersihkan)
                                </h2>
                                <button
                                    type="button"
                                    onClick={(e) => openLightbox(report.fotoLaporanUrl, e)}
                                    className="text-xs font-semibold text-slate-600 hover:text-sibersih-primary dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1 transition-colors"
                                >
                                    <Eye size={13} /> Lihat Foto Penuh
                                </button>
                            </div>

                            <div 
                                onClick={(e) => openLightbox(report.fotoLaporanUrl, e)}
                                className="relative w-full h-52 sm:h-60 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center overflow-hidden cursor-pointer group shadow-2xs"
                            >
                                <Image 
                                    src={report.fotoLaporanUrl} 
                                    alt="Laporan" 
                                    fill 
                                    sizes="(max-width: 1024px) 100vw, 50vw" 
                                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]" 
                                />
                                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1.5 backdrop-blur-[1px]">
                                    <Eye size={15} /> Klik untuk memperbesar foto
                                </div>
                                <div className="sm:hidden absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-1 rounded-md flex items-center gap-1">
                                    <Eye size={11} /> Perbesar
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                                Lokasi Pembersihan
                            </h2>
                            <div className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2.5 bg-slate-50/70 dark:bg-slate-800/30 p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800/70">
                                <MapPin size={16} className="text-slate-500 dark:text-slate-400 shrink-0" />
                                <span>{report.lokasi}</span>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                                Deskripsi Laporan Pelapor
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-slate-50/70 dark:bg-slate-800/30 p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800/70 leading-relaxed font-normal">
                                {report.deskripsi}
                            </p>
                        </div>
                    </div>

                    {/* Form Bukti Section */}
                    <form action={dispatch} className="p-5 sm:p-6 space-y-6">
                        <input type="hidden" name="reportId" value={report.id} />

                        {/* Main File Input */}
                        <input 
                            ref={mainFileInputRef}
                            id="file-upload" 
                            name="file-upload" 
                            type="file" 
                            required={!isSubmitted && !previewUrl}
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleImageChange} 
                            disabled={isSubmitted}
                        />
                        
                        <div className="space-y-2.5">
                            <label className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                                <span>
                                    Upload Foto Bukti Hasil Pembersihan <span className="text-slate-400 dark:text-slate-500 font-normal">*</span>
                                </span>
                                {previewUrl && (
                                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                        <CheckCircle2 size={12} /> Foto Terpilih
                                    </span>
                                )}
                            </label>

                            {isSubmitted && report.fotoBuktiUrl ? (
                                <div 
                                    onClick={(e) => openLightbox(report.fotoBuktiUrl!, e)}
                                    className="relative w-full h-52 sm:h-56 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center overflow-hidden cursor-pointer group shadow-2xs"
                                >
                                    <Image 
                                        src={report.fotoBuktiUrl} 
                                        alt="Bukti" 
                                        fill 
                                        sizes="(max-width: 1024px) 100vw, 50vw" 
                                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]" 
                                    />
                                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1.5 backdrop-blur-[1px]">
                                        <Eye size={15} /> Klik untuk memperbesar foto bukti
                                    </div>
                                    <div className="sm:hidden absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-1 rounded-md flex items-center gap-1">
                                        <Eye size={11} /> Perbesar
                                    </div>
                                </div>
                            ) : (
                                <div 
                                    className={`flex flex-col items-center justify-center p-5 sm:p-7 border border-dashed rounded-xl transition-all overflow-hidden bg-slate-50/50 dark:bg-slate-800/20 ${
                                        isDragging 
                                            ? 'border-sibersih-primary bg-sibersih-primary/5' 
                                            : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
                                    }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    {previewUrl ? (
                                        <div className="relative w-full h-56 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xs group">
                                            <Image src={previewUrl} alt="Preview Bukti" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
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
                                                    htmlFor="file-upload-change-staff"
                                                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-white/95 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xs hover:bg-white cursor-pointer transition-all"
                                                >
                                                    <RefreshCw size={13} className="pointer-events-none" />
                                                    <span className="pointer-events-none">Ganti Foto</span>
                                                    <input 
                                                        id="file-upload-change-staff" 
                                                        name="file-upload-change-staff-input"
                                                        type="file" 
                                                        accept="image/*" 
                                                        className="hidden" 
                                                        onChange={handleImageChange} 
                                                        disabled={isSubmitted}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 text-center py-2 w-full flex flex-col items-center">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center text-slate-500 dark:text-slate-400">
                                                <UploadCloud className="h-6 w-6" />
                                            </div>

                                            {/* Native Labels with Hidden File Inputs */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-sm">
                                                {/* Camera Label/Input */}
                                                <label 
                                                    htmlFor="file-upload-camera-staff"
                                                    onClick={handleDesktopCameraClick}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:border-slate-300 text-slate-700 dark:text-slate-200 active:scale-[0.98] rounded-xl text-xs sm:text-sm font-medium shadow-2xs transition-all cursor-pointer select-none"
                                                >
                                                    <Camera size={16} className="pointer-events-none shrink-0 text-slate-500 dark:text-slate-400" />
                                                    <span className="pointer-events-none">Ambil Foto</span>
                                                    <input 
                                                        id="file-upload-camera-staff" 
                                                        name="file-upload-camera"
                                                        type="file" 
                                                        accept="image/*" 
                                                        capture="environment" 
                                                        className="hidden" 
                                                        onChange={handleImageChange} 
                                                        disabled={isSubmitted}
                                                    />
                                                </label>

                                                {/* Gallery Label/Input */}
                                                <label 
                                                    htmlFor="file-upload-gallery-staff"
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:border-slate-300 text-slate-700 dark:text-slate-200 active:scale-[0.98] rounded-xl text-xs sm:text-sm font-medium shadow-2xs transition-all cursor-pointer select-none"
                                                >
                                                    <ImageIcon size={16} className="pointer-events-none shrink-0 text-slate-500 dark:text-slate-400" />
                                                    <span className="pointer-events-none">Pilih dari Galeri</span>
                                                    <input 
                                                        id="file-upload-gallery-staff" 
                                                        name="file-upload-gallery"
                                                        type="file" 
                                                        accept="image/*" 
                                                        className="hidden" 
                                                        onChange={handleImageChange} 
                                                        disabled={isSubmitted}
                                                    />
                                                </label>
                                            </div>

                                            <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                                Format PNG, JPG atau WEBP (Maksimal 5MB)
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                                <span>Deskripsi Hasil Kerja <span className="text-slate-400 dark:text-slate-500 font-normal">*</span></span>
                            </label>
                            <textarea
                                name="deskripsiPetugas"
                                defaultValue={report.deskripsiPetugas || ""}
                                disabled={isSubmitted}
                                required
                                rows={3}
                                className="w-full bg-slate-50/70 dark:bg-slate-800/30 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-xs sm:text-sm focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-sibersih-primary/20 focus:border-sibersih-primary outline-none transition-all"
                                placeholder="Jelaskan detail tindakan pembersihan yang telah dilakukan..."
                            />
                        </div>

                        {state.error && (
                            <div className="p-3.5 bg-slate-100 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-medium flex items-center gap-2">
                                <AlertCircle size={16} className="text-slate-500 dark:text-slate-400 shrink-0" />
                                <span>{state.error}</span>
                            </div>
                        )}
                        
                        {!isSubmitted && (
                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row justify-end gap-3 pb-8">
                                <Link 
                                    href="/staff/tasks" 
                                    className="w-full sm:w-auto text-center px-5 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Batal
                                </Link>
                                <div className="w-full sm:w-auto">
                                    <SubmitButton>Ajukan Selesai</SubmitButton>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            <ImageLightboxModal
                src={lightboxSrc}
                isOpen={isLightboxOpen}
                onClose={() => setIsLightboxOpen(false)}
            />

            <CameraCaptureModal
                isOpen={isCameraModalOpen}
                onClose={() => setIsCameraModalOpen(false)}
                onCapture={handleCameraCapture}
            />
        </div>
    );
}
