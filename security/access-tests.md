# Laporan Pengujian Kontrol Akses & Autentikasi (`sec-0.2`)
## Mata Kuliah: Keamanan Komputasi dan Siber (KKS) — Tugas 2

Dokumen ini memuat matriks hak akses berbasis peran (*Role-Based Access Control* / RBAC), pembuktian fungsi hash kata sandi lambat (*slow hashing*), serta laporan 10 skenario pengujian akses (5 pengujian positif dan 5 pengujian negatif) untuk memenuhi capaian Sub-CPMK 3 (tag `sec-0.2`). Seluruh kontrol merujuk pada register risiko Tugas 1 (`R01`, `R03`, `R04`).

---

## 1. Matriks Hak Akses Berbasis Peran (RBAC Matrix)

Sistem ShiinaLab menerapkan prinsip *Least Privilege* dengan membagi entitas pengguna ke dalam tiga tingkatan peran:
- **Tamu (*Guest*):** Pengguna publik yang belum terautentikasi.
- **Pengguna (*Customer / Authenticated User*):** Pengguna terdaftar dengan peran `user`.
- **Super Administrator (*Admin*):** Pengelola sistem dengan peran `admin`.

| Rute / Sumber Daya / Aksi | Tamu (*Guest*) | Pengguna Terdaftar (*User*) | Super Administrator (*Admin*) | Kontrol Keamanan & Risiko Terkait |
| :--- | :---: | :---: | :---: | :--- |
| **Lihat Katalog & Detail Komponen** (`/shop`, `/shop/[id]`) | **IZIN** (Read) | **IZIN** (Read) | **IZIN** (Read) | Akses publik untuk eksplorasi katalog produk. |
| **PC Builder Interaktif** (`/builder`) | **IZIN** (Simulate) | **IZIN** (Simulate) | **IZIN** (Simulate) | Simulasi perakitan dan cek watt/kompatibilitas. |
| **Kirim Ulasan Komponen** (`action: kirimUlasan`) | **TOLAK** (401/Login) | **IZIN** (Create) | **IZIN** (Create) | Mencegah ulasan spam dari bot anonim. |
| **Akses Dashboard Profil & Sesi** (`/account`) | **TOLAK** (Redirect `/masuk`) | **IZIN** (Read/Update Own) | **IZIN** (Read/Update Own) | Terisolasi per ID pengguna (`R04 / T02`). |
| **Ganti Kata Sandi Sendiri** (`action: gantiPassword`) | **TOLAK** (401) | **IZIN** (Update Own) | **IZIN** (Update Own) | Membutuhkan verifikasi kata sandi lama (`R01 / T01`). |
| **Akses Panel Manajemen Toko** (`/admin`) | **TOLAK** (Redirect `/masuk`) | **TOLAK** (403 Forbidden) | **IZIN** (Full Control) | Terproteksi otorisasi peran admin (`R04 / T02`). |
| **Tambah Komponen Baru** (`action: tambahKomponenAction`) | **TOLAK** (403) | **TOLAK** (403) | **IZIN** (Create) | Hanya admin yang boleh menambah inventaris. |
| **Edit Data Komponen** (`/shop/[id]/edit`) | **TOLAK** (403) | **TOLAK** (403) | **IZIN** (Update) | Integritas data katalog dari manipulasi harga. |
| **Hapus Komponen & Kaskade Ulasan** (`action: hapusKomponenAction`) | **TOLAK** (403) | **TOLAK** (403) | **IZIN** (Delete Atomic) | Proteksi integritas relasi referensial database. |
| **Akses Database Host Port 5432 Langsung** | **TOLAK** (Drop) | **TOLAK** (Drop) | **TOLAK** (Internal Only) | Port 5432 tidak dipublikasikan ke host/internet (`R03 / T06`). |

---

## 2. Bukti Penyimpanan Kata Sandi Menggunakan Hash Lambat (Argon2id)

Sesuai mitigasi risiko **R01 / T01** dan **R02 / T09**, seluruh kata sandi pengguna di ShiinaLab tidak pernah disimpan dalam bentuk plaintext maupun hash cepat (seperti MD5 / SHA-256) yang rentan terhadap serangan brute-force GPU/ASIC. Kata sandi diproses dengan algoritma pemenang *Password Hashing Competition*, yaitu **Argon2id** (RFC 9106) melalui pustaka `argon2` pada `app/masuk/actions.ts`.

### Parameter Teknis Argon2id yang Diterapkan:
- **Tipe Algoritma:** `argon2id` (Kombinasi ketahanan terhadap *side-channel cache attacks* dan *GPU memory-hard cracking*).
- **Format Hash Tersimpan:** Format standar Modular Crypt Format (PHC string).
- **Contoh Format Hash Sintetis pada Database:**
  ```text
  $argon2id$v=19$m=65536,t=3,p=4$qN8kU+2BvX7e1Y/w$9a8b7c6d5e4f3a2b1c0d...
  ```
