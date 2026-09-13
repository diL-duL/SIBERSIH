'use server';

import { prisma } from '@/lib/prisma';
import { auth, signOut } from '@/auth';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { deleteImageFromCloudinary } from '@/lib/cloudinary';

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

    // Ambil foto laporan untuk dibersihkan dari Cloudinary demi menghemat kuota gratis
    const userReports = await prisma.report.findMany({
      where: { pelaporId: user.id },
      select: { fotoLaporanUrl: true, fotoBuktiUrl: true }
    });

    for (const rep of userReports) {
      if (rep.fotoLaporanUrl) deleteImageFromCloudinary(rep.fotoLaporanUrl).catch(() => {});
      if (rep.fotoBuktiUrl) deleteImageFromCloudinary(rep.fotoBuktiUrl).catch(() => {});
    }

    // Lepaskan referensi jika user ini pernah menjadi petugas pembersih
    await prisma.report.updateMany({
      where: { petugasId: user.id },
      data: { petugasId: null }
    });

    // Hapus laporan pengguna terlebih dahulu jika ada
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

// 5. Create Staff Account (Pimpinan Only)
export async function buatAkunPetugas(data: { nama: string; email: string; password: string }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'PIMPINAN') {
      return { error: 'Unauthorized' };
    }

    const { nama, email, password } = data;

    if (!nama || !email || !password) {
      return { error: 'Semua kolom wajib diisi.' };
    }

    if (password.length < 6) {
      return { error: 'Kata sandi petugas minimal 6 karakter.' };
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: 'Email sudah terdaftar.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        nama,
        email,
        password: hashedPassword,
        role: 'PETUGAS'
      }
    });

    revalidatePath('/executive/staff-management');
    return { success: 'Akun petugas berhasil dibuat!' };
  } catch (error) {
    console.error("Error buatAkunPetugas:", error);
    return { error: 'Terjadi kesalahan saat membuat akun petugas.' };
  }
}

// 6. Delete Staff Account (Pimpinan Only)
export async function hapusAkunPetugas(id: string) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'PIMPINAN') {
      return { error: 'Unauthorized' };
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || user.role !== 'PETUGAS') {
      return { error: 'Akun petugas tidak ditemukan.' };
    }

    // Lepaskan referensi petugas pada laporan agar riwayat kerja historis kampus tidak hilang dan mencegah foreign key error
    await prisma.report.updateMany({
      where: { petugasId: id },
      data: { petugasId: null }
    });

    // Menghapus laporan jika petugas pernah membuat laporan sebagai pelapor
    await prisma.report.deleteMany({
      where: { pelaporId: id }
    });

    await prisma.user.delete({ where: { id } });
    revalidatePath('/executive/staff-management');
    return { success: 'Akun petugas berhasil dihapus.' };
  } catch (error) {
    console.error("Error hapusAkunPetugas:", error);
    return { error: 'Terjadi kesalahan saat menghapus akun petugas.' };
  }
}
