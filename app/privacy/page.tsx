import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi | SiBersih",
  description: "Kebijakan Privasi Penggunaan Layanan dan Otentikasi Google OAuth SiBersih Fakultas Teknik Universitas Tadulako.",
};

export default function PrivacyPolicyPage() {
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" /> Kebijakan Privasi
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-sibersih-primary">
              Kebijakan Privasi SiBersih
            </h1>
            <p className="text-sm text-sibersih-primary/60">
              Terakhir diperbarui: 25 September 2026
            </p>
          </div>

          <section className="space-y-3 text-sm leading-relaxed text-sibersih-primary/80">
            <h2 className="text-base font-bold text-sibersih-primary">1. Pendahuluan</h2>
            <p>
              Aplikasi <strong>SiBersih</strong> dikembangkan sebagai Sistem Informasi Kebersihan Kampus di lingkungan Fakultas Teknik, Universitas Tadulako. Kami menghargai dan berkomitmen penuh untuk melindungi privasi serta keamanan data pribadi seluruh civitas akademika yang menggunakan layanan kami.
            </p>
          </section>

          <section className="space-y-3 text-sm leading-relaxed text-sibersih-primary/80">
            <h2 className="text-base font-bold text-sibersih-primary">2. Data yang Dikumpulkan Melalui Google OAuth</h2>
            <p>
              Saat Anda memilih untuk masuk menggunakan akun Google (One-Click Google Sign-In), kami hanya meminta izin dasar (*non-sensitive scopes*) berupa:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li><strong>Nama Lengkap:</strong> Digunakan untuk menampilkan identitas nama pelapor pada kartu laporan kebersihan fasilitas kampus.</li>
              <li><strong>Alamat Email:</strong> Digunakan sebagai identifikasi akun unik dan memastikan hanya civitas yang terverifikasi yang dapat masuk dan membuat laporan.</li>
            </ul>
            <p className="pt-1">
              Kami <strong>tidak meminta, mengakses, atau menyimpan</strong> foto profil, kata sandi akun Google Anda, data kontak, berkas Google Drive, email pribadi, atau data sensitif lainnya.
            </p>
          </section>

          <section className="space-y-3 text-sm leading-relaxed text-sibersih-primary/80">
            <h2 className="text-base font-bold text-sibersih-primary">3. Penggunaan Informasi</h2>
            <p>Data yang dikumpulkan semata-mata digunakan untuk:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Mengotentikasi dan memberikan hak akses peran (Role) pelapor di sistem SiBersih.</li>
              <li>Menghubungkan laporan tumpukan sampah yang dibuat dengan akun pelapor yang bersangkutan.</li>
              <li>Mencegah tindakan penyalahgunaan, spam, atau laporan palsu (*anti-abuse*).</li>
            </ul>
          </section>

          <section className="space-y-3 text-sm leading-relaxed text-sibersih-primary/80">
            <h2 className="text-base font-bold text-sibersih-primary">4. Pembagian Data kepada Pihak Ketiga</h2>
            <p>
              Kami <strong>tidak pernah menjual, menyewakan, atau membagikan</strong> informasi pribadi Anda kepada pihak ketiga atau pengiklan komersial manapun. Data hanya dapat diakses oleh petugas kebersihan dan pimpinan kampus dalam rangka verifikasi dan penanganan kebersihan lingkungan kampus.
            </p>
          </section>

          <section className="space-y-3 text-sm leading-relaxed text-sibersih-primary/80">
            <h2 className="text-base font-bold text-sibersih-primary">5. Keamanan Data & Penyimpanan</h2>
            <p>
              Seluruh transmisi data dilindungi dengan enkripsi standar industri HTTPS/TLS. Kata sandi akun internal di-hash menggunakan algoritma Bcrypt yang aman, dan koneksi database dilindungi dengan isolasi jaringan terenkripsi.
            </p>
          </section>

          <section className="space-y-3 text-sm leading-relaxed text-sibersih-primary/80">
            <h2 className="text-base font-bold text-sibersih-primary">6. Hak Pengguna & Penghapusan Akun</h2>
            <p>
              Pengguna memiliki hak penuh untuk memperbarui profil atau menghapus akun mereka secara permanen kapan saja melalui menu Pengaturan Profil di dalam aplikasi. Saat akun dihapus, seluruh data riwayat dan foto terkait akan dibersihkan dari server dan cloud storage.
            </p>
          </section>

          <section className="space-y-3 text-sm leading-relaxed text-sibersih-primary/80">
            <h2 className="text-base font-bold text-sibersih-primary">7. Hubungi Kami</h2>
            <p>
              Jika Anda memiliki pertanyaan mengenai kebijakan privasi ini atau pengelolaan data di SiBersih, silakan hubungi tim pengelola Fakultas Teknik Universitas Tadulako.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
