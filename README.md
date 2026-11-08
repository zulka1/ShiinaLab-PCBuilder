# ShiinaLab — PC Builder & Parts Store

ShiinaLab adalah platform aplikasi web modern untuk membantu pengguna merencanakan rakitan PC, memeriksa kompatibilitas dasar antarkomponen secara cerdas, serta menjelajahi dan mengelola katalog komponen dalam satu alur terpadu.

Proyek ini dikembangkan bertahap sebagai proyek terintegrasi lintas mata kuliah: **Pengembangan Aplikasi Web (PAW)**, **Kriptografi**, dan **Keamanan Komputasi dan Siber (KKS)**.

---

## Perkembangan Fitur: Milestone 1 (v0.1) $\rightarrow$ Milestone 2 (v0.2)

Pada **Milestone 2 (`v0.2`)**, ShiinaLab telah berevolusi dari prototipe antarmuka berbasis mock data menjadi aplikasi *full-stack* berbasis database persisten dan Server Actions yang siap produksi:

1. **Integrasi Database Persisten:** Menggantikan seluruh data mock dengan database relasional **PostgreSQL 18** yang dikelola melalui **Prisma ORM 7**.
2. **Pemodelan Data Relasional (1:N):** Menerapkan relasi *One-to-Many* antara entitas `Komponen` dan `Ulasan` (*reviews*), lengkap dengan integritas referensial dan kaskade penghapusan.
3. **Operasi CRUD Lengkap pada Kedua Entitas:**
   - **Komponen:** *Create* (Form Tambah di `/admin`), *Read* (Katalog dinamis di `/shop` dan Halaman Detail di `/shop/[id]`), *Update* (Form Edit di `/shop/[id]/edit`), dan *Delete* (Aksi Hapus di panel `/admin`).
   - **Ulasan:** *Create* (Form Ulasan di `/shop/[id]`), *Read* (Daftar ulasan & perhitungan rating rata-rata produk), dan *Delete* (Penghapusan ulasan terkait).
4. **Validasi Sisi Server (Server-Side Validation):** Validasi menyeluruh menggunakan **Zod** pada seluruh Server Actions (`komponenSchema` dan `ulasanSchema`) dengan penanganan gagal tertutup (*fail-closed*) dan pemetaan pesan kesalahan langsung pada field antarmuka terkait.
5. **Integritas Relasional Transaksional:** Menggunakan transaksi atomik `prisma.$transaction()` saat menghapus komponen yang memiliki relasi ulasan guna mencegah pelanggaran *Foreign Key Constraint* (`P2003`) dan mencegah *orphaned records*.
6. **Panel Manajemen Admin:** Halaman `/admin` untuk memonitor inventaris, mengelola katalog produk secara langsung, serta menambahkan komponen baru.
7. **Pengalaman Pengguna & Aksesibilitas Terjaga:** Mempertahankan seluruh fitur interaktif, tata letak responsif, kontras warna yang nyaman, serta pencegahan *hydration mismatch*.

---

## Sasaran Pengguna

- **Pemula:** Membutuhkan alur terarah dan rekomendasi komponen untuk merakit PC pertama mereka tanpa khawatir salah socket atau daya.
- **Enthusiast & Gamer:** Ingin membandingkan spesifikasi teknis komponen kelas atas dan memperkirakan total anggaran rakitan secara presisi.
- **Administrator Toko:** Memerlukan antarmuka yang efisien dan aman untuk memperbarui stok, harga, dan variasi komponen hardware.

---

## Teknologi yang Digunakan

- **Framework:** Next.js 16 (App Router, React Server Components, Server Actions)
- **Frontend & UI:** React 19, Tailwind CSS 4, Lucide Icons
- **Bahasa Pemrograman:** TypeScript 5
- **Database & ORM:** PostgreSQL 18, Prisma ORM 7
- **Validasi Data:** Zod
- **Keamanan & Autentikasi:** Argon2id (Password Hashing), Secure HttpOnly Cookie Sessions, CSPRNG Web Crypto API

---

## Struktur Aplikasi

