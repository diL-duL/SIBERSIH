# SiBersih

Sistem Informasi Kebersihan dan Sarana Prasarana Kampus berbasis web modern yang mengintegrasikan pelaporan fasilitas kotor/rusak, penugasan petugas kebersihan, serta validasi dan pengawasan oleh pimpinan kampus dalam satu platform terpusat yang transparan, aman, dan akuntabel.

---

## Tech Stack

- **Framework Utama:** Next.js 16.2.10 (App Router, Server Actions, Turbopack)
- **Library UI:** React 19.2.4
- **Styling & Tema:** Tailwind CSS v4, Lucide Icons, Institutional Botanical Theme (`#1F4B2C`)
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
- **Halaman Registrasi Khusus Google Sign-Up (`/login/register`):** Rute pendaftaran khusus bagi civitas akademika tanpa formulir manual berbelit-belit.
- **Auto-Provisioning & Modal Atur Sandi Pasca-Login Google:** Pengguna Google baru otomatis dibuatkan akun dengan peran `PELAPOR`. Modal pop-up interaktif menawarkan pengguna untuk menyetel kata sandi manual (opsional) agar akun dapat diakses baik via Google maupun email/password.
- **Wajib Nomor HP Pasca-Registrasi / Login:** Modal khusus (`RequirePhoneNumberModal`) mewajibkan pelapor melengkapi nomor HP/WhatsApp aktif demi kemudahan verifikasi dan koordinasi petugas di lapangan.
- **UX Form Login Cerdas:**
  - Klik pada logo SiBersih (desktop maupun mobile) langsung mengarahkan pengguna kembali ke Beranda (*Landing Page*).
  - Jika proses masuk gagal, alamat email pengguna tetap tertulis di formulir, sementara kolom kata sandi otomatis terhapus dan kursor langsung terfokus kembali ke kolom sandi.
- **Fitur Ubah Kata Sandi & Vision Toggle (Semua Peran):** Seluruh peran dapat memperbarui kata sandi melalui tab Pengaturan Akun di profil, dilengkapi tombol **Vision Toggle (`Eye` / `EyeOff`)** pada setiap kolom kata sandi lama, baru, dan konfirmasi.
- **Dukungan Kredensial Email & Password (Petugas & Pimpinan):** Form login kredensial berproteksi Bcrypt dan anti-brute force rate limiter khusus untuk staf internal (Petugas dan Pimpinan).
- **Kepatuhan Legalitas Google OAuth:** Dilengkapi halaman resmi Kebijakan Privasi (`/privacy`) dan Ketentuan Layanan (`/terms`) yang tertaut di footer autentikasi.

### 2. Publik & Beranda (Landing Page)
- **Pintasan Aplikasi Resmi Untad (*Untad App Shortcuts*):** Kartu navigasi terintegrasi ke layanan resmi Universitas Tadulako (SIGA, SIDAMPAK, E-Learning, Portal Untad, MBKM Untad, dan Kepegawaian).
- **Kontak Tanggap Darurat Pemadam Kebakaran (*Emergency Hotline*):** Kartu kontak siaga terintegrasi dengan akses panggilan cepat ke Posko Damkar Palu `(0451) 423113` dan tautan WhatsApp resmi `+62 821 8823 2113`, didesain selaras dengan palet hijau institusional Sibersih.
- **Showcase Laporan Transparan:** Menampilkan hingga 50 laporan fasilitas kampus terkini mencakup seluruh status (`LAPORAN_MASUK`, `MENUNGGU_APPROVAL`, `SELESAI`) secara transparan kepada seluruh civitas.
- **Tampilan Awal Ringkas & Toggle Interaktif:** Menampilkan 3 laporan awal dengan tombol toggle *"Lihat Semua Laporan"* / *"Tampilkan Lebih Sedikit"*.
- **Hemat Kuota & Cepat (Tanpa Gambar Publik):** Daftar laporan publik sengaja tidak memuat aset gambar, menjaga kecepatan *load* instan dan menghemat kuota cloud.
- **Anti-DDoS via ISR Caching:** Menggunakan *Incremental Static Regeneration* (`revalidate: 60`), melayani ribuan pengunjung langsung dari CDN Edge tanpa membebani database.

### 3. Pelapor (Mahasiswa / Civitas Akademika)
- **Kategori Laporan (Sampah vs Sarana & Prasarana):** Pelapor dapat membedakan jenis laporan antara tumpukan **Sampah** atau kerusakan **Sarana & Prasarana** (fasilitas toilet, lampu, gedung, jalan). Dilengkapi badge penanda visual yang jelas.
- **Formulir Pelaporan Sederhana & Cepat:**
  - Urutan teratas: **1. Foto Bukti** (ambil kamera langsung via WebRTC atau unggah galeri).
  - Urutan kedua: **2. Lokasi & Titik Peta** (nama lokasi spesifik dan geser pin GPS Leaflet).
  - **Deskripsi Laporan Bersifat Opsional:** Pelapor dapat langsung mengirim laporan hanya dengan foto dan lokasi tanpa wajib mengetik deskripsi panjang.
