"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useActionState } from "react";
import { registerAction } from "@/app/actions/auth";
import { SubmitButton } from "@/components/SubmitButton";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, dispatch] = useActionState(registerAction, undefined);

  return (
    <div className="flex min-h-screen bg-sibersih-bg font-sans">
      {/* Left side - Image */}
      <div className="relative hidden w-1/2 lg:block">
        <Image
          src="/fatek.jpg"
          alt="SIBERSIH Background"
          fill
          className="object-cover"
          priority
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
        
        {/* Subtle gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
          
          <div className="space-y-5 pb-8">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl max-w-lg leading-tight">
              Bergabung<br/>Bersama Kami.
            </h1>
            <p className="max-w-lg text-lg text-sibersih-bg font-medium opacity-90">
              Jadilah bagian dari perubahan untuk lingkungan yang lebih bersih, nyaman, dan terpercaya.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex w-full flex-col justify-center px-8 py-12 sm:px-12 lg:w-1/2 xl:px-24">
        <div className="mx-auto w-full max-w-md flex justify-center -mb-6">
           <div className="relative h-48 w-full max-w-[420px]">
             <Image src="/newlogowithtext.png" alt="SIBERSIH Logo" fill className="object-contain" priority sizes="(max-width: 768px) 100vw, 420px" />
           </div>
        </div>
        <div className="mx-auto w-full max-w-sm space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-sibersih-primary">
              Buat Akun Baru
            </h2>
            <p className="text-sm text-sibersih-primary/60">
              Masukkan informasi Anda untuk memulai.
            </p>
          </div>

          <form action={dispatch} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2 text-left">
                <label
                  htmlFor="name"
                  className="text-sm font-semibold leading-none text-sibersih-primary"
                >
                  Nama Lengkap
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Nama"
                  required
                  className="flex h-12 w-full rounded-xl border border-sibersih-primary/20 bg-white px-4 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sibersih-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sibersih-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                />
              </div>

              <div className="space-y-2 text-left">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold leading-none text-sibersih-primary"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nama@contoh.com"
                  required
                  className="flex h-12 w-full rounded-xl border border-sibersih-primary/20 bg-white px-4 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sibersih-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sibersih-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                />
              </div>

              <div className="space-y-2 text-left">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold leading-none text-sibersih-primary"
                >
                  Kata Sandi
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="flex h-12 w-full rounded-xl border border-sibersih-primary/20 bg-white px-4 py-2 pr-10 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sibersih-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sibersih-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sibersih-primary/50 hover:text-sibersih-primary transition-colors"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-left">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-semibold leading-none text-sibersih-primary"
                >
                  Konfirmasi Kata Sandi
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className="flex h-12 w-full rounded-xl border border-sibersih-primary/20 bg-white px-4 py-2 pr-10 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sibersih-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sibersih-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sibersih-primary/50 hover:text-sibersih-primary transition-colors"
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}

            <SubmitButton>Daftar</SubmitButton>
          </form>

          <div className="text-center text-sm text-sibersih-primary/60">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-semibold text-sibersih-primary hover:underline hover:text-sibersih-primary/80 transition-colors"
            >
              Masuk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
