import Image from "next/image";
import Link from "next/link";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Akun | SiBersih",
  description: "Daftar akun pelapor SiBersih menggunakan Google Sign-In untuk civitas akademika Fakultas Teknik Universitas Tadulako.",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen bg-sibersih-bg font-sans">
      {/* Left side - Image */}
      <div className="relative hidden w-1/2 lg:block overflow-hidden">
        <Image 
          src="/fatek.webp" 
          alt="Gedung Fakultas Teknik Universitas Tadulako" 
          fill 
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-sibersih-primary/40 mix-blend-multiply" />
        
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
             <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-lg border border-white/30 bg-white">
               <Image 
                 src="/sibersihLogo.webp" 
                 alt="SiBersih" 
                 fill 
                 priority 
                 sizes="44px" 
                 className="object-contain" 
               />
             </div>
             <span className="font-bold text-2xl tracking-tight text-white/90 drop-shadow-md">SiBersih</span>
          </div>
          
          <div className="space-y-4 pb-8 max-w-lg">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.15] drop-shadow-lg">
              Sistem Pelaporan Kebersihan Fatek
            </h1>
            <p className="text-base sm:text-lg text-white/85 leading-relaxed drop-shadow-sm font-normal">
              Fakultas Teknik, Universitas Tadulako. Bersama-sama menjaga kebersihan, kenyamanan, dan kelestarian fasilitas kampus.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Google Sign-Up Form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-md flex flex-col gap-8">
          
          {/* Mobile Logo */}
          <div className="flex flex-col items-center justify-center lg:hidden -mb-4">
            <div className="relative h-16 w-16 mb-1">
              <Image src="/sibersihLogo.webp" alt="SIBERSIH Logo" fill className="object-contain" priority sizes="64px" />
            </div>
            <span className="font-bold text-xl text-sibersih-primary tracking-tight">SiBersih</span>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-sibersih-primary">
              Buat Akun Baru
            </h2>
            <p className="text-sm text-sibersih-primary/60">
              Daftar menggunakan akun Google Anda untuk melanjutkan.
            </p>
          </div>

          <GoogleSignInButton text="Daftar dengan Google" />

          <div className="text-center text-sm text-sibersih-primary/60 flex items-center justify-center gap-1.5">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-bold text-sibersih-primary hover:underline hover:text-sibersih-primary/80 transition-colors"
            >
              Masuk di sini
            </Link>
          </div>

          <div className="pt-2 text-center text-xs text-sibersih-primary/50 flex items-center justify-center gap-3">
            <Link href="/privacy" className="hover:text-sibersih-primary underline underline-offset-2 transition-colors">
              Kebijakan Privasi
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-sibersih-primary underline underline-offset-2 transition-colors">
              Ketentuan Layanan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
