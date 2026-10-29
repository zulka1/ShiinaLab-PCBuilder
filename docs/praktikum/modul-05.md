# Dokumen Teknis Modul 5 — Formulir, Validasi, Session, dan Cookie

Nama/NIM   : Ubaidulloh Zulkarnain / 105224024  
Repositori : https://github.com/zulka1/ShiinaLab-PCBuilder.git  

---

## 1. Skema Validasi

### Tabel Kolom Formulir Utama (`skemaKomponen`)

Berikut adalah aturan validasi untuk formulir penambahan komponen PC pada katalog **ShiinaLab PC Builder** (`lib/skema.ts`) menggunakan **Zod 4**:

| Nama Kolom | Tipe Data | Aturan Zod 4 | Pesan Galat Spesifik |
| :--- | :--- | :--- | :--- |
| `nama` | `string` | `z.string().trim().min(3).max(100)` | Minimal: `"Nama komponen minimal 3 karakter"`<br>Maksimal: `"Nama komponen maksimal 100 karakter"` |
| `kategori` | `enum` (`ProductCategory`) | `z.enum(["Processor", "Motherboard", "Graphics card", "Memory", "Storage", "Power supply", "Case"], { error: ... })` | `"Pilih salah satu kategori komponen"` |
| `harga` | `number` | `z.coerce.number({ error: ... }).int().min(10000).max(100000000)` | Tipe/Format: `"Harga wajib berupa angka"`<br>Minimal: `"Harga minimal Rp10.000"`<br>Maksimal: `"Harga maksimal Rp100.000.000"` |
| `deskripsi` | `string` | `z.string().trim().min(10).max(300)` | Minimal: `"Deskripsi minimal 10 karakter"`<br>Maksimal: `"Deskripsi maksimal 300 karakter"` |
| `tersedia` | `boolean` | `z.stringbool().default(false)` | Mengubah nilai checkbox `"on"` menjadi `true`, atau `false` jika kunci tidak dikirim dalam `FormData` |

Selain skema produk, terdapat skema autentikasi masuk (`skemaMasuk`) pada berkas yang sama:

| Nama Kolom | Tipe Data | Aturan Zod 4 | Pesan Galat Spesifik |
| :--- | :--- | :--- | :--- |
| `email` | `string` | `z.email("Format email tidak valid")` | `"Format email tidak valid"` |
| `kataSandi` | `string` | `z.string().min(8, "Kata sandi minimal 8 karakter")` | `"Kata sandi minimal 8 karakter"` |

### Implementasi `lib/skema.ts` dan `lib/status-form.ts`

```typescript
// lib/skema.ts
import { z } from "zod";

export const kategoriKomponen = [
  "Processor",
  "Motherboard",
  "Graphics card",
  "Memory",
  "Storage",
  "Power supply",
  "Case",
] as const;

export const skemaKomponen = z.object({
  nama: z
    .string()
    .trim()
    .min(3, "Nama komponen minimal 3 karakter")
    .max(100, "Nama komponen maksimal 100 karakter"),
  kategori: z.enum(kategoriKomponen, {
    error: "Pilih salah satu kategori komponen",
  }),
  harga: z.coerce
    .number({ error: "Harga wajib berupa angka" })
    .int("Harga harus berupa bilangan bulat")
    .min(10000, "Harga minimal Rp10.000")
    .max(100000000, "Harga maksimal Rp100.000.000"),
  deskripsi: z
    .string()
    .trim()
    .min(10, "Deskripsi minimal 10 karakter")
    .max(300, "Deskripsi maksimal 300 karakter"),
  tersedia: z.stringbool().default(false),
});

export type MasukanKomponen = z.infer<typeof skemaKomponen>;

export const skemaMasuk = z.object({
  email: z.email("Format email tidak valid"),
  kataSandi: z.string().min(8, "Kata sandi minimal 8 karakter"),
});
```

```typescript
// lib/status-form.ts
export type StatusForm = {
  galat?: Record<string, string[] | undefined>;
  pesan?: string;
  nilai?: Record<string, string>;
};
```

### Aturan Semantik yang Diperiksa di Server Action dan Alasannya

