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
