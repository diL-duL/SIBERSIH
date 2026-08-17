'use server';

import { prisma } from '@/lib/prisma';
import { auth, signOut } from '@/auth';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

// 1. Logout
export async function logoutAction() {
  await signOut({ redirectTo: '/login' });
}

// 2. Change Password
export async function changePasswordAction(prevState: unknown, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.email) return { error: 'Unauthorized' };

    const oldPassword = formData.get('oldPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return { error: 'Semua kolom wajib diisi.' };
    }

    if (newPassword !== confirmPassword) {
      return { error: 'Kata sandi baru tidak cocok.' };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) return { error: 'Pengguna tidak ditemukan.' };

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return { error: 'Kata sandi lama salah.' };

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    return { success: 'Kata sandi berhasil diubah!' };
  } catch {
    return { error: 'Terjadi kesalahan pada server.' };
  }
}

// 3. Update Profile
export async function updateProfileAction(prevState: unknown, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.email) return { error: 'Unauthorized' };

    const nama = formData.get('nama') as string;
    if (!nama) return { error: 'Nama tidak boleh kosong.' };

    await prisma.user.update({
      where: { email: session.user.email },
      data: { nama }
    });

    revalidatePath('/', 'layout');
    return { success: 'Profil berhasil diperbarui!' };
  } catch {
    return { error: 'Gagal memperbarui profil.' };
  }
}

// 4. Delete Account
export async function deleteAccountAction(prevState: unknown, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.email) return { error: 'Unauthorized' };

    const password = formData.get('password') as string;
    if (!password) return { error: 'Kata sandi wajib diisi.' };

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) return { error: 'Pengguna tidak ditemukan.' };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return { error: 'Kata sandi salah.' };

    // Hapus laporan pengguna terlebih dahulu jika ada (Mencegah foreign key error)
    await prisma.report.deleteMany({
      where: { pelaporId: user.id }
    });

    await prisma.user.delete({
      where: { id: user.id }
    });
  } catch {
    return { error: 'Gagal menghapus akun.' };
  }
  
  await signOut({ redirectTo: '/login' });
}
