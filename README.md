# SiBersih

Sistem Informasi Kebersihan Kampus berbasis web modern yang mengintegrasikan pelaporan fasilitas kotor/sampah, penugasan petugas kebersihan, serta validasi dan pengawasan oleh pimpinan kampus dalam satu platform terpusat yang transparan, aman, dan akuntabel.

---

## Tech Stack

- **Framework Utama:** Next.js 16.2.10 (App Router, Server Actions, Turbopack)
- **Library UI:** React 19.2.4
- **Styling & Tema:** Tailwind CSS v4, Lucide Icons, Seed Botanical-Clinical Theme
- **Database:** Supabase (PostgreSQL via Connection Pooler Port 6543)
- **ORM:** Prisma 7.9+ (Custom Client Output di `app/generated/prisma`)
- **Autentikasi & Otorisasi:** Auth.js (NextAuth v5 beta) dengan Credentials Provider & JWT Session
- **Penyimpanan Media (Cloud Storage):** Cloudinary API (dengan kompresi cerdas `f_auto,q_auto`)
- **Peta Interaktif:** Leaflet & React-Leaflet (Koordinat Fakultas Teknik Universitas Tadulako)
- **Deployment Ready:** Vercel & Shared Hosting cPanel / Rumahweb (`output: "standalone"`)

---

## Fitur Utama Berdasarkan Peran

### 1. Publik & Beranda (Landing Page)
- **Showcase Laporan Transparan:** Menampilkan hingga 50 laporan fasilitas kampus terkini mencakup seluruh status (`LAPORAN_MASUK`, `MENUNGGU_APPROVAL`, `SELESAI`) secara transparan kepada seluruh civitas.
- **Tampilan Awal Ringkas & Toggle Interaktif:** Menampilkan 3 laporan awal dengan tombol toggle *"Lihat Semua Laporan"* / *"Tampilkan Lebih Sedikit"*.
- **Hemat Kuota & Cepat (Tanpa Gambar Publik):** Daftar laporan publik sengaja tidak memuat aset gambar, menjaga kecepatan *load* instan dan menghemat kuota cloud.
- **Anti-DDoS via ISR Caching:** Menggunakan *Incremental Static Regeneration* (`revalidate: 60`), melayani ribuan pengunjung langsung dari CDN Edge tanpa membebani database.

### 2. Pelapor (Mahasiswa / Civitas Akademika)
- **Pelaporan Presisi Berbasis Peta:** Menentukan titik tumpukan sampah menggunakan peta interaktif (*Leaflet*), drag-and-drop foto, atau kamera langsung (WebRTC).
- **Edit & Batalkan Laporan:** Pelapor dapat mengedit deskripsi, titik peta, foto, atau membatalkan/menghapus laporan selama statusnya masih `LAPORAN_MASUK`.
- **Hapus Laporan di Halaman Riwayat:** Tombol hapus laporan yang belum diproses kini tersedia di dasbor utama maupun di halaman riwayat lengkap (`/reporter/history`).
- **Pelacakan Status Real-time:** Mengetahui posisi penanganan laporan (Menunggu Petugas, Menunggu Validasi, atau Selesai).

### 3. Petugas Kebersihan (Staff)
- **Daftar Tugas Baru:** Dasbor interaktif dan halaman tugas (`/staff/tasks`) untuk memantau fasilitas yang membutuhkan penanganan.
- **Unggah Bukti Pengerjaan:** Petugas mengunggah foto sesudah dibersihkan dan catatan tindakan hasil kerja.
- **Mode Edit Bukti:** Petugas dapat memperbarui foto bukti dan catatan kerja selama laporan belum disetujui oleh pimpinan.
- **Riwayat Penanganan:** Arsip seluruh tugas yang pernah dikerjakan oleh petugas terkait.

### 4. Pimpinan (Executive)
- **Peta Pengawasan Wilayah Responsif:** Peta pemantauan sebaran laporan kampus yang adaptif (berada di posisi atas pada perangkat mobile, dan berada di bagian bawah membentang 3 kolom pada layar desktop).
- **Panel Validasi Komparasi (Sebelum vs Sesudah):** Meninjau foto laporan awal pelapor bersanding langsung dengan foto bukti petugas dan catatan penanganan.
- **Tolak / Hapus Laporan Palsu & Konten Tidak Senonoh:** Hak akses khusus pimpinan untuk menolak dan menghapus laporan palsu/spam langsung dari Dasbor atau Panel Validasi, dengan pembersihan permanen file foto dari Cloudinary untuk mencegah pemborosan kuota.
- **Proteksi Status Selesai:** Laporan yang sudah divalidasi `SELESAI` otomatis mengunci tombol tolak agar data riwayat valid tidak sengaja terhapus.
- **Manajemen Akun Petugas:** Menambah akun petugas baru (`buatAkunPetugas`) dan mencabut akses petugas (`hapusAkunPetugas`) dengan sanitasi data dan transaksi ACID database.

---

## Bahasa Desain: "Seed" Botanical-Clinical Aesthetic

SiBersih menerapkan bahasa visual terinspirasi dari **Seed Style Reference** (*"living organism under laboratory glass"*):
- **Palet Warna 93% Akromatik:**
  - **Snow White (`#fcfcf7`):** Kanvas hangat organik yang bersih.
  - **Forest Depths (`#1c3a13`):** Hijau pinus tinta pekat untuk teks utama dan tombol kontras tinggi.
  - **Warm Stone (`#eeeee9`):** Latar panel pendukung dan kotak detail.
  - **Lime Pulse (`#d3fa99`):** Aksen tunggal fungsional untuk lencana status selesai/sukses.
