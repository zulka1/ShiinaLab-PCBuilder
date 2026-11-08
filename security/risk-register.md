# Risk Register ShiinaLab (`sec-0.2`)

Skor risiko = kemungkinan × dampak, masing-masing pada skala 1–5. Register ini diperbarui untuk Milestone 2 (`sec-0.2`) dengan merefleksikan kontrol hardening OS, container non-root, enkripsi data, dan kontrol akses RBAC yang telah diterapkan.

**Arti skala singkat:** 
- **Kemungkinan:** 1 = jarang, 3 = mungkin, 5 = sangat mudah / sering
- **Dampak:** 1 = gangguan kecil, 3 = mengganggu satu pengguna / sebagian layanan, 5 = pengambilalihan akun / data penting atau gangguan besar.

---

## Tabel Register Risiko & Status Mitigasi (`sec-0.2`)

| Prioritas | ID Risiko / Ancaman | Deskripsi Risiko Awal | Skor Awal | Kontrol yang Diterapkan pada `sec-0.2` | Kemungkinan Akhir | Dampak Akhir | Skor Baru | Status Mitigasi |
|---:|---|---|---:|---|---:|---:|---:|:---:|
| 1 | **R01 / T01** | Password mudah ditebak / credential stuffing. Route login publik rentan brute force. | 16 (4 × 4) | Password hashing lambat dengan **Argon2id** (memory-hard 64MB, t=3, p=4) diterapkan di `app/masuk/actions.ts`. Pesan error umum tanpa membocorkan keberadaan username/email. | 2 | 4 | 8 | **Terkontrol Sebagian** *(Rate-limiting lanjutan di Tugas 3)* |
| 2 | **R02 / T09** | ReDoS / CPU exhaustion via hashing requests berulang. | 16 (4 × 4) | Validasi Zod ketat di sisi server membatasi panjang input password sebelum proses hash dieksekusi. | 3 | 4 | 12 | **Dalam Pantauan** *(Pembatasan rate limit di Tugas 3)* |
| 3 | **R03 / T06** | File database / host diakses pihak tidak berwenang; pembocoran data sensitif. | 15 (3 × 5) | **Selesai di `sec-0.2`:** Port PostgreSQL 5432 tidak dipublikasikan ke host (internal bridge only). Kontainer berjalan sebagai pengguna **non-root** (`nextjs` UID 1001), `cap_drop: ALL`, `no-new-privileges: true`. Data rakitan sensitif dienkripsi terautentikasi dengan **AEAD AES-256-GCM** di `lib/crypto.ts`. Lynis hardening index mencapai **78**. | 1 | 5 | **5** | **TERKONTROL PENUH** |
| 4 | **R04 / T02** | Pembajakan sesi / eskalasi hak akses (*Privilege Escalation*). | 15 (3 × 5) | **Selesai di `sec-0.2`:** Implementasi RBAC ketat (Guest, User, Admin) di `lib/sesi.ts` dan `app/admin/page.tsx`. Seluruh akses tidak sah ditolak tegas (*fail-closed*) dan terbukti lewat 10 skenario uji di `security/access-tests.md`. Cookie sesi dilindungi `HttpOnly`, `SameSite=lax`, dan ID sesi dibangkitkan dengan CSPRNG. | 1 | 5 | **5** | **TERKONTROL PENUH** |
| 5 | **R05 / T05** | Ketiadaan jejak audit atas aksi kritis pada akun atau data inventaris. | 12 (4 × 3) | Pencatatan transaksional atomik via Prisma `$transaction` dan penanganan error terstruktur. | 3 | 3 | 9 | **Direncanakan** *(Logging audit khusus di Tugas 3)* |

---

## Catatan Evaluasi & Validasi Teknis (`sec-0.2`)

1. **Efektivitas Kontrol R03 & R04:**  
   Penerapan kontrol akses per peran dan hardening container non-root berhasil menurunkan risiko kebocoran database dari skor kritis **15** menjadi skor rendah **5**.
2. **Keterkaitan Dokumen Bukti:**
   - Bukti kontrol akses dan hashing kata sandi: [`security/access-tests.md`](./access-tests.md)
   - Bukti hardening host dan SSH (`PermitRootLogin no`, `PasswordAuthentication no`): [`security/lynis-after.txt`](./lynis-after.txt)
   - Bukti hardening container bebas kerentanan critical: [`security/image-scan-after.txt`](./image-scan-after.txt)
   - Bukti daftar komponen perangkat lunak: [`security/sbom.cdx.json`](./sbom.cdx.json)
