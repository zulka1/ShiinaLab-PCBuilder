# ShiinaLab — PC Builder & Parts Store

ShiinaLab adalah konsep aplikasi web untuk membantu pengguna merencanakan rakitan PC, meninjau kecocokan dasar antarkomponen, dan menjelajahi katalog komponen dalam satu alur. Proyek ini dikembangkan bertahap sebagai proyek individu lintas mata kuliah Pengembangan Aplikasi Web, Keamanan Komputasi dan Siber, serta Kriptografi.

Masalah yang ingin diselesaikan adalah informasi komponen, kecocokan, dan perkiraan biaya sering perlu dicari dari beberapa sumber. ShiinaLab mengusulkan satu alur untuk menyusun pilihan dan meninjau rancangan sebelum pengguna melakukan riset atau pembelian lebih lanjut.

Pada Milestone 1, proyek berfokus pada antarmuka responsif dan interaksi awal dengan mock data. Katalog, estimasi harga, dan pemeriksaan kompatibilitas pada versi ini **bukan data penjualan atau validasi teknis untuk pembelian**.

## Sasaran pengguna

- Pemula yang membutuhkan alur terarah untuk menyusun PC.
- PC enthusiast dan gamer yang ingin membandingkan pilihan komponen.
- Pembeli komponen yang ingin menjelajahi kategori dan spesifikasi produk.

## Fitur awal

- **Beranda:** konsep produk, sasaran pengguna, dan alur utama ShiinaLab.
- **Katalog:** pencarian, filter kategori, pengurutan harga, spesifikasi, serta keranjang simulasi.
- **PC Builder:** pemilihan tujuh kategori komponen, estimasi biaya, pemeriksaan dasar socket/tipe memori/ukuran casing/daya PSU, dan formulir penyimpanan rancangan.
- **Validasi form:** nama rakitan dibatasi 3–40 karakter dan anggaran harus lebih besar dari Rp0; pesan kesalahan ditampilkan pada field terkait.
- **Penyimpanan lokal:** rancangan dienkripsi dengan AES-256-GCM dan disimpan di browser untuk demonstrasi, bukan dikirim ke server atau database. Frasa kunci tidak disimpan; pengguna harus mengingatnya.
- **Mock data:** komponen, spesifikasi, dan harga contoh tersedia di `app/data/mock-products.ts`.

## Teknologi

- Next.js App Router 16
- React 19
- TypeScript
- Tailwind CSS 4 (dengan CSS khusus dan token desain di `app/globals.css`)

## Struktur aplikasi

```text
app/
├── builder/
│   └── page.tsx                 # Halaman PC Builder
├── components/
│   ├── BuilderWorkspace.tsx     # Form pemilihan, ringkasan, pemeriksaan, dan simpan
│   ├── ProductCard.tsx          # Kartu produk katalog
│   ├── ShopCatalog.tsx          # Pencarian, filter, urut, dan keranjang simulasi
│   └── SiteNavigation.tsx       # Navigasi dan footer bersama
├── data/
│   └── mock-products.ts         # Tipe, kategori, dan data komponen contoh
├── shop/
│   └── page.tsx                 # Halaman katalog
├── globals.css                 # Token desain, komponen, responsivitas, aksesibilitas
├── layout.tsx                  # Metadata dan layout aplikasi
└── page.tsx                    # Beranda
```

## Menjalankan proyek

Pastikan Node.js dan npm tersedia. Dari folder proyek, jalankan:

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Perintah pengembangan lainnya:

```bash
npm run lint
npm run build
```

## Status dan batasan

Belum ada backend, database, akun pengguna, katalog live, stok aktual, checkout, pembayaran, atau dashboard admin. Keranjang dan penyimpanan rancangan hanya demonstrasi sisi klien. Pemeriksaan kompatibilitas menggunakan aturan dasar dari data mock dan tidak mencakup seluruh spesifikasi teknis perangkat.

Rencana milestone berikutnya mengikuti master plan ShiinaLab: backend API dan database untuk katalog/rakitan; kemudian alur toko, keranjang dan checkout simulasi; analisis performa; serta pengelolaan admin. Sebelum transaksi nyata, harga/stok, validasi sisi server, autentikasi, kontrol akses, keamanan pembayaran, dan perlindungan data harus dirancang dan diuji terlebih dahulu.
