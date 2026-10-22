"use client";

import { useEffect, useMemo, useState, useSyncExternalStore, type FormEvent } from "react";
import { decryptJson, encryptJson, isEncryptedBuilds } from "../lib/saved-build-crypto";
import {
  builderCategories,
  categoryLabels,
  formatRupiah,
  mockProducts,
  type Product,
  type ProductCategory,
} from "../data/mock-products";

type SelectedComponents = Partial<Record<ProductCategory, string>>;
type SavedBuild = { name: string; budget: number; total: number; savedAt: string };
type CompatibilityResult = { label: string; state: "ok" | "warning" | "pending"; detail: string };
const savedBuildsKey = "shiinalab-saved-builds";
const savedBuildsEvent = "shiinalab-saved-builds-change";
const storageUnavailable = "__shiinalab-storage-unavailable__";

function subscribeToSavedBuilds(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(savedBuildsEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(savedBuildsEvent, onStoreChange);
  };
}

function getSavedBuildsSnapshot() {
  try {
    return window.localStorage.getItem(savedBuildsKey) ?? "[]";
  } catch {
    return storageUnavailable;
  }
}

function getServerSavedBuildsSnapshot() {
  return "[]";
}

function isSavedBuild(value: unknown): value is SavedBuild {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    typeof value.name === "string" &&
    "budget" in value &&
    typeof value.budget === "number" &&
    "total" in value &&
    typeof value.total === "number" &&
    "savedAt" in value &&
    typeof value.savedAt === "string"
  );
}

function parseBuildList(value: unknown): SavedBuild[] {
  if (!Array.isArray(value) || !value.every(isSavedBuild)) {
    throw new Error("Format data rakitan tidak valid.");
  }
  return value;
}

function getSelectedProduct(category: ProductCategory, id?: string) {
  return mockProducts.find((product) => product.category === category && product.id === id);
}

function ComponentSelector({
  category,
  selectedId,
  onChange,
}: {
  category: ProductCategory;
  selectedId?: string;
  onChange: (category: ProductCategory, productId: string) => void;
}) {
  const products = mockProducts.filter((product) => product.category === category);
  const selectedProduct = getSelectedProduct(category, selectedId);

  return (
    <article className={`builder-component${selectedProduct ? " is-selected" : ""}`}>
      <div className="component-heading">
        <span className="component-number">{String(builderCategories.indexOf(category) + 1).padStart(2, "0")}</span>
        <div>
          <h3>{categoryLabels[category]}</h3>
          <p>{selectedProduct?.name ?? "Pilih komponen dari data demonstrasi"}</p>
        </div>
      </div>
      <div className="component-choice">
        <label className="visually-hidden" htmlFor={`component-${category.replaceAll(" ", "-")}`}>
          Pilih {categoryLabels[category]}
        </label>
        <select
          id={`component-${category.replaceAll(" ", "-")}`}
          value={selectedId ?? ""}
          onChange={(event) => onChange(category, event.target.value)}
        >
          <option value="">Pilih komponen</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} — {formatRupiah(product.price)}
            </option>
          ))}
        </select>
        {selectedProduct && <strong>{formatRupiah(selectedProduct.price)}</strong>}
      </div>
    </article>
  );
}

function getCompatibility(
  selected: Partial<Record<ProductCategory, Product>>,
  estimatedPower: number,
): CompatibilityResult[] {
  const processor = selected.Processor;
  const motherboard = selected.Motherboard;
  const memory = selected.Memory;
  const powerSupply = selected["Power supply"];
  const caseProduct = selected.Case;
  const results: CompatibilityResult[] = [];

  if (processor && motherboard) {
    const compatible = processor.socket === motherboard.socket;
    results.push({
      label: "Socket prosesor",
      state: compatible ? "ok" : "warning",
      detail: compatible
        ? `${processor.socket} cocok dengan motherboard.`
        : `${processor.socket} tidak cocok dengan motherboard ${motherboard.socket}.`,
    });
  } else {
    results.push({ label: "Socket prosesor", state: "pending", detail: "Pilih prosesor dan motherboard untuk memeriksa." });
  }

  if (memory && motherboard) {
    const compatible = memory.memoryType === motherboard.memoryType;
    results.push({
      label: "Tipe memori",
      state: compatible ? "ok" : "warning",
      detail: compatible
        ? `${memory.memoryType} didukung motherboard.`
        : `${memory.memoryType} tidak cocok dengan motherboard ${motherboard.memoryType}.`,
    });
  } else {
    results.push({ label: "Tipe memori", state: "pending", detail: "Pilih memori dan motherboard untuk memeriksa." });
  }

  if (caseProduct && motherboard) {
    const compatible = caseProduct.supportedMotherboardSizes?.includes(motherboard.formFactor ?? "ATX") ?? false;
    results.push({
      label: "Ukuran casing",
      state: compatible ? "ok" : "warning",
      detail: compatible
        ? `${motherboard.formFactor} didukung casing.`
        : `Dukungan casing untuk ${motherboard.formFactor} belum tersedia.`,
    });
  } else {
    results.push({ label: "Ukuran casing", state: "pending", detail: "Pilih motherboard dan casing untuk memeriksa." });
  }

  if (powerSupply) {
    const adequate = (powerSupply.wattage ?? 0) >= estimatedPower;
    results.push({
      label: "Daya power supply",
      state: adequate ? "ok" : "warning",
      detail: adequate
        ? `Mock ${powerSupply.wattage} W mencukupi estimasi ${estimatedPower} W.`
        : `Mock ${powerSupply.wattage} W di bawah estimasi ${estimatedPower} W.`,
    });
  } else {
    results.push({ label: "Daya power supply", state: "pending", detail: "Pilih power supply untuk memeriksa." });
  }

  return results;
}

