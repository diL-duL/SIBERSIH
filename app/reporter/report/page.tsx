"use client";

import { UploadCloud, ArrowLeft, Eye, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useActionState, useRef } from "react";
import dynamic from "next/dynamic";
import { buatLaporan } from "@/lib/actions";
import { SubmitButton } from "@/components/SubmitButton";
import ImageLightboxModal from "@/components/ImageLightboxModal";
import { Button } from "@/components/ui/button";

// Wrapper for the action to catch errors
type ActionState = { message: string | null; error: string | null };

async function formAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    try {
        await buatLaporan(formData);
        return { message: "Laporan berhasil dikirim", error: null };
    } catch (e: unknown) {
        const error = e as Error;
        if (error.message === "NEXT_REDIRECT") throw error; // Let Next.js handle redirect
        return { message: null, error: error.message || "Gagal mengirim laporan" };
    }
}

const MapPicker = dynamic(() => import('@/components/MapPicker'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-100 flex items-center justify-center text-sibersih-primary/50 text-sm">Memuat peta...</div>
});

export default function ReportPage() {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [state, dispatch] = useActionState(formAction, { message: null, error: null });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        }
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
            if (fileInputRef.current) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInputRef.current.files = dataTransfer.files;
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
        <div className="min-h-screen bg-sibersih-bg py-8 px-4 sm:px-6 lg:px-8 pb-32">
            <div className="max-w-2xl mx-auto w-full">
                <Link href="/reporter" className="inline-flex items-center gap-2 text-sibersih-primary/60 hover:text-sibersih-primary font-medium text-sm mb-6 transition-colors">
                    <ArrowLeft size={16} /> Kembali
                </Link>

                <div className="bg-white rounded-xl shadow-sm border border-sibersih-primary/10 overflow-hidden">
                    <div className="p-6 border-b border-sibersih-primary/5 bg-sibersih-bg/50">
                        <h1 className="text-xl font-semibold text-sibersih-primary">Buat Laporan Kebersihan</h1>
                        <p className="text-sm text-sibersih-primary/60 mt-1">
                            Lengkapi detail di bawah ini untuk melaporkan tumpukan sampah atau fasilitas kotor.
                        </p>
                    </div>

                    <form action={dispatch} className="p-6 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-sibersih-primary/80">Tandai Lokasi di Peta</label>
                            <div className="w-full h-64 bg-gray-100 rounded-lg relative overflow-hidden group">
                                <MapPicker onPositionChange={(lat, lng) => {
                                    setLatitude(lat);
                                    setLongitude(lng);
                                }} />
                                <input type="hidden" name="latitude" value={latitude || ""} />
                                <input type="hidden" name="longitude" value={longitude || ""} />
                            </div>
                            <p className="text-xs text-sibersih-primary/60 mt-1">
                                Geser penanda di atas peta untuk menyesuaikan titik lokasi dengan akurat.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-sibersih-primary/80">Detail Lokasi</label>
                            <input 
                                type="text" 
                                name="lokasi"
                                required
                                placeholder="Contoh: Samping Gedung Perpustakaan" 
                                className="w-full bg-white border border-sibersih-primary/20 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-sibersih-accent focus:border-sibersih-accent outline-none transition-shadow" 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-sibersih-primary/80">Deskripsi Kondisi</label>
                            <textarea 
                                rows={4} 
                                name="deskripsi"
                                required
                                placeholder="Jelaskan kondisi tumpukan sampah secara spesifik..." 
                                className="w-full bg-white border border-sibersih-primary/20 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-sibersih-accent focus:border-sibersih-accent outline-none resize-y transition-shadow"
                            ></textarea>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-sibersih-primary/80">Foto Laporan</label>
                            
                            <input 
                                ref={fileInputRef} 
                                id="file-upload" 
                                name="file-upload" 
                                type="file" 
                                required 
                                className="sr-only" 
                                accept="image/*" 
                                onChange={handleImageChange} 
                            />

                            <div 
                                className={`mt-1 flex justify-center px-6 pt-6 pb-6 border-2 border-dashed rounded-xl transition-all cursor-pointer overflow-hidden ${
                                    isDragging 
                                        ? 'border-sibersih-accent bg-sibersih-accent/15 scale-[1.01]' 
                                        : 'border-sibersih-primary/20 bg-sibersih-bg hover:bg-sibersih-primary/5 hover:border-sibersih-primary/40'
                                }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {previewUrl ? (
                                    <div className="relative w-full h-52 rounded-lg overflow-hidden group">
                                        <Image src={previewUrl} alt="Preview Foto Laporan" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                            <Button 
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                onClick={(e) => openLightbox(previewUrl, e)}
                                                className="gap-1.5 text-xs font-semibold"
                                            >
                                                <Eye size={14} /> Lihat Full
                                            </Button>
                                            <Button 
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    fileInputRef.current?.click();
                                                }}
                                                className="gap-1.5 text-xs font-semibold bg-white"
                                            >
                                                <RefreshCw size={14} /> Ganti Foto
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2 text-center py-2">
                                        <div className="w-12 h-12 rounded-full bg-sibersih-primary/10 flex items-center justify-center mx-auto">
                                            <UploadCloud className={`h-6 w-6 transition-colors ${isDragging ? 'text-sibersih-primary' : 'text-sibersih-primary/60'}`} />
                                        </div>
                                        <div className="flex text-sm text-sibersih-primary/80 justify-center font-medium">
                                            <span className="text-sibersih-primary underline hover:text-sibersih-primary/80">Klik untuk memilih foto</span>
                                            <span className="pl-1 text-sibersih-primary/60">atau tarik dan lepas di sini</span>
                                        </div>
                                        <p className="text-xs text-sibersih-primary/50">
                                            Format PNG, JPG atau WEBP (Maksimal 5MB)
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {state.error && <p className="text-red-500 text-sm mt-2">{state.error}</p>}
                        <div className="pt-4 flex justify-end gap-3">
                            <Link href="/reporter" className="px-4 py-2 border border-sibersih-primary/20 rounded-lg text-sm font-medium text-sibersih-primary/80 hover:bg-sibersih-primary/5 transition-colors">
                                Batal
                            </Link>
                            <SubmitButton>Kirim Laporan</SubmitButton>
                        </div>
                    </form>
                </div>
            </div>

            <ImageLightboxModal
                src={lightboxSrc}
                isOpen={isLightboxOpen}
                onClose={() => setIsLightboxOpen(false)}
            />
        </div>
    );
}