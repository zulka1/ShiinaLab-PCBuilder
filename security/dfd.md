## DFD ShiinaLab — PC Builder & Parts Store

flowchart TD

    U\[Pengguna\]

    A\[Administrator\]

    PG\[External Entity: Penyedia Pembayaran\]

    P1((P1: Input dan Validasi Rakitan))

    P2((P2: Analisis Kompatibilitas))

    P3((P3: Katalog dan Detail Produk))

    P4((P4: Checkout dan Pemesanan))

    P5((P5: Verifikasi Pembayaran))

    P6((P6: Pengelolaan Produk dan Stok))

    D1\[(D1: Data Komponen dan Harga)\]

    D2\[(D2: Data Rakitan)\]

    D3\[(D3: Data Pelanggan)\]

    D4\[(D4: Data Pesanan dan Transaksi)\]

    D5\[(D5: Log Aplikasi)\]

    D6\[(D6: Backup Data)\]

    U \--\>|Pilihan komponen| P1

    P1 \--\>|Data komponen| D1

    D1 \--\>|Spesifikasi komponen| P1

    P1 \--\> P2

    P2 \--\>|Hasil analisis| U

    U \--\>|Simpan rakitan| D2

    U \--\>|Cari dan pilih produk| P3

    P3 \--\>|Baca katalog dan stok| D1

    D1 \--\>|Detail produk dan harga| P3

    P3 \--\>|Informasi produk| U

    U \--\>|Data checkout dan alamat| P4

    P4 \--\>|Simpan data pelanggan| D3

    P4 \--\>|Buat pesanan| D4

    P4 \--\>|Permintaan pembayaran| PG

    PG \--\>|Status pembayaran| P5

    P5 \--\>|Perbarui status pesanan| D4

    P5 \--\>|Konfirmasi status| U

    A \--\>|Kelola produk, harga, stok| P6

    P6 \--\>|Perbarui katalog dan stok| D1

    P1 \--\>|Catatan aktivitas| D5

    P3 \--\>|Catatan aktivitas| D5

    P4 \--\>|Catatan pesanan| D5

    P5 \--\>|Catatan pembayaran| D5

    D1 \-.-\>|Pencadangan| D6

    D2 \-.-\>|Pencadangan| D6

    D3 \-.-\>|Pencadangan| D6

    D4 \-.-\>|Pencadangan| D6

## Data yang Dilindungi dengan Kriptografi

| Data | Mekanisme Perlindungan |
| :---- | :---- |
| Kata sandi pengguna | Password hashing, jika fitur login tersedia. |
| Data pelanggan saat dikirim | HTTPS/TLS. |
| Kredensial penyedia pembayaran | Secret manager atau environment variables. |
| Status pembayaran | Verifikasi melalui API tepercaya atau tanda tangan webhook yang valid jika didukung penyedia. |
| Backup data pelanggan dan pesanan | Enkripsi saat disimpan. |
| Log transaksi | Kontrol akses dan mekanisme pemeriksaan integritas jika diperlukan. |

