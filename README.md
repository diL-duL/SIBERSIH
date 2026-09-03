# SiBersih

Sistem Informasi Kebersihan Kampus berbasis web yang mengintegrasikan pelaporan, penugasan, dan pengawasan dalam satu platform terpusat yang transparan dan akuntabel.

## Tech Stack
- **Framework Utama:** Next.js 16 (App Router) dengan Server Actions
- **Styling & UI:** Tailwind CSS v4, shadcn/ui, Lucide Icons, Glassmorphism UI
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **Autentikasi & Otorisasi:** Auth.js (NextAuth v5)
- **Penyimpanan Gambar (Storage):** Cloudinary

## Fitur Utama

- **Public Landing Page**: Halaman muka yang elegan menampilkan data riil (laporan terbaru) secara instan untuk transparansi publik sebelum melakukan registrasi.
- **Role-based Dashboard**: Tampilan dan fitur yang disesuaikan untuk Pelapor, Petugas, dan Pimpinan.
- **Manajemen Petugas (Eksekutif)**: Dasbor khusus bagi Pimpinan untuk mengelola (menambah dan menghapus) akses akun Petugas secara aman.
- **Sistem Pelaporan Real-time**: Pelapor dapat mengajukan laporan kebersihan lengkap dengan foto dan lokasi koordinat presisi berkat integrasi peta interaktif (*Leaflet*).
- **Pembatalan Laporan**: Pelapor dapat membatalkan atau menghapus laporannya sendiri selama statusnya masih "LAPORAN MASUK".
- **Upload Interaktif (Drag and Drop)**: Pengalaman pengguna yang lebih baik dengan fitur seret dan lepas untuk mengunggah foto laporan maupun bukti kerja.
- **Manajemen Tugas**: Petugas dapat melihat daftar laporan baru, dan mengunggah bukti foto jika tugas telah diselesaikan.
- **Sistem Approval (Validasi)**: Pimpinan dapat melihat komparasi "Sebelum dan Sesudah" dan menyetujui laporan.

## Keamanan & Performa (Enterprise-Grade)

- **Anti-DDoS & Caching Ekstrem (ISR)**: Landing Page dibangun menggunakan *Incremental Static Regeneration* (`revalidate: 60`). Sistem menyajikan _file_ statis ke jutaan pengunjung dan hanya membebani database (GET Query) 1 kali setiap 60 detik.
- **Anti-Brute Force & Spam**: Implementasi *In-Memory Rate Limiter* pada level *Server Actions* untuk melindungi formulir pendaftaran dan _login_. Memblokir skrip bot secara instan berdasarkan deteksi IP dan Email sebelum menyentuh _database_.
- **SaaS Premium UI & UX**: Formulir pendaftaran/login dirancang menyerupai standar *Startup/SaaS* modern, dengan elemen *Glassmorphism*, penempatan ikon interaktif, mikro-animasi pada komponen tombol, serta navigasi bawah (*BottomNav*) yang responsif.
- **Performa LCP Maksimal**: Penggunaan komponen `<Image />` bawaan Next.js dengan deteksi LCP otomatis (prioritizing), pengoptimalan resolusi, kualitas (*qualities config*), dan format _WebP_ modern.
- **Type-Safety & Efisiensi Database**: Basis kode murni TypeScript tanpa `any`, ditambah lapisan *B-Tree Indexing* (`@@index`) di skema Prisma pada parameter relasional kunci untuk mempercepat operasi kueri tabel berskala besar.

## Panduan Instalasi & Setup Lokal

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi SiBersih di mesin lokal Anda.

### 1. Persiapan Repositori
Clone repositori ini ke komputer Anda dan masuk ke dalam direktorinya:
```bash
git clone https://github.com/username/sibersih.git
cd sibersih
```

### 2. Instalasi Dependensi
Pastikan Anda menggunakan Node.js (direkomendasikan v18+). Instal seluruh dependensi menggunakan NPM:
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Aplikasi ini membutuhkan kredensial dari **Supabase** (Database) dan **Cloudinary** (Penyimpanan Gambar).
Salin file template `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Buka file `.env` dan isi variabel berikut:
- `DATABASE_URL`: Connection String PostgreSQL (Transaction mode) dari Supabase.
- `DIRECT_URL`: Connection String PostgreSQL (Session mode) dari Supabase untuk Prisma migrations.
- `AUTH_SECRET`: String acak aman untuk NextAuth. Buat menggunakan perintah terminal: `npx auth secret` atau `openssl rand -base64 32`.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Dapatkan dari *Dashboard* akun Cloudinary Anda.

### 4. Sinkronisasi Database (Prisma)
Karena kita menggunakan struktur Prisma Client kustom di `app/generated/prisma`, Anda wajib melakukan generate dan sinkronisasi skema ke database Supabase Anda:
```bash
npx prisma generate
npx prisma db push
```

### 5. Seeding Akun Default
Untuk masuk ke dasbor, Anda butuh akun. Buka **SQL Editor** di *Dashboard* Supabase Anda, jalankan _script_ berikut untuk membuat 3 akun peran utama (Password semuanya adalah `password123`):
```sql
INSERT INTO "User" ("id", "nama", "email", "password", "role", "createdAt", "updatedAt")
VALUES 
    (gen_random_uuid()::text, 'Andi Pelapor', 'pelapor@sibersih.com', '$2b$10$SMlPAl/6/7A4t28N4miYQuEk4L9N2.6yeR.6UDL.0dWVbRDGldIVC', 'PELAPOR'::"Role", NOW(), NOW()),
    (gen_random_uuid()::text, 'Joko Petugas', 'petugas@sibersih.com', '$2b$10$SMlPAl/6/7A4t28N4miYQuEk4L9N2.6yeR.6UDL.0dWVbRDGldIVC', 'PETUGAS'::"Role", NOW(), NOW()),
    (gen_random_uuid()::text, 'Budi Pimpinan', 'pimpinan@sibersih.com', '$2b$10$SMlPAl/6/7A4t28N4miYQuEk4L9N2.6yeR.6UDL.0dWVbRDGldIVC', 'PIMPINAN'::"Role", NOW(), NOW());
```

### 6. Menjalankan Server
Jalankan server *development*:
```bash
npm run dev
```
Buka browser Anda dan akses `http://localhost:3000`. Selamat, SiBersih siap digunakan!

## Arsitektur Aplikasi (App Router)
- **Server Actions (`app/actions/`)**: Digunakan untuk menangani pengiriman formulir dan mutasi data (serta mitigasi Rate Limiting).
- **Middleware Otomatis (`auth.config.ts`)**: Melindungi _Dashboard_ secara aman tanpa memblokir Landing Page publik.
- **Prisma Client Custom**: Menghasilkan klien secara spesifik ke folder `app/generated/prisma` untuk optimalisasi performa dalam lingkungan _monorepo_ maupun _serverless_.
