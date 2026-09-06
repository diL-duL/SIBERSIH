import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import EditReportForm from "./EditReportForm";

export default async function EditReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "PELAPOR") {
    redirect("/login");
  }

  const resolvedParams = await params;
  const report = await prisma.report.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!report || report.pelaporId !== session.user.id) {
    notFound();
  }

  // Hanya laporan yang belum direspon atau masih menunggu petugas (LAPORAN_MASUK) yang dapat diedit
  if (report.status !== "LAPORAN_MASUK") {
    redirect("/reporter");
  }

  return <EditReportForm report={report} />;
}