- **Tipografi "Whisper-Light":**
  - Menggunakan Google Fonts **Inter** (bobot 300, 400, 500) dengan *tracking tight* (-0.025em) untuk headline berwibawa layaknya jurnal ilmiah.
  - Tipografi **JetBrains Mono** untuk ID laporan `#ID`, koordinat GPS, dan penanda waktu bergaya label spesimen laboratorium.
- **Geometri Komponen Flat & Pill:**
  - Seluruh tombol kontrol dan lencana (*badge*) berbentuk *pill* penuh (`rounded-full`).
  - Kartu laporan bersudut lengkung 16px (`rounded-2xl`) tanpa bayangan (*zero drop-shadow / pure flat*).

---

## Keamanan & Performa (Enterprise-Grade)

1. **Anti-Brute Force Rate Limiting:** *In-Memory Rate Limiter* pada level Server Actions untuk melindungi endpoint otentikasi dari serangan bot dan spam.
2. **HTTP Security Headers OWASP:** Dilengkapi proteksi `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, serta `Permissions-Policy` untuk akses kamera dan geolokasi.
3. **Pembersihan Otomatis Cloudinary:** Utilitas `deleteMultipleImagesFromCloudinary` berbasis `Promise.allSettled` untuk menghapus foto secara paralel saat laporan dibatalkan atau ditolak.
4. **Optimasi B-Tree Database Supabase:** Eliminasi indeks redundan dan penambahan *composite indexes* (`@@index([petugasId, status, updatedAt(sort: Desc)])`) untuk kueri cepat dengan latensi rendah (15–30 ms).
5. **Session-Level Caching:** Memanfaatkan data JWT session pengguna untuk menghindari kueri SQL `findUnique` berulang pada setiap render dasbor.
6. **Zero External Date Libraries:** Format tanggal menggunakan `Intl.DateTimeFormat` bawaan JavaScript tanpa dependensi eksternal tambahan.

---

## Panduan Instalasi & Setup Lokal

### 1. Persiapan Repositori
```bash
git clone https://github.com/diL-duL/SIBERSIH.git
cd SIBERSIH
```

### 2. Instalasi Dependensi
Pastikan menggunakan Node.js (v20+ direkomendasikan):
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Salin berkas `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Lengkapi variabel berikut di dalam `.env`:
```env
# Supabase PostgreSQL (Connection Pooler Port 6543)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct Connection untuk Prisma Migrations (Port 5432)
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres"

# NextAuth Secret (Generate via: npx auth secret)
AUTH_SECRET="your-generated-auth-secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 4. Sinkronisasi Database (Prisma)
Generate klien Prisma kustom dan sinkronkan skema ke Supabase:
```bash
npx prisma generate
npx prisma db push
```

### 5. Seeding Akun Default (Opsional)
Jalankan query SQL berikut di SQL Editor Supabase untuk membuat 3 akun peran pengujian (Password: `password123`):
```sql
INSERT INTO "User" ("id", "nama", "email", "password", "role")
VALUES 
    (gen_random_uuid()::text, 'Andi Pelapor', 'pelapor@sibersih.com', '$2b$10$SMlPAl/6/7A4t28N4miYQuEk4L9N2.6yeR.6UDL.0dWVbRDGldIVC', 'PELAPOR'::"Role"),
    (gen_random_uuid()::text, 'Joko Petugas', 'petugas@sibersih.com', '$2b$10$SMlPAl/6/7A4t28N4miYQuEk4L9N2.6yeR.6UDL.0dWVbRDGldIVC', 'PETUGAS'::"Role"),
    (gen_random_uuid()::text, 'Budi Pimpinan', 'pimpinan@sibersih.com', '$2b$10$SMlPAl/6/7A4t28N4miYQuEk4L9N2.6yeR.6UDL.0dWVbRDGldIVC', 'PIMPINAN'::"Role");
```

### 6. Menjalankan Server Lokal
```bash
npm run dev
```
Buka peramban di `http://localhost:3000`.

---

## Panduan Deployment

### Opsi A: Deployment ke Vercel (Rekomendasi Cloud Serverless)
1. Hubungkan repositori GitHub Anda ke **Vercel**.
2. Masukkan seluruh *Environment Variables* di Vercel Dashboard.
3. Deploy otomatis berjalan via CI/CD.

### Opsi B: Deployment ke cPanel / Rumahweb (Standalone Mode)
Proyek ini telah dikonfigurasi dengan mode `output: "standalone"` di `next.config.ts`:
1. Jalankan kompilasi di laptop:
   ```bash
   npm run build
   ```
2. Salin aset statis ke folder standalone:
   ```bash
   cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/
   ```
3. Kompres seluruh isi folder `.next/standalone/` ke format `.zip` dan unggah ke File Manager cPanel.
4. Buat aplikasi di menu **"Setup Node.js App"** cPanel Rumahweb (Node.js 20 LTS, Startup file: `server.js`).
5. Masukkan Environment Variables di cPanel dan jalankan aplikasi.

---

## Lisensi & Kontribusi

Dikembangkan untuk **Fakultas Teknik, Universitas Tadulako**.
