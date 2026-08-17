'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function loginAction(prevState: string | undefined, formData: FormData) {
  try {
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

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function registerAction(prevState: string | undefined, formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

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
