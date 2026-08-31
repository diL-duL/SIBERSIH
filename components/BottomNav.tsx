"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, User, ClipboardList, CheckCircle } from "lucide-react";

export default function BottomNav() {
    const pathname = usePathname();

    // Sembunyikan navbar di halaman otentikasi
    const hiddenPaths = ["/login", "/login/register", "/login/forgot-password"];
    if (hiddenPaths.includes(pathname || "")) {
        return null;
    }

    // Deteksi role dari URL
    let role = "reporter"; // Default
    if (pathname?.startsWith("/staff")) {
        role = "staff";
    } else if (pathname?.startsWith("/executive")) {
        role = "executive";
    } else if (pathname?.startsWith("/reporter") || pathname === "/") {
        role = "reporter";
    }

    // Tentukan URL untuk navigasi berdasarkan role
    const homeUrl = pathname === "/" ? "/" : `/${role}`;
    
    let centerUrl = "/reporter/report";
    let CenterIcon = FileText;
    let centerLabel = "Lapor";

    if (role === "staff") {
        centerUrl = "/staff/tasks";
        CenterIcon = ClipboardList;
        centerLabel = "Tugas";
    } else if (role === "executive") {
        centerUrl = "/executive/validations";
        CenterIcon = CheckCircle;
        centerLabel = "Validasi";
    }

    // Logika cerdas untuk mendeteksi halaman aktif
    const isHome = pathname === "/" || pathname === "/reporter" || pathname === "/staff" || pathname === "/executive";
    const isCenter = pathname?.startsWith(centerUrl) || (pathname?.startsWith(`/${role}/`) && !isHome && !pathname.endsWith("/profile"));
    const isProfile = pathname?.endsWith("/profile");

    return (
        <div 
            style={{ position: 'fixed', bottom: '24px', left: 0, right: 0, margin: '0 auto', zIndex: 9999 }}
            className="w-[90%] max-w-sm bg-white/85 backdrop-blur-xl rounded-[28px] shadow-[0_10px_35px_rgba(0,0,0,0.15)] flex justify-around items-center px-6 py-2.5 border border-white/60 transition-all"
        >

            {/* Tombol Home (Kiri) */}
            <Link
                href={homeUrl}
                className={`flex flex-col items-center gap-0.5 transition-all duration-300 transform ${isHome ? "text-sibersih-primary scale-105" : "text-sibersih-primary/40 hover:text-sibersih-primary/70"}`}
            >
                <Home size={22} className={`pointer-events-none ${isHome ? "stroke-[2.5]" : "stroke-2"}`} />
                <span className="text-[11px] font-semibold tracking-tight">Beranda</span>
            </Link>

            {/* Tombol Aksi Utama (Tengah) */}
            <Link
                href={centerUrl}
                className={`flex flex-col items-center gap-0.5 transition-all duration-300 transform ${isCenter ? "text-sibersih-primary scale-105" : "text-sibersih-primary/40 hover:text-sibersih-primary/70"}`}
            >
                <CenterIcon size={22} className={`pointer-events-none ${isCenter ? "stroke-[2.5]" : "stroke-2"}`} />
                <span className="text-[11px] font-semibold tracking-tight">{centerLabel}</span>
            </Link>

            {/* Tombol Profile (Kanan) */}
            <Link
                href={`/${role}/profile`}
                className={`flex flex-col items-center gap-0.5 transition-all duration-300 transform ${isProfile ? "text-sibersih-primary scale-105" : "text-sibersih-primary/40 hover:text-sibersih-primary/70"}`}
            >
                <User size={22} className={`pointer-events-none ${isProfile ? "stroke-[2.5]" : "stroke-2"}`} />
                <span className="text-[11px] font-semibold tracking-tight">Profil</span>
            </Link>

        </div>
    );
}