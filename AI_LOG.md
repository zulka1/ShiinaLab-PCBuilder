# AI\_LOG.md

## 2026-10-13 — Tugas 1 (tag v0.1): perencanaan

- Tool : Claude (Anthropic), model Claude Sonnet 5.5, lewat claude.ai  
- Tujuan : merancang kebutuhan kriptografi dan komponen kriptografi dasar untuk ShiinaLab sesuai ketentuan tugas, serta memahami arti ketentuan uji otomatis  
- Ringkasan prompt :  
  1. Meminta penjelasan rencana pengerjaan tugas kriptografi untuk web rakit PC sebelum membuat apa pun  
  2. Menanyakan arti "minimal 4 skenario uji otomatis, minimal 3 berhasil, termasuk 1 uji negatif atau uji batas"  
  3. Melampirkan asset-inventory.md dan dfd.md agar rancangan mengikuti dokumen tim  
  4. Menanyakan apakah kolom "mekanisme" berarti memakai sistem enkripsi yang sudah ada  
  5. Memutuskan memulai dari fitur akun pengguna (daftar dan login)  
- Bagian yang digunakan :  
  - Usulan tabel kebutuhan (data, tujuan keamanan, prioritas) yang diturunkan dari asset-inventory.md dan dfd.md  
  - Usulan tiga komponen: hash password Argon2id, verifikasi webhook pembayaran HMAC-SHA256, enkripsi backup AES-256-GCM  
  - Usulan tujuh skenario uji (4 positif, 3 negatif atau batas)  
  - Usulan memulai dari akun pengguna dengan cakupan kecil (daftar dan login, SQLite untuk demo)  
- Bagian yang diubah : implementasi akun pada proyek ShiinaLab: pendaftaran dan login menggunakan Argon2id, sesi login berbasis cookie HttpOnly, halaman profil, ubah nama/email/username dan password, logout, serta hapus akun dengan konfirmasi. Database SQLite membuat tabel sesi dan menambahkan kolom profil secara otomatis. Halaman dan navigasi akun disesuaikan dengan tampilan proyek. Penyimpanan rakitan per akun (Tahap 5\) belum dibuat; rakitan tetap tersimpan di browser.  
- Verifikasi : npm run lint, npx tsc \--noEmit, dan npm run build berhasil. Uji API manual juga berhasil untuk daftar, login, membaca dan mengubah profil, penolakan email duplikat tanpa membedakan kapitalisasi, logout, penggantian password yang mengakhiri sesi, dan penghapusan akun. Akun sementara yang dipakai untuk pengujian telah dibersihkan.

## 2026-10-14 — Threat model (`sec-0.1`)

- Tool: Copilot SDK di VS Code.
- Tujuan: memperbarui inventaris aset dan DFD agar sesuai fitur ShiinaLab yang berjalan, lalu menyusun ancaman STRIDE, lima risiko prioritas, dan rencana kontrol untuk Tugas 2/3.
- Ringkasan prompt: menjelaskan tugas dengan bahasa sederhana, kemudian meminta dokumen keamanan dibuat dengan bahasa Indonesia yang mudah dipahami.
- Bagian yang digunakan: pemetaan fitur akun dan profil, autentikasi Argon2id, cookie sesi, database SQLite, builder/katalog demo, serta penyimpanan rakitan di `localStorage`.
- Bagian yang dibuat/diperbarui: `security/asset-inventory.md`, `security/dfd.md`, `security/threat-model.md`, dan `security/risk-register.md`.
- Batasan yang dicatat: checkout, pembayaran, stok, panel admin, dan penyimpanan rakitan ke akun belum berjalan; ancaman ditulis sebagai skenario risiko, bukan klaim bahwa serangan telah terjadi.
- Verifikasi: peninjauan isi dokumen terhadap route API, implementasi sesi/database, builder, dan data katalog yang ada. Perubahan dokumentasi saja; belum menjalankan tes aplikasi.

## 2026-11-08 — Tugas 2 Kriptografi & PAW (tag `v0.2`)

- Tool: Antigravity (Google DeepMind)
- Tujuan: 
  1. Mengimplementasikan enkripsi terautentikasi (AEAD AES-256-GCM) untuk perlindungan kerahasiaan dan integritas data rakitan PC sensitif serta data konfigurasi pengguna.
  2. Menyusun dokumen arsitektur kriptografi `KEPUTUSAN.md` yang memetakan kebutuhan, mekanisme (Argon2id, AES-256-GCM, HMAC-SHA256, CSPRNG, HKDF), dan justifikasi teknis fail-closed.
  3. Membangun rangkaian pengujian otomatis AEAD (positive encryption/decryption, tampered ciphertext, tampered auth tag, wrong key, AAD mismatch, dan pencegahan nonce reuse).
  4. Melengkapi pengujian 10 skenario CRUD & Relasional PostgreSQL-Prisma pada PAW serta pembuktian validasi server Zod.
- Ringkasan prompt:
  1. Menganalisis rubrik Tugas 2 Kriptografi dan Tugas 2 PAW dari berkas panduan e-learning.
  2. Merancang modul kriptografi mandiri `lib/crypto.ts` berbasis Node.js standard library `node:crypto` tanpa dependensi eksternal yang rentan.
  3. Menyiapkan skrip uji otomatis `scripts/test-crypto.ts` dengan penanganan gagal tertutup (fail-closed) dan pesan galat spesifik.
  4. Mendokumentasikan 10 skenario uji PAW dan memperbarui `README.md` untuk rilis tag `v0.2`.
- Bagian yang digunakan:
  - Primitif kriptografi resmi Node.js: `crypto.createCipheriv`, `crypto.createDecipheriv`, `crypto.randomBytes`, dan `crypto.hkdfSync`.
  - Skema relasi Prisma `Komponen` dan `Ulasan` beserta Zod validation di `lib/validasi.ts`.
- Bagian yang diubah/dibuat:
  - `lib/crypto.ts`: fungsi `enkripsiAEAD`, `dekripsiAEAD`, dan derivasi kunci `turunkanKunciHKDF`.
  - `KEPUTUSAN.md`: dokumentasi lengkap pemetaan kriptografi, parameter (panjang kunci 256-bit, IV 96-bit, tag 128-bit, AAD context), dan analisis risiko bila nonce berulang.
  - `scripts/test-crypto.ts`: 5 skenario uji otomatis dengan pelaporan warna terminal yang dapat diulang kapan saja.
  - `docs/Pemrograman-aplikasi-dan-web/Tugas2/pengujian-paw-v0.2.md` & `README.md`: dokumentasi skenario pengujian CRUD PAW dan bukti penolakan validasi server.
- Verifikasi: Menjalankan eksekusi uji otomatis AEAD (`npx tsx scripts/test-crypto.ts`), verifikasi `npx tsc --noEmit` bersih tanpa galat, dan uji alur validasi server Zod.
