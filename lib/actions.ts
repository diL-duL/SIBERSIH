"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "./prisma";
import { uploadImageToCloudinary, deleteImageFromCloudinary, deleteMultipleImagesFromCloudinary } from "./cloudinary";
import { getValidUserId } from "./session-user";

function sanitizeTextInput(input: unknown): string {
  if (typeof input !== "string") return "";
  // Bersihkan karakter kontrol berbahaya tanpa menghapus newline atau tab
  return input.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
}

export async function buatLaporan(formData: FormData): Promise<{ success: boolean; error?: string | null }> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Sesi login Anda telah berakhir. Silakan keluar dan login kembali." };
    }
    if (session.user.role !== "PELAPOR") {
      return { success: false, error: "Hanya akun dengan peran Pelapor yang berhak membuat laporan." };
    }

    const lokasi = sanitizeTextInput(formData.get("lokasi"));
    const deskripsi = sanitizeTextInput(formData.get("deskripsi"));
    
    if (!lokasi || lokasi.length < 3 || lokasi.length > 150) {
      return { success: false, error: "Nama lokasi wajib diisi (antara 3 sampai 150 karakter)." };
    }
    if (!deskripsi || deskripsi.length < 5 || deskripsi.length > 1000) {
      return { success: false, error: "Deskripsi laporan wajib diisi (antara 5 sampai 1000 karakter)." };
    }

    // Periksa file upload (prioritas input utama terkompresi, fallback input cadangan)
    let file = formData.get("file-upload") as File | null;
    if (!file || file.size === 0) {
      file = formData.get("file-upload-gallery") as File | null;
    }
    if (!file || file.size === 0) {
      file = formData.get("file-upload-camera") as File | null;
    }
    if (!file || file.size === 0) {
      file = formData.get("file-upload-change-input") as File | null;
    }

    if (!file || file.size === 0) {
      return { success: false, error: "Foto laporan wajib diunggah." };
    }

    let imageUrl: string;
    try {
      imageUrl = await uploadImageToCloudinary(file);
    } catch (uploadErr) {
      const errMsg = uploadErr instanceof Error ? uploadErr.message : "Gagal mengunggah foto.";
      return { success: false, error: `Gagal mengunggah foto ke Cloudinary: ${errMsg}` };
    }

    const pelaporId = await getValidUserId(session.user);
    if (!pelaporId) {
      return {
        success: false,
        error: "Akun pelapor tidak ditemukan di database. Silakan keluar (logout) dan login kembali.",
      };
    }

    const latStr = formData.get("latitude") as string | null;
    const lngStr = formData.get("longitude") as string | null;

    const dataToSave: {
      lokasi: string;
      deskripsi: string;
      fotoLaporanUrl: string;
      pelaporId: string;
      status: "LAPORAN_MASUK" | "MENUNGGU_APPROVAL" | "SELESAI";
      latitude?: number;
      longitude?: number;
    } = {
      lokasi,
      deskripsi,
      fotoLaporanUrl: imageUrl,
      pelaporId,
      status: "LAPORAN_MASUK",
    };

    if (latStr && lngStr) {
      const lat = parseFloat(latStr);
      const lng = parseFloat(lngStr);
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        dataToSave.latitude = lat;
        dataToSave.longitude = lng;
      }
    }

    let savedReport = null;
    let lastError: unknown = null;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        savedReport = await prisma.report.create({
          data: dataToSave,
        });
        break;
      } catch (err: unknown) {
        lastError = err;
        const isTimeout =
          err instanceof Error &&
          (err.message.includes("timeout") ||
            err.message.includes("Connection terminated") ||
            (err as { code?: string }).code === "P1001");
        if (isTimeout && attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }
        break;
      }
    }

    if (!savedReport) {
      deleteImageFromCloudinary(imageUrl).catch(() => {});
      const errMsg = lastError instanceof Error ? lastError.message : "Koneksi database terputus.";
      return {
        success: false,
        error: `Koneksi database sedang sibuk atau waktu tunggu habis. Silakan tekan 'Kirim Laporan' kembali. (${errMsg})`,
      };
    }

    revalidatePath("/");
    revalidatePath("/reporter");
    revalidatePath("/reporter/history");
    revalidatePath("/staff");
    revalidatePath("/staff/tasks");
    revalidatePath("/executive");
  } catch (err: unknown) {
    if ((err as Error)?.message === "NEXT_REDIRECT") throw err;
    return {
      success: false,
      error: (err as Error)?.message || "Terjadi kesalahan pada server saat memproses laporan.",
    };
  }

  redirect("/reporter");
}

