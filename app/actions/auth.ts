'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

// --- In-Memory Rate Limiter Setup ---
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();

function isRateLimited(identifier: string, maxAttempts: number): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  if (!record || now > record.resetTime) {
    return false;
  }
  return record.count >= maxAttempts;
}

function recordFailedAttempt(identifier: string) {
  const now = Date.now();
  const limitWindowMs = 60 * 1000; // 1 menit cooldown

  // Bersihkan entri yang sudah kadaluarsa jika ukuran map membesar (mencegah memory leak)
  if (rateLimitMap.size > 150) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (now > val.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }

  const record = rateLimitMap.get(identifier);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + limitWindowMs });
  } else {
    record.count += 1;
  }
}

function resetRateLimit(identifier: string) {
  rateLimitMap.delete(identifier);
}
// ------------------------------------

export async function loginAction(prevState: string | undefined, formData: FormData) {
  let identifier = '';
  try {
    const headersList = await headers();
    const xForwardedFor = headersList.get('x-forwarded-for');
    const ip = xForwardedFor ? xForwardedFor.split(',')[0].trim() : 'unknown-ip';
    const emailRaw = formData.get('email') as string;
    const email = emailRaw ? emailRaw.trim().toLowerCase() : '';

    // ID unik untuk memblokir berdasarkan kombinasi IP dan Email
    identifier = `login_${ip}_${email}`;
    
    // Untuk Login, berikan toleransi 5 percobaan gagal
    if (isRateLimited(identifier, 5)) {
      return 'Terlalu banyak percobaan masuk yang gagal. Harap tunggu 1 menit.';
    }

    await signIn('credentials', {
      email, // Email dinormalisasi agar konsisten dengan pencarian di database
      password: formData.get('password'),
      redirectTo: '/'
    });

    // Reset limiter jika login berhasil
    resetRateLimit(identifier);
  } catch (error) {
    if (error instanceof AuthError) {
      if (identifier) recordFailedAttempt(identifier);
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Email atau kata sandi salah.';
        default:
          return 'Terjadi kesalahan saat masuk.';
      }
    }
    throw error;
  }
}

export async function registerAction(prevState: string | undefined, formData: FormData) {
  try {
    const headersList = await headers();
    const xForwardedFor = headersList.get('x-forwarded-for');
    const ip = xForwardedFor ? xForwardedFor.split(',')[0].trim() : 'unknown-ip';
    
    const name = (formData.get('name') as string)?.trim();
    const emailRaw = formData.get('email') as string;
    const email = emailRaw ? emailRaw.trim().toLowerCase() : '';
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // ID unik untuk memblokir berdasarkan kombinasi IP dan Email
    const identifier = `reg_${ip}_${email}`;
    
    // Untuk Register, batasnya lebih ketat (3 kali) untuk mencegah spam bot pembuat akun
    if (isRateLimited(identifier, 3)) {
      return 'Terlalu banyak percobaan pendaftaran. Harap tunggu 1 menit.';
    }
    recordFailedAttempt(identifier);

    if (!name || !email || !password || !confirmPassword) {
      return 'Semua kolom wajib diisi.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Format email tidak valid.';
    }

    if (password.length < 6) {
      return 'Kata sandi minimal 6 karakter.';
    }

    if (password !== confirmPassword) {
      return 'Kata sandi tidak cocok.';
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return 'Email sudah digunakan.';
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        nama: name,
        email,
        password: hashedPassword,
        role: 'PELAPOR', // Default role for new users
      },
    });

  } catch {
    return 'Terjadi kesalahan saat mendaftar.';
  }
  
  redirect('/login');
}
