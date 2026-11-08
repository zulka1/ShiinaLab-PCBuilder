import crypto from "node:crypto";
import {
  enkripsiAEAD,
  dekripsiAEAD,
  turunkanKunci,
  AutentikasiGagalError,
  KriptoError,
  PANJANG_IV_BYTES,
  PANJANG_TAG_BYTES,
  PANJANG_KUNCI_BYTES,
} from "../lib/crypto";

// Warna ANSI terminal untuk pelaporan pengujian
const HIJAU = "\x1b[32m";
const MERAH = "\x1b[31m";
const BIRU = "\x1b[34m";
const KUNING = "\x1b[33m";
const RESET = "\x1b[0m";
const TEBAL = "\x1b[1m";

interface HasilUji {
  id: string;
  nama: string;
  kategori: string;
  status: "LULUS" | "GAGAL";
  detail: string;
}

const daftarHasil: HasilUji[] = [];

function catat(
  id: string,
  nama: string,
  kategori: string,
  lulus: boolean,
  detail: string
) {
  daftarHasil.push({
    id,
    nama,
    kategori,
    status: lulus ? "LULUS" : "GAGAL",
    detail,
  });
  const simbol = lulus ? `${HIJAU}✔ LULUS${RESET}` : `${MERAH}✖ GAGAL${RESET}`;
  console.log(`[${id}] ${nama} -> ${simbol}`);
  console.log(`     Detail: ${detail}\n`);
}

console.log(`\n${TEBAL}${BIRU}================================================================${RESET}`);
console.log(`${TEBAL}${BIRU}   PENGUJIAN OTOMATIS KRIPTOGRAFI AEAD (AES-256-GCM & HKDF)     ${RESET}`);
console.log(`${TEBAL}${BIRU}   ShiinaLab — PC Builder & Parts Store (Milestone 2 - v0.2)   ${RESET}`);
console.log(`${TEBAL}${BIRU}================================================================${RESET}\n`);

// Inisialisasi Master Key Sintetis Pengujian
const masterKeyUji = crypto.randomBytes(PANJANG_KUNCI_BYTES);
const plaintextSintetis = JSON.stringify({
  namaRancangan: "ShiinaLab Ultimate Rig 2026",
  pemilik: "Zulfa Ubaidillah",
  anggaranTotal: 34500000,
  komponen: ["AMD Ryzen 7 7800X3D", "RTX 4080 Super", "Corsair 32GB DDR5"],
  catatanKhusus: "Konfigurasi benchmark rahasia performa tinggi",
  timestamp: 1762614000000,
});

// Skenario 1: Positive Test - Enkripsi & Dekripsi Berhasil Sempurna
try {
  const terenkripsi = enkripsiAEAD(plaintextSintetis, masterKeyUji, "konteks:build:101", "vault");
  const terdekripsi = dekripsiAEAD(terenkripsi, masterKeyUji, "vault");

  const cocok = terdekripsi === plaintextSintetis;
  catat(
    "TC-01",
    "Enkripsi & Dekripsi Normal (Roundtrip Positive Test)",
    "Fungsional Positif",
    cocok,
    `Plaintext terdekripsi identik 100%. IV: ${terenkripsi.iv.substring(0, 10)}..., Tag: ${terenkripsi.tag.substring(0, 10)}...`
  );
} catch (e: any) {
  catat("TC-01", "Enkripsi & Dekripsi Normal", "Fungsional Positif", false, e.message);
}

// Skenario 2: Negative Test - Ciphertext Dimodifikasi (Tampered Ciphertext) Ditolak
try {
  const terenkripsi = enkripsiAEAD(plaintextSintetis, masterKeyUji, "konteks:build:101", "vault");
  
  // Modifikasi karakter pada ciphertext (Simulasi serangan man-in-the-middle / bit-flipping)
  const rawCipher = Buffer.from(terenkripsi.ciphertext, "base64");
  rawCipher[rawCipher.length - 1] ^= 0xff; // Flip bits di byte terakhir
  const tamperedCiphertext = rawCipher.toString("base64");

  let ditolak = false;
  try {
    dekripsiAEAD(
      { ...terenkripsi, ciphertext: tamperedCiphertext },
      masterKeyUji,
      "vault"
    );
  } catch (err: any) {
    if (err instanceof AutentikasiGagalError) {
      ditolak = true;
    }
  }

  catat(
    "TC-02",
    "Deteksi Modifikasi Ciphertext (Tampered Data)",
    "Keamanan Negatif",
    ditolak,
    "Ciphertext yang dimanipulasi berhasil ditolak secara fail-closed melempar AutentikasiGagalError."
  );
} catch (e: any) {
  catat("TC-02", "Deteksi Modifikasi Ciphertext", "Keamanan Negatif", false, e.message);
}