export async function ajukanPenyelesaian(reportId: string, formData: FormData): Promise<{ success: boolean; error?: string | null }> {
  let isNewImageUploaded = false;
  let newUploadedImageUrl: string | null = null;

  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Sesi login Anda telah berakhir. Silakan login kembali." };
    if (session.user.role !== "PETUGAS") return { success: false, error: "Hanya akun Petugas yang berhak menyelesaikan laporan." };

    const deskripsiPetugas = sanitizeTextInput(formData.get("deskripsiPetugas"));
    if (!deskripsiPetugas || deskripsiPetugas.length < 5 || deskripsiPetugas.length > 1000) {
      return { success: false, error: "Deskripsi hasil kerja wajib diisi (antara 5 sampai 1000 karakter)." };
    }
    
    const existingReport = await prisma.report.findUnique({ where: { id: reportId } });
    if (!existingReport) {
      return { success: false, error: "Laporan tidak ditemukan." };
    }
    
    if (existingReport.status === "SELESAI") {
      return { success: false, error: "Laporan yang sudah divalidasi tidak dapat diedit kembali." };
    }

    const petugasId = await getValidUserId(session.user);
    if (!petugasId) return { success: false, error: "Data akun petugas tidak ditemukan di database." };

    // Cegah petugas lain menimpa pekerjaan laporan yang sedang diajukan
    if (
      existingReport.status === "MENUNGGU_APPROVAL" &&
      existingReport.petugasId &&
      existingReport.petugasId !== petugasId
    ) {
      return { success: false, error: "Laporan ini sedang diajukan penyelesaiannya oleh petugas lain." };
    }

    let file = formData.get("file-upload") as File | null;
    if (!file || file.size === 0) {
      file = formData.get("file-upload-gallery") as File | null;
    }
    if (!file || file.size === 0) {
      file = formData.get("file-upload-camera") as File | null;
    }
    if (!file || file.size === 0) {
      file = formData.get("file-upload-change-staff-input") as File | null;
    }

    let imageUrl = existingReport.fotoBuktiUrl;

    if (file && file.size > 0) {
      try {
        const newImageUrl = await uploadImageToCloudinary(file);
        imageUrl = newImageUrl;
        newUploadedImageUrl = newImageUrl;
        isNewImageUploaded = true;
      } catch (uploadErr) {
        const errMsg = uploadErr instanceof Error ? uploadErr.message : "Gagal mengunggah foto.";
        return { success: false, error: `Gagal mengunggah foto bukti ke Cloudinary: ${errMsg}` };
      }
    }

    if (!imageUrl) {
      return { success: false, error: "Foto bukti pengerjaan wajib diunggah." };
    }

    try {
      await prisma.report.update({
        where: { id: reportId },
        data: {
          fotoBuktiUrl: imageUrl,
          deskripsiPetugas,
          petugasId,
          status: "MENUNGGU_APPROVAL",
        },
      });

      // Jika update DB sukses dan ada foto baru, hapus foto lama
      if (isNewImageUploaded && existingReport.fotoBuktiUrl && existingReport.fotoBuktiUrl !== imageUrl) {
        deleteImageFromCloudinary(existingReport.fotoBuktiUrl).catch(() => {});
      }
    } catch (dbError) {
      // Jika update DB gagal, rollback foto baru yang baru diunggah
      if (isNewImageUploaded && newUploadedImageUrl) {
        deleteImageFromCloudinary(newUploadedImageUrl).catch(() => {});
      }
      const errMsg = dbError instanceof Error ? dbError.message : "Gagal memperbarui data.";
      return { success: false, error: `Koneksi database terputus atau gagal menyimpan: ${errMsg}` };
    }

    // Cross-role cache invalidation: Pimpinan & Pelapor ter-update
    revalidatePath("/");
    revalidatePath("/staff");
    revalidatePath("/staff/tasks");
    revalidatePath(`/staff/tasks/${reportId}`);
    revalidatePath("/staff/history");
    revalidatePath("/reporter");
    revalidatePath("/reporter/history");
    revalidatePath("/executive");
    revalidatePath("/executive/validations");
  } catch (err: unknown) {
    if ((err as Error)?.message === "NEXT_REDIRECT") throw err;
    if (isNewImageUploaded && newUploadedImageUrl) {
      deleteImageFromCloudinary(newUploadedImageUrl).catch(() => {});
    }
    return {
      success: false,
      error: (err as Error)?.message || "Terjadi kesalahan pada server saat menyimpan bukti.",
    };
  }

  redirect("/staff");
}

