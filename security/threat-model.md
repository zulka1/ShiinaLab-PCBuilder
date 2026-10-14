# Threat model ShiinaLab (`sec-0.1`)

## Batas penilaian

Ini memetakan ancaman yang masuk akal untuk aplikasi yang ada sekarang: akun dan profil sungguhan, builder/katalog demo, SQLite lokal, dan rakitan di browser. Bukan berarti serangan di bawah sudah pernah terjadi atau sudah berhasil. Pembayaran, checkout, stok, panel admin, dan rakitan tersimpan di akun belum menjadi bagian produk.

Skor kemungkinan dan dampak memakai skala 1–5: 1 = sangat rendah, 2 = rendah, 3 = sedang, 4 = tinggi, 5 = sangat tinggi. Skor angka membantu membandingkan; alasan dan batas produk tetap lebih penting daripada angkanya.

## Ancaman STRIDE

| ID | STRIDE | Skenario ancaman | Elemen DFD | Aset terdampak | Kemungkinan × dampak | Alasan dan perlindungan yang sudah ada |
|---|---|---|---|---|---|---|
| T01 | Spoofing | Penyerang mencoba password hasil kebocoran layanan lain atau menebak password untuk masuk sebagai pengguna. | P1, P2, D1; F3, F7 | A01, A02, A03 | 4 × 4 | Endpoint login tersedia untuk umum dan belum tampak pembatasan percobaan. Password Argon2id dan pesan login yang umum membantu, tetapi tidak mencegah percobaan berulang. |
| T02 | Spoofing | Token sesi dicuri lalu dipakai ulang untuk menyamar sebagai pemilik akun. | P1, P2, D1; F3, F7 | A02, A03 | 3 × 5 | Token acak, cookie `HttpOnly`/`SameSite=Lax`, dan hash token di database mengurangi risiko. Perangkat yang terinfeksi, akses fisik, atau koneksi tanpa TLS tetap dapat membahayakan sesi. |
| T03 | Tampering | Pengguna mengubah permintaan profil untuk mengirim username, nama, atau email yang tidak valid atau berbenturan dengan akun lain. | P1, P2, D1; F3, F7 | A03 | 2 × 3 | API memvalidasi input di server, memakai query berparameter, dan mengambil ID akun dari sesi. Input tidak tepercaya tetap perlu diuji karena data profil disimpan permanen. |
| T04 | Tampering | Isi rakitan pada `localStorage` diubah langsung sehingga nama, anggaran, atau total yang tampil tidak lagi cocok. | P3, D2; F6 | A05 | 3 × 2 | `localStorage` berada di perangkat pengguna dan bukan sumber data transaksi. Dampak saat ini terbatas pada rakitan lokal yang tampil keliru; jangan memakai nilainya sebagai dasar pembelian atau keputusan server. |
| T05 | Repudiation | Pengguna menyangkal perubahan profil, penggantian password, atau penghapusan akun karena aplikasi tidak punya jejak audit khusus untuk tindakan tersebut. | P2, D1 | A03, A04 | 4 × 3 | Database mencatat data akun, tetapi belum ada log audit yang mencatat aktor, tindakan, dan waktunya. Ini menyulitkan penelusuran insiden atau sengketa. |
| T06 | Information Disclosure | Seseorang yang memperoleh akses ke file SQLite atau salinannya membaca email/nama, hash password, dan hash token sesi. | P2, D1; F7 | A01, A02, A03 | 3 × 5 | Password di-hash dan token mentah tidak disimpan di DB, tetapi data profil dan file DB tidak dienkripsi oleh aplikasi. Hash password juga berisiko diserang secara offline jika file bocor. |
| T07 | Information Disclosure | Kredensial login atau cookie sesi terlihat di jaringan bila deployment produksi menerima koneksi tanpa HTTPS/TLS. | P1, P2, NET1; F2, F3 | A01, A02 | 2 × 5 | Cookie disetel `Secure` pada mode produksi, tetapi konfigurasi TLS hosting belum diverifikasi. Tanpa TLS, atribut cookie saja tidak melindungi kredensial saat dikirim. |
| T08 | Information Disclosure | Skrip berbahaya yang berjalan pada origin aplikasi membaca atau mengubah rakitan di `localStorage`. | P1, P3, D2; F6 | A05 | 2 × 2 | Rakitan tidak memuat password atau data akun dan React meng-escape teks saat dirender. Namun, `localStorage` tetap dapat diakses skrip pada origin yang sama. |
| T09 | Denial of Service | Bot membanjiri pendaftaran/login; pembuatan atau verifikasi hash Argon2id menghabiskan CPU server dan mengganggu layanan akun. | P2, D1; F3, F7 | A04, A01, A02 | 4 × 4 | Argon2id sengaja memakai sumber daya komputasi, sementara pembatasan laju dan batas konkurensi belum terlihat pada route. Endpoint pendaftaran juga terbuka. |
| T10 | Denial of Service | File database kehabisan ruang, terkunci, atau rusak sehingga login dan pengelolaan profil gagal. | P2, D1; F7 | A04, A01, A02, A03 | 3 × 4 | SQLite berjalan sebagai file lokal; belum ada mekanisme backup/pemulihan yang tercatat di aplikasi. Dampak operasionalnya mencakup semua akun pada instalasi itu. |
| T11 | Elevation of Privilege | Pengguna mencoba mengganti data akun milik pengguna lain dengan memanipulasi permintaan API (pelanggaran batas antar-akun). | P1, P2, D1; F3, F7 | A03 | 1 × 4 | Route profil saat ini memakai ID pengguna dari sesi, bukan ID yang dikirim klien. Itu perlindungan yang baik; risikonya rendah selama pola otorisasi ini konsisten di semua endpoint. |

Ancaman dengan skor dan alasan tertinggi dipilih sebagai risiko prioritas di [risk-register.md](./risk-register.md).
