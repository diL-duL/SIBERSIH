"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, User } from "lucide-react";

export default function BottomNav() {
    const pathname = usePathname();

    // Logika cerdas untuk mendeteksi halaman aktif berdasarkan role
    const isHome = pathname === "/" || pathname === "/reporter" || pathname === "/staff" || pathname === "/executive";
    const isReport = pathname?.includes("/reporter/report") || pathname?.includes("/[id]");
    const isProfile = pathname === "/profile";

    return (
        <div 
            style={{ position: 'fixed', bottom: '32px', left: 0, right: 0, margin: '0 auto', zIndex: 9999 }}
            className="w-[90%] max-w-sm bg-white/80 backdrop-blur-xl rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex justify-around items-center px-6 py-4 border border-white/50"
        >

            {/* Tombol Home (Kiri) */}
            <Link
                href="/reporter"
                className={`flex flex-col items-center gap-1 transition-all duration-300 transform hover:scale-110 ${isHome ? "text-blue-600" : "text-zinc-400 hover:text-zinc-600"}`}
            >
                <Home size={24} className={isHome ? "stroke-[2.5]" : "stroke-2"} />
            </Link>

            {/* Tombol Report (Tengah) */}
            <Link
                href="/reporter/report"
                className={`flex flex-col items-center gap-1 transition-all duration-300 transform hover:scale-110 ${isReport ? "text-blue-600" : "text-zinc-400 hover:text-zinc-600"}`}
            >
                <FileText size={24} className={isReport ? "stroke-[2.5]" : "stroke-2"} />
            </Link>

            {/* Tombol Profile (Kanan) */}
            <Link
                href="/profile"
                className={`flex flex-col items-center gap-1 transition-all duration-300 transform hover:scale-110 ${isProfile ? "text-blue-600" : "text-zinc-400 hover:text-zinc-600"}`}
            >
                <User size={24} className={isProfile ? "stroke-[2.5]" : "stroke-2"} />
            </Link>

        </div>
    );
}