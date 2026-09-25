'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
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

export async function loginWithGoogleAction() {
  const googleId = process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID;
  const googleSecret = process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET;

  if (!googleId || !googleSecret) {
    return 'Konfigurasi Google OAuth belum disetel di file .env (AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET).';
  }

  try {
    await signIn('google', { redirectTo: '/' });
  } catch (error) {
    if (error instanceof AuthError) {
      return 'Terjadi kesalahan saat masuk dengan Google.';
    }
    throw error;
  }
}

