# Dokumen Teknis Modul 4: Next.js App Router

Nama/NIM   : Ubaidulloh Zulkarnain / 105224024  
Repositori : https://github.com/zulka1/ShiinaLab-PCBuilder.git  
Versi Next.js dan mode Cache Components (aktif/tidak) : Next.js 16.4.0 (Turbopack), Cache Components: **aktif** (`cacheComponents: true`, `partialPrefetching: true`)

---

## 1. Peta Rute

Berikut adalah tabel pemetaan rute aplikasi ShiinaLab PC Builder:

| URL | Berkas di `app/` | Jenis Rute | Isi Halaman |
| :--- | :--- | :--- | :--- |
| `/` | `app/page.tsx` | Statis | Halaman beranda (Hero, Brand Marquee, sorotan fitur PC Builder & toko) |
| `/shop` | `app/shop/page.tsx` | Statis | Katalog komponen demonstrasi lengkap dengan pencarian, filter kategori, dan pengurutan harga |
| `/shop/[id]` | `app/shop/[id]/page.tsx` | Dinamis | Halaman detail komponen spesifik berdasarkan slug ID (spesifikasi teknis, socket, daya, form factor) |
| `/builder` | `app/builder/page.tsx` | Statis | Antarmuka interaktif perakitan PC, kompatibilitas komponen, dan kalkulasi daya |
| `/account` | `app/account/page.tsx` | Statis | Halaman profil pengguna dan riwayat racikan PC |
| `/login` | `app/login/page.tsx` | Statis | Halaman autentikasi masuk / registrasi akun |
| `/*` (lainnya) | `app/not-found.tsx` | Khusus | Halaman fallback 404 ketika rute tidak ditemukan |
| `/shop/[id]` (id salah) | `app/shop/[id]/not-found.tsx` | Khusus | Halaman 404 khusus segmen toko jika ID produk tidak terdaftar |

### Potongan Tabel Rute dari Keluaran `npm run build`

```text
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /account
├ ƒ /api/account
├ ƒ /api/account/password
├ ƒ /api/account/profile
├ ƒ /api/auth/login
├ ƒ /api/auth/logout
├ ƒ /api/auth/register
├ ○ /builder
├ ○ /login
├ ○ /shop
└   /shop/[id]
  ├ ◐ /shop/[id]
  ├ ○ /shop/cpu-ryzen-7600
  ├ ○ /shop/cpu-core-12400f
  └ ◐ [+10 more paths]

○  (Static)             prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
ƒ  (Dynamic)            server-rendered on demand
```

---

## 2. Layout, Template, dan Berkas Khusus

### Pohon Folder `app/` Akhir

```text
app/
├── account/
│   └── page.tsx
├── api/
│   ├── account/
│   │   ├── password/route.ts
│   │   ├── profile/route.ts
│   │   └── route.ts
│   └── auth/
│       ├── login/route.ts
│       ├── logout/route.ts
│       └── register/route.ts
├── builder/
│   └── page.tsx
├── components/
│   ├── BrandMarquee.tsx
│   ├── BuilderWorkspace.tsx
│   ├── ProductCard.tsx
│   ├── ShopCatalog.tsx
│   └── SiteNavigation.tsx
├── data/
│   └── mock-products.ts
├── lib/
│   ├── saved-build-crypto.test.mjs
│   └── saved-build-crypto.ts
├── login/
│   └── page.tsx
├── shop/
│   ├── [id]/
│   │   ├── not-found.tsx
│   │   └── page.tsx
│   └── page.tsx
├── favicon.ico
├── globals.css
├── layout.tsx
├── not-found.tsx
└── page.tsx
```

### Hasil Uji Layout vs Template
- **Perilaku `layout.tsx`:** Komponen di dalam `layout.tsx` (seperti `SiteHeader` dan struktur wrapper halaman) dipertahankan lintas navigasi. State lokal yang ada pada layout tidak mengalami remounting maupun reset saat berpindah halaman antar-segmen.
- **Perilaku `template.tsx`:** Jika menggunakan template, Next.js menyematkan *key* unik untuk setiap segmen anak sehingga seluruh pohon DOM di dalamnya akan dibuat ulang (*remount*) dan state akan kembali ke nilai awal ketika segmen rute berubah.

### Tangkapan Layar loading.tsx dan error.tsx

---