export async function approveLaporan(reportId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  if (session.user.role !== "PIMPINAN") throw new Error("Forbidden");

  // Atomic state machine transition: Hanya laporan berstatus MENUNGGU_APPROVAL yang bisa disetujui
  const result = await prisma.report.updateMany({
    where: { 
      id: reportId,
      status: "MENUNGGU_APPROVAL"
    },
    data: {
      status: "SELESAI",
    },
  });

  if (result.count === 0) {
    throw new Error("Laporan tidak ditemukan atau belum diajukan penyelesaiannya oleh petugas.");
  }

  // Cross-role cache invalidation
  revalidatePath("/");
  revalidatePath("/executive");
  revalidatePath("/executive/validations");
  revalidatePath("/executive/history");
  revalidatePath("/reporter");
  revalidatePath("/reporter/history");
  revalidatePath("/staff");
  revalidatePath("/staff/history");
}

export async function tolakLaporanPalsu(reportId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  if (session.user.role !== "PIMPINAN") {
    throw new Error("Forbidden: Hanya Pimpinan yang berwenang menolak atau menghapus laporan palsu.");
  }

  const report = await prisma.report.findUnique({
    where: { id: reportId },
    select: {
      id: true,
      fotoLaporanUrl: true,
      fotoBuktiUrl: true,
    },
  });

  if (!report) {
    throw new Error("Laporan tidak ditemukan atau sudah dihapus.");
  }

  // Hapus rekaman dari database
  await prisma.report.delete({
    where: { id: reportId },
  });

  // Hapus aset Cloudinary untuk membersihkan kuota penyimpanan
  const imagesToDelete = [report.fotoLaporanUrl, report.fotoBuktiUrl].filter(
    (url): url is string => Boolean(url)
  );
  if (imagesToDelete.length > 0) {
    await deleteMultipleImagesFromCloudinary(imagesToDelete);
  }

  // Cross-role cache invalidation
  revalidatePath("/");
  revalidatePath("/executive");
  revalidatePath("/executive/validations");
  revalidatePath("/executive/history");
  revalidatePath("/reporter");
  revalidatePath("/reporter/history");
  revalidatePath("/staff");
  revalidatePath("/staff/tasks");
  revalidatePath("/staff/history");
}

export async function hapusLaporan(reportId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  if (session.user.role !== "PELAPOR") throw new Error("Forbidden");

  const validUserId = await getValidUserId(session.user);
  if (!validUserId) {
    throw new Error("Sesi login Anda tidak valid. Silakan logout dan login kembali.");
  }

  const report = await prisma.report.findUnique({ where: { id: reportId } });
  if (!report || report.pelaporId !== validUserId) {
    throw new Error("Laporan tidak ditemukan atau Anda tidak berhak menghapusnya.");
  }

  if (report.status !== "LAPORAN_MASUK") {
    throw new Error("Laporan yang sudah diproses tidak dapat dihapus.");
  }

  // Atomic deletion with state verification
  const deleted = await prisma.report.deleteMany({
    where: { 
      id: reportId,
      pelaporId: validUserId,
      status: "LAPORAN_MASUK"
    },
  });

  if (deleted.count > 0) {
    // Hapus aset Cloudinary untuk menghemat kuota penyimpanan gratis
    if (report.fotoLaporanUrl) {
      deleteImageFromCloudinary(report.fotoLaporanUrl).catch(() => {});
    }
    if (report.fotoBuktiUrl) {
      deleteImageFromCloudinary(report.fotoBuktiUrl).catch(() => {});
    }
  }

  revalidatePath("/");
  revalidatePath("/reporter");
  revalidatePath("/reporter/history");
  revalidatePath("/staff");
  revalidatePath("/staff/tasks");
  revalidatePath("/executive");
}

