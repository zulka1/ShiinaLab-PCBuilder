"use client";

import { useActionState } from "react";
import { ubahKomponen } from "@/app/shop/actions";
import type { StatusForm } from "@/lib/status-form";
import Link from "next/link";

interface KomponenItem {
  id: number;
  nama: string;
  kategori: string;
  harga: number;
  deskripsi: string;
  tersedia: boolean;
  gambar?: string | null;
}

const awal: StatusForm = {};

export function FormEditKomponen({ item }: { item: KomponenItem }) {
  const [status, formAction, pending] = useActionState(
    ubahKomponen.bind(null, item.id),
    awal,
  );

  return (
    <form action={formAction} className="space-y-4">
      {status.pesan && (
        <div
          role="status"
          className={`p-3 rounded-2xl text-xs font-bold ${
            status.pesan.includes("Perubahan disimpan")
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {status.pesan}
        </div>
      )}

      <div>
        <label htmlFor="nama" className="block text-xs font-bold text-slate-700 mb-1">
          Nama Komponen
        </label>
        <input
          id="nama"
          name="nama"
          type="text"
          defaultValue={item.nama}
          required
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {status.galat?.nama && (
          <p className="text-xs text-rose-600 mt-1">{status.galat.nama[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="kategori" className="block text-xs font-bold text-slate-700 mb-1">
          Kategori
        </label>
        <input
          id="kategori"
          name="kategori"
          type="text"
          defaultValue={item.kategori}
          required
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="harga" className="block text-xs font-bold text-slate-700 mb-1">
          Harga (Rp)
        </label>
        <input
          id="harga"
          name="harga"
          type="number"
          defaultValue={item.harga}
          required
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="deskripsi" className="block text-xs font-bold text-slate-700 mb-1">
          Deskripsi
        </label>
        <textarea
          id="deskripsi"
          name="deskripsi"
          rows={3}
          defaultValue={item.deskripsi}
          required
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* MODUL 7: SELECT KETERSEDIAAN USULAN AI YANG MEMICU GALAT */}
      <div>
        <label htmlFor="tersedia" className="block text-xs font-bold text-slate-700 mb-1">
          Ketersediaan
        </label>
        <select
          id="tersedia"
          name="tersedia"
          defaultValue={String(item.tersedia)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="true">Tersedia</option>
          <option value="false">Tidak tersedia</option>
        </select>
        <p className="text-[11px] text-slate-400 mt-1">
          Pilih &quot;Tidak tersedia&quot; untuk menguji bug z.coerce.boolean()
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <Link
          href={`/shop/${item.id}`}
          className="text-xs font-bold text-slate-500 hover:text-slate-800"
        >
          ← Kembali ke Detail
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm transition disabled:opacity-50"
        >
          {pending ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}