- **Aturan Semantik:** **Keunikan Nama Komponen (`namaSudahAda`)** — Nama komponen baru yang dikirimkan tidak boleh sama (tanpa membedakan huruf besar/kecil / *case-insensitive*) dengan nama komponen yang sudah terdaftar di dalam daftar katalog produk.
- **Lokasi Pemeriksaan:** Diperiksa di dalam **Server Action** (`simpanKomponen` pada `app/shop/actions.ts`) tepat setelah validasi bentuk `skemaKomponen.safeParse()` dinyatakan berhasil.
- **Alasan Pemisahan Validasi Bentuk dan Validasi Semantik:**
  1. **Validasi Bentuk (Sintaksis):** Skema Zod hanya memeriksa struktur, tipe data, panjang karakter, dan pilihan *enum* dari masukan `FormData` secara terisolasi tanpa menyentuh penyimpanan data.
  2. **Validasi Semantik ( Konteks Data Tersimpan):** Memeriksa apakah suatu nama komponen sudah digunakan memerlukan pembacaan/pencarian ke sumber data server (`mockProducts` di memori atau basis data pada modul berikutnya). Memisahkan keduanya mencegah kueri pencarian data yang sia-sia apabila format dasar masukan pengguna saja belum valid.

---

## 2. Alur Server Action

### Urutan Pemeriksaan di dalam Server Action

Setiap pemanggilan Server Action `simpanKomponen` mengeksekusi 5 tahapan secara berurutan:

| Urutan | Tahap Pemeriksaan / Aksi | Mekanisme Kode | Perilaku Bila Gagal |
| :---: | :--- | :--- | :--- |
| **1** | **Verifikasi Sesi** | `await bacaSesi()` | Mengembalikan `{ pesan: "Silakan masuk terlebih dahulu." }` dan menghentikan eksekusi sebelum memproses data. |
| **2** | **Validasi Bentuk (Skema Zod)** | `skemaKomponen.safeParse(mentah)` | Mengembalikan `{ galat: z.flattenError(hasil.error).fieldErrors, pesan: "Periksa kembali isian formulir.", nilai }` agar galat tampil per kolom dan isian pengguna tidak hilang. |
| **3** | **Validasi Semantik** | `namaSudahAda(hasil.data.nama)` | Mengembalikan `{ galat: { nama: ["Nama komponen sudah dipakai produk lain"] }, nilai }` khusus pada kolom `nama`. |
| **4** | **Mutasi Data** | `tambahKomponen(hasil.data)` di dalam blok `try { ... } catch (e) { ... }` | Mencatat detail galat di server dengan `console.error("simpanKomponen gagal:", e)` dan mengembalikan pesan umum `{ pesan: "Komponen gagal disimpan. Coba lagi.", nilai }` tanpa membocorkan *stack trace* ke klien. |
| **5** | **Revalidasi Cache & Redirect** | `revalidatePath("/shop")` lalu `redirect(\`/shop/\${id}\`)` **di luar blok `try`** | Menandai *cache* rute katalog agar dirender ulang dengan data terbaru, kemudian mengalihkan pengguna ke halaman detail komponen baru. |

> **Mengapa `redirect()` diletakkan di luar blok `try`?**  
> Di Next.js, fungsi `redirect()` bekerja dengan cara melempar *exception* internal khusus (`NEXT_REDIRECT`). Apabila `redirect()` diletakkan di dalam blok `try`, blok `catch (e)` akan menangkap *exception* tersebut sebagai kegagalan penyimpanan sehingga pengalihan halaman batal terjadi dan pengguna justru melihat pesan *"Komponen gagal disimpan"*.

```typescript
// app/shop/actions.ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { skemaKomponen } from "@/lib/skema";
import { bacaSesi } from "@/lib/sesi";
import { namaSudahAda, tambahKomponen } from "@/app/data/mock-products";
import type { StatusForm } from "@/lib/status-form";

export async function simpanKomponen(
  _sebelumnya: StatusForm,
  formData: FormData,
): Promise<StatusForm> {
  // 1. Pemeriksaan sesi
  if (!(await bacaSesi())) {
    return { pesan: "Silakan masuk terlebih dahulu." };
  }

  const mentah = Object.fromEntries(formData);
  const nilai = {
    nama: String(mentah.nama ?? ""),
    kategori: String(mentah.kategori ?? ""),
    harga: String(mentah.harga ?? ""),
    deskripsi: String(mentah.deskripsi ?? ""),
  };

  // 2. Validasi bentuk dengan Zod 4
  const hasil = skemaKomponen.safeParse(mentah);
  if (!hasil.success) {
    return {
      galat: z.flattenError(hasil.error).fieldErrors,
      pesan: "Periksa kembali isian formulir.",
      nilai,
    };
  }

  // 3. Validasi semantik (keunikan nama komponen)
  if (namaSudahAda(hasil.data.nama)) {
    return {
      galat: { nama: ["Nama komponen sudah dipakai produk lain"] },
      nilai,
    };
  }

  // 4. Mutasi penyimpanan data
  let id: string;
  try {
    id = tambahKomponen(hasil.data).id;
  } catch (e) {
    console.error("simpanKomponen gagal:", e);
    return { pesan: "Komponen gagal disimpan. Coba lagi.", nilai };
  }

  // 5. Revalidasi cache dan redirect (di luar blok try)
  revalidatePath("/shop");
  redirect(`/shop/${id}`);
}


```

