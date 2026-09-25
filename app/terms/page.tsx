import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan | SiBersih",
  description: "Syarat dan Ketentuan Penggunaan Sistem Informasi Kebersihan Kampus SiBersih Fakultas Teknik Universitas Tadulako.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-sibersih-bg font-sans flex flex-col">
      {/* Header */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-sibersih-primary/10 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative h-9 w-9">
              <Image 
                src="/sibersihLogo.webp" 
                alt="SiBersih" 
                fill 
                priority 
                className="object-contain" 
                sizes="36px" 
              />
            </div>
            <span className="font-bold text-xl text-sibersih-primary tracking-tight">SiBersih</span>
          </Link>
          <Link 
            href="/login" 
            className="inline-flex items-center gap-1.5 text-sm font-medium text-sibersih-primary/70 hover:text-sibersih-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="bg-white rounded-2xl border border-sibersih-primary/10 p-6 sm:p-10 space-y-8 shadow-xs">
          <div className="space-y-2 border-b border-sibersih-primary/10 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
              <FileText className="w-4 h-4" /> Syarat & Ketentuan
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-sibersih-primary">
              Ketentuan Layanan SiBersih
            </h1>
            <p className="text-sm text-sibersih-primary/60">
              Terakhir diperbarui: 25 September 2026
            </p>
          </div>

          <section className="space-y-3 text-sm leading-relaxed text-sibersih-primary/80">
            <h2 className="text-base font-bold text-sibersih-primary">1. Penerimaan Ketentuan</h2>
            <p>
              Dengan mengakses atau menggunakan platform <strong>SiBersih</strong> (melalui web atau masuk menggunakan Google OAuth), Anda menyatakan setuju untuk terikat oleh Syarat dan Ketentuan ini.
            </p>
          </section>

          <section className="space-y-3 text-sm leading-relaxed text-sibersih-primary/80">
            <h2 className="text-base font-bold text-sibersih-primary">2. Penggunaan Layanan & Tanggung Jawab Pengguna</h2>
            <p>
              Platform SiBersih disediakan khusus untuk membantu pengelolaan dan kebersihan di lingkungan Fakultas Teknik Universitas Tadulako. Pengguna diwajibkan:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Memberikan informasi lokasi dan deskripsi tumpukan sampah yang akurat dan dapat dipertanggungjawabkan.</li>
              <li>Mengunggah foto asli yang relevan dengan kondisi fisik kebersihan fasilitas kampus.</li>
              <li>Tidak mengunggah konten yang melanggar hukum, bersifat pornografi, ujaran kebencian, pencemaran nama baik, atau spam.</li>
            </ul>
          </section>

          <section className="space-y-3 text-sm leading-relaxed text-sibersih-primary/80">
            <h2 className="text-base font-bold text-sibersih-primary">3. Pengawasan dan Pembatalan Laporan Palsu</h2>
            <p>
              Pimpinan kampus dan administrator sistem memiliki wewenang penuh untuk meninjau, menolak, atau menghapus laporan yang terindikasi palsu, spam, atau mengandung konten tidak pantas. Akun yang terbukti berulang kali menyalahgunakan sistem dapat dicabut hak aksesnya.
            </p>
          </section>

          <section className="space-y-3 text-sm leading-relaxed text-sibersih-primary/80">
            <h2 className="text-base font-bold text-sibersih-primary">4. Batasan Tanggung Jawab</h2>
            <p>
              Layanan ini disediakan sebagaimana adanya (*as-is*). Tim pengembang berupaya sebaik mungkin menjaga ketersediaan sistem dan akurasi data, namun tidak bertanggung jawab atas kerugian tidak langsung yang timbul akibat gangguan teknis di luar kendali.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
