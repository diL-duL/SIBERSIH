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
    
    if (role === "staff") {
        centerUrl = "/staff/tasks";
        CenterIcon = ClipboardList;
    } else if (role === "executive") {
        centerUrl = "/executive/validations";
        CenterIcon = CheckCircle;
    }

    // Logika cerdas untuk mendeteksi halaman aktif
    const isHome = pathname === "/" || pathname === "/reporter" || pathname === "/staff" || pathname === "/executive";
    const isCenter = pathname?.startsWith(centerUrl) || (pathname?.startsWith(`/${role}/`) && !isHome && !pathname.endsWith("/profile"));
    const isProfile = pathname?.endsWith("/profile");

    return (
        <div 
            style={{ position: 'fixed', bottom: '32px', left: 0, right: 0, margin: '0 auto', zIndex: 9999 }}
            className="w-[90%] max-w-sm bg-white/80 backdrop-blur-xl rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex justify-around items-center px-6 py-4 border border-white/50"
        >

            {/* Tombol Home (Kiri) */}
            <Link
                href={homeUrl}
                className={`flex flex-col items-center gap-1 transition-all duration-300 transform hover:scale-110 ${isHome ? "text-sibersih-primary" : "text-sibersih-primary/40 hover:text-sibersih-primary/70"}`}
            >
                <Home size={24} className={isHome ? "stroke-[2.5]" : "stroke-2"} />
            </Link>

            {/* Tombol Aksi Utama (Tengah) */}
            <Link
                href={centerUrl}
                className={`flex flex-col items-center gap-1 transition-all duration-300 transform hover:scale-110 ${isCenter ? "text-sibersih-primary" : "text-sibersih-primary/40 hover:text-sibersih-primary/70"}`}
            >
                <CenterIcon size={24} className={isCenter ? "stroke-[2.5]" : "stroke-2"} />
            </Link>

            {/* Tombol Profile (Kanan) */}
            <Link
                href={`/${role}/profile`}
                className={`flex flex-col items-center gap-1 transition-all duration-300 transform hover:scale-110 ${isProfile ? "text-sibersih-primary" : "text-sibersih-primary/40 hover:text-sibersih-primary/70"}`}
            >
                <User size={24} className={isProfile ? "stroke-[2.5]" : "stroke-2"} />
            </Link>

        </div>
    );
}