'use server';

import { prisma } from '@/lib/prisma';
import { auth, signOut } from '@/auth';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { deleteMultipleImagesFromCloudinary } from '@/lib/cloudinary';

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

    if (newPassword.length < 6) {
      return { error: 'Kata sandi baru minimal 6 karakter.' };
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

// 2b. Set Password Langsung (Untuk Popup Pasca-Login Google)
export async function setPasswordDirectAction(prevState: unknown, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.email) return { error: 'Sesi tidak valid, silakan login kembali.' };

    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!newPassword || !confirmPassword) {
      return { error: 'Kata sandi baru dan konfirmasi kata sandi wajib diisi.' };
    }

    if (newPassword.length < 6) {
      return { error: 'Kata sandi minimal 6 karakter.' };
    }

    if (newPassword !== confirmPassword) {
      return { error: 'Konfirmasi kata sandi tidak cocok.' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email: session.user.email },
      data: { password: hashedPassword }
    });

    return { success: 'Kata sandi berhasil dibuat! Anda kini dapat masuk menggunakan email & kata sandi ini.' };
  } catch {
    return { error: 'Gagal mengatur kata sandi.' };
  }
}

// 2c. Simpan Nomor HP (Wajib Pasca-Registrasi / Login)
export async function savePhoneNumberAction(prevState: unknown, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.email) return { error: 'Sesi tidak valid, silakan login kembali.' };

    const rawNomorHp = formData.get('nomorHp') as string;
    const nomorHp = rawNomorHp ? rawNomorHp.trim().replace(/[\s-]/g, '') : '';

    if (!nomorHp) {
      return { error: 'Nomor HP wajib diisi.' };
    }

    // Validasi format nomor HP Indonesia (minimal 10 digit, maks 15 digit, diawali 08 atau +628)
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{7,11}$/;
    if (!phoneRegex.test(nomorHp)) {
      return { error: 'Format nomor HP tidak valid. Gunakan format seperti 08123456789 atau +628123456789.' };
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: { nomorHp }
    });

    revalidatePath('/reporter');
    revalidatePath('/reporter/profile');
    revalidatePath('/', 'layout');

    return { success: 'Nomor HP berhasil disimpan!' };
  } catch (error) {
    console.error('savePhoneNumberAction error:', error);
    return { error: 'Gagal menyimpan nomor HP.' };
  }
}

// 3. Update Profile
export async function updateProfileAction(prevState: unknown, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.email) return { error: 'Unauthorized' };

    const nama = (formData.get('nama') as string)?.trim();
    if (!nama || nama.length < 2) return { error: 'Nama minimal 2 karakter.' };

    const rawNomorHp = formData.get('nomorHp') as string;
    let cleanPhone: string | null = null;
    if (rawNomorHp !== null && rawNomorHp !== undefined) {
      const trimmed = rawNomorHp.trim().replace(/[\s-]/g, '');
      if (trimmed.length > 0) {
        const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{7,11}$/;
        if (!phoneRegex.test(trimmed)) {
          return { error: 'Format nomor HP tidak valid (contoh: 08123456789).' };
        }
        cleanPhone = trimmed;
      }
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        nama,
        ...(cleanPhone !== null ? { nomorHp: cleanPhone } : {})
      }
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

    const urlsToDelete = userReports.flatMap((rep) => [rep.fotoLaporanUrl, rep.fotoBuktiUrl]);
    deleteMultipleImagesFromCloudinary(urlsToDelete).catch(() => {});

    // Jalankan seluruh mutasi dalam transaksi ACID untuk mencegah inkonsistensi data
    await prisma.$transaction([
      // Lepaskan referensi jika user ini pernah menjadi petugas pembersih
      prisma.report.updateMany({
        where: { petugasId: user.id },
        data: { petugasId: null }
      }),
      // Hapus laporan pengguna
      prisma.report.deleteMany({
        where: { pelaporId: user.id }
      }),
      // Hapus akun pengguna
      prisma.user.delete({
        where: { id: user.id }
      })
    ]);
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

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { error: 'Format email tidak valid.' };
    }

    const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existingUser) {
      return { error: 'Email sudah terdaftar.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        nama: nama.trim(),
        email: cleanEmail,
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

    // Ambil foto laporan jika akun petugas ini pernah membuat laporan sebagai pelapor
    const staffReports = await prisma.report.findMany({
      where: { pelaporId: id },
      select: { fotoLaporanUrl: true, fotoBuktiUrl: true }
    });

    const urlsToDelete = staffReports.flatMap((rep) => [rep.fotoLaporanUrl, rep.fotoBuktiUrl]);
    deleteMultipleImagesFromCloudinary(urlsToDelete).catch(() => {});

    // Jalankan seluruh mutasi dalam transaksi ACID
    await prisma.$transaction([
      // Lepaskan referensi petugas pada laporan agar riwayat kerja historis kampus tidak hilang dan mencegah foreign key error
      prisma.report.updateMany({
        where: { petugasId: id },
        data: { petugasId: null }
      }),
      // Hapus laporan jika petugas pernah membuat laporan sebagai pelapor
      prisma.report.deleteMany({
        where: { pelaporId: id }
      }),
      // Hapus akun petugas
      prisma.user.delete({ where: { id } })
    ]);

    revalidatePath('/executive/staff-management');
    revalidatePath('/executive/validations');
    revalidatePath('/');
    return { success: 'Akun petugas berhasil dihapus.' };
  } catch (error) {
    console.error("Error hapusAkunPetugas:", error);
    return { error: 'Terjadi kesalahan saat menghapus akun petugas.' };
  }
}

// 7. Update Staff Account (Pimpinan Only)
export async function updateAkunPetugas(data: {
  id: string;
  nama: string;
  email: string;
  password?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'PIMPINAN') {
      return { error: 'Unauthorized' };
    }

    const { id, nama, email, password } = data;

    if (!id || !nama || !email) {
      return { error: 'Nama dan email wajib diisi.' };
    }

    const cleanNama = nama.trim();
    if (cleanNama.length === 0) {
      return { error: 'Nama tidak boleh kosong.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { error: 'Format email tidak valid.' };
    }

    const targetStaff = await prisma.user.findUnique({ where: { id } });
    if (!targetStaff || targetStaff.role !== 'PETUGAS') {
      return { error: 'Akun petugas tidak ditemukan.' };
    }

    // Jika email diubah, pastikan tidak bentrok dengan akun lain
    if (cleanEmail !== targetStaff.email) {
      const emailExists = await prisma.user.findUnique({ where: { email: cleanEmail } });
      if (emailExists) {
        return { error: 'Email sudah terdaftar untuk pengguna lain.' };
      }
    }

    // Cek apakah ada perubahan kata sandi
    let updatedPasswordHash: string | undefined = undefined;
    if (password && password.trim().length > 0) {
      if (password.length < 6) {
        return { error: 'Kata sandi minimal 6 karakter.' };
      }
      updatedPasswordHash = await bcrypt.hash(password, 10);
    }

    await prisma.user.update({
      where: { id },
      data: {
        nama: cleanNama,
        email: cleanEmail,
        ...(updatedPasswordHash ? { password: updatedPasswordHash } : {}),
      },
    });

    revalidatePath('/executive/staff-management');
    revalidatePath('/executive/validations');
    revalidatePath('/');
    return { success: 'Data akun petugas berhasil diperbarui!' };
  } catch (error) {
    console.error("Error updateAkunPetugas:", error);
    return { error: 'Terjadi kesalahan saat memperbarui akun petugas.' };
  }
}
