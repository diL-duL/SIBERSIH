# SiBersih

Sistem Informasi Kebersihan Kampus berbasis web yang mengintegrasikan pelaporan, penugasan, dan pengawasan dalam satu platform terpusat yang transparan dan akuntabel.

## Tech Stack
- **Framework Utama:** Next.js 16 (App Router) dengan Server Actions
- **Styling & UI:** Tailwind CSS v4, shadcn/ui, Lucide Icons
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **Autentikasi & Otorisasi:** Auth.js (NextAuth v5)
- **Penyimpanan Gambar (Storage):** Cloudinary

## Fitur Utama

- **Role-based Dashboard**: Tampilan dan fitur yang disesuaikan untuk Pelapor, Petugas, dan Pimpinan.
- **Sistem Pelaporan Real-time**: Pelapor dapat mengajukan laporan kebersihan lengkap dengan foto dan lokasi koordinat presisi berkat integrasi peta interaktif (*Leaflet*).
- **Manajemen Tugas**: Petugas dapat melihat daftar laporan baru, dan mengunggah bukti foto jika tugas telah diselesaikan.
- **Sistem Approval (Validasi)**: Pimpinan dapat melihat komparasi "Sebelum dan Sesudah" dan menyetujui laporan.

## Cara Instalasi

1. **Clone repositori**
   ```bash
   git clone https://github.com/username/sibersih.git
   cd sibersih
   ```

2. **Instal dependensi**
   ```bash
   npm install
   ```

3. **Siapkan Environment Variables**
   Buat file `.env` berdasarkan `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Isi file `.env` dengan konfigurasi Supabase (DATABASE_URL, DIRECT_URL), NextAuth (AUTH_SECRET), dan Cloudinary (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).

4. **Inisialisasi Database**
   Jalankan migrasi database ke Supabase:
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Tambahkan Pengguna Default (SQL Editor Supabase)**
   Jalankan perintah SQL berikut pada menu SQL Editor di *dashboard* Supabase Anda untuk menambahkan tiga pengguna dengan *role* berbeda (Password untuk semuanya adalah `password123`):
   ```sql
   INSERT INTO "User" ("id", "nama", "email", "password", "role", "createdAt", "updatedAt")
   VALUES 
     (gen_random_uuid()::text, 'Andi Pelapor', 'pelapor@sibersih.com', '$2b$10$SMlPAl/6/7A4t28N4miYQuEk4L9N2.6yeR.6UDL.0dWVbRDGldIVC', 'PELAPOR'::"Role", NOW(), NOW()),
     (gen_random_uuid()::text, 'Joko Petugas', 'petugas@sibersih.com', '$2b$10$SMlPAl/6/7A4t28N4miYQuEk4L9N2.6yeR.6UDL.0dWVbRDGldIVC', 'PETUGAS'::"Role", NOW(), NOW()),
     (gen_random_uuid()::text, 'Budi Pimpinan', 'pimpinan@sibersih.com', '$2b$10$SMlPAl/6/7A4t28N4miYQuEk4L9N2.6yeR.6UDL.0dWVbRDGldIVC', 'PIMPINAN'::"Role", NOW(), NOW());
   ```

6. **Jalankan Server Development**
   ```bash
   npm run dev
   ```
   Aplikasi dapat diakses melalui `http://localhost:3000`.

## Arsitektur Aplikasi (App Router)

Aplikasi ini menggunakan fitur Next.js terbaru:
- **Server Actions (`lib/actions.ts`)**: Digunakan untuk menangani pengiriman formulir dan mutasi data (tanpa perlu membuat API routes secara manual).
- **Middleware (`middleware.ts`)**: Mengamankan rute dasbor secara otomatis agar tidak dapat diakses oleh peran yang tidak sesuai.
- **Server Components**: Dasbor secara langsung memuat data dari database (Prisma) tanpa *loading states* (Skeleton UI) di sisi klien.