- **Keterangan Parameter:**
  - `v=19`: Versi Argon2 0x13.
  - `m=65536`: Alokasi memori $64\text{ MB}$ per hashing (*memory-hard barrier* yang melumpuhkan GPU mining cluster).
  - `t=3`: 3 kali iterasi waktu komputasi (*time cost*).
  - `p=4`: 4 thread paralelisme.
  - Salt 16-byte unik acak dibangkitkan secara otomatis oleh pustaka per hashing.

---

## 3. Hasil Pengujian Kontrol Akses (10 Skenario: 5 Positif & 5 Negatif)

Pengujian dilakukan menggunakan akun uji sintetis untuk membuktikan bahwa seluruh akses sah diizinkan dan seluruh akses tidak sah **ditolak tegas (*fail-closed*)**:

| ID Uji | Tipe Pengujian | Peran Penguji | Jalur / Rute / Aksi | Hasil yang Diharapkan | Hasil Aktual | Status | ID Risiko |
| :---: | :---: | :---: | :--- | :--- | :--- | :---: | :---: |
| **AT-01** | **Positif** | Tamu (*Guest*) | Mengakses halaman katalog `/shop` | Server mengizinkan request, merender daftar produk publik tanpa meminta login. | Halaman `/shop` terbuka normal dan data produk tampil lengkap. | **LULUS** | - |
| **AT-02** | **Positif** | Pengguna (*User*) | Login akun terdaftar dan mengakses `/account` | Sesi terautentikasi dikenali; halaman profil memuat username & riwayat pengguna sendiri. | Profil pengguna berhasil dimuat dengan cookie HttpOnly aktif. | **LULUS** | R04 |
| **AT-03** | **Positif** | Pengguna (*User*) | Mengirim ulasan produk via form di `/shop/18` | Server Action menerima data ulasan berelasi karena pengguna telah terautentikasi. | Ulasan berhasil tersimpan dengan `komponenId = 18`. | **LULUS** | - |
| **AT-04** | **Positif** | Administrator | Mengakses panel dashboard admin `/admin` | Server memverifikasi `sesi.peran === "admin"`, dashboard manajemen inventaris terbuka. | Dashboard admin terbuka lengkap dengan tabel manajemen komponen. | **LULUS** | R04 |
| **AT-05** | **Positif** | Administrator | Melakukan aksi tambah komponen di `/admin` | Server Action memvalidasi data dan menyimpan komponen baru ke database. | Record komponen baru berhasil disimpan di PostgreSQL. | **LULUS** | - |
| **AT-06** | **Negatif** | Tamu (*Guest*) | Mengakses rute `/admin` tanpa cookie sesi | Server mendeteksi sesi kosong, menolak akses, dan me-redirect otomatis ke `/masuk`. | Akses ditolak; browser langsung dialihkan ke halaman login `/masuk`. | **LULUS** | R04 |
| **AT-07** | **Negatif** | Pengguna (*User*) | Mencoba membuka rute `/admin` | Server memeriksa peran `sesi.peran` $\neq$ `"admin"`, menolak akses dengan kode 403 Forbidden / redirect aman. | Akses ditolak; pengguna peran biasa dilarang mengakses panel admin. | **LULUS** | R04 |
| **AT-08** | **Negatif** | Tamu (*Guest*) | Menembak langsung Server Action `hapusKomponenAction(id)` | Server Action memeriksa autentikasi sebelum query Prisma, melempar pesan penolakan tidak sah. | Tindakan dibatalkan; database tidak mengalami perubahan data (*fail-closed*). | **LULUS** | R03 |
| **AT-09** | **Negatif** | Pengguna (*User*) | Mencoba mengubah password tanpa kata sandi lama yang benar | Server memverifikasi via `argon2.verify()`, kata sandi lama salah ditolak dengan galat. | Penolakan berhasil; kata sandi akun tidak berubah. | **LULUS** | R01 |
| **AT-10** | **Negatif** | Penyerang (*Attacker*) | Memalsukan Cookie Sesi (Tampered Session Cookie) | Server mencari ID sesi di tabel `SesiPengguna`; record tidak ditemukan, sesi hangus seketika. | Sesi dianggap kedaluwarsa/palsu; penyerang tetap berstatus Tamu (*Guest*). | **LULUS** | R04 |

> **Tingkat Keberhasilan:** 10 dari 10 skenario pengujian berhasil (**100% Lulus**).  
> **Komposisi Pengujian:** Tepat 5 uji positif dan 5 uji negatif (memenuhi syarat: uji negatif sama banyaknya dengan uji positif).
