"use client";

import { UploadCloud, ArrowLeft, CheckCircle, ImageIcon, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function UploadBuktiPage() {
    const [fileName, setFileName] = useState("");
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <div className="min-h-screen bg-sibersih-bg py-8 px-4 sm:px-6 lg:px-8 pb-32">
            <div className="max-w-2xl mx-auto w-full">
                <Link href="/staff" className="inline-flex items-center gap-2 text-sibersih-primary/60 hover:text-sibersih-primary font-medium text-sm mb-6 transition-colors">
                    <ArrowLeft size={16} /> Kembali ke Daftar Tugas
                </Link>

                <div className="bg-white rounded-xl shadow-sm border border-sibersih-primary/10 overflow-hidden">
                    <div className="p-6 border-b border-sibersih-primary/5 bg-sibersih-bg/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <span className="text-xs font-semibold text-sibersih-primary/60 uppercase tracking-wider">ID Laporan #1</span>
                            <h1 className="text-xl font-semibold text-sibersih-primary mt-1">Penyelesaian Tugas</h1>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md ${isSubmitted ? 'text-green-700 bg-green-100' : 'text-orange-700 bg-orange-100'}`}>
                            {isSubmitted ? 'Menunggu Validasi' : 'Pending'}
                        </span>
                    </div>

                    <div className="p-6 border-b border-sibersih-primary/5">
                        <h2 className="text-xs text-sibersih-primary/60 font-semibold uppercase tracking-wider mb-2">Kondisi Awal (Sebelum Dibersihkan)</h2>
                        <div className="w-full h-48 bg-sibersih-primary/5 border border-sibersih-primary/10 rounded-lg flex flex-col items-center justify-center gap-2 text-sibersih-primary/40 mb-6 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMGgyMHYyMEgwem0xMCAxMGgxMHYxMEgxMHoiIGZpbGw9IiMxRjRCMkMiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PC9zdmc+')] background-size-[20px_20px]"></div>
                            <ImageIcon size={32} className="relative z-10" />
                            <span className="text-sm font-medium uppercase tracking-wider relative z-10">Foto Tumpukan Sampah</span>
                        </div>

                        <h2 className="text-xs text-sibersih-primary/60 font-semibold uppercase tracking-wider mb-2">Lokasi Pembersihan</h2>
                        <div className="w-full h-40 bg-gray-100 rounded-lg border border-sibersih-primary/20 relative overflow-hidden mb-3"
                             style={{
                                 backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'20\\' height=\\'20\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M20 0L0 0L0 20L20 20L20 0ZM19 1L19 19L1 19L1 1L19 1Z\\' fill=\\'%231F4B2C\\' fill-opacity=\\'0.1\\'/%3E%3C/svg%3E')",
                                 backgroundSize: "20px 20px"
                             }}
                        >
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative animate-in zoom-in duration-300">
                                    <MapPin className="text-red-500 w-10 h-10 drop-shadow-md -mt-5" />
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-1 bg-black/20 rounded-[100%] blur-[1px]"></div>
                                </div>
                            </div>
                        </div>
                        <p className="text-base font-medium text-sibersih-primary flex items-center gap-2 mb-6">
                            Belakang Gedung Dekanat FT
                        </p>

                        <h2 className="text-xs text-sibersih-primary/60 font-semibold uppercase tracking-wider mb-2">Deskripsi Kondisi</h2>
                        <p className="text-sm text-sibersih-primary/80 bg-sibersih-primary/5 p-4 rounded-lg border border-sibersih-primary/10 leading-relaxed">
                            Banyak sampah plastik dan kertas yang menumpuk berserakan hingga keluar dari tempat sampah. Mohon segera dibersihkan.
                        </p>
                    </div>

                    <form className="p-6 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-sibersih-primary/80 flex items-center gap-2">
                                Foto Bukti (Sudah Bersih)
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-sibersih-primary/20 border-dashed rounded-lg bg-sibersih-bg hover:bg-sibersih-primary/5 transition-colors overflow-hidden">
                                {previewUrl ? (
                                    <div className="relative w-full h-48 rounded-lg overflow-hidden group">
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <label htmlFor="file-upload" className="cursor-pointer px-4 py-2 bg-white rounded-lg text-sm font-medium text-sibersih-primary shadow-sm hover:bg-sibersih-bg transition-colors">
                                                Ganti Foto
                                            </label>
                                        </div>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} disabled={isSubmitted} />
                                    </div>
                                ) : (
                                    <div className="space-y-1 text-center">
                                        <UploadCloud className="mx-auto h-12 w-12 text-sibersih-primary/40" />
                                        <div className="flex text-sm text-sibersih-primary/70 justify-center">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-sibersih-primary hover:text-sibersih-primary/90 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sibersih-accent">
                                                <span>Unggah file</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} disabled={isSubmitted} />
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

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-sibersih-primary/80 flex items-center gap-2">
                                Catatan Hasil Pengerjaan
                            </label>
                            <textarea 
                                rows={3} 
                                placeholder="Jelaskan tindakan yang telah dilakukan..." 
                                className="w-full bg-white border border-sibersih-primary/20 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-sibersih-accent focus:border-sibersih-accent outline-none resize-y transition-shadow disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed"
                                disabled={isSubmitted}
                            ></textarea>
                        </div>

                        {isSubmitted && (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700 animate-in fade-in duration-300">
                                <CheckCircle size={20} className="shrink-0" />
                                <div>
                                    <p className="font-medium text-sm">Bukti berhasil diajukan!</p>
                                    <p className="text-xs opacity-80 mt-0.5">Menunggu validasi dari pimpinan.</p>
                                </div>
                            </div>
                        )}

                        <div className="pt-4 flex justify-end gap-3">
                            <Link href="/staff" className="px-4 py-2 border border-sibersih-primary/20 rounded-lg text-sm font-medium text-sibersih-primary/80 hover:bg-sibersih-primary/5 transition-colors">
                                Kembali
                            </Link>
                            {!isSubmitted && (
                                <button type="button" onClick={() => setIsSubmitted(true)} disabled={!previewUrl} className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sibersih-accent transition-colors ${previewUrl ? 'bg-sibersih-primary text-white hover:bg-sibersih-primary/90' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>
                                    <CheckCircle size={16} /> Ajukan Selesai
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}