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
  const file = formData.get("file-upload") as File;
  const latStr = formData.get("latitude") as string | null;
  const lngStr = formData.get("longitude") as string | null;

  if (!lokasi || !deskripsi || !file || file.size === 0) {
    throw new Error("Data tidak lengkap");
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

  const file = formData.get("file-upload") as File;

  if (!file || file.size === 0) {
    throw new Error("Foto bukti harus diunggah");
  }

  const imageUrl = await uploadImageToCloudinary(file);

  await prisma.report.update({
    where: { id: reportId },
    data: {
      fotoBuktiUrl: imageUrl,
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
