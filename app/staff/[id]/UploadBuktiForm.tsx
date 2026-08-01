"use client";

import { UploadCloud, ArrowLeft, CheckCircle, ImageIcon, MapPin } from "lucide-react";
import Link from "next/link";
import { useState, useActionState } from "react";
import { ajukanPenyelesaian } from "@/lib/actions";
import { SubmitButton } from "@/components/SubmitButton";

async function formAction(prevState: any, formData: FormData) {
    try {
        const reportId = formData.get("reportId") as string;
        await ajukanPenyelesaian(reportId, formData);
        return { message: "Bukti berhasil diajukan", error: null };
    } catch (e: any) {
        if (e.message === "NEXT_REDIRECT") throw e;
        return { message: null, error: e.message || "Gagal mengajukan bukti" };
    }
}

export default function UploadBuktiForm({ report }: { report: any }) {
    const [fileName, setFileName] = useState("");
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [state, dispatch] = useActionState(formAction, { message: null, error: null });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const isSubmitted = report.status !== "LAPORAN_MASUK";

    return (
        <div className="min-h-screen bg-sibersih-bg py-8 px-4 sm:px-6 lg:px-8 pb-32">
            <div className="max-w-2xl mx-auto w-full">
                <Link href="/staff/tasks" className="inline-flex items-center gap-2 text-sibersih-primary/60 hover:text-sibersih-primary font-medium text-sm mb-6 transition-colors">
                    <ArrowLeft size={16} /> Kembali ke Daftar Tugas
                </Link>

                <div className="bg-white rounded-xl shadow-sm border border-sibersih-primary/10 overflow-hidden">
                    <div className="p-6 border-b border-sibersih-primary/5 bg-sibersih-bg/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <span className="text-xs font-semibold text-sibersih-primary/60 uppercase tracking-wider">ID Laporan #{report.id.substring(0, 8)}</span>
                            <h1 className="text-xl font-semibold text-sibersih-primary mt-1">Penyelesaian Tugas</h1>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md ${isSubmitted ? 'text-green-700 bg-green-100' : 'text-orange-700 bg-orange-100'}`}>
                            {isSubmitted ? 'Selesai / Menunggu' : 'Pending'}
                        </span>
                    </div>

                    <div className="p-6 border-b border-sibersih-primary/5">
                        <h2 className="text-xs text-sibersih-primary/60 font-semibold uppercase tracking-wider mb-2">Kondisi Awal (Sebelum Dibersihkan)</h2>
                        <div className="w-full h-48 bg-gray-100 border border-sibersih-primary/10 rounded-lg flex flex-col items-center justify-center mb-6 relative overflow-hidden">
                            <img src={report.fotoLaporanUrl} alt="Laporan" className="w-full h-full object-cover" />
                        </div>

                        <h2 className="text-xs text-sibersih-primary/60 font-semibold uppercase tracking-wider mb-2">Lokasi Pembersihan</h2>
                        <p className="text-base font-medium text-sibersih-primary flex items-center gap-2 mb-6">
                            <MapPin size={18} className="text-red-500" /> {report.lokasi}
                        </p>

                        <h2 className="text-xs text-sibersih-primary/60 font-semibold uppercase tracking-wider mb-2">Deskripsi Kondisi</h2>
                        <p className="text-sm text-sibersih-primary/80 bg-sibersih-primary/5 p-4 rounded-lg border border-sibersih-primary/10 leading-relaxed">
                            {report.deskripsi}
                        </p>
                    </div>

                    <form action={dispatch} className="p-6 space-y-6">
                        <input type="hidden" name="reportId" value={report.id} />
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-sibersih-primary/80 flex items-center gap-2">
                                Foto Bukti (Sudah Bersih)
                            </label>
                            
                            {isSubmitted && report.fotoBuktiUrl ? (
                                <div className="w-full h-48 bg-gray-100 border border-sibersih-primary/10 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
                                    <img src={report.fotoBuktiUrl} alt="Bukti" className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-sibersih-primary/20 border-dashed rounded-lg bg-sibersih-bg hover:bg-sibersih-primary/5 transition-colors overflow-hidden">
                                    {previewUrl ? (
                                        <div className="relative w-full h-48 rounded-lg overflow-hidden group">
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <label htmlFor="file-upload" className="cursor-pointer px-4 py-2 bg-white rounded-lg text-sm font-medium text-sibersih-primary shadow-sm hover:bg-sibersih-bg transition-colors">
                                                    Ganti Foto
                                                </label>
                                            </div>
                                            <input id="file-upload" name="file-upload" type="file" required className="sr-only" accept="image/*" onChange={handleImageChange} disabled={isSubmitted} />
                                        </div>
                                    ) : (
                                        <div className="space-y-1 text-center">
                                            <UploadCloud className="mx-auto h-12 w-12 text-sibersih-primary/40" />
                                            <div className="flex text-sm text-sibersih-primary/70 justify-center">
                                                <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-sibersih-primary hover:text-sibersih-primary/90 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sibersih-accent">
                                                    <span>Unggah file</span>
                                                    <input id="file-upload" name="file-upload" type="file" required className="sr-only" accept="image/*" onChange={handleImageChange} disabled={isSubmitted} />
                                                </label>
                                                <p className="pl-1">atau tarik dan lepas</p>
                                            </div>
                                            <p className="text-xs text-sibersih-primary/60">
                                                PNG, JPG hingga 5MB
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {state.error && <p className="text-red-500 text-sm mt-2">{state.error}</p>}
                        
                        {!isSubmitted && (
                            <div className="pt-4 flex justify-end gap-3">
                                <Link href="/staff/tasks" className="px-4 py-2 border border-sibersih-primary/20 rounded-lg text-sm font-medium text-sibersih-primary/80 hover:bg-sibersih-primary/5 transition-colors">
                                    Batal
                                </Link>
                                <SubmitButton>Ajukan Selesai</SubmitButton>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
