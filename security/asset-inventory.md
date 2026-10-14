# Inventaris Aset ShiinaLab — `sec-0.1`

Inventaris ini mengikuti fitur yang benar-benar ada di ShiinaLab saat ini. Akun pengguna dan profil tersimpan di server; katalog, keranjang, dan pemeriksaan rakitan masih berupa demo. Belum ada checkout, pembayaran, data stok, atau penyimpanan rakitan ke akun.

Skala: 1 = rendah, 2 = sedang, 3 = tinggi. C = kerahasiaan, I = integritas, A = ketersediaan.

| ID | Aset | Lokasi / bentuk saat ini | C | I | A | Kenapa perlu dijaga |
|---|---|---|---:|---:|---:|---|
| A01 | Kredensial akun | Username dan hash password di SQLite; password asli tidak disimpan | 3 | 3 | 2 | Hash yang bocor tetap memberi penyerang bahan untuk mencoba menebak password; perubahan kredensial dapat mengunci pemilik akun. |
| A02 | Sesi login | Token acak ada di cookie browser; hash SHA-256 token dan masa berlaku disimpan di SQLite | 3 | 3 | 3 | Sesi yang dicuri dapat dipakai untuk bertindak sebagai pengguna sampai kedaluwarsa atau dicabut. |
| A03 | Profil pengguna | Username, nama, dan email di tabel `users` pada SQLite | 3 | 3 | 2 | Nama dan email adalah informasi pribadi; perubahan tanpa izin dapat merugikan pemilik akun. |
| A04 | Layanan akun dan aplikasi | Halaman Next.js, API akun, proses server, dan database SQLite lokal | 1 | 2 | 3 | Jika API atau file database tidak tersedia, pengguna tidak dapat masuk atau mengatur akunnya. |
| A05 | Rakitan tersimpan | Nama rakitan, anggaran, total, dan waktu simpan di `localStorage` browser | 1 | 2 | 1 | Data ini bukan data akun dan dapat diubah atau dihapus dari perangkat yang sama. |
| A06 | Katalog dan hasil kompatibilitas demo | Data komponen statis di aplikasi; pilihan/keranjang berjalan di browser | 1 | 2 | 1 | Data contoh yang berubah dapat membingungkan pengguna, tetapi belum mengubah stok atau transaksi sungguhan. |

## Perlindungan yang sudah ada dan yang belum ada

- Password di-hash menggunakan Argon2id. Ini hashing satu arah, bukan enkripsi.
- Token sesi dibuat acak; database menyimpan hash SHA-256-nya, bukan token mentah.
- Cookie sesi memakai `HttpOnly` dan `SameSite=Lax`; atribut `Secure` aktif saat `NODE_ENV=production`.
- HTTPS/TLS harus dipastikan pada hosting produksi. Pengaturan TLS di luar aplikasi belum diverifikasi dalam inventaris ini.
- File SQLite (`data/shiinalab.sqlite`) dan `localStorage` tidak dienkripsi oleh aplikasi. Hak akses file, enkripsi disk, dan backup terenkripsi perlu dipastikan terpisah.
- Aplikasi belum mencatat jejak audit khusus untuk perubahan profil, password, atau penghapusan akun.
- Jangan memasukkan data pembayaran, alamat pengiriman, stok, pesanan, atau integrasi payment gateway ke daftar aset saat ini: fitur-fitur tersebut belum berjalan.
