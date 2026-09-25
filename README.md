# SiBersih

Sistem Informasi Kebersihan Kampus berbasis web modern yang mengintegrasikan pelaporan fasilitas kotor/sampah, penugasan petugas kebersihan, serta validasi dan pengawasan oleh pimpinan kampus dalam satu platform terpusat yang transparan, aman, dan akuntabel.

---

## Tech Stack

- **Framework Utama:** Next.js 16.2.10 (App Router, Server Actions, Turbopack)
- **Library UI:** React 19.2.4
- **Styling & Tema:** Tailwind CSS v4, Lucide Icons, Seed Botanical-Clinical Theme
- **Database:** Supabase (PostgreSQL via Connection Pooler Port 6543)
- **ORM:** Prisma 7.9+ (Custom Client Output di `app/generated/prisma`)
- **Autentikasi & Otorisasi:** Auth.js (NextAuth v5 beta) dengan Credentials Provider, Google OAuth 2.0 (SSO), & JWT Session
- **Penyimpanan Media (Cloud Storage):** Cloudinary API (dengan kompresi cerdas `f_auto,q_auto`)
- **Peta Interaktif:** Leaflet & React-Leaflet (Koordinat Fakultas Teknik Universitas Tadulako)
- **Deployment Ready:** Vercel & Shared Hosting cPanel / Rumahweb (`output: "standalone"`)

---

## Fitur Utama Berdasarkan Peran

### 1. Autentikasi Modern (Google OAuth & Kredensial)
- **Masuk & Daftar dengan Google (One-Click SSO):** Pengguna dapat masuk atau mendaftar langsung menggunakan akun Google resmi.
- **Auto-Provisioning Akun Baru:** Pengguna Google yang belum terdaftar otomatis dibuatkan akun dengan peran `PELAPOR` secara aman.
- **Dukungan Kredensial Email & Password (Petugas & Pimpinan):** Form login kredensial berproteksi Bcrypt dan anti-brute force rate limiter khusus untuk akun staf internal (Petugas dan Pimpinan). Fitur registrasi publik mandiri dan lupa sandi ditiadakan demi keamanan akun internal kampus.
- **Kepatuhan Legalitas Google OAuth:** Dilengkapi halaman resmi Kebijakan Privasi (`/privacy`) dan Ketentuan Layanan (`/terms`) yang tertaut di footer login dan terdaftar pada sitemap.

### 2. Publik & Beranda (Landing Page)
- **Showcase Laporan Transparan:** Menampilkan hingga 50 laporan fasilitas kampus terkini mencakup seluruh status (`LAPORAN_MASUK`, `MENUNGGU_APPROVAL`, `SELESAI`) secara transparan kepada seluruh civitas.
- **Tampilan Awal Ringkas & Toggle Interaktif:** Menampilkan 3 laporan awal dengan tombol toggle *"Lihat Semua Laporan"* / *"Tampilkan Lebih Sedikit"*.
- **Hemat Kuota & Cepat (Tanpa Gambar Publik):** Daftar laporan publik sengaja tidak memuat aset gambar, menjaga kecepatan *load* instan dan menghemat kuota cloud.
- **Anti-DDoS via ISR Caching:** Menggunakan *Incremental Static Regeneration* (`revalidate: 60`), melayani ribuan pengunjung langsung dari CDN Edge tanpa membebani database.

### 3. Pelapor (Mahasiswa / Civitas Akademika)
- **Pelaporan Presisi Berbasis Peta:** Menentukan titik tumpukan sampah menggunakan peta interaktif (*Leaflet*), drag-and-drop foto, atau kamera langsung (WebRTC).
- **Edit & Batalkan Laporan:** Pelapor dapat mengedit deskripsi, titik peta, foto, atau membatalkan/menghapus laporan selama statusnya masih `LAPORAN_MASUK`.
- **Hapus Laporan di Halaman Riwayat:** Tombol hapus laporan yang belum diproses kini tersedia di dasbor utama maupun di halaman riwayat lengkap (`/reporter/history`).
- **Pelacakan Status Real-time:** Mengetahui posisi penanganan laporan (Menunggu Petugas, Menunggu Validasi, atau Selesai).

### 4. Petugas Kebersihan (Staff)
- **Daftar Tugas Baru:** Dasbor interaktif dan halaman tugas (`/staff/tasks`) untuk memantau fasilitas yang membutuhkan penanganan.
- **Unggah Bukti Pengerjaan:** Petugas mengunggah foto sesudah dibersihkan dan catatan tindakan hasil kerja.
- **Mode Edit Bukti:** Petugas dapat memperbarui foto bukti dan catatan kerja selama laporan belum disetujui oleh pimpinan.
- **Riwayat Penanganan:** Arsip seluruh tugas yang pernah dikerjakan oleh petugas terkait.

