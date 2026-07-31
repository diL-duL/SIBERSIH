"use client";

import { MapPin, User, Check, X, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PimpinanValidations() {
    const [butuhApproval, setButuhApproval] = useState([
        { id: "1", lokasi: "Belakang Gedung Dekanat FT", pelapor: "Andi (Mahasiswa)", petugas: "Pak Joko" }
    ]);
    const [actionMessage, setActionMessage] = useState("");

    const handleAction = (id: string, isApproved: boolean) => {
        setButuhApproval(prev => prev.filter(item => item.id !== id));
        setActionMessage(isApproved ? "Laporan berhasil disetujui." : "Laporan ditolak.");
        setTimeout(() => setActionMessage(""), 3000);
    };

    return (
        <div className="pb-32 pt-8 min-h-screen bg-sibersih-bg flex flex-col max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <header className="mb-8 border-b border-sibersih-primary/10 pb-4 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-semibold text-sibersih-primary">Validasi Pekerjaan</h1>
                    <p className="text-sm text-sibersih-primary/60 mt-1">Laporan yang membutuhkan persetujuan Anda</p>
                </div>
                <Link href="/executive/history" className="text-xs font-medium text-sibersih-primary hover:underline">Riwayat Validasi</Link>
            </header>

            {actionMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700 animate-in fade-in slide-in-from-top-4 duration-300">
                    <Check size={20} className="shrink-0" />
                    <p className="font-medium text-sm">{actionMessage}</p>
                </div>
            )}

            {butuhApproval.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-sibersih-primary/10 p-12 text-center flex flex-col items-center justify-center">
                    <Check className="w-12 h-12 text-sibersih-primary/20 mb-4" />
                    <h3 className="text-lg font-semibold text-sibersih-primary mb-1">Semua Selesai!</h3>
                    <p className="text-sm text-sibersih-primary/60">Tidak ada laporan yang perlu divalidasi saat ini.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {butuhApproval.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-sibersih-primary/10 overflow-hidden">
                        <div className="p-5 border-b border-sibersih-primary/5 flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-lg text-sibersih-primary mb-2">
                                    {item.lokasi}
                                </h3>
                                <div className="flex flex-col gap-1 mt-2">
                                    <p className="text-sm text-sibersih-primary/70 flex items-start sm:items-center gap-2">
                                        <User size={14} className="text-sibersih-primary/40 mt-0.5 sm:mt-0 shrink-0" />
                                        <span className="text-sibersih-primary/60 w-20 shrink-0">Dilaporkan:</span>
                                        <span className="font-medium text-sibersih-primary break-words">{item.pelapor}</span>
                                    </p>
                                    <p className="text-sm text-sibersih-primary/70 flex items-start sm:items-center gap-2">
                                        <User size={14} className="text-sibersih-primary/40 mt-0.5 sm:mt-0 shrink-0" />
                                        <span className="text-sibersih-primary/60 w-20 shrink-0">Petugas:</span>
                                        <span className="font-medium text-sibersih-primary break-words">{item.petugas}</span>
                                    </p>
                                </div>
                            </div>
                            <span className="inline-flex items-center text-xs font-semibold text-orange-700 bg-orange-100 px-2.5 py-1 rounded">
                                Menunggu Review
                            </span>
                        </div>

                        {/* Komparasi Foto Sebelum vs Sesudah */}
                        <div className="p-5 grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-semibold text-sibersih-primary/60 uppercase tracking-wider">Kondisi Awal</span>
                                <div className="w-full h-32 bg-sibersih-primary/5 border border-sibersih-primary/10 rounded-lg flex flex-col items-center justify-center gap-2 text-sibersih-primary/40 relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMGgyMHYyMEgwem0xMCAxMGgxMHYxMEgxMHoiIGZpbGw9IiMxRjRCMkMiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PC9zdmc+')] background-size-[20px_20px]"></div>
                                    <ImageIcon size={24} className="relative z-10" />
                                    <span className="text-xs font-medium uppercase tracking-wider relative z-10">Foto Kotor</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-semibold text-sibersih-primary/60 uppercase tracking-wider">Hasil Kerja</span>
                                <div className="w-full h-32 bg-green-50 border border-green-200 rounded-lg flex flex-col items-center justify-center gap-2 text-green-700/60 relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMGgyMHYyMEgwem0xMCAxMGgxMHYxMEgxMHoiIGZpbGw9IiMxNTgwM0QiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PC9zdmc+')] background-size-[20px_20px]"></div>
                                    <ImageIcon size={24} className="relative z-10" />
                                    <span className="text-xs font-medium uppercase tracking-wider relative z-10">Foto Bersih</span>
                                </div>
                            </div>
                        </div>

                        {/* Tombol Aksi Pimpinan */}
                        <div className="p-5 bg-sibersih-bg/50 border-t border-sibersih-primary/10 flex gap-3">
                            <button onClick={() => handleAction(item.id, true)} className="flex-1 bg-sibersih-primary hover:bg-sibersih-primary/90 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                                <Check size={16} /> Setujui
                            </button>
                            <button onClick={() => handleAction(item.id, false)} className="px-6 bg-white hover:bg-sibersih-bg text-red-600 font-medium py-2.5 rounded-lg border border-sibersih-primary/20 transition-colors flex items-center justify-center gap-2 text-sm">
                                <X size={16} /> Tolak
                            </button>
                        </div>
                    </div>
                ))}
                </div>
            )}
        </div>
    );
}
