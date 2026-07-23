"use client";

import { UploadCloud, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ReportPage() {
    const [fileName, setFileName] = useState("");

    return (
        <div className="min-h-screen bg-zinc-50 py-8 px-4 sm:px-6 lg:px-8 pb-32">
            <div className="max-w-2xl mx-auto w-full">
                <Link href="/reporter" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 font-medium text-sm mb-6 transition-colors">
                    <ArrowLeft size={16} /> Kembali
                </Link>

                <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
                    <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
                        <h1 className="text-xl font-semibold text-zinc-900">Buat Laporan Kebersihan</h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Lengkapi detail di bawah ini untuk melaporkan tumpukan sampah atau fasilitas kotor.
                        </p>
                    </div>

                    <form className="p-6 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">Lokasi</label>
                            <input 
                                type="text" 
                                placeholder="Contoh: Samping Gedung Perpustakaan" 
                                className="w-full bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">Deskripsi Kondisi</label>
                            <textarea 
                                rows={4} 
                                placeholder="Jelaskan kondisi tumpukan sampah secara spesifik..." 
                                className="w-full bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y transition-shadow"
                            ></textarea>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">Foto Bukti</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-zinc-300 border-dashed rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors">
                                <div className="space-y-1 text-center">
                                    <UploadCloud className="mx-auto h-12 w-12 text-zinc-400" />
                                    <div className="flex text-sm text-zinc-600 justify-center">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                            <span>Unggah file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) setFileName(e.target.files[0].name) }} />
                                        </label>
                                        <p className="pl-1">atau tarik dan lepas</p>
                                    </div>
                                    <p className="text-xs text-zinc-500">
                                        {fileName || "PNG, JPG hingga 5MB"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <Link href="/reporter" className="px-4 py-2 border border-zinc-300 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors">
                                Batal
                            </Link>
                            <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                                Kirim Laporan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}