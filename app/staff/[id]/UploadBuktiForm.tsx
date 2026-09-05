"use client";

import { UploadCloud, ArrowLeft, MapPin, Eye, RefreshCw, Camera, ImageIcon, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useActionState, useRef } from "react";
import { ajukanPenyelesaian } from "@/lib/actions";
import { SubmitButton } from "@/components/SubmitButton";
import ImageLightboxModal from "@/components/ImageLightboxModal";
import CameraCaptureModal from "@/components/CameraCaptureModal";
import { Button } from "@/components/ui/button";

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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
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

    const handleCameraCapture = (file: File) => {
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

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
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

    const isSubmitted = report.status === "SELESAI";

    return (
        <div className="min-h-screen bg-sibersih-bg/60 py-6 px-3 sm:px-6 lg:px-8 pb-72">
            <div className="max-w-2xl mx-auto w-full">
                {/* Header Back Link */}
                <Link 
                    href="/staff/tasks" 
                    className="inline-flex items-center gap-2 text-sibersih-primary/70 hover:text-sibersih-primary font-semibold text-xs sm:text-sm mb-4 transition-colors px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-sibersih-primary/10 shadow-xs"
                >
                    <ArrowLeft size={16} /> Kembali ke Daftar Tugas
                </Link>

                <div className="bg-white rounded-2xl shadow-md border border-sibersih-primary/10 overflow-hidden mb-12">
                    {/* Header Info */}
                    <div className="p-5 sm:p-6 border-b border-sibersih-primary/10 bg-gradient-to-r from-sibersih-primary/5 via-sibersih-bg to-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <span className="text-[10px] font-bold text-sibersih-primary/60 uppercase tracking-wider bg-sibersih-primary/10 px-2.5 py-0.5 rounded-full">
                                ID #{report.id.substring(0, 8)}
                            </span>
                            <h1 className="text-lg sm:text-xl font-bold text-sibersih-primary mt-1">Penyelesaian Tugas Pembersihan</h1>
                        </div>
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full w-fit ${
                            report.status === "SELESAI" ? 'text-green-800 bg-green-100 border border-green-200' : 
                            report.status === "MENUNGGU_APPROVAL" ? 'text-blue-800 bg-blue-100 border border-blue-200' : 
                            'text-orange-800 bg-orange-100 border border-orange-200'
                        }`}>
                            {report.status === "SELESAI" ? <><CheckCircle2 size={14} /> Divalidasi / Selesai</> : 
                             report.status === "MENUNGGU_APPROVAL" ? <><CheckCircle2 size={14} /> Menunggu Validasi</> : 
                             '• Menunggu Pembersihan'}
                        </span>
                    </div>

                    {/* Report Information Details */}
                    <div className="p-4 sm:p-6 border-b border-sibersih-primary/10 space-y-5">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-xs text-sibersih-primary/70 font-bold uppercase tracking-wider">Foto Kondisi Awal (Sebelum Dibersihkan)</h2>
                                <button
                                    type="button"
                                    onClick={(e) => openLightbox(report.fotoLaporanUrl, e)}
                                    className="text-xs font-bold text-sibersih-primary hover:underline flex items-center gap-1"
                                >
                                    <Eye size={14} /> Lihat Full
                                </button>
                            </div>

                            <div 
                                onClick={(e) => openLightbox(report.fotoLaporanUrl, e)}
                                className="relative w-full h-48 sm:h-56 bg-sibersih-bg border border-sibersih-primary/15 rounded-xl flex flex-col items-center justify-center overflow-hidden cursor-pointer group shadow-inner"
                            >
                                <Image src={report.fotoLaporanUrl} alt="Laporan" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition-transform group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/40 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                                    <Eye size={16} /> Klik untuk memperbesar foto
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xs text-sibersih-primary/70 font-bold uppercase tracking-wider mb-1">Lokasi Pembersihan</h2>
                            <p className="text-xs sm:text-sm font-semibold text-sibersih-primary flex items-center gap-2 bg-sibersih-bg p-3 rounded-xl border border-sibersih-primary/10">
                                <MapPin size={18} className="text-red-500 shrink-0" /> {report.lokasi}
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xs text-sibersih-primary/70 font-bold uppercase tracking-wider mb-1">Deskripsi Laporan Pelapor</h2>
                            <p className="text-xs sm:text-sm text-sibersih-primary/80 bg-sibersih-bg/60 p-3.5 rounded-xl border border-sibersih-primary/10 leading-relaxed font-medium">
                                {report.deskripsi}
                            </p>
                        </div>
                    </div>

                    {/* Form Bukti Section */}
                    <form action={dispatch} className="p-4 sm:p-6 space-y-6">
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
                        
                        <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-bold text-sibersih-primary flex items-center justify-between">
                                <span>Upload Foto Bukti Hasil Pembersihan <span className="text-red-500">*</span></span>
                                {previewUrl && (
                                    <span className="text-[10px] text-green-700 font-semibold bg-green-100 px-2 py-0.5 rounded-full">
                                        ✓ Foto Terpilih
                                    </span>
                                )}
                            </label>

                            {isSubmitted && report.fotoBuktiUrl ? (
                                <div 
                                    onClick={(e) => openLightbox(report.fotoBuktiUrl!, e)}
                                    className="relative w-full h-52 bg-sibersih-bg border border-sibersih-primary/15 rounded-xl flex flex-col items-center justify-center overflow-hidden cursor-pointer group shadow-xs"
                                >
                                    <Image src={report.fotoBuktiUrl} alt="Bukti" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition-transform group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/40 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                                        <Eye size={16} /> Klik untuk memperbesar foto bukti
                                    </div>
                                </div>
                            ) : (
                                <div 
                                    className={`flex flex-col items-center justify-center p-4 sm:p-6 border-2 border-dashed rounded-2xl transition-all overflow-hidden bg-sibersih-bg/40 ${
                                        isDragging 
                                            ? 'border-sibersih-accent bg-sibersih-accent/15 scale-[1.01]' 
                                            : 'border-sibersih-primary/20 hover:border-sibersih-primary/40'
                                    }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    {previewUrl ? (
                                        <div className="relative w-full h-56 rounded-xl overflow-hidden shadow-inner group">
                                            <Image src={previewUrl} alt="Preview Bukti" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                                            <div className="absolute inset-0 bg-black/60 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                                                <Button 
                                                    type="button"
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={(e) => openLightbox(previewUrl, e)}
                                                    className="gap-1.5 text-xs font-semibold shadow-md bg-white text-sibersih-primary hover:bg-sibersih-bg"
                                                >
                                                    <Eye size={14} /> Lihat Full
                                                </Button>
                                                
                                                <label 
                                                    htmlFor="file-upload-change-staff"
                                                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-white text-sibersih-primary border border-sibersih-primary/20 rounded-lg shadow-sm hover:bg-sibersih-bg cursor-pointer transition-all"
                                                >
                                                    <RefreshCw size={14} className="pointer-events-none" />
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
                                            <div className="w-14 h-14 rounded-full bg-sibersih-primary/10 border border-sibersih-primary/15 flex items-center justify-center shadow-xs">
                                                <UploadCloud className="h-7 w-7 text-sibersih-primary" />
                                            </div>

                                            {/* Native Labels with Hidden File Inputs */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-sm">
                                                {/* Camera Label/Input */}
                                                <label 
                                                    htmlFor="file-upload-camera-staff"
                                                    onClick={handleDesktopCameraClick}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-sibersih-primary text-white hover:bg-sibersih-primary/90 active:scale-[0.98] rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer select-none"
                                                >
                                                    <Camera size={18} className="pointer-events-none shrink-0" />
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
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-white border border-sibersih-primary/20 hover:bg-sibersih-bg text-sibersih-primary active:scale-[0.98] rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer select-none"
                                                >
                                                    <ImageIcon size={18} className="pointer-events-none shrink-0" />
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

                                            <p className="text-[10px] sm:text-xs text-sibersih-primary/50">
                                                Format PNG, JPG atau WEBP (Maksimal 5MB)
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-bold text-sibersih-primary flex items-center justify-between">
                                <span>Deskripsi Hasil Kerja <span className="text-red-500">*</span></span>
                            </label>
                            <textarea
                                name="deskripsiPetugas"
                                defaultValue={report.deskripsiPetugas || ""}
                                disabled={isSubmitted}
                                required
                                rows={3}
                                className="w-full bg-sibersih-bg/60 p-3.5 rounded-xl border border-sibersih-primary/10 text-sibersih-primary text-xs sm:text-sm focus:ring-2 focus:ring-sibersih-primary/20 focus:border-sibersih-primary/50 transition-all outline-none"
                                placeholder="Jelaskan detail tindakan pembersihan yang telah dilakukan..."
                            />
                        </div>

                        {state.error && (
                            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs sm:text-sm font-medium">
                                {state.error}
                            </div>
                        )}
                        
                        {!isSubmitted && (
                            <div className="pt-6 border-t border-sibersih-primary/10 flex flex-col sm:flex-row justify-end gap-3 pb-8">
                                <Link 
                                    href="/staff/tasks" 
                                    className="w-full sm:w-auto text-center px-5 py-3.5 border border-sibersih-primary/20 rounded-xl text-xs sm:text-sm font-bold text-sibersih-primary/80 hover:bg-sibersih-primary/5 transition-colors"
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
