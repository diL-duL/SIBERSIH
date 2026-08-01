"use client";

import { UploadCloud, ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";
import { useState, useActionState, useRef } from "react";
import { buatLaporan } from "@/lib/actions";
import { SubmitButton } from "@/components/SubmitButton";

// Wrapper for the action to catch errors
async function formAction(prevState: any, formData: FormData) {
    try {
        await buatLaporan(formData);
        return { message: "Laporan berhasil dikirim", error: null };
    } catch (e: any) {
        if (e.message === "NEXT_REDIRECT") throw e; // Let Next.js handle redirect
        return { message: null, error: e.message || "Gagal mengirim laporan" };
    }
}

export default function ReportPage() {
    const [fileName, setFileName] = useState("");
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [mapPinSelected, setMapPinSelected] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [state, dispatch] = useActionState(formAction, { message: null, error: null });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
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
            if (fileInputRef.current) {
                fileInputRef.current.files = files;
            }
            setFileName(files[0].name);
            setPreviewUrl(URL.createObjectURL(files[0]));
        }
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
                            <div className="w-full h-48 bg-gray-100 rounded-lg border border-sibersih-primary/20 relative overflow-hidden group">
                                <iframe 
                                    src="https://www.google.com/maps?q=Fakultas+Teknik+Universitas+Tadulako&output=embed" 
                                    className={`absolute inset-0 w-full h-full ${!mapPinSelected ? 'pointer-events-none opacity-80' : 'pointer-events-auto opacity-100'} transition-opacity`} 
                                    style={{ border: 0 }} 
                                    loading="lazy" 
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                                
                                {!mapPinSelected ? (
                                    <div 
                                        className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px] cursor-pointer hover:bg-white/30 transition-colors"
                                        onClick={() => setMapPinSelected(true)}
                                    >
                                        <p className="text-sm font-medium text-sibersih-primary bg-white px-4 py-2 rounded-full shadow-sm border border-sibersih-primary/10 transition-transform hover:scale-105">
                                            Klik area peta untuk menandai lokasi
                                        </p>
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="relative animate-in zoom-in duration-200">
                                            <MapPin className="text-red-600 w-12 h-12 drop-shadow-lg -mt-12 fill-red-100" />
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-1.5 bg-black/30 rounded-[100%] blur-[1px]"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
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
                            <label className="text-sm font-medium text-sibersih-primary/80">Foto Bukti</label>
                            <div 
                                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors overflow-hidden ${isDragging ? 'border-sibersih-accent bg-sibersih-accent/10' : 'border-sibersih-primary/20 bg-sibersih-bg hover:bg-sibersih-primary/5'}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                {previewUrl ? (
                                    <div className="relative w-full h-48 rounded-lg overflow-hidden group">
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <label htmlFor="file-upload" className="cursor-pointer px-4 py-2 bg-white rounded-lg text-sm font-medium text-sibersih-primary shadow-sm hover:bg-sibersih-bg transition-colors">
                                                Ganti Foto
                                            </label>
                                        </div>
                                        <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" required className="sr-only" accept="image/*" onChange={handleImageChange} />
                                    </div>
                                ) : (
                                    <div className="space-y-1 text-center pointer-events-none">
                                        <UploadCloud className={`mx-auto h-12 w-12 transition-colors ${isDragging ? 'text-sibersih-accent' : 'text-sibersih-primary/40'}`} />
                                        <div className="flex text-sm text-sibersih-primary/70 justify-center">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-sibersih-primary hover:text-sibersih-primary/90 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sibersih-accent pointer-events-auto">
                                                <span>Unggah file</span>
                                                <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" required className="sr-only" accept="image/*" onChange={handleImageChange} />
                                            </label>
                                            <p className="pl-1">atau tarik dan lepas</p>
                                        </div>
                                        <p className="text-xs text-sibersih-primary/60">
                                            PNG, JPG hingga 5MB
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
        </div>
    );
}