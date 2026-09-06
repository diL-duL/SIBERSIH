import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export const revalidate = 60; // Regenerate page every 60 seconds (ISR)

export default async function LandingPage() {
  const recentReports = await prisma.report.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: { pelapor: { select: { nama: true } } }
  });

  return (
    <div className="min-h-screen bg-sibersih-bg font-sans flex flex-col">
      {/* Navbar Simple */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-sibersih-primary/10 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-sibersih-primary flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="font-bold text-sibersih-primary text-xl tracking-tight">SiBersih</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login" className="px-5 py-2 bg-sibersih-primary text-white rounded-full font-semibold text-sm hover:bg-sibersih-primary/90 transition-colors shadow-md">
              Masuk / Daftar
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-12">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-6 pt-8 pb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-sibersih-primary tracking-tight">
            Laporkan Masalah Sampah di Sekitar Anda
          </h1>
          <p className="text-lg text-sibersih-primary/70 leading-relaxed">
            Platform partisipatif untuk mewujudkan lingkungan yang lebih bersih dan sehat. Mari bersama-sama menjaga kebersihan lingkungan dengan satu ketukan.
          </p>
          <div className="pt-4 flex items-center justify-center gap-4">
            <Link href="/login" className="px-8 py-3.5 bg-sibersih-primary text-white rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-sibersih-primary/20">
              Mulai Melapor
            </Link>
          </div>
        </section>

        {/* Recent Reports */}
        <section className="space-y-8 pb-20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-sibersih-primary">Laporan Terbaru</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentReports.length > 0 ? (
              recentReports.map((report, index) => (
                <div key={report.id} className="bg-white rounded-2xl overflow-hidden border border-sibersih-primary/10 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                  <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                    <Image 
                      src={report.fotoLaporanUrl} 
                      alt="Foto Laporan" 
                      fill 
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-sm text-sibersih-primary shadow-sm uppercase tracking-wider">
                      {report.status.replace("_", " ")}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-semibold text-sibersih-primary mb-1 line-clamp-2">{report.lokasi}</h3>
                    <p className="text-sm text-sibersih-primary/60 line-clamp-2 mb-4 flex-1">
                      {report.deskripsi}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-sibersih-primary/10">
                      <div className="text-xs font-medium text-sibersih-primary/70">
                        {report.pelapor.nama}
                      </div>
                      <div className="text-xs text-sibersih-primary/50">
                        {new Date(report.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-sibersih-primary/50 bg-white rounded-2xl border border-dashed border-sibersih-primary/20">
                Belum ada laporan yang masuk.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