### Pembagian Berkas: Server Component, Client Component, dan `"use server"`

| Berkas | Jenis Modul | Peran & Alasan Teknis |
| :--- | :--- | :--- |
| `app/shop/tambah/page.tsx` | **Server Component** | Memeriksa sesi aktif secara asinkron (`await bacaSesi()`), mengalihkan ke `/masuk` bila belum login, menampilkan email pengguna aktif, tombol keluar, serta merender `<FormKomponen />`. |
| `app/masuk/page.tsx` | **Server Component** | Menyediakan metadata halaman login dan merender kerangka statis pembungkus `<FormMasuk />`. |
| `app/components/FormKomponen.tsx` | **Client Component** (`"use client"`) | Menggunakan hook `useActionState(simpanKomponen, awal)` dari `'react'` untuk mengelola state galat per kolom, mempertahankan nilai input (`defaultValue` dan `key` pada `<select>`), menampilkan indikator `pending` (*"Menyimpan..."*), serta mengikat atribut aksesibilitas `aria-invalid`, `aria-describedby`, dan `role="status"`. |
| `app/components/FormMasuk.tsx` | **Client Component** (`"use client"`) | Menggunakan `useActionState(masuk, awal)` untuk menampilkan galat validasi email/kata sandi per kolom dan status autentikasi tanpa memuat ulang seluruh halaman. |
| `app/shop/actions.ts` | **Server Action** (`"use server"`) | Mengeksekusi `simpanKomponen` di sisi server (verifikasi sesi, validasi Zod, validasi semantik, mutasi data, `revalidatePath`, dan `redirect`). |
| `app/masuk/actions.ts` | **Server Action** (`"use server"`) | Mengeksekusi aksi `masuk` (verifikasi kredensial terhadap variabel lingkungan `.env.local` dan pembuatan sesi) serta aksi `keluar` (penghapusan sesi dan cookie). |
| `lib/sesi.ts` | **Server-Only Module** (`import "server-only"`) | Mengelola penyimpanan sesi di memori server (`globalThis`) dan manipulasi cookie HTTP melalui `cookies()` dari `next/headers`. Penanda `server-only` menjamin build gagal apabila berkas ini tidak sengaja terimpor ke Client Component. |
| `lib/skema.ts` & `lib/status-form.ts` | **Shared Schema & Type** | Mendefinisikan skema Zod 4 dan tipe TypeScript `StatusForm` yang aman diimpor oleh Server Action maupun komponen formulir. |

---

## 3. Bukti Uji Validasi

### Tabel Kasus Uji Validasi (10 Kasus Uji)

Pengujian dilakukan terhadap formulir tambah komponen baik pada kondisi normal maupun dengan **melewati validasi klien (menambahkan atribut `novalidate` pada elemen `<form>` melalui DevTools Elements)**:

