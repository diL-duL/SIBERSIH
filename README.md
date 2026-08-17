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
*(Catatan: Kami menggunakan `db push` untuk prototyping cepat, untuk environment produksi Anda bisa menggunakan `migrate deploy`)*

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

Aplikasi ini menggunakan fitur Next.js terbaru:
- **Server Actions (`lib/actions.ts`)**: Digunakan untuk menangani pengiriman formulir dan mutasi data (tanpa perlu membuat API routes secara manual).
- **Middleware / Proxy (`auth.config.ts` & `proxy.ts`)**: Mengamankan rute dasbor secara otomatis dan mengalihkan (redirect) pengguna dari root (`/`) langsung ke halaman Login atau Dashboard sesuai perannya.
- **Server Components**: Dasbor secara langsung memuat data dari database (Prisma) tanpa *loading states* (Skeleton UI) di sisi klien.
- **Prisma Client (Singleton & Custom Output)**: Menghasilkan klien Prisma secara internal ke dalam folder `app/generated/prisma` dan menerapkan pola *Singleton* di seluruh aplikasi untuk memastikan tidak terjadi kebocoran memori (memory leaks) koneksi database.
