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
- **Pembatalan Laporan**: Pelapor dapat membatalkan atau menghapus laporannya sendiri selama statusnya masih "LAPORAN MASUK".
- **Upload Interaktif (Drag and Drop)**: Pengalaman pengguna yang lebih baik dengan fitur seret dan lepas untuk mengunggah foto laporan maupun bukti kerja.
- **Manajemen Tugas**: Petugas dapat melihat daftar laporan baru, dan mengunggah bukti foto jika tugas telah diselesaikan.
- **Sistem Approval (Validasi)**: Pimpinan dapat melihat komparasi "Sebelum dan Sesudah" dan menyetujui laporan.

## Optimasi & Keamanan (Enterprise-Grade)

- **Performa LCP Maksimal**: Penggunaan komponen `<Image />` bawaan Next.js untuk merender seluruh foto laporan/bukti secara responsif dan menghemat penggunaan _bandwidth_.
- **Type-Safety (100% Strict)**: Seluruh _codebase_ telah dideklarasikan secara ketat. Bebas dari tipe `any`, variabel terbuang (_unused variables_), dan berhasil melalui *strict linting* serta *production build* tanpa _error_ (Exit code: 0).
- **Efisiensi Database**: Penambahan lapisan *B-Tree Indexing* (`@@index`) pada parameter kunci (seperti `status`, `pelaporId`, dan `userId`) dalam *schema* Prisma memastikan operasi pencarian *query* berjalan secepat kilat (skala besar).
- **Zero Memory Leak**: Logika *hook* React (terutama pada modul *Leaflet Map*) telah didesain secara independen dan diekstrak keluar dari alur _render_ untuk mencegah _memory leak_ di peramban pengguna.

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
- **Middleware / Proxy (`auth.config.ts` & `proxy.ts`)**: Mengamankan rute dasbor secara otomatis dan mengalihkan (redirect) pengguna dari root (`/`) langsung ke halaman Login atau Dashboard sesuai perannya.
- **Server Components**: Dasbor secara langsung memuat data dari database (Prisma) tanpa *loading states* (Skeleton UI) di sisi klien.
- **Prisma Client (Singleton & Custom Output)**: Menghasilkan klien Prisma secara internal ke dalam folder `app/generated/prisma` dan menerapkan pola *Singleton* di seluruh aplikasi untuk memastikan tidak terjadi kebocoran memori (memory leaks) koneksi database.