- **Edit & Batalkan Laporan:** Pelapor dapat mengedit kategori, foto, lokasi, atau menghapus laporan selama statusnya masih `LAPORAN_MASUK`.
- **Hapus Laporan di Halaman Riwayat:** Tombol hapus laporan yang belum diproses tersedia di dasbor utama maupun di halaman riwayat lengkap (`/reporter/history`).
- **Pelacakan Status Real-time:** Mengetahui posisi penanganan laporan (Menunggu Petugas, Menunggu Validasi, atau Selesai).
- **Riwayat Terproteksi:** Kueri riwayat dibatasi hingga 100 laporan terkini dengan fitur pencarian teks langsung dan filter status.

### 4. Petugas Kebersihan (Staff)
- **Daftar Tugas Baru:** Dasbor interaktif dan halaman tugas (`/staff/tasks`) untuk memantau fasilitas yang membutuhkan penanganan.
- **Unggah Bukti Pengerjaan:** Petugas mengunggah foto sesudah dikerjakan di lokasi.
- **Deskripsi Hasil Kerja Opsional:** Catatan tindakan pembersihan/perbaikan bersifat fleksibel (opsional) agar tidak menghambat mobilitas kerja petugas di lapangan.
- **Mode Edit Bukti:** Petugas dapat memperbarui foto bukti atau catatan kerja selama laporan belum disetujui oleh pimpinan.
- **Riwayat Penanganan:** Arsip hingga 100 tugas terakhir yang pernah dikerjakan oleh petugas terkait, dilengkapi pencarian langsung dan paginasi.

### 5. Pimpinan (Executive)
- **Peta Pengawasan Wilayah Responsif:** Peta pemantauan sebaran laporan kampus yang adaptif (berada di posisi atas pada perangkat mobile, dan membentang pada layar desktop).
- **Panel Validasi Komparasi (Sebelum vs Sesudah):** Meninjau foto laporan awal pelapor bersanding langsung dengan foto bukti petugas dan catatan penanganan (`/executive/validations`).
- **Tolak / Hapus Laporan Palsu & Status Selesai:** Hak akses khusus pimpinan untuk menolak dan menghapus laporan palsu/spam pada antrean, serta memiliki otoritas menghapus laporan yang sudah berstatus `SELESAI` baik dari Dasbor Utama maupun Riwayat.
- **Pembersihan Otomatis Cloud Storage:** Penghapusan laporan otomatis membersihkan seluruh file foto terkait di Cloudinary untuk mencegah pemborosan kuota penyimpanan.
- **Pemantauan Seluruh Status Laporan (`/executive/history`):** Memantau hingga 200 laporan terkini dari segala tahapan (`LAPORAN_MASUK`, `MENUNGGU_APPROVAL`, `SELESAI`) untuk mengawasi laporan baru maupun laporan yang mangkrak.
- **Manajemen Akun Petugas:** Menambah akun petugas baru (`buatAkunPetugas`) dan mencabut akses petugas (`hapusAkunPetugas`) dengan sanitasi data dan transaksi ACID database.

---

## Bahasa Desain: Institutional Botanical Theme

SiBersih menerapkan antarmuka modern yang bersih, fungsional, dan bebas dari elemen berlebihan (*AI-slop*):
- **Palet Warna Institusional:**
  - **Sibersih Primary (`#1F4B2C`):** Hijau hutan khas Fakultas Teknik / Untad yang berwibawa dan kontras tinggi.
  - **Soft Surface (`#FCFCF7` / Slate-50):** Kanvas netral bersih untuk kenyamanan membaca dalam jangka panjang.
  - **Dark Mode Support:** Dukungan tema gelap terintegrasi (`bg-slate-900`, `border-slate-800`).
- **Tipografi Bersih & Tegas:**
  - Menggunakan Google Fonts **Inter** dengan bobot seimbang untuk legibilitas optimal pada seluruh ukuran layar.
- **Geometri Komponen Modern:**
  - Tombol kontrol dan kartu formulir berlekuk halus (`rounded-xl` / `rounded-2xl`) dengan bayangan halus (`shadow-2xs`), bebas dari animasi berlebihan yang mengganggu kinerja.

---

## Keamanan & Performa (Enterprise-Grade)

