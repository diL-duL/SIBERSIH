import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import LandingReportsList from "@/components/LandingReportsList";

export const revalidate = 60; // Regenerate page every 60 seconds (ISR)

export default async function LandingPage() {
  const allReports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      pelapor: { select: { nama: true } },
      petugas: { select: { nama: true } },
    },
  });

  return (
    <div className="min-h-screen bg-sibersih-bg font-sans flex flex-col">
      {/* Navbar */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-sibersih-primary/10 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center py-1">
            <div className="relative h-11 w-24 sm:w-28">
              <Image 
                src="/newlogowithtext.png" 
                alt="SiBersih" 
                fill 
                priority 
                className="object-contain object-left dark:brightness-0 dark:invert transition-[filter]" 
                sizes="120px" 
              />
            </div>
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

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10">
        {/* Hero Section */}
        <section className="text-center max-w-2xl mx-auto space-y-4 pt-6 pb-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-sibersih-primary tracking-tight">
            Sistem Pelaporan Kebersihan Kampus
          </h1>
          <p className="text-sm sm:text-base text-sibersih-primary/70 leading-relaxed">
            Fakultas Teknik, Universitas Tadulako. Laporkan fasilitas dan area yang memerlukan penanganan kebersihan untuk segera ditindaklanjuti oleh petugas.
          </p>
          <div className="pt-2 flex items-center justify-center">
            <Link 
              href="/login" 
              className="px-6 py-2.5 bg-sibersih-primary text-white rounded-lg font-medium text-sm hover:bg-sibersih-primary/90 transition-colors shadow-xs"
            >
              Mulai Melapor
            </Link>
          </div>
        </section>

        {/* All Reports Showcase (Tanpa Gambar, 3 Laporan Awal + Tombol Lihat Semua) */}
        <section className="space-y-6 pb-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-sibersih-primary/10 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-sibersih-primary">
                Daftar Laporan Kebersihan
              </h2>
              <p className="text-xs sm:text-sm text-sibersih-primary/60 mt-0.5">
                Semua laporan fasilitas dan area kampus dengan seluruh status penanganan secara transparan.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 bg-white border border-sibersih-primary/15 rounded-full text-sibersih-primary shadow-2xs">
                {allReports.length} Laporan Tercatat
              </span>
            </div>
          </div>
          
          <LandingReportsList reports={allReports} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-sibersih-primary/10 py-6 text-center text-xs text-sibersih-primary/50">
        © {new Date().getFullYear()} SiBersih — Fakultas Teknik, Universitas Tadulako
      </footer>
    </div>
  );
}