function CompatibilityPanel({ results }: { results: CompatibilityResult[] }) {
  const warningCount = results.filter((result) => result.state === "warning").length;

  return (
    <section className="compatibility-panel" aria-labelledby="compatibility-heading">
      <div className="section-title-row">
        <div>
          <p className="eyebrow">Pemeriksaan dasar</p>
          <h2 id="compatibility-heading">Kompatibilitas</h2>
        </div>
        <span className={`compatibility-count${warningCount ? " has-warning" : ""}`} aria-live="polite">
          {warningCount ? `${warningCount} catatan` : "Mock check"}
        </span>
      </div>
      <ul className="compatibility-list">
        {results.map((result) => (
          <li className={`compatibility-item is-${result.state}`} key={result.label}>
            <span className="compatibility-indicator" aria-hidden="true">
              {result.state === "ok" ? "✓" : result.state === "warning" ? "!" : "·"}
            </span>
            <span>
              <strong>{result.label}</strong>
              <small>{result.detail}</small>
            </span>
          </li>
        ))}
      </ul>
      <p className="panel-footnote">Pemeriksaan edukasi berbasis mock data, bukan validasi teknis untuk pembelian.</p>
    </section>
  );
}

function BuildSummary({ selected, total, selectedCount }: {
  selected: Partial<Record<ProductCategory, Product>>;
  total: number;
  selectedCount: number;
}) {
  return (
    <section className="build-summary" aria-labelledby="summary-heading">
      <div className="summary-topline">
        <span>RINGKASAN MOCK</span>
        <span>{selectedCount} / {builderCategories.length} komponen</span>
      </div>
      <h2 id="summary-heading">Rakit sesuai kebutuhan</h2>
      <p className="summary-copy">Pilihan dan estimasi selalu diperbarui saat komponen berubah.</p>
      <div className="summary-total">
        <span>Estimasi total</span>
        <strong>{formatRupiah(total)}</strong>
        <small>Harga demonstrasi; bukan harga jual.</small>
      </div>
      <ul className="summary-list">
        {builderCategories.map((category) => {
          const product = selected[category];
          return (
            <li key={category}>
              <span>{categoryLabels[category]}</span>
              <strong>{product ? formatRupiah(product.price) : "Belum dipilih"}</strong>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function SaveBuildForm({ total }: { total: number }) {
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [errors, setErrors] = useState<{ name?: string; budget?: string; passphrase?: string }>({});
  const [notice, setNotice] = useState("");
  const [decryptedBuilds, setDecryptedBuilds] = useState<{
    snapshot: string;
    passphrase: string;
    builds: SavedBuild[];
  } | null>(null);
  const [decryptFailure, setDecryptFailure] = useState<{ snapshot: string; passphrase: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const storedBuildsSnapshot = useSyncExternalStore(
    subscribeToSavedBuilds,
    getSavedBuildsSnapshot,
    getServerSavedBuildsSnapshot,
  );
  const storedBuilds = useMemo(() => {
    if (storedBuildsSnapshot === storageUnavailable) return { kind: "unavailable" as const };
    try {
      const value: unknown = JSON.parse(storedBuildsSnapshot);
      if (Array.isArray(value)) {
        return { kind: "legacy" as const, builds: parseBuildList(value) };
      }
      if (isEncryptedBuilds(value)) return { kind: "encrypted" as const, payload: value };
      return { kind: "invalid" as const };
    } catch {
      return { kind: "invalid" as const };
    }
  }, [storedBuildsSnapshot]);

  useEffect(() => {
    let active = true;
    if (storedBuilds.kind === "encrypted" && passphrase) {
      void decryptJson<unknown>(storedBuilds.payload, passphrase).then((value) => {
        if (active) {
          setDecryptedBuilds({
            snapshot: storedBuildsSnapshot,
            passphrase,
            builds: parseBuildList(value),
          });
        }
      }).catch(() => {
        if (active) setDecryptFailure({ snapshot: storedBuildsSnapshot, passphrase });
      });
    }

    return () => { active = false; };
  }, [passphrase, storedBuilds, storedBuildsSnapshot]);

  const savedBuilds = storedBuilds.kind === "legacy"
    ? storedBuilds.builds
    : storedBuilds.kind === "encrypted" &&
        decryptedBuilds?.snapshot === storedBuildsSnapshot &&
        decryptedBuilds.passphrase === passphrase
      ? decryptedBuilds.builds
      : null;
  const storageMessage = storedBuilds.kind === "unavailable"
    ? "Penyimpanan browser tidak dapat dibaca."
    : storedBuilds.kind === "invalid"
      ? "Data rakitan tersimpan tidak valid dan tidak dapat dibuka."
      : storedBuilds.kind === "legacy" && storedBuilds.builds.length > 0
        ? "Data lama belum terenkripsi. Data akan dienkripsi saat disimpan kembali."
        : storedBuilds.kind === "encrypted" && !passphrase
          ? "Masukkan frasa kunci untuk membuka rakitan terenkripsi."
          : storedBuilds.kind === "encrypted" && savedBuilds === null
            ? decryptFailure?.snapshot === storedBuildsSnapshot && decryptFailure.passphrase === passphrase
              ? "Frasa kunci salah atau data terenkripsi telah rusak."
              : "Membuka rakitan terenkripsi..."
            : "";

  async function saveBuild(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: { name?: string; budget?: string; passphrase?: string } = {};
    const trimmedName = name.trim();
    const budgetAmount = Number(budget);

    if (trimmedName.length < 3 || trimmedName.length > 40) {
      nextErrors.name = "Nama rakitan harus terdiri dari 3–40 karakter.";
    }
    if (!budget || !Number.isFinite(budgetAmount) || budgetAmount <= 0) {
      nextErrors.budget = "Masukkan anggaran lebih besar dari Rp0.";
    }
    if (passphrase.length < 12) {
      nextErrors.passphrase = "Frasa kunci harus terdiri dari minimal 12 karakter.";
    }

    setErrors(nextErrors);
    setNotice("");
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      const storedValue = window.localStorage.getItem(savedBuildsKey);
      let existingBuilds: SavedBuild[] = [];
      if (storedValue) {
        const parsed: unknown = JSON.parse(storedValue);
        existingBuilds = isEncryptedBuilds(parsed)
          ? parseBuildList(await decryptJson<unknown>(parsed, passphrase))
          : parseBuildList(parsed);
      }
      const nextBuilds = [
        { name: trimmedName, budget: budgetAmount, total, savedAt: new Date().toISOString() },
        ...existingBuilds,
      ];
      const encrypted = await encryptJson(nextBuilds, passphrase);
      window.localStorage.setItem(savedBuildsKey, JSON.stringify(encrypted));
      window.dispatchEvent(new Event(savedBuildsEvent));
      setNotice(`Rakitan “${trimmedName}” dienkripsi dan tersimpan di perangkat ini.`);
      setName("");
    } catch (error) {
      setNotice(
        error instanceof Error && error.name === "OperationError"
          ? "Frasa kunci salah atau data lama tidak dapat didekripsi. Rakitan baru tidak disimpan."
          : error instanceof Error
            ? `Rakitan belum tersimpan: ${error.message}`
            : "Rakitan belum tersimpan karena terjadi kesalahan yang tidak diketahui.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="save-build-panel" aria-labelledby="save-build-heading">
      <div>
        <p className="eyebrow">Simpan rancangan</p>
        <h2 id="save-build-heading">Beri nama rakitanmu</h2>
        <p className="save-build-copy">
          Data rakitan dienkripsi dengan AES-GCM sebelum disimpan di browser. Frasa kunci tidak disimpan;
          gunakan frasa yang sama untuk membukanya dan simpan frasa itu dengan aman.
        </p>
      </div>
      <form className="save-build-form" onSubmit={saveBuild} noValidate>
        <div className="form-field">
          <label htmlFor="build-name">Nama rakitan</label>
          <input
            id="build-name"
            type="text"
            autoComplete="off"
            value={name}
            maxLength={40}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "build-name-error" : undefined}
            onChange={(event) => setName(event.target.value)}
            placeholder="Contoh: PC kuliah dan desain"
          />
          {errors.name && <small className="field-error" id="build-name-error" role="alert">{errors.name}</small>}
        </div>
        <div className="form-field">
          <label htmlFor="build-budget">Anggaran (Rp)</label>
          <input
            id="build-budget"
            type="number"
            inputMode="numeric"
            min="1"
            step="100000"
            value={budget}
            aria-invalid={Boolean(errors.budget)}
            aria-describedby={errors.budget ? "build-budget-error" : undefined}
            onChange={(event) => setBudget(event.target.value)}
            placeholder="Contoh: 15000000"
          />
          {errors.budget && <small className="field-error" id="build-budget-error" role="alert">{errors.budget}</small>}
        </div>
        <div className="form-field">
          <label htmlFor="build-passphrase">Frasa kunci enkripsi</label>
          <input
            id="build-passphrase"
            type="password"
            autoComplete="new-password"
            value={passphrase}
            aria-invalid={Boolean(errors.passphrase)}
            aria-describedby={errors.passphrase ? "build-passphrase-error" : "build-passphrase-hint"}
            onChange={(event) => setPassphrase(event.target.value)}
            placeholder="Minimal 12 karakter"
          />
          {errors.passphrase
            ? <small className="field-error" id="build-passphrase-error" role="alert">{errors.passphrase}</small>
            : <small className="field-error" id="build-passphrase-hint">Frasa yang sama diperlukan untuk membuka rakitan.</small>}
        </div>
        <button className="button button-primary" type="submit" disabled={saving}>
          {saving ? "Mengenkripsi..." : "Simpan rakitan"}
        </button>
      </form>
      <p className="form-feedback" role="status" aria-live="polite">
        {notice || storageMessage}
      </p>
      {savedBuilds && savedBuilds.length > 0 && (
        <div className="saved-builds">
          <h3>Rakitan tersimpan terenkripsi di browser ini</h3>
          <ul>
            {savedBuilds.map((build) => (
              <li key={`${build.name}-${build.savedAt}`}>
                <span>{build.name}</span>
                <strong>{formatRupiah(build.total)} / anggaran {formatRupiah(build.budget)}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export function BuilderWorkspace() {
  const [selectedIds, setSelectedIds] = useState<SelectedComponents>({});
  const selectedProducts = useMemo(() => {
    const selected: Partial<Record<ProductCategory, Product>> = {};
    for (const category of builderCategories) {
      const product = getSelectedProduct(category, selectedIds[category]);
      if (product) selected[category] = product;
    }
    return selected;
  }, [selectedIds]);

  const selectedCount = Object.keys(selectedProducts).length;
  const total = Object.values(selectedProducts).reduce((sum, product) => sum + product.price, 0);
  const estimatedPower =
    (selectedProducts.Processor?.powerDraw ?? 0) +
    (selectedProducts["Graphics card"]?.powerDraw ?? 0) +
    (selectedCount > 0 ? 120 : 0);
  const compatibility = getCompatibility(selectedProducts, estimatedPower);

  function changeComponent(category: ProductCategory, productId: string) {
    setSelectedIds((current) => {
      const next = { ...current };
      if (productId) next[category] = productId;
      else delete next[category];
      return next;
    });
  }

  return (
    <div className="builder-workspace">
      <section className="builder-components-panel" aria-labelledby="components-heading">
        <div className="section-title-row builder-title-row">
          <div>
            <p className="eyebrow">Workspace / konfigurasi mock</p>
            <h2 id="components-heading">Pilih komponen</h2>
          </div>
          <span className="section-index">{selectedCount} dari {builderCategories.length} dipilih</span>
        </div>
        <div className="component-list">
          {builderCategories.map((category) => (
            <ComponentSelector
              key={category}
              category={category}
              selectedId={selectedIds[category]}
              onChange={changeComponent}
            />
          ))}
        </div>
        <div className="builder-note">
          <strong>Data demonstrasi.</strong>
          <span>Nama dan spesifikasi contoh membantu uji alur; harga tidak menunjukkan penawaran atau stok aktual.</span>
        </div>
      </section>

      <aside className="builder-aside">
        <BuildSummary selected={selectedProducts} total={total} selectedCount={selectedCount} />
        <CompatibilityPanel results={compatibility} />
      </aside>

      <SaveBuildForm total={total} />
    </div>
  );
}