## 3. Rute Dinamis dan Validasi `params`

### Tabel Uji Rute Dinamis

| URL Uji | Hasil yang Diharapkan | Hasil Aktual | Kode Status HTTP (curl) |
| :--- | :--- | :--- | :--- |
| `/shop/cpu-ryzen-7600` | Menampilkan detail AMD Ryzen 5 7600 | Halaman detail tampil lengkap dengan spesifikasi AM5 | `200 OK` |
| `/shop/board-b650m` | Menampilkan detail MSI PRO B650M-A WiFi | Halaman detail tampil lengkap dengan spesifikasi Micro-ATX | `200 OK` |
| `/shop/gpu-rtx-4060` | Menampilkan detail MSI GeForce RTX 4060 | Halaman detail tampil lengkap dengan daya 115 W | `200 OK` |
| `/shop/barang-fiktif` | Mengalihkan ke `notFound()` | Menampilkan tampilan `app/shop/[id]/not-found.tsx` | `404 Not Found` |
| `/shop/12345` | Mengalihkan ke `notFound()` | Menampilkan tampilan `app/shop/[id]/not-found.tsx` | `404 Not Found` |

### Penjelasan Aturan Validasi `params`
Pada Next.js 15+, objek `params` dioper sebagai sebuah `Promise`:
```typescript
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }
  // render komponen ...
}
```
1. **Asinkron:** Nilai parameter segmen dinamis `id` wajib di-`await` terlebih dahulu sebelum diakses.
2. **Pencocokan Slug/ID:** Parameter `id` dicocokkan dengan basis data katalog melalui fungsi `getProductById(id)`.
3. **Pencegahan Data Anomali:** Jika ID kosong, tidak sesuai, atau tidak ditemukan di daftar `mockProducts`, sistem langsung memanggil fungsi `notFound()` dari `next/navigation` untuk merender tampilan 404 segmen tanpa memicu runtime error.
4. **Optimasi Prerender:** Fungsi `generateStaticParams()` diekspor untuk mengekstrak seluruh 12 ID produk yang sah, sehingga Next.js dapat me-render halaman secara statis pada fase build.

---

## 4. Pembagian Server dan Client Components

### Tabel Komponen dan Alasan Teknis

| Komponen / Berkas | Jenis Komponen | Alasan Teknis |
| :--- | :--- | :--- |
| `app/layout.tsx` | **Server Component** | Kerangka akar aplikasi; tidak memerlukan hooks interaktif sehingga kode bundelnya tidak dikirim ke klien demi performa akses awal. |
| `app/shop/page.tsx` | **Server Component** | Menyiapkan metadata halaman dan struktur statis kontainer toko. |
| `app/shop/[id]/page.tsx` | **Server Component** | Mengambil data produk berdasarkan parameter URL secara langsung di server serta mengekspor `generateMetadata` dan `generateStaticParams`. |
| `app/shop/[id]/not-found.tsx` | **Server Component** | Tampilan status statis 404 tanpa interaksi formulir/state. |
| `components/ShopCatalog.tsx` | **Client Component** (`"use client"`) | Menggunakan hook `useState` dan `useMemo` untuk interaktivitas filter kategori, pencarian live, dan pengurutan harga. |
| `components/BuilderWorkspace.tsx`| **Client Component** (`"use client"`) | Memerlukan manajemen state lokal interaktif untuk pemilihan slot komponen, penghitungan total daya listrik secara dinamis, dan validasi kecocokan socket. |
| `components/ProductCard.tsx` | **Client Component** (`"use client"`) | Memiliki interaksi tombol "Tambah ke Keranjang" yang memanggil callback `onAdd` dari state parent katalog. |
| `components/SiteNavigation.tsx` | **Client Component** (`"use client"`) | Menangani event listener scroll jendela (`window.scrollY`) untuk mengubah latar belakang navbar secara dinamis dan toggling menu mobile. |

### Hasil Uji Batas Server–Klien (`server-only`)
- Ketika modul data server diberi penanda `import "server-only";` lalu diimpor ke dalam berkas Client Component (`"use client"`), Turbopack/Next.js akan langsung menghentikan build dengan galat kompilasi:
  ```text
  You're importing a module that depends on the `server-only` package in a Client Component...
  ```
- Ini menjamin bahwa logika database, secrets, atau modul khusus server tidak akan pernah bocor ke bundel JavaScript peramban klien.