// Skenario 3: Negative Test - Authentication Tag Dimodifikasi Ditolak
try {
  const terenkripsi = enkripsiAEAD(plaintextSintetis, masterKeyUji, "konteks:build:101", "vault");

  // Modifikasi byte pada tag autentikasi
  const rawTag = Buffer.from(terenkripsi.tag, "base64");
  rawTag[0] ^= 0x01; // Ubah bit pertama
  const tamperedTag = rawTag.toString("base64");

  let ditolak = false;
  try {
    dekripsiAEAD(
      { ...terenkripsi, tag: tamperedTag },
      masterKeyUji,
      "vault"
    );
  } catch (err: any) {
    if (err instanceof AutentikasiGagalError) {
      ditolak = true;
    }
  }

  catat(
    "TC-03",
    "Deteksi Pemalsuan Auth Tag (Tampered Authentication Tag)",
    "Keamanan Negatif",
    ditolak,
    "Auth Tag palsu/rusak ditolak tegas oleh algoritma Galois/Counter Mode tanpa membocorkan plaintext."
  );
} catch (e: any) {
  catat("TC-03", "Deteksi Pemalsuan Auth Tag", "Keamanan Negatif", false, e.message);
}

// Skenario 4: Negative Test - Kunci Salah (Wrong Key) Ditolak
try {
  const terenkripsi = enkripsiAEAD(plaintextSintetis, masterKeyUji, "konteks:build:101", "vault");
  const wrongKey = crypto.randomBytes(PANJANG_KUNCI_BYTES); // Kunci asing sembarang

  let ditolak = false;
  try {
    dekripsiAEAD(terenkripsi, wrongKey, "vault");
  } catch (err: any) {
    if (err instanceof AutentikasiGagalError) {
      ditolak = true;
    }
  }

  catat(
    "TC-04",
    "Penolakan Kunci yang Salah (Wrong Key Rejection)",
    "Keamanan Negatif",
    ditolak,
    "Upaya dekripsi dengan master key yang salah ditolak seketika pada tahap verifikasi GCM tag."
  );
} catch (e: any) {
  catat("TC-04", "Penolakan Kunci yang Salah", "Keamanan Negatif", false, e.message);
}

// Skenario 5: Negative Test - AAD (Additional Authenticated Data) Tidak Cocok Ditolak
try {
  const terenkripsi = enkripsiAEAD(plaintextSintetis, masterKeyUji, "konteks:user:42", "vault");

  // Percobaan replikasi data ke konteks pengguna lain (ID 99)
  let ditolak = false;
  try {
    dekripsiAEAD(
      { ...terenkripsi, aad: "konteks:user:99" }, // AAD diubah penyerang
      masterKeyUji,
      "vault"
    );
  } catch (err: any) {
    if (err instanceof AutentikasiGagalError) {
      ditolak = true;
    }
  }

  catat(
    "TC-05",
    "Penolakan Perubahan AAD (Context Replay Attack Prevention)",
    "Integritas Konteks",
    ditolak,
    "AAD yang tidak cocok menggagalkan proses dekripsi, mencegah serangan perpindahan kepemilikan konteks data."
  );
} catch (e: any) {
  catat("TC-05", "Penolakan Perubahan AAD", "Integritas Konteks", false, e.message);
}

// Skenario 6: Security Property - Nonce Uniqueness (CSPRNG Unpredictability)
try {
  const enc1 = enkripsiAEAD(plaintextSintetis, masterKeyUji, "konteks:test", "vault");
  const enc2 = enkripsiAEAD(plaintextSintetis, masterKeyUji, "konteks:test", "vault");

  const ivBerbeda = enc1.iv !== enc2.iv;
  const cipherBerbeda = enc1.ciphertext !== enc2.ciphertext;
  const tagBerbeda = enc1.tag !== enc2.tag;

  const lulus = ivBerbeda && cipherBerbeda && tagBerbeda;

  catat(
    "TC-06",
    "Jaminan Keunikan Nonce (Fresh CSPRNG 96-bit IV per Encryption)",
    "Karakteristik Keamanan",
    lulus,
    `Enkripsi data yang sama 2x menghasilkan IV dan Ciphertext yang sama sekali berbeda (IV1: ${enc1.iv.substring(0, 8)}, IV2: ${enc2.iv.substring(0, 8)}). Mencegah Nonce-Reuse attack.`
  );
} catch (e: any) {
  catat("TC-06", "Jaminan Keunikan Nonce", "Karakteristik Keamanan", false, e.message);
}

// Ringkasan
const totalLulus = daftarHasil.filter((h) => h.status === "LULUS").length;
const totalUji = daftarHasil.length;
const persentase = ((totalLulus / totalUji) * 100).toFixed(0);

console.log(`${TEBAL}${BIRU}================================================================${RESET}`);
console.log(
  `${TEBAL}HASIL AKHIR: ${totalLulus}/${totalUji} Skenario LULUS (${persentase}% Keberhasilan)${RESET}`
);
console.log(`${TEBAL}${BIRU}================================================================${RESET}\n`);

if (totalLulus < totalUji) {
  process.exit(1);
} else {
  process.exit(0);
}
