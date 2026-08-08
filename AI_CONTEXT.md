AICONTEXT.md baru
# SiBersih - AI Assistant Context Guide

*Dokumen ini dirancang khusus untuk diberikan sebagai **prompt awal** kepada AI Assistant (seperti Claude, ChatGPT, Windsurf, Cursor) di masa mendatang agar AI dapat langsung memahami seluruh arsitektur, teknologi, dan logika bisnis aplikasi SiBersih tanpa perlu meraba-raba.*

---

## 1. Project Overview
**Nama Proyek:** SiBersih (Sistem Informasi Pelaporan Sampah dan Kebersihan)
**Tujuan:** Aplikasi *full-stack* untuk melaporkan, memantau, dan memvalidasi kebersihan lingkungan, difokuskan pada area **Fakultas Teknik, Universitas Tadulako**.
**Arsitektur Utama:** Menggunakan **Role-Based Access Control (RBAC)** dengan 3 jenis peran pengguna yang memiliki *dashboard* terpisah.

## 2. Tech Stack (Tumpukan Teknologi)
- **Framework Utama:** Next.js (App Router) versi terbaru (v15/v16+).
- **Bahasa:** TypeScript.
- **Styling:** Tailwind CSS (dikustomisasi dengan warna spesifik: *dark blue* `#071b34`, *sky-blue accent*, *glassmorphism*, dan *border-radius 28px*).
- **Komponen UI:** shadcn/ui & ikon dari Lucide React.
- **Database:** PostgreSQL (Di-hosting melalui Supabase menggunakan koneksi *Connection Pooling*).
- **ORM:** Prisma ORM (v7) menggunakan `@prisma/adapter-pg` untuk stabilitas koneksi di lingkungan *serverless*.
- **Autentikasi:** Auth.js / NextAuth (v5) menggunakan strategi *Credentials* (sandi di-hash dengan `bcryptjs`).
- **Penyimpanan Berkas (Storage):** Cloudinary (untuk menyimpan foto laporan dan foto bukti kebersihan).

## 3. Struktur Direktori & Rute (App Router)
Aplikasi sangat bergantung pada pola perutean berdasarkan peran (*role-based routing*):
- `/login` & `/login/register`: Halaman Autentikasi.
- `/reporter/*`: Area **Pelapor** (Mahasiswa/Dosen). Fitur: Dashboard minimap, Form buat laporan (`/reporter/report`), Riwayat, dan Profil.
- `/staff/*`: Area **Petugas Kebersihan**. Fitur: Dashboard daftar tugas masuk, form unggah bukti pengerjaan (`/staff/[id]`), Riwayat tugas, dan Profil.
- `/executive/*`: Area **Pimpinan/Executive**. Fitur: Dashboard pantauan wilayah, Validasi kinerja (`/executive/validations`), Riwayat, dan Profil.

## 4. Pola Implementasi Penting (Key Patterns)
Tolong perhatikan aturan ini setiap kali Anda (AI) menulis kode untuk SiBersih:
1. **Server Actions vs API Routes:** Aplikasi ini HAMPIR TIDAK MENGGUNAKAN folder `app/api/`. Semua operasi database (CRUD) wajib ditulis menggunakan **React Server Actions** yang diletakkan di dalam folder `app/actions/` (contoh: `app/actions/user.ts`, `app/actions/auth.ts`, `app/actions/notification.ts`).
2. **Koneksi Prisma:** Jangan pernah melakukan instansiasi `new PrismaClient()` secara langsung di dalam komponen. Selalu *import* instance singleton dari `import { prisma } from "@/lib/prisma"`. Ini krusial karena kita menggunakan arsitektur *adapter-pg* untuk Supabase.
3. **Middleware / Proxy:** File *middleware* keamanan (otentikasi dan *redirect* per-role) diubah namanya menjadi `proxy.ts` (bukan `middleware.ts`) untuk menghindari *deprecation warning* dari Next.js 16. Pastikan konfigurasi rute di `auth.config.ts`.
4. **Desain Komponen UI:** Terdapat komponen klien yang dipakai bersama *(Shared Client Components)*. Contohnya `ProfileClient.tsx` (digunakan di ketiga *role*) dan `BottomNav.tsx` (navigasi dengan utilitas `pointer-events-none` pada SVG untuk mencegah klik terblokir).

## 5. Skema Database (Prisma)
Terdapat 3 entitas utama:
- **User:** Memiliki `id`, `nama`, `email`, `password`, `role` (PELAPOR, PETUGAS, PIMPINAN), dan berelasi dengan Report & Notification.
- **Report (Laporan):** Memiliki `id`, `lokasi`, `deskripsi`, `fotoLaporanUrl` (awal laporan), `fotoBuktiUrl` (setelah dikerjakan petugas), `status` (LAPORAN_MASUK, MENUNGGU_APPROVAL, SELESAI), dan `pelaporId`.
- **Notification (Notifikasi):** Memiliki `id`, `title`, `message`, `type` (success, info, alert), `isRead`, dan `userId` (sistem *cascade* saat User dihapus).

## 6. Integrasi Eksternal (Maps, Gambar, & Branding)
- **Peta Interaktif (Leaflet):** Aplikasi kini menggunakan `react-leaflet` (`components/MapPicker.tsx`) untuk fitur pemilihan lokasi secara dinamis *(draggable marker)* pada formulir pelaporan. Koordinat `latitude` dan `longitude` presisi disimpan ke dalam database Prisma. Dashboard saat ini masih memuat *minimap* statis, namun dipersiapkan untuk beralih ke Leaflet di masa mendatang.
- **Upload Gambar:** Ditangani secara *client-side* ke endpoint spesifik Cloudinary, lalu URL dari Cloudinary dikirimkan ke *Server Actions* untuk direkam di database Prisma.
- **Branding & Logo:** Aset logo resmi aplikasi tersimpan di direktori `/public` (contoh: `newlogowithtext.png` dan `sibersih-logowithouttext.png`). Logo ini diimplementasikan menggunakan komponen `<Image>` Next.js pada halaman otentikasi dengan manajemen rasio yang responsif dan tersentralisasi.

---
**Instruksi untuk AI:**
*Gunakan dokumen konteks di atas sebagai *Ground Truth* (Kebenaran Dasar) mengenai proyek SiBersih. Jika pengguna meminta penambahan fitur, pastikan Anda mempertahankan stack Next.js App Router, menggunakan Server Actions, dan tidak merusak arsitektur otorisasi berbasis rute (Auth.js) yang telah berjalan dengan stabil.*