import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import StaffManagementClient from "./StaffManagementClient";

export default async function StaffManagementPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "PIMPINAN") {
    redirect("/login");
  }

  const staffList = await prisma.user.findMany({
    where: { role: "PETUGAS" },
    select: { id: true, nama: true, email: true },
    orderBy: { nama: "asc" }
  });

  return (
    <div className="pb-32 pt-8 min-h-screen bg-sibersih-bg flex flex-col max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-sibersih-primary">Manajemen Petugas</h1>
        <p className="text-sm sm:text-base text-sibersih-primary/60 font-medium">Kelola akun petugas kebersihan di sistem SiBersih.</p>
      </div>

      <StaffManagementClient initialStaffList={staffList} />
    </div>
  );
}
