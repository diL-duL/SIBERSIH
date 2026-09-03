'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

// --- In-Memory Rate Limiter Setup ---
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();

function checkRateLimit(identifier: string, maxAttempts: number) {
  const now = Date.now();
  const limitWindowMs = 60 * 1000; // 1 menit cooldown

  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + limitWindowMs });
    return true; 
  }

  if (record.count >= maxAttempts) {
    return false; 
  }

  record.count += 1;
  return true; 
}
// ------------------------------------

export async function loginAction(prevState: string | undefined, formData: FormData) {
  try {
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown-ip';
    const emailRaw = formData.get('email') as string;
    const email = emailRaw ? emailRaw.trim().toLowerCase() : '';

    // ID unik untuk memblokir berdasarkan kombinasi IP dan Email
    const identifier = `login_${ip}_${email}`;
    
    // Untuk Login, berikan toleransi 5 percobaan agar user asli yang lupa password tidak cepat terblokir
    if (!checkRateLimit(identifier, 5)) {
      return 'Terlalu banyak percobaan masuk yang gagal. Harap tunggu 1 menit.';
    }

    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: '/'
    });
  } catch (error) {
    if (error instanceof AuthError) {
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
    const ip = headersList.get('x-forwarded-for') || 'unknown-ip';
    
    const name = formData.get('name') as string;
    const emailRaw = formData.get('email') as string;
    const email = emailRaw ? emailRaw.trim().toLowerCase() : '';
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // ID unik untuk memblokir berdasarkan kombinasi IP dan Email
    const identifier = `reg_${ip}_${email}`;
    
    // Untuk Register, batasnya lebih ketat (3 kali) untuk mencegah spam bot pembuat akun
    if (!checkRateLimit(identifier, 3)) {
      return 'Terlalu banyak percobaan pendaftaran. Harap tunggu 1 menit.';
    }

    if (!name || !email || !password || !confirmPassword) {
      return 'Semua kolom wajib diisi.';
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