```text
shiinalab-pcbuilder/
├── app/
│   ├── account/                 # Halaman profil akun & dashboard user
│   ├── admin/                   # Panel manajemen inventaris & CRUD komponen (Admin)
│   ├── api/                     # Route Handlers API (auth, account, session)
│   ├── builder/                 # PC Builder interaktif & verifikasi kompatibilitas
│   ├── components/              # Komponen UI modular (Navbar, Form, Dialog, Cards)
│   ├── login/                   # Rute redirect & helper autentikasi
│   ├── masuk/                   # Form autentikasi login & registrasi (Argon2id)
│   ├── shop/                    # Katalog dinamis, detail komponen, & edit produk
│   │   ├── [id]/                # Detail spesifik komponen & ulasan pelanggan
│   │   │   └── edit/            # Formulir edit komponen (Update CRUD)
│   │   ├── tambah/              # Formulir tambah komponen baru (Create CRUD)
│   │   └── actions.ts           # Server Actions pengelolaan komponen
│   ├── tentang/                 # Halaman profil & informasi produk ShiinaLab
│   ├── uji/                     # Rute simulasi pengujian error handling & latency
│   ├── globals.css              # Desain token, styling global, & Tailwind CSS 4
│   ├── layout.tsx               # Root layout dengan pelindung hidrasi browser
│   └── page.tsx                 # Landing page utama ShiinaLab
├── docs/
│   ├── Kriptografi/             # Dokumentasi tugas mata kuliah Kriptografi
│   │   ├── Tugas1/              # Tugas 1 Kriptografi (tag v0.1)
│   │   ├── Tugas2/              # Tugas 2 Kriptografi (AEAD AES-256-GCM & Integritas Data v0.2)
│   │   │   └── KEPUTUSAN.md
│   │   └── latihan4/            # Eksplorasi enkripsi simetris rakitan
│   ├── Pemrograman-aplikasi-dan-web/ # Dokumentasi tugas mata kuliah PAW
│   │   ├── Tugas1/              # Tugas 1 PAW (Lighthouse & konsep v0.1)
│   │   └── Tugas2/              # Tugas 2 PAW (Pengujian 10 Skenario CRUD & Relasi v0.2)
│   │       └── pengujian-paw-v0.2.md
│   └── praktikum/               # Laporan modul praktikum mingguan & tangkapan layar
│       ├── images/modul7/       # Bukti tangkapan layar pengujian & CRUD
│       └── modul-07.md          # Laporan teknis praktikum Modul 7
├── lib/
│   ├── prisma.ts                # Prisma Client singleton untuk koneksi PostgreSQL
│   ├── sesi.ts                  # Manajemen sesi HttpOnly, cookie, & otorisasi peran
│   ├── skema.ts                 # Skema validasi Zod sisi server (fail-closed)
│   └── tipe.ts                  # Definisi TypeScript interface & tipe data
├── prisma/
│   ├── migrations/              # Berkas migrasi skema SQL database
│   ├── schema.prisma            # Skema model data (Komponen, Ulasan, Pengguna, Sesi)
│   └── seed.ts                  # Skrip seeding data sintetis awal katalog
├── public/                      # Aset statis & gambar komponen 3D resolusi tinggi
├── security/                    # Audit keamanan KKS (asset-inventory, dfd, threat-model, risk)
├── AI_LOG.md                    # Catatan transparansi penggunaan AI generatif
├── KEPUTUSAN.md                 # Arsitektur kriptografi (AEAD AES-256-GCM, HKDF, Argon2id)
└── README.md                    # Dokumentasi utama proyek
```

---

## Panduan Menjalankan Proyek

### 1. Prasyarat Sistem
- Node.js versi 20.x atau lebih baru
- PostgreSQL 16/17/18 aktif di sistem lokal atau container Docker

### 2. Konfigurasi Lingkungan (.env)
Salin berkas `.env.example` menjadi `.env`, kemudian sesuaikan kredensial database PostgreSQL Anda:
```env
DATABASE_URL="postgresql://postgres:password_anda@localhost:5432/shiinalab_db?schema=public"
```

### 3. Instalasi Dependensi
```bash
npm install
```

### 4. Migrasi & Seeding Database
Jalankan migrasi skema database Prisma dan isi katalog dengan data sintetis awal:
```bash
npx prisma migrate dev --name init_komponen_ulasan
npx prisma db seed
```

### 5. Menjalankan Server Pengembangan
```bash
npm run dev
```
Akses aplikasi melalui browser di [http://localhost:3000](http://localhost:3000).

Perintah pemeriksaan kode dan build produksi:
```bash
npx tsc --noEmit        # Pemeriksaan tipe TypeScript
npm run lint            # Pemeriksaan linter ESLint
npm run build           # Kompilasi build produksi Next.js
```

---

## Ringkasan Pengujian Fungsional (Milestone 2)

Pengujian dilakukan secara komprehensif mencakup operasi CRUD, pengujian integritas relasi data (1:N), serta verifikasi penolakan validasi server menggunakan data sintetis:

| No | Skenario Pengujian | Kategori | Hasil |
| :---: | :--- | :--- | :---: |
| 1 | Tambah Komponen Baru dengan Data Valid | CRUD (Create) | **LULUS** |
| 2 | Penolakan Tambah Komponen dengan Data Tidak Sah (Zod) | CRUD (Create) | **LULUS** |
| 3 | Tampilkan Katalog Produk Dinamis dari Database | CRUD (Read) | **LULUS** |
| 4 | Tampilkan Detail Komponen beserta Relasi Ulasan | CRUD (Read) | **LULUS** |
| 5 | Perbarui Data Komponen (Harga & Stok) | CRUD (Update) | **LULUS** |
| 6 | Penolakan Perubahan Komponen dengan Nilai Negatif (Zod) | CRUD (Update) | **LULUS** |
| 7 | Hapus Komponen Tanpa Relasi | CRUD (Delete) | **LULUS** |
| 8 | Hapus Ulasan Tertentu pada Komponen | CRUD (Delete) | **LULUS** |
| 9 | Tambah Ulasan Baru Terhubung ke Komponen (Relasi 1:N) | Relasional | **LULUS** |
| 10 | Hapus Komponen Berelasi via Transaksi Atomik ($transaction) | Relasional | **LULUS** |

> **Hasil:** 10/10 Skenario Berhasil (**100% Tingkat Kelulusan**).  
> Dokumentasi lengkap pengujian, rincian langkah, serta bukti tangkapan layar penolakan server dapat dilihat di: [docs/Pemrograman-aplikasi-dan-web/Tugas2/pengujian-paw-v0.2.md](file:///d:/KULIAH/5/project/shiinalab-pcbuilder/docs/Pemrograman-aplikasi-dan-web/Tugas2/pengujian-paw-v0.2.md).

---

## Status dan Rencana Lanjutan

- **Milestone 2 (Selesai):** Integrasi penuh Next.js Server Actions, PostgreSQL, Prisma ORM 7, Zod validation, CRUD 2 entitas, serta relasi kaskade.
- **Rencana Milestone 3 & Final Project:** Integrasi modul enkripsi terautentikasi (AEAD) untuk brankas data rakitan, alur simulasi checkout terautentikasi, serta evaluasi metrik kinerja sistem.