| No | Skenario / Mode Uji | Masukan Uji (`nama`, `kategori`, `harga`, `deskripsi`, `tersedia`) | Hasil yang Diharapkan | Hasil Nyata | Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | **Data Sah Lengkap** | `nama`: `"ASUS ROG Strix B650E-F"`<br>`kategori`: `"Motherboard"`<br>`harga`: `4250000`<br>`deskripsi`: `"Motherboard ATX AM5 dengan dukungan PCIe 5.0 dan DDR5."`<br>`tersedia`: dicentang (`"on"`) | Komponen tersimpan, cache `/shop` direvalidasi, dan dialihkan ke halaman detail `/shop/[id]` produk baru. | Komponen berhasil disimpan dan langsung tampil di halaman detail `/shop/asus-rog-strix-b650e-f` serta katalog `/shop`. | Sesuai |
| **2** | **Validasi Semantik (Nama Duplikat)** | `nama`: `"AMD Ryzen 5 7600"` (sudah ada di katalog)<br>`kategori`: `"Processor"`<br>`harga`: `3150000`<br>`deskripsi`: `"Prosesor desktop 6-core untuk rancangan serbaguna."`<br>`tersedia`: dicentang | Ditolak di tahap validasi semantik Server Action; tampil galat `"Nama komponen sudah dipakai produk lain"` di bawah kolom nama; nilai kolom lain tetap terisi. | Tampil pesan `"Nama komponen sudah dipakai produk lain"` pada `#galat-nama`, pilihan kategori dan deskripsi tidak ter-reset. | Sesuai |
| **3** | **Validasi Semantik (Duplikat Beda Huruf Besar/Kecil)** | `nama`: `"amd ryzen 5 7600"`<br>`kategori`: `"Processor"`<br>`harga`: `3150000`<br>`deskripsi`: `"Prosesor desktop AM5 dengan 6 core dan 12 thread."`<br>`tersedia`: tidak dicentang | Ditolak oleh `namaSudahAda()` karena pemeriksaan bersifat *case-insensitive* (`toLowerCase()`). | Ditolak server dan menampilkan `"Nama komponen sudah dipakai produk lain"` di bawah kolom nama. | Sesuai |
| **4** | **Bypass Klien (`novalidate`) — Multi-kolom Tidak Sah Sekaligus** | `nama`: `"ab"` (2 karakter)<br>`kategori`: `""` (kosong)<br>`harga`: `5000`<br>`deskripsi`: 350 karakter (`"A".repeat(350)`) | Server menolak semua kolom yang melanggar aturan sekaligus dan mengembalikan galat spesifik pada masing-masing kolom. | Keempat pesan galat tampil serentak di bawah kolom masing-masing dan `aria-invalid="true"` aktif pada setiap input. | Sesuai |
| **5** | **Bypass Klien (`novalidate`) — Nama Terlalu Pendek** | `nama`: `"R5"` (2 karakter)<br>`kategori`: `"Processor"`<br>`harga`: `2500000`<br>`deskripsi`: `"Prosesor generasi terbaru untuk desktop."` | Ditolak Zod (`min(3)`); tampil galat `"Nama komponen minimal 3 karakter"`. | Tampil pesan `"Nama komponen minimal 3 karakter"` tepat di bawah kolom nama (`#galat-nama`). | Sesuai |
| **6** | **Bypass Klien (`novalidate`) — Kategori Kosong / Tidak Dipilih** | `nama`: `"Corsair RM750e Gold"`<br>`kategori`: `""` (kosong)<br>`harga`: `1650000`<br>`deskripsi`: `"Power supply modular ATX 3.0 efisiensi 80 Plus Gold."` | Ditolak Zod (`z.enum`); tampil galat `"Pilih salah satu kategori komponen"`. | Tampil pesan `"Pilih salah satu kategori komponen"` pada `#galat-kategori`. | Sesuai |
| **7** | **Bypass Klien (`novalidate`) — Deskripsi Terlalu Pendek (< 10 karakter)** | `nama`: `"Samsung 990 PRO 1TB"`<br>`kategori`: `"Storage"`<br>`harga`: `1850000`<br>`deskripsi`: `"SSD cepat"` (9 karakter) | Ditolak Zod (`min(10)`); tampil galat `"Deskripsi minimal 10 karakter"`. | Tampil pesan `"Deskripsi minimal 10 karakter"` pada `#galat-deskripsi`. | Sesuai |
| **8** | **Bypass Klien (`novalidate`) — Deskripsi Melebihi 300 Karakter** | `nama`: `"Noctua NH-D15 Chromax"`<br>`kategori`: `"Case"`<br>`harga`: `1550000`<br>`deskripsi`: Teks sepanjang 400 karakter | Ditolak Zod (`max(300)`); tampil galat `"Deskripsi maksimal 300 karakter"`. | Tampil pesan `"Deskripsi maksimal 300 karakter"` pada `#galat-deskripsi`. | Sesuai |
| **9** | **Bypass Klien (`novalidate`) — Harga di Bawah Batas Minimum** | `nama`: `"Thermal Paste Grizzly"`<br>`kategori`: `"Processor"`<br>`harga`: `0` (atau string kosong yang ter-coerce menjadi `0`)<br>`deskripsi`: `"Pasta termal konduktivitas tinggi untuk prosesor."` | Ditolak Zod (`min(10000)`); walaupun `""` diubah menjadi `0` oleh `z.coerce.number()`, aturan `.min(10000)` tetap menolaknya. | Ditolak server dengan pesan `"Harga minimal Rp10.000"` pada `#galat-harga`. | Sesuai |
| **10** | **Kolom Tambahan Asing (Injeksi Field via DevTools)** | Data sah ditambah `<input name="isAdmin" value="true" />` di dalam `<form>` | Zod `z.object()` secara bawaan membuang kunci yang tidak dikenal (*strip unknown keys*); komponen tersimpan tanpa properti `isAdmin`. | Komponen tersimpan normal dan properti `isAdmin` tidak ikut masuk ke objek produk di memori. | Sesuai |

