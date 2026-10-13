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

