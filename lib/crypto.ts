import crypto from "node:crypto";

/**
 * Modul Kriptografi ShiinaLab — AEAD AES-256-GCM & HKDF Key Derivation
 * Sesuai Standar NIST SP 800-38D, RFC 5869 (HKDF), & Panduan Tugas 2 Kriptografi
 */

export const ALGORITMA_AEAD = "aes-256-gcm" as const;
export const PANJANG_KUNCI_BYTES = 32; // 256 bits
export const PANJANG_IV_BYTES = 12;    // 96 bits (rekomendasi NIST untuk AES-GCM)
export const PANJANG_TAG_BYTES = 16;   // 128 bits authentication tag

export interface HasilEnkripsiAEAD {
  ciphertext: string; // Base64
  iv: string;         // Base64
  tag: string;        // Base64
  aad?: string;       // Additional Authenticated Data
}

export interface InputDekripsiAEAD {
  ciphertext: string;
  iv: string;
  tag: string;
  aad?: string;
}

export class KriptoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "KriptoError";
  }
}

export class AutentikasiGagalError extends KriptoError {
  constructor(message: string = "Autentikasi AEAD gagal: data atau tag telah dimodifikasi atau kunci salah.") {
    super(message);
    this.name = "AutentikasiGagalError";
  }
}

/**
 * Mengambil master key dari environment variable secara aman.
 * Jika tidak ditemukan di production, melempar error (fail-closed).
 */
export function ambilMasterKey(): Buffer {
  const envKey = process.env.APP_ENCRYPTION_KEY;
  if (!envKey) {
    // Kunci fallback sintetis hanya untuk lingkungan pengujian otomatis lokal
    if (process.env.NODE_ENV === "test" || !process.env.NODE_ENV) {
      return Buffer.from("shiinalab_super_secret_master_key_32b!", "utf-8");
    }
    throw new KriptoError("APP_ENCRYPTION_KEY belum dikonfigurasi di environment variable.");
  }

  // Jika kunci dalam format hex (64 karakter) atau base64 (44 karakter)
  if (envKey.length === 64 && /^[0-9a-fA-F]+$/.test(envKey)) {
    return Buffer.from(envKey, "hex");
  }

  const keyBuffer = Buffer.from(envKey, "utf-8");
  if (keyBuffer.length < PANJANG_KUNCI_BYTES) {
    throw new KriptoError(
      `Panjang APP_ENCRYPTION_KEY tidak mencukupi (minimal ${PANJANG_KUNCI_BYTES} bytes).`
    );
  }
  return keyBuffer.subarray(0, PANJANG_KUNCI_BYTES);
}

/**
 * Derivasi Kunci dengan HKDF (RFC 5869) untuk pemisahan kunci per tujuan (Key Separation).
 * Mencegah penggunaan kunci yang sama untuk fungsi berbeda.
 */
export function turunkanKunci(masterKey: Buffer, tujuan: string): Buffer {
  if (!tujuan || typeof tujuan !== "string") {
    throw new KriptoError("Parameter tujuan derivasi kunci harus berupa string tidak kosong.");
  }

  const salt = Buffer.from("shiinalab-salt-v0.2", "utf-8");
  const info = Buffer.from(`shiinalab-purpose:${tujuan}`, "utf-8");

  // HKDF-SHA256
  return Buffer.from(
    crypto.hkdfSync("sha256", masterKey, salt, info, PANJANG_KUNCI_BYTES)
  );
}

/**
 * Enkripsi Terautentikasi (AEAD) menggunakan AES-256-GCM.
 * Menjamin KERAHASIAAN (confidentiality) sekaligus INTEGRITAS (integrity) data.
 */
export function enkripsiAEAD(
  plaintext: string | Buffer,
  kunciKustom?: Buffer,
  aadKustom?: string,
  tujuan: string = "user-vault"
): HasilEnkripsiAEAD {
  if (plaintext === undefined || plaintext === null || plaintext === "") {
    throw new KriptoError("Plaintext tidak boleh kosong.");
  }

  const dataBuffer = typeof plaintext === "string" ? Buffer.from(plaintext, "utf-8") : plaintext;
  const masterKey = kunciKustom || ambilMasterKey();
  const derivedKey = turunkanKunci(masterKey, tujuan);

  // Bangkitkan IV/nonce unik 12-byte menggunakan CSPRNG
  const iv = crypto.randomBytes(PANJANG_IV_BYTES);

  const cipher = crypto.createCipheriv(ALGORITMA_AEAD, derivedKey, iv, {
    authTagLength: PANJANG_TAG_BYTES,
  });

  const aad = aadKustom || `context:${tujuan}:v0.2`;
  cipher.setAAD(Buffer.from(aad, "utf-8"));

  const encrypted = Buffer.concat([cipher.update(dataBuffer), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    ciphertext: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    aad,
  };
}

/**
 * Dekripsi Terautentikasi (AEAD) menggunakan AES-256-GCM.
 * Menolak transaksi dan melempar AutentikasiGagalError jika ciphertext, tag, kunci, atau AAD tidak valid.
 */
export function dekripsiAEAD(
  payload: InputDekripsiAEAD,
  kunciKustom?: Buffer,
  tujuan: string = "user-vault"
): string {
  if (!payload || !payload.ciphertext || !payload.iv || !payload.tag) {
    throw new KriptoError("Payload dekripsi tidak lengkap: memerlukan ciphertext, iv, dan tag.");
  }

  const masterKey = kunciKustom || ambilMasterKey();
  const derivedKey = turunkanKunci(masterKey, tujuan);

  let ciphertextBuffer: Buffer;
  let ivBuffer: Buffer;
  let tagBuffer: Buffer;

  try {
    ciphertextBuffer = Buffer.from(payload.ciphertext, "base64");
    ivBuffer = Buffer.from(payload.iv, "base64");
    tagBuffer = Buffer.from(payload.tag, "base64");
  } catch {
    throw new KriptoError("Format encoding Base64 payload tidak valid.");
  }

  if (ivBuffer.length !== PANJANG_IV_BYTES) {
    throw new KriptoError(`Panjang IV tidak valid (harus ${PANJANG_IV_BYTES} bytes).`);
  }

  if (tagBuffer.length !== PANJANG_TAG_BYTES) {
    throw new KriptoError(`Panjang Auth Tag tidak valid (harus ${PANJANG_TAG_BYTES} bytes).`);
  }

  try {
    const decipher = crypto.createDecipheriv(ALGORITMA_AEAD, derivedKey, ivBuffer, {
      authTagLength: PANJANG_TAG_BYTES,
    });

    if (payload.aad) {
      decipher.setAAD(Buffer.from(payload.aad, "utf-8"));
    }

    decipher.setAuthTag(tagBuffer);

    const decrypted = Buffer.concat([decipher.update(ciphertextBuffer), decipher.final()]);
    return decrypted.toString("utf-8");
  } catch (err: unknown) {
    // Gagal tertutup (Fail-Closed): seluruh kegagalan verifikasi tag / data palsu melempar AutentikasiGagalError
    throw new AutentikasiGagalError(
      `Verifikasi integritas AEAD gagal: data/tag telah dirusak atau kunci tidak cocok.`
    );
  }
}