export async function editLaporan(reportId: string, formData: FormData): Promise<{ success: boolean; error?: string | null }> {
  let isNewImageUploaded = false;
  let newUploadedImageUrl: string | null = null;

  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Sesi login Anda telah berakhir. Silakan login kembali." };
    if (session.user.role !== "PELAPOR") return { success: false, error: "Hanya akun Pelapor yang berhak mengedit laporan." };

    const validUserId = await getValidUserId(session.user);
    if (!validUserId) {
      return { success: false, error: "Sesi login Anda tidak valid. Silakan logout dan login kembali." };
    }

    const existingReport = await prisma.report.findUnique({ where: { id: reportId } });
    if (!existingReport || existingReport.pelaporId !== validUserId) {
      return { success: false, error: "Laporan tidak ditemukan atau Anda tidak berhak mengeditnya." };
    }

    if (existingReport.status !== "LAPORAN_MASUK") {
      return { success: false, error: "Laporan yang sudah direspon atau sedang diproses petugas tidak dapat diedit." };
    }

    const lokasi = sanitizeTextInput(formData.get("lokasi"));
    const deskripsi = sanitizeTextInput(formData.get("deskripsi"));

    if (!lokasi || lokasi.length < 3 || lokasi.length > 150) {
      return { success: false, error: "Nama lokasi wajib diisi (antara 3 sampai 150 karakter)." };
    }
    if (!deskripsi || deskripsi.length < 5 || deskripsi.length > 1000) {
      return { success: false, error: "Deskripsi laporan wajib diisi (antara 5 sampai 1000 karakter)." };
    }

    let file = formData.get("file-upload") as File | null;
    if (!file || file.size === 0) {
      file = formData.get("file-upload-gallery") as File | null;
    }
    if (!file || file.size === 0) {
      file = formData.get("file-upload-camera") as File | null;
    }
    if (!file || file.size === 0) {
      file = formData.get("file-upload-change-input") as File | null;
    }

    let imageUrl = existingReport.fotoLaporanUrl;

    if (file && file.size > 0) {
      try {
        const newImageUrl = await uploadImageToCloudinary(file);
        imageUrl = newImageUrl;
        newUploadedImageUrl = newImageUrl;
        isNewImageUploaded = true;
      } catch (uploadErr) {
        const errMsg = uploadErr instanceof Error ? uploadErr.message : "Gagal mengunggah foto.";
        return { success: false, error: `Gagal mengunggah foto ke Cloudinary: ${errMsg}` };
      }
    }

    const latStr = formData.get("latitude") as string | null;
    const lngStr = formData.get("longitude") as string | null;

    const dataToUpdate: {
      lokasi: string;
      deskripsi: string;
      fotoLaporanUrl: string;
      latitude?: number | null;
      longitude?: number | null;
    } = {
      lokasi,
      deskripsi,
      fotoLaporanUrl: imageUrl,
    };

    if (latStr && lngStr) {
      const lat = parseFloat(latStr);
      const lng = parseFloat(lngStr);
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        dataToUpdate.latitude = lat;
        dataToUpdate.longitude = lng;
      }
    }

    try {
      await prisma.report.update({
        where: { 
          id: reportId,
          pelaporId: validUserId,
          status: "LAPORAN_MASUK"
        },
        data: dataToUpdate,
      });

      // Jika update DB sukses dan ada foto baru, hapus foto lama
      if (isNewImageUploaded && existingReport.fotoLaporanUrl && existingReport.fotoLaporanUrl !== imageUrl) {
        deleteImageFromCloudinary(existingReport.fotoLaporanUrl).catch(() => {});
      }
    } catch (dbError) {
      // Jika update DB gagal, rollback foto baru yang baru diunggah
      if (isNewImageUploaded && newUploadedImageUrl) {
        deleteImageFromCloudinary(newUploadedImageUrl).catch(() => {});
      }
      const errMsg = dbError instanceof Error ? dbError.message : "Gagal memperbarui data.";
      return { success: false, error: `Koneksi database terputus atau gagal menyimpan perubahan: ${errMsg}` };
    }

    revalidatePath("/");
    revalidatePath("/reporter");
    revalidatePath("/reporter/history");
    revalidatePath("/staff");
    revalidatePath("/staff/tasks");
    revalidatePath("/executive");
  } catch (err: unknown) {
    if ((err as Error)?.message === "NEXT_REDIRECT") throw err;
    if (isNewImageUploaded && newUploadedImageUrl) {
      deleteImageFromCloudinary(newUploadedImageUrl).catch(() => {});
    }
    return {
      success: false,
      error: (err as Error)?.message || "Terjadi kesalahan pada server saat memperbarui laporan.",
    };
  }

  redirect("/reporter");
}