1. **Anti-Brute Force Rate Limiting:** *In-Memory Rate Limiter* pada level Server Actions untuk melindungi form autentikasi dari serangan bot dan spam.
2. **HTTP Security Headers OWASP:** Dilengkapi proteksi `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, serta `Permissions-Policy` untuk akses kamera dan geolokasi.
3. **Kompresi Gambar Sisi Klien & Anti-Payload-Limit:** Modul `clientImageCompressor.ts` mengompresi foto pelapor dan petugas di browser menjadi WebP/JPEG < 350 KB sebelum dikirim ke server. Dilengkapi normalisasi latar belakang putih solid untuk PNG transparan.
4. **Batas Aman Kueri Database (Bounded History Queries):** Kueri riwayat dibatasi secara terukur (`take: 200` untuk pimpinan, `take: 100` untuk petugas & civitas, `take: 50` untuk validasi & landing page), menjamin kestabilan memori server jangka panjang.
5. **Optimasi Payload Kueri JWT & Google OAuth:** Kueri sinkronisasi user dan sesi di `auth.ts` menggunakan klausul `select` spesifik, mencegah transfer hash password melalui jaringan.
6. **Optimasi Bandwidth Query Database (Landing Page):** Query publik di `app/page.tsx` menggunakan `select` eksplisit tanpa mengambil field gambar besar (`fotoLaporanUrl` & `fotoBuktiUrl`), menghemat kuota transfer database Supabase.
7. **Pembersihan Otomatis Cloudinary:** Utilitas `deleteMultipleImagesFromCloudinary` berbasis `Promise.allSettled` untuk menghapus foto secara paralel saat laporan dibatalkan, ditolak, atau akun dihapus.
8. **Optimasi B-Tree Database Supabase:** Skema Prisma dilengkapi *composite indexes* (`@@index([status, createdAt(sort: Desc)])`, `@@index([pelaporId, createdAt(sort: Desc)])`, `@@index([petugasId, status, updatedAt(sort: Desc)])`, `@@index([kategori])`) untuk kueri cepat dengan latensi rendah.
9. **Keep-Alive Endpoint Supabase Free Tier (`/api/health`):** Endpoint ringan penghitung latensi database untuk mencegah proyek Supabase free-tier dinonaktifkan otomatis (*auto-paused*) oleh Supabase setelah 7 hari tidak ada traffic.
10. **Session-Level Caching:** Memanfaatkan data JWT session pengguna untuk menghindari kueri SQL `findUnique` berulang pada setiap render dasbor.
11. **Dukungan Domain Kustom & Reverse Proxy:** Penyetelan `trustHost: true` dan `AUTH_TRUST_HOST` memastikan otentikasi NextAuth v5 berjalan mulus di server hosting/cPanel (`sibersih.my.id`).
12. **Zero Dead Code:** Repositori diaudit bebas dari variabel tak terpakai, fungsi yatim, dan tipe redundan menggunakan integrasi Knip & ESLint.

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
INSERT INTO "User" ("id", "nama", "email", "password", "nomorHp", "role")
VALUES 
    (gen_random_uuid()::text, 'Andi Pelapor', 'pelapor@sibersih.com', '$2b$10$SMlPAl/6/7A4t28N4miYQuEk4L9N2.6yeR.6UDL.0dWVbRDGldIVC', '081234567890', 'PELAPOR'::"Role"),
    (gen_random_uuid()::text, 'Joko Petugas', 'petugas@sibersih.com', '$2b$10$SMlPAl/6/7A4t28N4miYQuEk4L9N2.6yeR.6UDL.0dWVbRDGldIVC', '081234567891', 'PETUGAS'::"Role"),
    (gen_random_uuid()::text, 'Budi Pimpinan', 'pimpinan@sibersih.com', '$2b$10$SMlPAl/6/7A4t28N4miYQuEk4L9N2.6yeR.6UDL.0dWVbRDGldIVC', '081234567892', 'PIMPINAN'::"Role");
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
2. Gulir ke bagian **Environment variables**, lalu klik **Add Variable** untuk menambahkan variabel `.env`.
3. Klik tombol **Save** di bagian atas halaman edit aplikasi.

#### 5. Restart & Jalankan Aplikasi
1. Klik tombol **"Restart"** (ikon putar hijau).
2. Akses aplikasi melalui peramban di `https://sibersih.my.id`.

---

## Otomasi Keep-Alive Supabase (Anti-Pause Free Tier)

Supabase Free Tier otomatis menonaktifkan (*pause*) database jika tidak menerima traffic selama 7 hari berturut-turut. Untuk memastikan database selalu aktif, SiBersih menyediakan endpoint probe ringan:

* **Endpoint URL:** `https://sibersih.my.id/api/health`
* **Metode:** `GET`
* **Respon Sukses:** HTTP 200 `{ "status": "healthy", "database": "connected", "latencyMs": 15 }`

### Panduan Setup Otomatis via cron-job.org:
1. Buka dan buat akun gratis di [cron-job.org](https://cron-job.org).
2. Klik **"Create Cronjob"**.
3. Isi parameter:
   - **Title:** `SiBersih Supabase Keepalive`
   - **URL:** `https://sibersih.my.id/api/health` *(Pastikan menggunakan HTTPS domain Anda)*
   - **Schedule:** Setiap 1 hari sekali atau setiap 12 jam (contoh: `0 6 * * *`).
4. Klik **Create** untuk mengaktifkan. Database Supabase kini dijamin tetap aktif 24/7 tanpa risiko terjeda.

---

## Lisensi & Kontribusi

Dikembangkan untuk **Fakultas Teknik, Universitas Tadulako**.
