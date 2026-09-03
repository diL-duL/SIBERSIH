"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useActionState } from "react";
import { loginAction } from "@/app/actions/auth";
import { SubmitButton } from "@/components/SubmitButton";
import { Mail, Lock, Eye, EyeOff, Quote } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, dispatch] = useActionState(loginAction, undefined);

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
             <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xl shadow-lg border border-white/30">
               S
             </div>
             <span className="font-bold text-2xl tracking-tight text-white/90 drop-shadow-md">SiBersih</span>
          </div>
          
          <div className="space-y-6 pb-8">
            <h1 className="text-5xl font-extrabold tracking-tight max-w-lg leading-[1.1] drop-shadow-lg">
              Sistem Pelaporan Kebersihan Terpadu.
            </h1>
            
            {/* Glassmorphic Testimonial/Quote Card */}
            <div className="max-w-md p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl mt-8">
              <Quote className="text-white/40 mb-3" size={28} />
              <p className="text-white/90 text-sm leading-relaxed font-medium">
                "Lingkungan yang bersih adalah cerminan dari pikiran yang jernih. Mari bersama-sama wujudkan Fakultas Teknik yang nyaman untuk semua."
              </p>
              <div className="mt-4 flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                   <span className="text-xs font-bold">FT</span>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-xs font-bold text-white">Universitas Tadulako</span>
                   <span className="text-[10px] text-white/60">Fakultas Teknik</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-md flex flex-col gap-8">
          
          {/* Mobile Logo */}
          <div className="flex items-center justify-center lg:hidden -mb-4">
            <div className="relative h-16 w-48">
              <Image src="/newlogowithtext.png" alt="SIBERSIH Logo" fill className="object-contain" priority sizes="(max-width: 1024px) 192px, 0px" />
            </div>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-sibersih-primary">
              Masuk ke Akun Anda
            </h2>
            <p className="text-sm text-sibersih-primary/60">
              Masukkan email dan kata sandi yang telah terdaftar.
            </p>
          </div>

          <form action={dispatch} className="space-y-5">
            <div className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5 text-left group">
                <label htmlFor="email" className="text-sm font-semibold text-sibersih-primary">Email</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 text-sibersih-primary/40 group-focus-within:text-sibersih-primary transition-colors" size={18} />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="nama@contoh.com"
                    required
                    className="flex h-12 w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-11 pr-4 py-2 text-sm text-sibersih-primary placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sibersih-primary/20 focus-visible:border-sibersih-primary focus-visible:bg-white transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5 text-left group">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-semibold text-sibersih-primary">Kata Sandi</label>
                  <Link href="/login/forgot-password" className="text-xs font-semibold text-sibersih-primary/60 hover:text-sibersih-primary transition-colors">
                    Lupa sandi?
                  </Link>
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 text-sibersih-primary/40 group-focus-within:text-sibersih-primary transition-colors" size={18} />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className="flex h-12 w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-11 pr-11 py-2 text-sm text-sibersih-primary placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sibersih-primary/20 focus-visible:border-sibersih-primary focus-visible:bg-white transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-sibersih-primary/40 hover:text-sibersih-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {errorMessage}
              </div>
            )}
            
            <SubmitButton className="mt-2 text-base font-bold tracking-wide">
              Masuk
            </SubmitButton>
          </form>

          <div className="text-center text-sm text-sibersih-primary/60 flex items-center justify-center gap-1">
            Belum punya akun?
            <Link
              href="/login/register"
              className="font-bold text-sibersih-primary hover:underline hover:text-sibersih-primary/80 transition-colors"
            >
              Daftar sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
