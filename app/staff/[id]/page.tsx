"use client";

import { UploadCloud, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function UploadBuktiPage() {
    const [fileName, setFileName] = useState("");

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
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-700 bg-orange-100 px-3 py-1.5 rounded-md">
                            Pending
                        </span>
                    </div>

                    <div className="p-6 border-b border-sibersih-primary/5">
                        <h2 className="text-xs text-sibersih-primary/60 font-semibold uppercase tracking-wider mb-2">Lokasi Pembersihan</h2>
                        <p className="text-base font-medium text-sibersih-primary flex items-center gap-2">
                            Belakang Gedung Dekanat FT
                        </p>
                    </div>

                    <form className="p-6 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-sibersih-primary/80 flex items-center gap-2">
                                Foto Bukti (Sudah Bersih)
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-sibersih-primary/20 border-dashed rounded-lg bg-sibersih-bg hover:bg-sibersih-primary/5 transition-colors">
                                <div className="space-y-1 text-center">
                                    <UploadCloud className="mx-auto h-12 w-12 text-sibersih-primary/40" />
                                    <div className="flex text-sm text-sibersih-primary/70 justify-center">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-sibersih-primary hover:text-sibersih-primary/90 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sibersih-accent">
                                            <span>Unggah file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) setFileName(e.target.files[0].name) }} />
                                        </label>
                                        <p className="pl-1">atau tarik dan lepas</p>
                                    </div>
                                    <p className="text-xs text-sibersih-primary/60">
                                        {fileName || "PNG, JPG hingga 5MB"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <Link href="/staff" className="px-4 py-2 border border-sibersih-primary/20 rounded-lg text-sm font-medium text-sibersih-primary/80 hover:bg-sibersih-primary/5 transition-colors">
                                Batal
                            </Link>
                            <button type="button" className="inline-flex items-center gap-2 px-4 py-2 bg-sibersih-primary text-white rounded-lg text-sm font-medium hover:bg-sibersih-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sibersih-accent transition-colors">
                                <CheckCircle size={16} /> Ajukan Selesai
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}