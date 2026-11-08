"use client";

import Image from "next/image";
import { useState, useActionState } from "react";
import { simpanKomponen } from "@/app/shop/actions";
import { categoryLabels, imagePresets } from "@/app/data/mock-products";
import type { StatusForm } from "@/lib/status-form";

const awal: StatusForm = {};
const inputClass =
  "mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 text-xs font-medium transition";

export default function FormKomponen() {
  const [status, aksi, pending] = useActionState(simpanKomponen, awal);
  const [selectedImage, setSelectedImage] = useState<string>(imagePresets[0].url);
  const g = status.galat;
  const n = status.nilai;

  return (
    <form action={aksi} className="space-y-5">
      {status.pesan && (
        <div
          role="status"
          aria-live="polite"
          className={`rounded-2xl p-3.5 text-xs font-bold border ${
            g ||
            status.pesan.includes("Gagal") ||
            status.pesan.includes("salah") ||
            status.pesan.includes("kembali")
              ? "bg-rose-50 border-rose-200 text-rose-800"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}
        >
          {status.pesan}
        </div>
      )}

      <div>
        <label htmlFor="nama" className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
          Nama Komponen
        </label>
        <input
          id="nama"
          name="nama"
          required
          minLength={3}
          maxLength={100}
          defaultValue={n?.nama}
          placeholder="Contoh: ASUS ROG Strix Z790-A Gaming WiFi II"
          className={inputClass}
          aria-invalid={!!g?.nama}
          aria-describedby="galat-nama"
        />
        {g?.nama && (
          <p id="galat-nama" className="mt-1 text-xs text-rose-600 font-medium">
            {g.nama[0]}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="kategori" className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
            Kategori Komponen
          </label>
          <select
            id="kategori"
            name="kategori"
            required
            defaultValue={n?.kategori || "GraphicsCard"}
            className={`${inputClass} cursor-pointer`}
            aria-invalid={!!g?.kategori}
            aria-describedby="galat-kategori"
          >
            <option value="Processor">Processor</option>
            <option value="GraphicsCard">Graphics Card</option>
            <option value="Motherboard">Motherboard</option>
            <option value="Memory">Memory</option>
            <option value="Storage">Storage</option>
            <option value="Case">Case</option>
            <option value="Cooler">Liquid Cooling</option>
            <option value="PowerSupply">Power Supply</option>
          </select>
          {g?.kategori && (
            <p id="galat-kategori" className="mt-1 text-xs text-rose-600 font-medium">
              {g.kategori[0]}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="harga" className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
            Harga Komponen (Rupiah)
          </label>
          <input
            id="harga"
            name="harga"
            type="number"
            required
            min={10000}
            defaultValue={n?.harga || 15000000}
            placeholder="15000000"
            className={inputClass}
            aria-invalid={!!g?.harga}
            aria-describedby="galat-harga"
          />
          {g?.harga && (
            <p id="galat-harga" className="mt-1 text-xs text-rose-600 font-medium">
              {g.harga[0]}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="deskripsi" className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
          Deskripsi &amp; Spesifikasi
        </label>
        <textarea
          id="deskripsi"
          name="deskripsi"
          rows={3}
          required
          minLength={10}
          maxLength={1000}
          defaultValue={n?.deskripsi}
          placeholder="Jelaskan spesifikasi teknis, clock speed, dan keunggulan pendinginan..."
          className={inputClass}
          aria-invalid={!!g?.deskripsi}
          aria-describedby="galat-deskripsi"
        />
        {g?.deskripsi && (
          <p id="galat-deskripsi" className="mt-1 text-xs text-rose-600 font-medium">
            {g.deskripsi[0]}
          </p>
        )}
      </div>

      {/* VISUAL IMAGE PRESET SELECTOR */}
      <div>
        <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-2">
          Pilih Foto Studio Komponen (HD Studio Photos)
        </label>
        <input type="hidden" name="gambar" value={selectedImage} />
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto p-2 border border-slate-200 rounded-2xl bg-slate-50/50">
          {imagePresets.map((preset) => (
            <button
              key={preset.url}
              type="button"
              onClick={() => setSelectedImage(preset.url)}
              className={`relative w-full aspect-square rounded-xl border p-1 overflow-hidden transition ${
                selectedImage === preset.url
                  ? "border-blue-600 ring-2 ring-blue-100 bg-white shadow-xs"
                  : "border-slate-200 bg-white hover:border-slate-300 opacity-70 hover:opacity-100"
              }`}
              title={preset.label}
            >
              <Image
                src={preset.url}
                alt={preset.label}
                fill
                sizes="64px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <input
          id="tersedia"
          name="tersedia"
          type="checkbox"
          defaultChecked
          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
        />
        <label htmlFor="tersedia" className="text-xs font-bold text-slate-700">
          Stok Tersedia (Komponen dapat langsung dipilih pada PC Builder)
        </label>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={pending}
          className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-xs shadow-md hover:shadow-xl transition-all duration-200 disabled:opacity-50"
        >
          {pending ? "Menyimpan ke PostgreSQL..." : "Simpan Komponen"}
        </button>
      </div>
    </form>
  );
}
