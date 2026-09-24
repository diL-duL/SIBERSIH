"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useActionState } from "react";
import { registerAction } from "@/app/actions/auth";
import { SubmitButton } from "@/components/SubmitButton";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, dispatch] = useActionState(registerAction, undefined);

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
              Daftar Akun Pelapor
            </h1>
            <p className="text-base sm:text-lg text-white/85 leading-relaxed drop-shadow-sm font-normal">
              Fakultas Teknik, Universitas Tadulako. Bersama-sama menjaga kebersihan, kenyamanan, dan kelestarian fasilitas kampus.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
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
              Lengkapi data di bawah ini untuk bergabung.
            </p>
          </div>

          <form action={dispatch} className="space-y-5">
            <div className="space-y-4">
              
              {/* Name Input */}
              <div className="space-y-1.5 text-left group">
                <label htmlFor="name" className="text-sm font-semibold text-sibersih-primary">Nama Lengkap</label>
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 text-sibersih-primary/40 group-focus-within:text-sibersih-primary transition-colors" size={18} />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Contoh: Budi Santoso"
                    required
                    className="flex h-12 w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-11 pr-4 py-2 text-sm text-sibersih-primary placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sibersih-primary/20 focus-visible:border-sibersih-primary focus-visible:bg-white transition-all duration-200"
                  />
                </div>
              </div>

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

              {/* Password Inputs - Grid layout for desktop, stacked for mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password */}
                <div className="space-y-1.5 text-left group">
                  <label htmlFor="password" className="text-sm font-semibold text-sibersih-primary">Kata Sandi</label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 text-sibersih-primary/40 group-focus-within:text-sibersih-primary transition-colors" size={18} />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="flex h-12 w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-11 pr-10 py-2 text-sm text-sibersih-primary placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sibersih-primary/20 focus-visible:border-sibersih-primary focus-visible:bg-white transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-sibersih-primary/40 hover:text-sibersih-primary transition-colors p-1"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5 text-left group">
                  <label htmlFor="confirmPassword" className="text-sm font-semibold text-sibersih-primary">Ulangi Sandi</label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 text-sibersih-primary/40 group-focus-within:text-sibersih-primary transition-colors" size={18} />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="flex h-12 w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-11 pr-10 py-2 text-sm text-sibersih-primary placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sibersih-primary/20 focus-visible:border-sibersih-primary focus-visible:bg-white transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 text-sibersih-primary/40 hover:text-sibersih-primary transition-colors p-1"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
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
              Daftar
            </SubmitButton>
          </form>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-200 w-full" />
            <span className="bg-white px-3 text-xs text-sibersih-primary/50 uppercase font-medium">atau</span>
            <div className="border-t border-gray-200 w-full" />
          </div>

          <GoogleSignInButton text="Daftar dengan Google" />

          <div className="text-center text-sm text-sibersih-primary/60 flex items-center justify-center gap-1">
            Sudah punya akun?
            <Link
              href="/login"
              className="font-bold text-sibersih-primary hover:underline hover:text-sibersih-primary/80 transition-colors"
            >
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