---

## 5. Verifikasi

Hasil eksekusi seluruh perintah verifikasi pada terminal proyek:
PS D:\KULIAH\5\project\shiinalab-pcbuilder> cmd
Microsoft Windows [Version 10.0.26300.9711]
(c) Microsoft Corporation. All rights reserved.

D:\KULIAH\5\project\shiinalab-pcbuilder>npx tsc --noEmit
npm notice run shiinalab-pcbuilder@0.1.0 npx
npm notice run tsc --noEmit

D:\KULIAH\5\project\shiinalab-pcbuilder>npm run lint
npm notice run shiinalab-pcbuilder@0.1.0 lint
npm notice run eslint

D:\KULIAH\5\project\shiinalab-pcbuilder>npm run build
npm notice run shiinalab-pcbuilder@0.1.0 build
npm notice run next build
▲ Next.js 16.4.0 (Turbopack)
✓ Running next.config.ts took 101ms
- Cache Components enabled
- Partial Prefetching enabled
- Experiments (use with caution):
  ✓ agentFeedback

  Creating an optimized production build ...
✓ Compiled successfully in 4.5s
  Running TypeScript ...
  Finished TypeScript in 4.0s ...
  Collecting page data using 11 workers ...
✓ Collecting page data using 11 workers in 2.9s
  Generating static pages using 11 workers (0/29) ...
  Generating static pages using 11 workers (7/29)
  Generating static pages using 11 workers (14/29)
  Generating static pages using 11 workers (21/29)
✓ Generating static pages using 11 workers (29/29) in 1960ms
  Finalizing page optimization ...
✓ Finalizing page optimization in 46ms

Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /account
├ ƒ /api/account
├ ƒ /api/account/password
├ ƒ /api/account/profile
├ ƒ /api/auth/login
├ ƒ /api/auth/logout
├ ƒ /api/auth/register
├ ○ /builder
├ ○ /login
├ ○ /shop
├   /shop/[id]
│ ├ ◐ /shop/[id]
│ ├ ○ /shop/cpu-ryzen-7600
│ ├ ○ /shop/cpu-core-12400f
│ └ ◐ [+10 more paths]
├ ◐ /uji/galat
└ ◐ /uji/lambat


○  (Static)             prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
ƒ  (Dynamic)            server-rendered on demand

  Preparing upgrade...
npm notice run shiinalab-pcbuilder@0.1.0 npx
npm notice run next upgrade D:\KULIAH\5\project\shiinalab-pcbuilder --agent=security
  Upgrade: Next.js 16.4.0 → 16.4.2
  Looking for coding agents...
  No supported coding agent found. The upgrade prompt was copied to your clipboard.

D:\KULIAH\5\project\shiinalab-pcbuilder>
## 6. Kendala dan Penyelesaian

1. **Perubahan Signature `params` di Next.js 15/16:**
   - *Kendala:* Properti `params` pada props halaman sekarang bertipe `Promise` dan tidak dapat diakses langsung secara sinkron seperti versi Next.js sebelumnya (`params.id`).
   - *Penyelesaian:* Mengubah fungsi halaman menjadi `async` dan menambahkan `const { id } = await params;` sebelum mengambil data.
2. **Kesesuaian Tipe Data Slug vs ID String:**
   - *Kendala:* ID komponen pada data mock berupa string deskriptif (misal: `cpu-ryzen-7600`), berbeda dengan contoh angka modul.
   - *Penyelesaian:* Dibuatkan helper pencarian `getProductById(id: string)` yang langsung memvalidasi keberadaan string ID tersebut tanpa harus memaksa konversi ke integer numerik.

---

## 7. Catatan Pemanfaatan AI

- **Alat:** Antigravity AI Assistant
- **Bagian yang Digunakan:**
  - Perancangan arsitektur dynamic routing `app/shop/[id]/page.tsx` dan `generateStaticParams()`.
  - Integrasi UI halaman detail produk yang serasi dengan desain tema ShiinaLab.
  - Penyusunan kerangka dokumen teknis sesuai rubrik penilaian Modul 4.
- **Cara Verifikasi:**
  - Melakukan build langsung menggunakan `node node_modules/typescript/bin/tsc --noEmit` dan `npm run build`.
  - Memeriksa tabel keluaran rute untuk memastikan rute statis dan dinamis ter-generate dengan benar.
