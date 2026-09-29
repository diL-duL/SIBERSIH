import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import LandingReportsList from "@/components/LandingReportsList";
import UntadAppShortcuts from "@/components/UntadAppShortcuts";
import EmergencyHotline from "@/components/EmergencyHotline";

export const revalidate = 60; // Regenerate page every 60 seconds (ISR)

export default async function LandingPage() {
  const [allReports, totalReportsCount] = await Promise.all([
    prisma.report.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        lokasi: true,
        deskripsi: true,
        deskripsiPetugas: true,
        kategori: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        pelapor: { select: { nama: true } },
        petugas: { select: { nama: true } },
      },
    }),
    prisma.report.count(),
  ]);

  return (
    <div className="min-h-screen bg-sibersih-bg font-sans flex flex-col">
      {/* Navbar */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-sibersih-primary/10 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 py-1">
            <div className="relative h-10 w-10 sm:h-11 sm:w-11">
              <Image 
                src="/sibersihLogo.webp" 
                alt="SiBersih" 
                fill 
                priority 
                className="object-contain" 
                sizes="44px" 
              />
            </div>
            <span className="font-bold text-xl sm:text-2xl text-sibersih-primary tracking-tight">
              SiBersih
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link 
              href="/login" 
              className="px-4 py-2 bg-sibersih-primary text-white rounded-lg font-medium text-sm hover:bg-sibersih-primary/90 transition-colors shadow-xs"
            >
              Masuk
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col gap-10">
        {/* Hero Section */}
        <section className="text-center max-w-2xl mx-auto space-y-4 pt-2 pb-2 flex flex-col items-center">
          <div className="relative h-20 w-20 sm:h-24 sm:w-24 mb-1 drop-shadow-sm">
            <Image 
              src="/sibersihLogo.webp" 
              alt="Logo SiBersih" 
              fill 
              priority 
              className="object-contain" 
              sizes="96px" 
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-sibersih-primary tracking-tight">
            Sistem Pelaporan Kebersihan & Fasilitas Fatek
          </h1>
          <p className="text-sm sm:text-base text-sibersih-primary/70 leading-relaxed">
            Fakultas Teknik, Universitas Tadulako. Laporkan fasilitas, tumpukan sampah, dan sarana prasarana yang memerlukan penanganan untuk segera ditindaklanjuti petugas.
          </p>
          <div className="pt-2 flex items-center justify-center">
            <Link 
              href="/login" 
              className="px-6 py-2.5 bg-sibersih-primary text-white rounded-lg font-semibold text-sm hover:bg-sibersih-primary/90 transition-colors shadow-xs"
            >
              Mulai Melapor
            </Link>
          </div>
        </section>

        {/* Pemadam Kebakaran & Emergency Hotline */}
        <EmergencyHotline />

        {/* Untad Ecosystem Applications Shortcuts */}
        <UntadAppShortcuts />

        {/* All Reports Showcase */}
        <section className="space-y-6 pb-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-sibersih-primary/10 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-sibersih-primary">
                Daftar Laporan Terkini
              </h2>
              <p className="text-xs sm:text-sm text-sibersih-primary/60 mt-0.5">
                Semua laporan kebersihan sampah dan sarana prasarana kampus secara transparan.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 bg-white border border-sibersih-primary/15 rounded-full text-sibersih-primary shadow-2xs">
                {totalReportsCount > allReports.length
                  ? `${allReports.length} dari ${totalReportsCount} Laporan`
                  : `${allReports.length} Laporan Tercatat`}
              </span>
            </div>
          </div>
          
          <LandingReportsList reports={allReports} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-sibersih-primary/10 py-6 text-center text-xs text-sibersih-primary/50 flex items-center justify-center gap-2">
        <div className="relative h-4 w-4 opacity-75">
          <Image src="/sibersihLogo.webp" alt="SiBersih" fill className="object-contain" sizes="16px" />
        </div>
        <span>© {new Date().getFullYear()} SiBersih — Fakultas Teknik, Universitas Tadulako</span>
      </footer>
    </div>
  );
}
