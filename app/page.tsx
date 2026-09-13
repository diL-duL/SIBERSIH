import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export const revalidate = 60; // Regenerate page every 60 seconds (ISR)

export default async function LandingPage() {
  const recentReports = await prisma.report.findMany({
    where: {
      fotoBuktiUrl: { not: null },
    },
    orderBy: { updatedAt: "desc" },
    take: 9,
    include: {
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
            <ThemeToggle />
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

        {/* Recent Reports Showcase */}
        <section className="space-y-6 pb-16">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-sibersih-primary">Hasil Pembersihan Terbaru</h2>
            <p className="text-xs sm:text-sm text-sibersih-primary/60 mt-0.5">
              Dokumentasi fasilitas dan area kampus yang telah selesai dibersihkan oleh petugas.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentReports.length > 0 ? (
              recentReports.map((report, index) => {
                const petugasNama = report.petugas?.nama || "Petugas Kebersihan";

                return (
                  <div 
                    key={report.id} 
                    className="bg-white rounded-xl overflow-hidden border border-sibersih-primary/10 shadow-xs flex flex-col"
                  >
                    <div className="relative w-full h-44 bg-gray-100 overflow-hidden">
                      <Image 
                        src={report.fotoBuktiUrl!} 
                        alt={`Foto pembersihan ${report.lokasi}`} 
                        fill 
                        priority={index === 0}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover" 
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-semibold text-sibersih-primary text-sm line-clamp-1 mb-1">
                        {report.lokasi}
                      </h3>
                      <p className="text-xs text-sibersih-primary/65 line-clamp-2 mb-4 flex-1">
                        {report.deskripsiPetugas || report.deskripsi}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-sibersih-primary/10 text-xs text-sibersih-primary/60">
                        <span className="line-clamp-1">
                          Petugas: <strong className="text-sibersih-primary font-medium">{petugasNama}</strong>
                        </span>
                        <span className="text-[11px] shrink-0 ml-2">
                          {new Date(report.updatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center text-sm text-sibersih-primary/50 bg-white rounded-xl border border-dashed border-sibersih-primary/15">
                Belum ada dokumentasi pembersihan yang selesai.
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-sibersih-primary/10 py-6 text-center text-xs text-sibersih-primary/50">
        © {new Date().getFullYear()} SiBersih — Fakultas Teknik, Universitas Tadulako
      </footer>
    </div>
  );
}
