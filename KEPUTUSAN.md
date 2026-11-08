# KEPUTUSAN.md — Arsitektur Kriptografi ShiinaLab (v0.2)
## Tugas 2: Enkripsi Terautentikasi (AEAD) dan Integritas Data

Dokumen ini mendokumentasikan keputusan arsitektur kriptografi, pemilihan mekanisme pengamanan, manajemen kunci, mitigasi risiko kegagalan parameter, serta skenario pengujian pada produk digital **ShiinaLab — PC Builder & Parts Store** untuk memenuhi capaian Sub-CPMK 3 (Milestone 2 - tag `v0.2`).

---

## 1. Pemetaan Kebutuhan $\rightarrow$ Mekanisme $\rightarrow$ Alasan (K1 — 20 Poin)

Sesuai prinsip pertahanan berlapis (*defense-in-depth*), setiap jenis data produk dilindungi menggunakan primitif kriptografi yang tepat sesuai karakteristik dan tujuannya:

| Jenis Data Produk | Kebutuhan Keamanan | Mekanisme Terpilih | Pustaka / Standar | Alasan & Justifikasi Pemilihan |
| :--- | :--- | :--- | :--- | :--- |
| **Password Akun Pengguna** (`User.passwordHash`) | Kerahasiaan satu arah (*irreversible*), ketahanan terhadap serangan offline brute-force & GPU/ASIC cracking. | **Argon2id** (Memory-hard password hashing) | RFC 9106, Pustaka `argon2` | Password **TIDAK BOLEH** disimpan dengan enkripsi dua arah (karena jika kunci bocor, seluruh password plaintext terbongkar). Password juga tidak boleh menggunakan hash cepat (MD5/SHA-256) yang rentan GPU rainbow table. Argon2id merupakan pemenang *Password Hashing Competition* (PHC) dengan trade-off memori dan waktu komputasi yang tinggi. |
| **Data Brankas Rakitan PC Sensitif** (*Client Blueprint Vault, Custom Rig Specs, Catatan Rahasia Pembeli*) | Kerahasiaan (*confidentiality*) dan Integritas (*authenticity*) data rahasia. | **AEAD AES-256-GCM** (*Galois/Counter Mode*) | NIST SP 800-38D, Node.js `node:crypto` standard library | Data rakitan custom perlu didekripsi kembali oleh pemilik sah (*reversible*), sehingga hash tidak dapat digunakan. Enkripsi simetris tradisional (seperti AES-CBC tanpa MAC) rentan terhadap manipulasi bit (*bit-flipping attacks*) dan *padding oracle*. AES-256-GCM menggabungkan enkripsi stream CTR dengan integritas GMAC dalam satu operasi primitif standar industri dengan akselerasi perangkat keras AES-NI. |
| **Pemisahan Kunci per Tujuan** (*Domain Key Separation*) | Mencegah penggunaan satu kunci yang sama untuk berbagai fungsi kriptografi yang berbeda. | **HKDF-SHA256** (*HMAC-based Extract-and-Expand Key Derivation Function*) | RFC 5869, Node.js `crypto.hkdfSync` | Menggunakan master key yang sama untuk enkripsi data, tanda tangan, dan penyimpanan lain melanggar prinsip *cryptographic domain separation*. HKDF menurunkan sub-kunci turunan dengan parameter *salt* dan *info/purpose* spesifik secara matematis independen. |
| **Token Sesi Login** (*Session ID Cookie*) | Kerahasiaan identitas sesi, ketahanan dari tebakan penyerang (*unpredictability*). | **CSPRNG 128-bit Random UUID** | W3C Crypto API / `crypto.randomUUID()` | Token sesi harus memiliki entropi penuh agar penyerang tidak dapat melakukan *session hijacking* atau menebak urutan ID sesi. |
| **Integritas Konteks Data** | Mencegah pemindahan ciphertext ke kepemilikan/pengguna lain (*context replay attack*). | **AAD** (*Additional Authenticated Data*) | Bagian integral dari AEAD AES-GCM | Metadata seperti `userId` atau `purpose` diautentikasi oleh tag GCM tanpa dienkripsi, memastikan ciphertext hanya valid untuk pemilik dan konteks yang dimaksud. |

---

## 2. Implementasi Mekanisme & Parameter Kriptografi (K2 — 30 Poin)

