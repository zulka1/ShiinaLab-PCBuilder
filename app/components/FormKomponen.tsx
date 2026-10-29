"use client";

import { useActionState } from "react";
import { simpanKomponen } from "@/app/shop/actions";
import { categoryLabels, builderCategories } from "@/app/data/mock-products";
import type { StatusForm } from "@/lib/status-form";

const awal: StatusForm = {};
const kolom =
  "mt-1 block w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-white focus:border-amber-400 focus:outline-none";

export default function FormKomponen() {
  const [status, aksi, pending] = useActionState(simpanKomponen, awal);
  const g = status.galat;
  const n = status.nilai;

  return (
    <form action={aksi} className="mt-6 space-y-5">
      <div>
        <label htmlFor="nama" className="block text-sm font-medium text-neutral-200">
          Nama Komponen
        </label>
        <input
          id="nama"
          name="nama"
          required
          minLength={3}
          maxLength={100}
          defaultValue={n?.nama}
          placeholder="Contoh: ASUS ROG Strix B650E-F"
          className={kolom}
          aria-invalid={!!g?.nama}
          aria-describedby="galat-nama"
        />
        <p id="galat-nama" className="mt-1 text-sm text-red-400">
          {g?.nama?.[0]}
        </p>
      </div>

      <div>
        <label htmlFor="kategori" className="block text-sm font-medium text-neutral-200">
          Kategori
        </label>
        <select
          id="kategori"
          name="kategori"
          required
          key={n?.kategori ?? "awal"}
          defaultValue={n?.kategori ?? ""}
          className={kolom}
          aria-invalid={!!g?.kategori}
          aria-describedby="galat-kategori"
        >
          <option value="" disabled>
            Pilih kategori komponen
          </option>
          {builderCategories.map((cat) => (
            <option key={cat} value={cat}>
              {categoryLabels[cat]} ({cat})
            </option>
          ))}
        </select>
        <p id="galat-kategori" className="mt-1 text-sm text-red-400">
          {g?.kategori?.[0]}
        </p>
      </div>

      <div>
        <label htmlFor="harga" className="block text-sm font-medium text-neutral-200">
          Harga (Rp)
        </label>
        <input
          id="harga"
          name="harga"
          type="number"
          required
          min={10000}
          max={100000000}
          defaultValue={n?.harga}
          placeholder="Contoh: 3150000"
          className={kolom}
          aria-invalid={!!g?.harga}
          aria-describedby="galat-harga"
        />
        <p id="galat-harga" className="mt-1 text-sm text-red-400">
          {g?.harga?.[0]}
        </p>
      </div>

      <div>
        <label htmlFor="deskripsi" className="block text-sm font-medium text-neutral-200">
          Deskripsi
        </label>
        <textarea
          id="deskripsi"
          name="deskripsi"
          required
          minLength={10}
          maxLength={300}
          rows={4}
          defaultValue={n?.deskripsi}
          placeholder="Tuliskan spesifikasi singkat atau fungsi komponen (10–300 karakter)..."
          className={kolom}
          aria-invalid={!!g?.deskripsi}
          aria-describedby="galat-deskripsi"
        />
        <p id="galat-deskripsi" className="mt-1 text-sm text-red-400">
          {g?.deskripsi?.[0]}
        </p>
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-200">
        <input type="checkbox" name="tersedia" defaultChecked />
        Tersedia di Katalog
      </label>

      <button
        type="submit"
        disabled={pending}
        className="button button-primary disabled:opacity-60"
      >
        {pending ? "Menyimpan..." : "Simpan Komponen"}
      </button>

      <p role="status" aria-live="polite" className="text-sm text-amber-300">
        {status.pesan}
      </p>
    </form>
  );
}