### Rincian Pengujian Melewati Validasi Klien (`novalidate`)

Untuk membuktikan bahwa validasi di sisi server tetap bekerja meskipun validasi HTML5 di peramban dimatikan:
1. Membuka halaman tambah komponen dan membuka **Chrome DevTools > Panel Elements**.
2. Klik kanan pada elemen `<form>` lalu memilih **Add attribute** dan mengetikkan `novalidate`.
3. Mengirimkan formulir dengan kombinasi masukan tidak sah (Kasus Uji #4 s.d. #9 pada tabel di atas):
   - **Kasus `novalidate` 1 (Judul/Nama `"ab"`):** Server mengembalikan `"Nama komponen minimal 3 karakter"` dan memasang `aria-invalid="true"` serta `aria-describedby="galat-nama"`.
   - **Kasus `novalidate` 2 (Kategori tidak dipilih):** Server mengembalikan `"Pilih salah satu kategori komponen"` pada `#galat-kategori`.
   - **Kasus `novalidate` 3 (Deskripsi 400 karakter):** Server mengembalikan `"Deskripsi maksimal 300 karakter"` pada `#galat-deskripsi`.

### Tangkapan Layar Galat per Kolom

<img width="1916" height="866" alt="Screenshot 2026-10-30 060000" src="https://github.com/user-attachments/assets/2679a265-bdad-4fb4-9975-8ee6975de1ed" />
<img width="1917" height="863" alt="Screenshot 2026-10-30 055933" src="https://github.com/user-attachments/assets/265d2109-f945-47db-8c23-612a8f6e3c0c" />
<img width="1917" height="865" alt="Screenshot 2026-10-30 055905" src="https://github.com/user-attachments/assets/88bbfd34-b0ac-49b9-b225-2b36438dcb80" />
<img width="1901" height="867" alt="Screenshot 2026-10-30 010056" src="https://github.com/user-attachments/assets/357cb0f4-e622-4cad-85cb-cf8ae72ecbe7" />


---

## 4. Session dan Cookie

### Atribut Cookie Sesi dan Alasan Pemilihannya

Cookie sesi (`"sesi"`) dibuat di dalam fungsi `buatSesi()` pada `lib/sesi.ts` setelah pengguna berhasil masuk menggunakan akun demo (`.env.local`):

| Atribut Cookie | Nilai Konfigurasi | Alasan Pemilihan & Ancaman yang Dikurangi |
| :--- | :--- | :--- |
| **`HttpOnly`** | `httpOnly: true` | **Mencegah akses skrip klien:** Memastikan cookie tidak dapat dibaca melalui `document.cookie` di JavaScript peramban, sehingga memitigasi pencurian ID sesi apabila terjadi serangan **Cross-Site Scripting (XSS)**. |
| **`Secure`** | `secure: process.env.NODE_ENV === "production"` | **Enkripsi jalur transmisi:** Memastikan cookie hanya dikirim melalui koneksi terenkripsi HTTPS di lingkungan produksi (dengan tetap mengizinkan `http://localhost` saat pengembangan), sehingga mencegah penyadapan paket (**Man-in-the-Middle / Sniffing**) di jaringan publik. |
| **`SameSite`** | `sameSite: "lax"` | **Perlindungan lintas situs:** Mencegah pengiriman cookie pada permintaan lintas situs (*cross-site subrequests* seperti `fetch`/POST dari domain asing), namun tetap mengizinkan cookie dikirim saat pengguna melakukan navigasi tingkat atas (*top-level navigation*), sehingga menahan serangan **Cross-Site Request Forgery (CSRF)**. |
| **`Path`** | `path: "/"` | **Cakupan rute aplikasi:** Membuat cookie sesi berlaku dan dikirimkan pada seluruh rute di dalam domain aplikasi (`/shop`, `/shop/tambah`, `/masuk`, dll.). |
| **`Max-Age`** | `maxAge: 28800` (8 jam) | **Pembatasan masa aktif:** Membatasi umur cookie selama 8 jam (selaras dengan waktu kedaluwarsa di `Map` server) untuk mempersempit jendela eksploitasi apabila ID sesi dicuri (**Session Hijacking / Replay Attack**). |

### Tangkapan Layar Panel Application dan Header `Set-Cookie` (Nilai Disamarkan)

Pada pengujian login akun demo:
- **Header `Set-Cookie` di Panel Network (`POST /masuk`):**
  ```text
  Set-Cookie: sesi=████████-████-4███-████-████████████; Path=/; Max-Age=28800; HttpOnly; SameSite=lax
  ```
- **Pemeriksaan `document.cookie` di Panel Console:**
  Mengetikkan `document.cookie` di Console menghasilkan string kosong `""` (tidak memuat cookie `sesi` karena dilindungi atribut `HttpOnly`).

<img width="985" height="771" alt="Screenshot 2026-10-30 054757" src="https://github.com/user-attachments/assets/bfdb796b-52b5-4092-a990-d6debcbddb8a" />
<img width="983" height="791" alt="Screenshot 2026-10-30 054628" src="https://github.com/user-attachments/assets/50d33e8f-9286-410d-9fb1-1862de599362" />



### Hasil Uji Keamanan Sesi: Cookie Palsu, Logout, dan Cookie Lama Setelah Logout

| Skenario Uji | Langkah Pengujian | Hasil yang Diharapkan | Hasil Nyata |
| :--- | :--- | :--- | :--- |
| **1. Uji Cookie Palsu** | 1. Masuk dengan akun demo dan buka halaman tambah komponen.<br>2. Buka **DevTools > Application > Cookies**, ubah nilai cookie `sesi` menjadi string palsu (`palsu-12345`).<br>3. Isi formulir dengan data komponen yang sah lalu klik **Simpan**. | `proxy.ts` meloloskan permintaan karena cookie bernama `sesi` ada, tetapi `bacaSesi()` di dalam Server Action `simpanKomponen` tidak menemukan ID tersebut di `Map` server (`return null`), sehingga menolak penyimpanan. | Formulir menampilkan pesan status **`"Silakan masuk terlebih dahulu."`** dan komponen **tidak tersimpan** ke katalog. |
| **2. Uji Logout** | 1. Masuk dengan akun demo.<br>2. Pada halaman tambah komponen, klik tombol **Keluar** yang memanggil Server Action `keluar()`.<br>3. Periksa panel **Application > Cookies**. | Fungsi `hapusSesi()` menghapus entri sesi dari `Map` penyimpanan server sekaligus menghapus cookie `sesi` dari peramban (`toko.delete("sesi")`), lalu mengalihkan ke beranda `/`. | Cookie `sesi` terhapus dari daftar Cookies di DevTools dan pengguna dialihkan ke halaman beranda `/`. |
| **3. Uji Cookie Lama Setelah Logout (*Session Replay*)** | 1. Masuk dengan akun demo, lalu salin nilai asli UUID cookie `sesi` dari panel Application.<br>2. Klik tombol **Keluar** hingga sesi berakhir.<br>3. Tambahkan kembali cookie bernama `sesi` secara manual di panel **Application > Cookies** dengan menempelkan nilai UUID lama tadi.<br>4. Akses kembali halaman tambah komponen. | Meskipun `proxy.ts` melihat keberadaan cookie `sesi`, Server Component memanggil `await bacaSesi()` yang mengembalikan `null` karena ID sesi lama sudah dihapus dari `Map` server saat logout. | Pengguna langsung **dialihkan kembali (`redirect`) ke halaman `/masuk`** dan tidak dapat mengakses halaman tambah komponen. |

---

## 5. Keputusan Teknis

### 1. Alasan Pola Session di Server Dibandingkan Token di Cookie (*Stateless Token*)

Pada modul ini digunakan **pola session di sisi server (*stateful server-side session*)** di mana cookie peramban hanya menyimpan pengenal acak (`crypto.randomUUID()`), sementara data sesi (`{ email, kedaluwarsa }`) disimpan di memori server (`Map` pada `globalThis`):

1. **Pencabutan Sesi Instan (*Immediate Revocation*):**  
   Saat pengguna menekan tombol **Keluar** (`hapusSesi()`), server langsung menghapus entri ID sesi dari `Map` di memori (`penyimpanan.delete(id)`). Seperti dibuktikan pada **Uji Cookie Lama Setelah Logout**, sekalipun penyerang sempat mencuri dan menyimpan nilai cookie sebelum pengguna logout, cookie tersebut langsung tidak berlaku detik itu juga. Sebaliknya, pada pola *stateless token* (seperti JWT yang ditandatangani tanpa penyimpanan server), token yang sudah terlanjur dicuri tetap dianggap sah oleh server hingga waktu `exp` (kedaluwarsa) token tersebut habis, kecuali server menambahkan mekanisme *blacklist/denylist* yang pada akhirnya kembali membutuhkan penyimpanan di server.
2. **Kerahasiaan Data Sesi & Ukuran Cookie Minimal:**  
   Cookie hanya membawa UUID 36 karakter tanpa mengekspos alamat email, peran (*role*), atau metadata pengguna di sisi klien, sehingga meminimalkan beban *header* HTTP pada setiap permintaan.
3. **Ketahanan terhadap *Fast Refresh* saat Pengembangan:**  
   Penyimpanan `Map` diikatkan pada objek global (`globalThis.sesiTiruan`) agar data sesi pengguna yang sedang login tidak hilang setiap kali Next.js melakukan *Hot Module Replacement (HMR) / Fast Refresh* ketika kode diubah saat pengembangan.

### 2. Batas Peran `proxy.ts` Dibandingkan Pemeriksaan di Server Action

Sejak Next.js 16, `proxy.ts` (pengganti `middleware.ts`) berjalan di lapisan paling depan sebelum rute dirender, namun perannya dibatasi hanya sebagai **pemeriksaan optimistik (*optimistic check*)**, bukan pengganti verifikasi sesi di dalam Server Component maupun Server Action:

1. **`proxy.ts` Hanya Memeriksa Keberadaan Cookie, Bukan Kebenaran Sesi:**  
   Di dalam `proxy.ts`, pemeriksaan dilakukan dengan `request.cookies.has("sesi")` agar eksekusi navigasi sangat cepat tanpa membebani setiap permintaan rute dengan pencarian ke penyimpanan sesi/database. Akibatnya, `proxy.ts` hanya memastikan cookie bernama `"sesi"` dikirim oleh peramban, tetapi **tidak memverifikasi** apakah nilai UUID di dalamnya benar-benar terdaftar di `Map` server atau belum kedaluwarsa.
2. **Risiko Perubahan Konfigurasi `matcher`:**  
   Cakupan `proxy.ts` bergantung pada larik `config.matcher`. Jika pengembang menambahkan rute baru atau mengubah pola `matcher` tanpa sengaja, rute atau aksi dapat terlewat dari penjagaan `proxy.ts`.
3. **Server Action Adalah Endpoint HTTP POST Publik:**  
   Penyerang dapat mengirimkan permintaan `POST` dengan *header* `Cookie: sesi=palsu` langsung ke endpoint Server Action menggunakan `curl` atau skrip. Oleh sebab itu, verifikasi otoritatif melalui `await bacaSesi()` **wajib tetap dijalankan di baris pertama setiap Server Action** (`simpanKomponen`) dan di dalam Server Component halaman terlindungi sebagai pertahanan berlapis (*defense-in-depth*).

---

## 6. Kendala dan Penyelesaian

1. **Perilaku Reset Formulir Otomatis pada React 19 (`useActionState`):**
   - *Kendala:* Setelah Server Action mengembalikan pesan galat validasi, React 19 secara otomatis mengatur ulang (*reset*) seluruh elemen input dan `<select>` yang tidak terkendali (*uncontrolled*) ke keadaan kosong, sehingga pengguna harus mengetik ulang semua kolom dari awal.
   - *Penyelesaian:* Mengembalikan objek `nilai` (berisi string masukan mentah yang baru saja dikirim) dari Server Action saat validasi gagal, lalu memasangnya ke atribut `defaultValue={n?.nama}` pada `<input>`/`<textarea>`, serta menambahkan prop `key={n?.kategori ?? "awal"}` beserta `defaultValue` pada elemen `<select>` agar React merender ulang pilihan kategori terakhir pengguna.
2. **Pengalihan Halaman (`redirect`) Tertangkap sebagai Error Penyimpanan:**
   - *Kendala:* Apabila `redirect(\`/shop/\${id}\`)` dipanggil di dalam blok `try { ... } catch (e) { ... }`, proses pindah halaman gagal karena `redirect()` di Next.js bekerja dengan melempar *exception* internal yang ikut tertangkap oleh blok `catch`.
   - *Penyelesaian:* Memisahkan pendeklarasian variabel `let id: string;` di luar `try`, hanya membungkus operasi mutasi `tambahKomponen()` di dalam `try/catch`, dan memanggil `revalidatePath()` serta `redirect()` di bagian paling akhir di luar blok `try`.
3. **Perubahan API Zod 4 dibanding Contoh Dokumentasi Zod 3:**
   - *Kendala:* Beberapa metode lama seperti `error.flatten()`, `z.string().email()`, dan opsi `required_error` sudah ditandai usang (*deprecated*) atau dihapus pada Zod 4.
   - *Penyelesaian:* Menggunakan API tingkat atas Zod 4 yang baru, yaitu `z.flattenError(hasil.error).fieldErrors` untuk mengekstrak galat per kolom, `z.email()` untuk validasi email, parameter `{ error: "..." }` untuk pesan kustom, serta `z.stringbool().default(false)` untuk menangani nilai kotak centang (`"on"`) dari `FormData`.
4. **API `cookies()` yang Bersifat Asinkron di Next.js 16:**
   - *Kendala:* Memanggil `cookies().get("sesi")` secara sinkron memicu galat TypeScript `TS2339: Property 'get' does not exist on type 'Promise<ReadonlyRequestCookies>'`.
   - *Penyelesaian:* Selalu menambahkan kata kunci `await` sebelum memanggil `cookies()`, misalnya `(await cookies()).get("sesi")?.value`.

---

## 7. Catatan Pemanfaatan AI

- **Alat AI yang Digunakan:** Antigravity AI Assistant (Model: Gemini 4 Argon).
- **Perintah Utama (*Prompt*):**
  1. *"Susun Dokumen Teknis mengikuti kerangka di bawah (juga bagian H Modul 5). Simpan sebagai docs/praktikum/modul-05.md. Tolong jangan dikerjakan dulu, analisis dulu dan beri tahu saya apa yang akan dilakukan."*
  2. *"Ini berarti database dan cache gitu?"* (Diskusi konseptual mengenai perbedaan penyimpanan *in-memory* `Array`/`Map` di Modul 5 dan peran *cache revalidation* `revalidatePath`).
  3. *"Eksekusi dah"* (Penyusunan lengkap dokumen teknis `docs/praktikum/modul-05.md` berdasarkan spesifikasi produk ShiinaLab PC Builder dan rubrik Modul 5).
- **Bagian yang Digunakan:**
  - Penyelarasan tabel aturan validasi skema Zod 4 (`skemaKomponen` dan `skemaMasuk`) dengan struktur tipe produk pada proyek ShiinaLab PC Builder.
  - Penyusunan dokumentasi alur 5 langkah Server Action, pembagian batas Server/Client Component, matriks 10 kasus uji validasi (termasuk skenario bypass `novalidate`), serta analisis keputusan teknis (pola session di server vs token di cookie dan batas peran `proxy.ts`).
- **Cara Memverifikasi:**
  - Memeriksa kesesuaian seluruh sintaks Zod 4 (`z.flattenError`, `z.stringbool`, `z.email`, `safeParse`) terhadap dokumentasi resmi Zod 4 dan panduan Modul 5.
  - Memverifikasi urutan logika Server Action (pemeriksaan `bacaSesi()` di awal dan peletakan `revalidatePath` + `redirect` di luar blok `try/catch`).
  - Memastikan seluruh butir pada **Bagian H (Dokumen Teknis)** dan **Tabel 6 (Rubrik Dokumen Teknis Modul 5)** telah terjawab secara lengkap dan akurat.
