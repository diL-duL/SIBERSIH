"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "./prisma";
import { uploadImageToCloudinary } from "./cloudinary";

export async function buatLaporan(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  if (session.user.role !== "PELAPOR") throw new Error("Forbidden");

  const lokasi = formData.get("lokasi") as string;
  const deskripsi = formData.get("deskripsi") as string;
  
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

  if (!lokasi || !deskripsi || !file || file.size === 0) {
    throw new Error("Data tidak lengkap. Harap pastikan lokasi, deskripsi, dan foto laporan telah diisi.");
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
    if (!isNaN(lat) && !isNaN(lng)) {
      dataToSave.latitude = lat;
      dataToSave.longitude = lng;
    }
  }

  await prisma.report.create({
    data: dataToSave,
  });

  revalidatePath("/reporter");
  revalidatePath("/reporter/history");
  redirect("/reporter");
}

export async function ajukanPenyelesaian(reportId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  if (session.user.role !== "PETUGAS") throw new Error("Forbidden");

  const deskripsiPetugas = formData.get("deskripsiPetugas") as string;
  
  const existingReport = await prisma.report.findUnique({ where: { id: reportId } });
  
  if (existingReport?.status === "SELESAI") {
      throw new Error("Laporan yang sudah divalidasi tidak dapat diedit.");
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

  let imageUrl = existingReport?.fotoBuktiUrl;

  if (file && file.size > 0) {
    imageUrl = await uploadImageToCloudinary(file);
  }

  if (!imageUrl) {
    throw new Error("Foto bukti harus diunggah.");
  }

  if (!deskripsiPetugas) {
    throw new Error("Deskripsi hasil kerja harus diisi.");
  }

  await prisma.report.update({
    where: { id: reportId },
    data: {
      fotoBuktiUrl: imageUrl,
      deskripsiPetugas,
      status: "MENUNGGU_APPROVAL",
    },
  });

  revalidatePath("/staff");
  revalidatePath("/staff/tasks");
  revalidatePath(`/staff/tasks/${reportId}`);
  redirect("/staff");
}

export async function approveLaporan(reportId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  if (session.user.role !== "PIMPINAN") throw new Error("Forbidden");

  await prisma.report.update({
    where: { id: reportId },
    data: {
      status: "SELESAI",
    },
  });

  revalidatePath("/executive");
  revalidatePath("/executive/history");
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

  await prisma.report.delete({
    where: { id: reportId },
  });

  revalidatePath("/reporter");
  revalidatePath("/reporter/history");
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

  const lokasi = formData.get("lokasi") as string;
  const deskripsi = formData.get("deskripsi") as string;

  if (!lokasi || !deskripsi) {
    throw new Error("Data tidak lengkap. Lokasi dan deskripsi harus diisi.");
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
    imageUrl = await uploadImageToCloudinary(file);
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
    if (!isNaN(lat) && !isNaN(lng)) {
      dataToUpdate.latitude = lat;
      dataToUpdate.longitude = lng;
    }
  }

  await prisma.report.update({
    where: { id: reportId },
    data: dataToUpdate,
  });

  revalidatePath("/reporter");
  revalidatePath("/reporter/history");
  redirect("/reporter");
}