Seluruh implementasi AEAD dibangun secara konsisten menggunakan pustaka resmi **Node.js standard library (`node:crypto`)** pada berkas [`lib/crypto.ts`](file:///d:/KULIAH/5/project/shiinalab-pcbuilder/lib/crypto.ts) tanpa dependensi eksternal pihak ketiga yang rentan:

### Parameter Teknis AEAD:
1. **Algoritma:** `AES-256-GCM` (`ALGORITMA_AEAD = "aes-256-gcm"`).
2. **Panjang Kunci:** 256 bits (32 bytes), memenuhi rekomendasi NIST untuk perlindungan jangka panjang.
3. **Panjang Nonce / Initialization Vector (IV):** Tepat **96 bits (12 bytes)** dibangkitkan secara unik menggunakan CSPRNG (`crypto.randomBytes(12)`).
   > *Catatan NIST SP 800-38D:* IV 12 bytes diproses langsung oleh fungsi GMAC tanpa perlu hashing tambahan (GHASH), menghasilkan kinerja tercepat dan keamanan optimal.
4. **Panjang Authentication Tag:** **128 bits (16 bytes)** (`authTagLength: 16`), memastikan probabilitas pemalsuan tag acak adalah $1 / 2^{128}$ (praktis mustahil dipalsukan).
5. **Additional Authenticated Data (AAD):** String konteks eksplisit (contoh: `context:user-vault:v0.2`) yang dimasukkan ke `cipher.setAAD()` sebelum enkripsi dan diverifikasi otomatis oleh `decipher.setAAD()` sebelum dekripsi.
6. **Sifat Gagal Tertutup (*Fail-Closed*):** Jika verifikasi tag gagal (data dirusak, tag dipalsukan, AAD tidak cocok, atau kunci salah), sistem melempar galat khusus `AutentikasiGagalError` dan **sama sekali tidak mengembalikan cuplikan data plaintext** (*zero partial decryption leaks*).

---

## 3. Penanganan Masukan dan Manajemen Kunci (K3 — 15 Poin)

### A. Penyimpanan Kunci di Luar Repository
- **Kunci Rahasia:** Master key **TIDAK PERNAH** disimpan di dalam kode sumber (*hardcoded*).
- **Environment Variable:** Kunci disimpan di berkas `.env` dengan variabel `APP_ENCRYPTION_KEY`.
- **Proteksi Git:** Berkas `.env` telah tercantum di dalam `.gitignore` sehingga tidak akan pernah ter-commit ke GitHub.
- **Contoh Konfigurasi:** Template berkas `.env.example` disediakan tanpa nilai rahasia aktual:
  ```env
  APP_ENCRYPTION_KEY="kunci_rahasia_32_byte_dari_csprng_di_sini"
  ```

### B. Pembangkitan Kunci CSPRNG
Kunci diproduksi menggunakan generator bilangan acak semu kriptografis (*Cryptographically Secure Pseudo-Random Number Generator*):
```bash
# Perintah pembangkitan kunci 256-bit acak hex
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### C. Pemisahan Kunci Menggunakan HKDF (RFC 5869)
Setiap operasi enkripsi menurunkan sub-kunci turunan spesifik menggunakan fungsi `turunkanKunci()`:
$$\text{DerivedKey} = \text{HKDF-Expand}(\text{HKDF-Extract}(\text{salt}, \text{MasterKey}), \text{"shiinalab-purpose:"} \parallel \text{tujuan}, 32)$$
Hal ini menjamin bahwa kebocoran kunci pada satu modul tidak akan mengompromikan modul lainnya.

---

## 4. Bahaya Penyalahgunaan Parameter: Dampak Nonce Reuse (K5 Analisis Risiko)

Pada mode **AES-GCM (Galois/Counter Mode)**, keunikan Nonce/IV adalah batasan keamanan paling kritis. Jika nonce yang sama digunakan kembali (*nonce reuse*) dengan kunci yang sama untuk mengenkripsi dua pesan berbeda ($P_1$ dan $P_2$):

1. **Kehilangan Kerahasiaan (Two-Time Pad Attack):**  
   AES-GCM mengenkripsi data seperti stream cipher: $C_1 = P_1 \oplus \text{Keystream}$ dan $C_2 = P_2 \oplus \text{Keystream}$. Jika nonce berulang, $\text{Keystream}$ yang dihasilkan identik. Akibatnya:
   $$C_1 \oplus C_2 = (P_1 \oplus \text{Keystream}) \oplus (P_2 \oplus \text{Keystream}) = P_1 \oplus P_2$$
   Penyerang dapat merekonstruksi kedua teks asli secara komputasi (*known-plaintext attack*).
2. **Kehilangan Integritas Total (Pemalsuan Tag GMAC):**  
   Pengulangan nonce memungkinkan penyerang menyelesaikan persamaan polinomial atas Galois Field $GF(2^{128})$ untuk menemukan kunci hash otentikasi ($H$). Setelah $H$ diketahui, penyerang dapat **memalsukan tag autentikasi valid untuk ciphertext arbitrer apa pun**, menghancurkan seluruh jaminan integritas data aplikasi.

> **Mitigasi di ShiinaLab:**  
> Fungsi `enkripsiAEAD()` membangkitkan IV 12-byte baru dari `crypto.randomBytes(12)` **pada setiap kali enkripsi dipanggil**. Probabilitas tabrakan nonce 96-bit secara acak adalah $\approx 1 / 2^{48}$ sesuai *Birthday Paradox*, yang aman hingga miliaran operasi enkripsi.

---

## 5. Hasil Skenario Pengujian Otomatis (K4 — 25 Poin)

Seluruh pengujian dapat dijalankan ulang secara otomatis melalui skrip [`scripts/test-crypto.ts`](file:///d:/KULIAH/5/project/shiinalab-pcbuilder/scripts/test-crypto.ts) menggunakan perintah:
```bash
npm test
# atau
npm run test:crypto
```

### Tabel Hasil Eksekusi Pengujian:

| ID Skenario | Kategori Pengujian | Deskripsi & Kondisi Uji | Perilaku yang Diharapkan | Hasil Aktual | Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **TC-01** | Fungsional Positif | Enkripsi dan Dekripsi Normal (Roundtrip) | Plaintext terenkripsi dengan IV & Tag acak, lalu didekripsi kembali menghasilkan data yang identik 100%. | Plaintext berhasil didekripsi utuh tanpa distorsi. | **LULUS** |
| **TC-02** | Keamanan Negatif | Modifikasi Ciphertext (Bit-Flipping Attack) | 1 byte terakhir ciphertext diubah (`^= 0xff`). Dekripsi harus gagal secara fail-closed. | Melempar `AutentikasiGagalError` seketika; tidak ada data bocor. | **LULUS** |
| **TC-03** | Keamanan Negatif | Pemalsuan Auth Tag (Tampered Tag) | 1 bit pada authentication tag 128-bit diubah (`^= 0x01`). | GCM menolak tag palsu dan melempar `AutentikasiGagalError`. | **LULUS** |
| **TC-04** | Keamanan Negatif | Kunci yang Salah (Wrong Master Key) | Dekripsi ciphertext menggunakan kunci acak 32-byte lain yang tidak berhak. | Dekripsi ditolak pada tahap verifikasi tag GCM. | **LULUS** |
| **TC-05** | Integritas Konteks | Modifikasi AAD (Context Replay Attack) | Ciphertext valid dari user ID `42` dicoba didekripsi dengan AAD user ID `99`. | Perbedaan AAD menyebabkan verifikasi tag gagal total. | **LULUS** |
| **TC-06** | Karakteristik Keamanan | Verifikasi Keunikan Nonce (Fresh CSPRNG) | Data yang sama dienkripsi 2 kali berurutan. | IV, Ciphertext, dan Auth Tag kedua operasi berbeda total 100%. | **LULUS** |

> **Ringkasan Tingkat Kelulusan:** 6 dari 6 Skenario Pengujian Berhasil (**100% Lulus**, memenuhi kriteria 80–100% rubrik K4).

---

## 6. Panduan Demonstrasi Individual (3 Menit)

Saat demonstrasi tatap muka pekan 6 di hadapan dosen:
1. **Menunjukkan Lokasi Kunci (Menit 0:00 - 0:45):**
   - Tunjukkan berkas `.env` lokal yang memuat `APP_ENCRYPTION_KEY`.
   - Tunjukkan berkas `.gitignore` untuk membuktikan baris `.env` terisolasi dari repository publik.
   - Buka `lib/crypto.ts` pada fungsi `ambilMasterKey()` dan `turunkanKunci()` untuk menunjukkan mekanisme HKDF.
2. **Menjalankan Pengujian Otomatis (Menit 0:45 - 2:00):**
   - Jalankan terminal: `npm test`.
   - Perlihatkan output visual hijau: 6/6 skenario uji berhasil.
   - Sorot pengujian negatif **TC-02** (ciphertext rusak ditolak) dan **TC-04** (salah kunci ditolak) yang membuktikan sifat *fail-closed*.
3. **Menjelaskan Nonce Reuse & AAD (Menit 2:00 - 3:00):**
   - Jelaskan bahaya Two-Time Pad attack jika nonce berulang pada AES-GCM.
   - Tunjukkan pembuktian skenario **TC-06** bahwa setiap panggilan enkripsi selalu membangkitkan IV unik 12-byte baru melalui CSPRNG.
