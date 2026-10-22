import assert from "node:assert/strict";
import { test } from "node:test";
import { decryptJson, encryptJson } from "./saved-build-crypto.ts";

const phrase = "contoh-frasa-kunci-aman-2026";

test("AES-GCM round-trip mengembalikan data rakitan yang sama", async () => {
  const builds = [{ name: "PC kuliah", budget: 12_000_000, total: 10_000_000 }];
  const ciphertext = await encryptJson(builds, phrase);
  assert.deepEqual(await decryptJson(ciphertext, phrase), builds);
});

test("frasa kunci yang salah ditolak saat dekripsi", async () => {
  const ciphertext = await encryptJson([{ name: "PC desain" }], phrase);
  await assert.rejects(decryptJson(ciphertext, "frasa-kunci-yang-salah"));
});

test("mengubah ciphertext terdeteksi dan dekripsi ditolak", async () => {
  const ciphertext = await encryptJson([{ name: "PC gaming" }], phrase);
  const changed = {
    ...ciphertext,
    ciphertext: `${ciphertext.ciphertext[0] === "A" ? "B" : "A"}${ciphertext.ciphertext.slice(1)}`,
  };
  await assert.rejects(decryptJson(changed, phrase));
});

test("enkripsi berulang memakai salt dan IV berbeda", async () => {
  const builds = [{ name: "PC yang sama" }];
  const first = await encryptJson(builds, phrase);
  const second = await encryptJson(builds, phrase);
  assert.notEqual(first.salt, second.salt);
  assert.notEqual(first.iv, second.iv);
  assert.notEqual(first.ciphertext, second.ciphertext);
});
