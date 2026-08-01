-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PELAPOR', 'PETUGAS', 'PIMPINAN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('LAPORAN_MASUK', 'MENUNGGU_APPROVAL', 'SELESAI');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'PELAPOR',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "lokasi" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "fotoLaporanUrl" TEXT NOT NULL,
    "fotoBuktiUrl" TEXT,
    "status" "Status" NOT NULL DEFAULT 'LAPORAN_MASUK',
    "pelaporId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_pelaporId_fkey" FOREIGN KEY ("pelaporId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
