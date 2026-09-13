"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "./prisma";
import { uploadImageToCloudinary, deleteImageFromCloudinary } from "./cloudinary";

function sanitizeTextInput(input: unknown): string {
  if (typeof input !== "string") return "";
  // Bersihkan karakter kontrol berbahaya tanpa menghapus newline atau tab
  return input.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
}

export async function buatLaporan(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  if (session.user.role !== "PELAPOR") throw new Error("Forbidden");

  const lokasi = sanitizeTextInput(formData.get("lokasi"));
  const deskripsi = sanitizeTextInput(formData.get("deskripsi"));
  
  if (!lokasi || lokasi.length < 3 || lokasi.length > 150) {
    throw new Error("Nama lokasi wajib diisi (antara 3 sampai 150 karakter).");
  }
  if (!deskripsi || deskripsi.length < 5 || deskripsi.length > 1000) {
    throw new Error("Deskripsi laporan wajib diisi (antara 5 sampai 1000 karakter).");
  }

  // Check all possible file input names from mobile or desktop
  let file = formData.get("file-upload") as File | null;
  if (!file || file.size === 0) {
    file = formData.get("file-upload-gallery") as File | null;
  }
  if (!file || file.size === 0) {
    file = formData.get("file-upload-camera") as File | null;
  }

  const latStr = formData.get("latitude") as string | null;
  const lngStr = formData.get("longitude") as string | null;

  if (!file || file.size === 0) {
    throw new Error("Foto laporan wajib diunggah.");
  }

  const imageUrl = await uploadImageToCloudinary(file);

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
    pelaporId: session.user.id,
    status: "LAPORAN_MASUK",
  };

  if (latStr && lngStr) {
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    // Validasi rentang koordinat bola bumi (-90 s.d 90, -180 s.d 180)
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      dataToSave.latitude = lat;
      dataToSave.longitude = lng;
    }
  }

  try {
    await prisma.report.create({
      data: dataToSave,
    });
  } catch (dbError) {
    // Rollback foto di Cloudinary agar tidak menjadi orphan / boros kuota free tier
    deleteImageFromCloudinary(imageUrl).catch(() => {});
    throw dbError;
  }

  // Cross-role cache invalidation agar petugas langsung melihat tugas baru
  revalidatePath("/");
  revalidatePath("/reporter");
  revalidatePath("/reporter/history");
  revalidatePath("/staff");
  revalidatePath("/staff/tasks");
  revalidatePath("/executive");
  redirect("/reporter");
}

export async function ajukanPenyelesaian(reportId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  if (session.user.role !== "PETUGAS") throw new Error("Forbidden");

  const deskripsiPetugas = sanitizeTextInput(formData.get("deskripsiPetugas"));
  if (!deskripsiPetugas || deskripsiPetugas.length < 5 || deskripsiPetugas.length > 1000) {
    throw new Error("Deskripsi hasil kerja wajib diisi (antara 5 sampai 1000 karakter).");
  }
  
  const existingReport = await prisma.report.findUnique({ where: { id: reportId } });
  if (!existingReport) {
    throw new Error("Laporan tidak ditemukan.");
  }
  
  if (existingReport.status === "SELESAI") {
    throw new Error("Laporan yang sudah divalidasi tidak dapat diedit.");
  }

  // Cegah petugas lain menimpa pekerjaan laporan yang sedang diajukan
  if (
    existingReport.status === "MENUNGGU_APPROVAL" &&
    existingReport.petugasId &&
    existingReport.petugasId !== session.user.id
  ) {
    throw new Error("Laporan ini sedang diajukan penyelesaiannya oleh petugas lain.");
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
  let isNewImageUploaded = false;

  if (file && file.size > 0) {
    const newImageUrl = await uploadImageToCloudinary(file);
    imageUrl = newImageUrl;
    isNewImageUploaded = true;
  }

  if (!imageUrl) {
    throw new Error("Foto bukti harus diunggah.");
  }

  try {
    await prisma.report.update({
      where: { id: reportId },
      data: {
        fotoBuktiUrl: imageUrl,
        deskripsiPetugas,
        petugasId: session.user.id,
        status: "MENUNGGU_APPROVAL",
      },
    });

    // Jika update DB sukses dan ada foto baru, hapus foto lama
    if (isNewImageUploaded && existingReport.fotoBuktiUrl && existingReport.fotoBuktiUrl !== imageUrl) {
      deleteImageFromCloudinary(existingReport.fotoBuktiUrl).catch(() => {});
    }
  } catch (dbError) {
    // Jika update DB gagal, rollback foto baru yang baru diunggah
    if (isNewImageUploaded) {
      deleteImageFromCloudinary(imageUrl).catch(() => {});
    }
    throw dbError;
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

export async function hapusLaporan(reportId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  if (session.user.role !== "PELAPOR") throw new Error("Forbidden");

  const report = await prisma.report.findUnique({ where: { id: reportId } });
  if (!report || report.pelaporId !== session.user.id) {
    throw new Error("Laporan tidak ditemukan atau Anda tidak berhak menghapusnya.");
  }

  if (report.status !== "LAPORAN_MASUK") {
    throw new Error("Laporan yang sudah diproses tidak dapat dihapus.");
  }

  // Atomic deletion with state verification
  const deleted = await prisma.report.deleteMany({
    where: { 
      id: reportId,
      pelaporId: session.user.id,
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

export async function editLaporan(reportId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  if (session.user.role !== "PELAPOR") throw new Error("Forbidden");

  const existingReport = await prisma.report.findUnique({ where: { id: reportId } });
  if (!existingReport || existingReport.pelaporId !== session.user.id) {
    throw new Error("Laporan tidak ditemukan atau Anda tidak berhak mengeditnya.");
  }

  if (existingReport.status !== "LAPORAN_MASUK") {
    throw new Error("Laporan yang sudah direspon atau sedang diproses petugas tidak dapat diedit.");
  }

  const lokasi = sanitizeTextInput(formData.get("lokasi"));
  const deskripsi = sanitizeTextInput(formData.get("deskripsi"));

  if (!lokasi || lokasi.length < 3 || lokasi.length > 150) {
    throw new Error("Nama lokasi wajib diisi (antara 3 sampai 150 karakter).");
  }
  if (!deskripsi || deskripsi.length < 5 || deskripsi.length > 1000) {
    throw new Error("Deskripsi laporan wajib diisi (antara 5 sampai 1000 karakter).");
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
  let isNewImageUploaded = false;

  if (file && file.size > 0) {
    const newImageUrl = await uploadImageToCloudinary(file);
    imageUrl = newImageUrl;
    isNewImageUploaded = true;
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
        pelaporId: session.user.id,
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
    if (isNewImageUploaded) {
      deleteImageFromCloudinary(imageUrl).catch(() => {});
    }
    throw dbError;
  }

  revalidatePath("/");
  revalidatePath("/reporter");
  revalidatePath("/reporter/history");
  revalidatePath("/staff");
  revalidatePath("/staff/tasks");
  revalidatePath("/executive");
  redirect("/reporter");
}

