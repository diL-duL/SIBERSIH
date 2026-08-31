"use client";

import { UploadCloud, ArrowLeft, Eye, RefreshCw, Camera, ImageIcon, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useActionState, useRef } from "react";
import dynamic from "next/dynamic";
import { buatLaporan } from "@/lib/actions";
import { SubmitButton } from "@/components/SubmitButton";
import ImageLightboxModal from "@/components/ImageLightboxModal";
import CameraCaptureModal from "@/components/CameraCaptureModal";
import { Button } from "@/components/ui/button";

type ActionState = { message: string | null; error: string | null };

async function formAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    try {
        await buatLaporan(formData);
        return { message: "Laporan berhasil dikirim", error: null };
    } catch (e: unknown) {
        const error = e as Error;
        if (error.message === "NEXT_REDIRECT") throw error;
        return { message: null, error: error.message || "Gagal mengirim laporan" };
    }
}

const MapPicker = dynamic(() => import('@/components/MapPicker'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-sibersih-bg flex flex-col items-center justify-center text-sibersih-primary/50 text-xs gap-2">
            <MapPin className="animate-bounce text-sibersih-primary" size={24} />
            <span>Memuat peta interaktif...</span>
        </div>
    )
});

export default function ReportPage() {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

    const mainFileInputRef = useRef<HTMLInputElement>(null);
    const [state, dispatch] = useActionState(formAction, { message: null, error: null });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Ensure main hidden input has the file for FormData submission
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

    return (
        <div className="min-h-screen bg-sibersih-bg/60 py-6 px-3 sm:px-6 lg:px-8 pb-36">
            <div className="max-w-2xl mx-auto w-full">
                {/* Header Back Button */}
                <Link 
                    href="/reporter" 
                    className="inline-flex items-center gap-2 text-sibersih-primary/70 hover:text-sibersih-primary font-semibold text-xs sm:text-sm mb-4 transition-colors px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-sibersih-primary/10 shadow-xs"
                >
                    <ArrowLeft size={16} /> Kembali ke Beranda
                </Link>

                {/* Form Card Container */}
                <div className="bg-white rounded-2xl shadow-md border border-sibersih-primary/10 overflow-hidden">
                    {/* Banner Card Header */}
                    <div className="p-5 sm:p-6 border-b border-sibersih-primary/10 bg-gradient-to-r from-sibersih-primary/5 via-sibersih-bg to-white flex items-center justify-between">
                        <div>
                            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-sibersih-primary bg-sibersih-primary/10 px-2.5 py-1 rounded-full uppercase tracking-wider mb-1">
                                <Sparkles size={12} /> Formulir Pelaporan
                            </span>
                            <h1 className="text-lg sm:text-2xl font-bold text-sibersih-primary tracking-tight">Buat Laporan Kebersihan</h1>
                            <p className="text-xs sm:text-sm text-sibersih-primary/70 mt-1">
                                Laporkan lokasi kotor atau tumpukan sampah untuk segera dibersihkan petugas.
                            </p>
                        </div>
                    </div>

                    <form action={dispatch} className="p-4 sm:p-6 space-y-6">
                        {/* Primary Hidden Form Input for File Upload */}
                        <input 
                            ref={mainFileInputRef}
                            id="file-upload" 
                            name="file-upload" 
                            type="file" 
                            required={!previewUrl}
                            className="hidden" 
                            accept="image/*"
                            onChange={handleImageChange}
                        />

                        {/* 1. Map Section */}
                        <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-bold text-sibersih-primary flex items-center gap-1.5">
                                <MapPin size={16} className="text-red-500" /> 1. Tandai Lokasi di Peta
                            </label>
                            <div className="w-full h-60 sm:h-72 bg-sibersih-bg rounded-xl relative overflow-hidden border border-sibersih-primary/15 shadow-inner">
                                <MapPicker onPositionChange={(lat, lng) => {
                                    setLatitude(lat);
                                    setLongitude(lng);
                                }} />
                                <input type="hidden" name="latitude" value={latitude || ""} />
                                <input type="hidden" name="longitude" value={longitude || ""} />
                            </div>
                            <p className="text-[11px] sm:text-xs text-sibersih-primary/60 italic">
                                *Sentuh atau geser penanda di atas peta untuk menyesuaikan posisi lokasi dengan akurat.
                            </p>
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
                                placeholder="Jelaskan kondisi sampah secara rinci (misal: tumpukan plastik dan dedaunan kering)..." 
                                className="w-full bg-white border border-sibersih-primary/20 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-sibersih-primary placeholder:text-sibersih-primary/40 focus:ring-2 focus:ring-sibersih-accent focus:border-sibersih-accent outline-none shadow-xs resize-y transition-all"
                            ></textarea>
                        </div>

                        {/* 4. Upload Foto Section */}
                        <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-bold text-sibersih-primary flex items-center justify-between">
                                <span>4. Foto Bukti Laporan <span className="text-red-500">*</span></span>
                                {previewUrl && (
                                    <span className="text-[10px] text-green-700 font-semibold bg-green-100 px-2 py-0.5 rounded-full">
                                        ✓ Foto Terpilih
                                    </span>
                                )}
                            </label>

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
                                        <Image src={previewUrl} alt="Preview Foto Laporan" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
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
                                                htmlFor="file-upload-change"
                                                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/90 text-sibersih-primary border border-sibersih-primary/20 rounded-lg shadow-sm hover:bg-white cursor-pointer transition-colors"
                                            >
                                                <RefreshCw size={14} /> Ganti Foto
                                                <input 
                                                    id="file-upload-change" 
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
                                        <div className="w-14 h-14 rounded-full bg-sibersih-primary/10 border border-sibersih-primary/15 flex items-center justify-center shadow-xs">
                                            <UploadCloud className="h-7 w-7 text-sibersih-primary" />
                                        </div>

                                        <div>
                                            <p className="text-xs sm:text-sm font-semibold text-sibersih-primary">
                                                Pilih Cara Unggah Foto
                                            </p>
                                            <p className="text-[11px] text-sibersih-primary/60 mt-0.5">
                                                Ambil dari kamera fisik atau pilih dari penyimpanan HP
                                            </p>
                                        </div>

                                        {/* Mobile Native Labels with Hidden File Inputs */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-sm">
                                            {/* Camera Label/Input */}
                                            <label 
                                                htmlFor="file-upload-camera"
                                                onClick={handleDesktopCameraClick}
                                                className="flex items-center justify-center gap-2 px-4 py-3 bg-sibersih-primary text-white hover:bg-sibersih-primary/90 active:scale-[0.98] rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer select-none"
                                            >
                                                <Camera size={18} /> Ambil Foto (Kamera)
                                                <input 
                                                    id="file-upload-camera" 
                                                    type="file" 
                                                    accept="image/*" 
                                                    capture="environment" 
                                                    className="hidden" 
                                                    onChange={handleImageChange} 
                                                />
                                            </label>

                                            {/* Gallery Label/Input */}
                                            <label 
                                                htmlFor="file-upload-gallery"
                                                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-sibersih-primary/20 hover:bg-sibersih-bg text-sibersih-primary active:scale-[0.98] rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer select-none"
                                            >
                                                <ImageIcon size={18} /> Pilih dari Galeri / File
                                                <input 
                                                    id="file-upload-gallery" 
                                                    type="file" 
                                                    accept="image/*" 
                                                    className="hidden" 
                                                    onChange={handleImageChange} 
                                                />
                                            </label>
                                        </div>

                                        <p className="text-[10px] sm:text-xs text-sibersih-primary/50">
                                            Format PNG, JPG atau WEBP (Maksimal 5MB)
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Error Alert */}
                        {state.error && (
                            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs sm:text-sm font-medium">
                                {state.error}
                            </div>
                        )}

                        {/* Form Submit Footer Actions */}
                        <div className="pt-4 border-t border-sibersih-primary/10 flex flex-col sm:flex-row justify-end gap-3">
                            <Link 
                                href="/reporter" 
                                className="w-full sm:w-auto text-center px-5 py-3 border border-sibersih-primary/20 rounded-xl text-xs sm:text-sm font-bold text-sibersih-primary/80 hover:bg-sibersih-primary/5 transition-colors"
                            >
                                Batal
                            </Link>
                            <div className="w-full sm:w-auto">
                                <SubmitButton>Kirim Laporan</SubmitButton>
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

            {/* Desktop WebRTC Camera Modal */}
            <CameraCaptureModal
                isOpen={isCameraModalOpen}
                onClose={() => setIsCameraModalOpen(false)}
                onCapture={handleCameraCapture}
            />
        </div>
    );
}