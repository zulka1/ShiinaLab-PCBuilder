## Pengujian

1. Enkripsi lalu dekripsi dengan frasa kunci yang sama menghasilkan data rakitan semula.
2. Frasa kunci yang salah membuat dekripsi ditolak.
3. Perubahan ciphertext terdeteksi oleh autentikasi GCM dan dekripsi ditolak.
4. Enkripsi berulang atas data yang sama menghasilkan salt, IV, dan ciphertext berbeda.

Hasil terakhir: **4 tes lulus, 0 gagal**.

## Analisis mode operasi

ECB tidak digunakan. Dalam ECB, blok plaintext yang berulang menghasilkan blok ciphertext yang sama; pola isi data dapat terlihat walaupun ciphertext tidak dapat dibaca langsung. Fitur ini menggunakan GCM, yang menyediakan kerahasiaan sekaligus autentikasi sehingga perubahan ciphertext atau tag dapat diketahui.

IV GCM harus unik untuk setiap enkripsi dengan kunci yang sama. Implementasi ini menghasilkan IV acak 96-bit dan salt baru untuk setiap penyimpanan; pengulangan IV tetap harus dihindari karena penggunaan ulang dengan kunci yang sama dapat merusak jaminan keamanan GCM. Frasa kunci yang terlupa tidak dapat dipulihkan dari ciphertext.

Data lama yang tersimpan sebagai JSON plaintext tetap dapat dibaca sebagai migrasi kompatibilitas. Data tersebut dienkripsi ulang saat rakitan berikutnya disimpan. Enkripsi pada browser ini melindungi data tersimpan dari pembacaan langsung di `localStorage`, tetapi tidak melindungi dari skrip berbahaya yang berjalan di origin yang sama atau perangkat yang telah dikompromikan.
