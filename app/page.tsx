import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin } from "lucide-react";

export const revalidate = 60; // Regenerate page every 60 seconds (ISR)

function getStatusBadge(status: string) {
  switch (status) {
    case "SELESAI":
      return (
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Selesai
        </span>
      );
    case "MENUNGGU_APPROVAL":
      return (
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Menunggu Validasi
        </span>
      );
    case "LAPORAN_MASUK":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Laporan Masuk
        </span>
      );
  }
}

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

        {/* All Reports Showcase (Tanpa Gambar) */}
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {allReports.length > 0 ? (
              allReports.map((report) => {
                const pelaporNama = report.pelapor?.nama || "Civitas Akademika";
                const petugasNama = report.petugas?.nama || "Belum Ditugaskan";

                return (
                  <div 
                    key={report.id} 
                    className="bg-white rounded-xl border border-sibersih-primary/10 shadow-xs hover:shadow-sm transition-all p-4 sm:p-5 flex flex-col justify-between"
                  >
                    <div>
                      {/* Lokasi & Status */}
                      <div className="flex items-start justify-between gap-2.5 mb-2.5">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-mono font-medium text-sibersih-primary/50 bg-sibersih-primary/5 px-1.5 py-0.5 rounded border border-sibersih-primary/10 inline-block mb-1">
                            #{report.id.substring(0, 8)}
                          </span>
                          <h3 className="font-bold text-sibersih-primary text-sm sm:text-base line-clamp-1 flex items-center gap-1.5">
                            <MapPin size={14} className="text-sibersih-primary/50 shrink-0" />
                            <span className="truncate">{report.lokasi}</span>
                          </h3>
                        </div>
                        {getStatusBadge(report.status)}
                      </div>

                      {/* Detail Laporan & Catatan Petugas */}
                      <div className="space-y-2.5 mb-4">
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-sibersih-primary/50 block">
                            Deskripsi Laporan:
                          </span>
                          <p className="text-xs sm:text-sm text-sibersih-primary/80 leading-relaxed mt-0.5">
                            {report.deskripsi}
                          </p>
                        </div>

                        {report.deskripsiPetugas && (
                          <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 block mb-0.5">
                              Catatan Petugas:
                            </span>
                            <p className="text-emerald-950/80 leading-relaxed">
                              {report.deskripsiPetugas}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Metadata: Pelapor, Petugas, dan Waktu */}
                    <div className="pt-3 border-t border-sibersih-primary/10 flex flex-col gap-1.5 text-xs text-sibersih-primary/60">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate">
                          Pelapor: <strong className="text-sibersih-primary font-medium">{pelaporNama}</strong>
                        </span>
                        <span className="truncate text-right">
                          Petugas: <strong className="text-sibersih-primary font-medium">{petugasNama}</strong>
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-sibersih-primary/5 text-[11px] text-sibersih-primary/50">
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="shrink-0" />
                          {new Date(report.createdAt).toLocaleDateString("id-ID", { 
                            day: "numeric", 
                            month: "short", 
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                        {report.status === "SELESAI" && (
                          <span className="text-emerald-700 font-medium">
                            Selesai: {new Date(report.updatedAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short"
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center text-sm text-sibersih-primary/50 bg-white rounded-xl border border-dashed border-sibersih-primary/15">
                Belum ada laporan kebersihan saat ini.
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
