# Asset Inventory ShiinaLab

| ID | Aset | Jenis | C | I | A | Alasan |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| A08 | Data produk dan harga jual | Data | 1 | 3 | 3 | Data yang salah dapat menyesatkan pembeli dan memengaruhi transaksi. |
| A09 | Data stok komponen | Data | 1 | 3 | 3 | Stok harus akurat agar produk yang dipesan benar-benar tersedia. |
| A10 | Data pelanggan dan alamat pengiriman | Data | 3 | 3 | 2 | Informasi pribadi pelanggan harus dilindungi dari akses tidak sah. |
| A11 | Data pesanan dan riwayat transaksi | Data | 3 | 3 | 3 | Data pesanan harus akurat, terlindungi, dan tersedia untuk memproses pembelian. |
| A12 | Informasi status pembayaran | Data | 3 | 3 | 3 | Status pembayaran harus valid agar pesanan tidak salah diproses. |
| A13 | Layanan checkout dan pemesanan | Layanan | 2 | 3 | 3 | Gangguan atau manipulasi layanan dapat menghambat dan mengacaukan proses pembelian. |
| A14 | Integrasi penyedia pembayaran | Secrets | 3 | 3 | 2 | Kredensial integrasi yang bocor dapat disalahgunakan untuk mengakses layanan pembayaran. |

**Skala:** 1 \= Rendah, 2 \= Sedang, 3 \= Tinggi.  
**Keterangan:** C \= Kerahasiaan, I \= Integritas, A \= Ketersediaan.

**Perlindungan tambahan untuk toko online:**

- Data pelanggan dan pesanan hanya boleh diakses oleh pihak yang berwenang.  
- Komunikasi checkout menggunakan HTTPS/TLS.  
- Kredensial penyedia pembayaran disimpan secara aman dan tidak ditulis langsung di source code.  
- Status pembayaran harus diverifikasi melalui mekanisme tepercaya dari penyedia pembayaran.  
- Informasi kartu pembayaran tidak disimpan oleh ShiinaLab jika pemrosesannya diserahkan kepada penyedia pembayaran.