### 5. Pimpinan (Executive)
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
3. **Kompresi Gambar Sisi Klien & Anti-Payload-Limit:** Modul `clientImageCompressor.ts` mengompresi foto pelapor dan petugas di browser menjadi WebP < 250 KB sebelum dikirim ke server. Dilengkapi normalisasi latar belakang putih solid untuk PNG transparan dan eliminasi pengiriman ganda (*double file payload*).
4. **Optimasi Bandwidth Query Database (Landing Page):** Query publik di `app/page.tsx` menggunakan `select` eksplisit tanpa mengambil field gambar besar (`fotoLaporanUrl` & `fotoBuktiUrl`), menghemat kuota transfer database Supabase.
5. **Pembersihan Otomatis Cloudinary:** Utilitas `deleteMultipleImagesFromCloudinary` berbasis `Promise.allSettled` untuk menghapus foto secara paralel saat laporan dibatalkan, ditolak, atau akun dihapus.
6. **Optimasi B-Tree Database Supabase:** Eliminasi indeks redundan dan penambahan *composite indexes* (`@@index([petugasId, status, updatedAt(sort: Desc)])`) untuk kueri cepat dengan latensi rendah (15–30 ms).
7. **Session-Level Caching:** Memanfaatkan data JWT session pengguna untuk menghindari kueri SQL `findUnique` berulang pada setiap render dasbor.
8. **Dukungan Domain Kustom & Reverse Proxy:** Penyetelan `trustHost: true` dan `AUTH_TRUST_HOST` memastikan otentikasi NextAuth v5 berjalan mulus di server hosting/cPanel (`sibersih.my.id`).
9. **Zero External Date Libraries:** Format tanggal menggunakan `Intl.DateTimeFormat` bawaan JavaScript tanpa dependensi eksternal tambahan.

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

# NextAuth Configuration
AUTH_SECRET="your-generated-auth-secret"
AUTH_URL="http://localhost:3000"
AUTH_TRUST_HOST="true"

# Google OAuth 2.0 (Google Cloud Console Credentials)
AUTH_GOOGLE_ID="your-google-client-id.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```
> **Tips Database Password:** Jika kata sandi database Supabase Anda mengandung karakter khusus (seperti simbol `@`), pastikan karakter tersebut di-encode dalam format URL (misalnya `@` menjadi `%40`) agar koneksi string dapat diparsing dengan benar oleh Node.js dan PostgreSQL pooler.

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
Proyek ini telah dikonfigurasi dengan mode `output: "standalone"` di `next.config.ts`, memungkinkan aplikasi berjalan ringan tanpa perlu instalasi `node_modules` berat di cPanel:

#### 1. Persiapan Berkas di Laptop (Build Standalone)
Jalankan kompilasi produksi di terminal lokal:
```bash
npm run build
```
Salin aset statis (`public` dan `.next/static`) ke dalam folder standalone agar gambar dan CSS dapat dilayani oleh server:
```bash
cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/
```
Kompres isi folder standalone menjadi berkas `.zip` (ringan, ~46 MB):
```bash
cd .next/standalone && zip -r ../../deploy.zip . && cd ../..
```

#### 2. Buat Aplikasi di "Setup Node.js App" cPanel
1. Masuk ke **cPanel Rumahweb** dan buka menu **"Setup Node.js App"** (kelompok *Software*).
2. Klik tombol **"Create Application"** di pojok kanan atas.
3. Isi parameter aplikasi:
   - **Node.js version:** Pilih versi **20.x** (disarankan 20 LTS).
   - **Application mode:** Pilih **Production**.
   - **Application root:** Ketik nama folder aplikasi, misal `sibersih` (berada di `/home/username/sibersih`).
   - **Application URL:** Pilih domain yang digunakan (misal: `sibersih.my.id`).
   - **Application startup file:** Ketik `server.js`.
4. Klik tombol **Create**.

#### 3. Unggah & Ekstrak Berkas via File Manager
1. Buka menu **File Manager** di cPanel.
2. Masuk ke folder penampung yang telah dibuat (folder `sibersih`). Hapus file default cPanel (seperti `app.js`) jika ada.
3. Klik tombol **Upload** di bilah atas, lalu unggah berkas `deploy.zip`.
4. Setelah proses upload mencapai 100%, kembali ke File Manager, klik kanan `deploy.zip` dan pilih **Extract**.
5. Pastikan folder `sibersih` memiliki struktur: `server.js`, `package.json`, `.next/`, `public/`, dan `node_modules/`.

#### 4. Masukkan Environment Variables di cPanel
1. Kembali ke menu **"Setup Node.js App"** dan klik tombol pensil (**Edit**) pada aplikasi Anda.
2. Gulir ke bagian **Environment variables**, lalu klik **Add Variable** untuk menambahkan:
   - `DATABASE_URL`: `postgresql://postgres.[REF]:[PASS]@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true`
   - `DIRECT_URL`: `postgresql://postgres.[REF]:[PASS]@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres`
   - `AUTH_SECRET`: *[Secret NextAuth Anda]*
   - `AUTH_URL`: `https://sibersih.my.id`
   - `AUTH_TRUST_HOST`: `true`
   - `AUTH_GOOGLE_ID`: *[Google Client ID Anda]*
   - `AUTH_GOOGLE_SECRET`: *[Google Client Secret Anda]*
   - `CLOUDINARY_CLOUD_NAME`: *[Cloud Name Cloudinary]*
   - `CLOUDINARY_API_KEY`: *[API Key Cloudinary]*
   - `CLOUDINARY_API_SECRET`: *[API Secret Cloudinary]*
   - `NODE_ENV`: `production`
3. Klik tombol **Save** di bagian atas halaman edit aplikasi.

#### 5. Restart & Jalankan Aplikasi
1. Klik tombol **"Restart"** (ikon putar hijau).
2. Akses aplikasi melalui peramban di `https://sibersih.my.id`.

---

## Lisensi & Kontribusi

Dikembangkan untuk **Fakultas Teknik, Universitas Tadulako**.
