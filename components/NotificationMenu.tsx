"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function NotificationMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Sample notifications
    const notifications = [
        {
            id: 1,
            title: "Laporan Baru Masuk",
            message: "Terdapat laporan sampah di Area Parkir Fakultas Teknik.",
            time: "5 menit yang lalu",
            type: "alert",
            isRead: false,
        },
        {
            id: 2,
            title: "Validasi Diterima",
            message: "Laporan kebersihan di Gedung Rektorat telah disetujui.",
            time: "1 jam yang lalu",
            type: "success",
            isRead: true,
        },
        {
            id: 3,
            title: "Pengingat Jadwal",
            message: "Jangan lupa jadwal piket rutin besok pagi.",
            time: "Kemarin",
            type: "info",
            isRead: true,
        }
    ];

    // Handle click outside to close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const getIcon = (type: string) => {
        switch (type) {
            case "success": return <CheckCircle2 size={18} className="text-green-500" />;
            case "alert": return <AlertCircle size={18} className="text-orange-500" />;
            case "info":
            default: return <Info size={18} className="text-blue-500" />;
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-lg relative transition-colors ${isOpen ? "bg-sibersih-primary/10 text-sibersih-primary" : "text-sibersih-primary/70 hover:bg-sibersih-primary/10"}`}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-sibersih-bg"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-sibersih-primary/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-sibersih-primary/10 flex justify-between items-center bg-sibersih-bg/50">
                        <div>
                            <h3 className="font-semibold text-sibersih-primary">Notifikasi</h3>
                            <p className="text-xs text-sibersih-primary/60">Anda memiliki {unreadCount} pesan belum dibaca</p>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-sibersih-primary/50 hover:text-sibersih-primary transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                    
                    <div className="max-h-[360px] overflow-y-auto">
                        {notifications.length > 0 ? (
                            <div className="flex flex-col">
                                {notifications.map((notif) => (
                                    <div key={notif.id} className={`p-4 border-b border-sibersih-primary/5 hover:bg-sibersih-primary/5 transition-colors flex gap-3 ${!notif.isRead ? 'bg-sibersih-primary/[0.02]' : ''}`}>
                                        <div className="mt-0.5 shrink-0">
                                            {getIcon(notif.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1 gap-2">
                                                <h4 className={`text-sm ${!notif.isRead ? 'font-semibold text-sibersih-primary' : 'font-medium text-sibersih-primary/80'}`}>
                                                    {notif.title}
                                                </h4>
                                                <span className="text-[10px] text-sibersih-primary/50 shrink-0 whitespace-nowrap">{notif.time}</span>
                                            </div>
                                            <p className="text-xs text-sibersih-primary/60 leading-snug">
                                                {notif.message}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center flex flex-col items-center justify-center text-sibersih-primary/50">
                                <Bell size={32} className="mb-2 opacity-20" />
                                <p className="text-sm">Belum ada notifikasi</p>
                            </div>
                        )}
                    </div>
                    
                    {notifications.length > 0 && (
                        <div className="p-3 border-t border-sibersih-primary/10 bg-sibersih-bg/50 text-center">
                            <button className="text-xs font-medium text-sibersih-primary hover:underline">
                                Tandai semua dibaca
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
