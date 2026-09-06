"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, User, ClipboardList, CheckCircle } from "lucide-react";

interface BottomNavProps {
    role: "reporter" | "staff" | "executive";
}

export default function BottomNav({ role }: BottomNavProps) {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);

    // Reset visibility saat navigasi rute berubah
    useEffect(() => {
        setIsVisible(true);
    }, [pathname]);

    // Deteksi scroll untuk autohide (scroll bawah = sembunyi, scroll atas = muncul)
    useEffect(() => {
        const lastScrollMap = new Map<EventTarget, number>();

        const handleScroll = (e: Event) => {
            const target = e.target;
            let currentY = 0;

            if (target === document || target === window) {
                currentY = window.scrollY || document.documentElement.scrollTop;
            } else if (target instanceof HTMLElement) {
                currentY = target.scrollTop;
            } else {
                return;
            }

            const prevY = lastScrollMap.get(target) ?? 0;
            const diff = currentY - prevY;

            // Jika di dekat paling atas, selalu tampilkan
            if (target === document || target === window) {
                if (currentY <= 15) {
                    setIsVisible(true);
                    lastScrollMap.set(target, currentY);
                    return;
                }
            }

            // Abaikan pergeseran kecil untuk kestabilan
            if (Math.abs(diff) < 8) return;

            if (diff > 0 && currentY > 30) {
                // Scroll ke bawah -> autohide navbar
                setIsVisible(false);
            } else if (diff < 0) {
                // Scroll ke atas -> tampilkan navbar
                setIsVisible(true);
            }

            lastScrollMap.set(target, currentY);
        };

        // Tangkap scroll di window maupun container dengan overflow (capture: true)
        window.addEventListener("scroll", handleScroll, { capture: true, passive: true });

        // Tampilkan juga jika kursor digerakkan ke area bawah layar (desktop)
        const handleMouseMove = (e: MouseEvent) => {
            if (e.clientY > window.innerHeight - 80) {
                setIsVisible(true);
            }
        };
        window.addEventListener("mousemove", handleMouseMove, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll, { capture: true });
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    // Sembunyikan navbar di halaman otentikasi
    const hiddenPaths = ["/login", "/login/register", "/login/forgot-password"];
    if (hiddenPaths.includes(pathname || "")) {
        return null;
    }

    // Tentukan URL untuk navigasi berdasarkan role
    const homeUrl = `/${role}`;
    
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
    const isHome = pathname === `/${role}`;
    const isCenter = pathname?.startsWith(centerUrl) || (pathname?.startsWith(`/${role}/`) && !isHome && !pathname.endsWith("/profile") && !pathname.endsWith("/staff-management"));
    const isProfile = pathname?.endsWith("/profile");

    return (
        <div 
            style={{ position: 'fixed', bottom: '24px', left: 0, right: 0, margin: '0 auto', zIndex: 9999 }}
            className={`w-[90%] max-w-sm bg-white/85 backdrop-blur-xl rounded-[28px] shadow-[0_10px_35px_rgba(0,0,0,0.15)] flex justify-around items-center px-6 py-2.5 border border-white/60 transition-all duration-300 ease-in-out transform ${
                isVisible 
                    ? "translate-y-0 opacity-100 pointer-events-auto" 
                    : "translate-y-28 opacity-0 pointer-events-none"
            }`}
        >

            {/* Tombol Home (Kiri) */}
            <Link
                href={homeUrl}
                className={`flex flex-col items-center gap-0.5 transition-all duration-300 transform ${isHome ? "text-sibersih-primary scale-105" : "text-sibersih-primary/40 hover:text-sibersih-primary/70"}`}
            >
                <Home size={22} className={`pointer-events-none ${isHome ? "stroke-[2.5]" : "stroke-2"}`} />
                <span className="text-[11px] font-semibold tracking-tight">beranda</span>
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