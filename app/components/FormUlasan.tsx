"use client";

import { useActionState } from "react";
import { tambahUlasan } from "@/app/shop/ulasan-actions";
import type { StatusForm } from "@/lib/status-form";

const awal: StatusForm = {};
const inputClass =
  "mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 text-xs font-medium transition";

export default function FormUlasan({ komponenId }: { komponenId: number }) {
  const [status, aksi, pending] = useActionState(
    tambahUlasan.bind(null, komponenId),
    awal,
  );
  const g = status.galat;

  return (
    <form action={aksi} className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
      <div>
        <h3 className="text-sm font-extrabold text-slate-950 uppercase tracking-wider">
          Write a Review
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Share your build impressions and thermal test observations.
        </p>
      </div>

      {status.pesan && (
        <div
          role="status"
          className={`rounded-2xl p-3 text-xs font-bold ${
            status.pesan.includes("berhasil") || status.pesan.includes("tersimpan")
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-rose-50 border border-rose-200 text-rose-800"
          }`}
        >
          {status.pesan}
        </div>
      )}

      <div>
        <label htmlFor="nama-ulasan" className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
          Your Name / Handle
        </label>
        <input
          id="nama-ulasan"
          name="nama"
          type="text"
          required
          minLength={2}
          maxLength={60}
          placeholder="e.g. Stephen R. or Marcus Vance"
          className={inputClass}
          aria-invalid={!!g?.nama}
          aria-describedby="galat-ulasan-nama"
        />
        {g?.nama && (
          <p id="galat-ulasan-nama" className="mt-1 text-xs text-rose-600">
            {g.nama[0]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="nilai-ulasan" className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
          Rating (1 to 5 Stars)
        </label>
        <select
          id="nilai-ulasan"
          name="nilai"
          defaultValue={5}
          className={`${inputClass} cursor-pointer`}
          aria-invalid={!!g?.nilai}
          aria-describedby="galat-ulasan-nilai"
        >
          <option value={5}>★★★★★ - 5 Stars (Exceptional)</option>
          <option value={4}>★★★★☆ - 4 Stars (High Performance)</option>
          <option value={3}>★★★☆☆ - 3 Stars (Satisfactory)</option>
          <option value={2}>★★☆☆☆ - 2 Stars (Below Expectations)</option>
          <option value={1}>★☆☆☆☆ - 1 Star (Not Recommended)</option>
        </select>
        {g?.nilai && (
          <p id="galat-ulasan-nilai" className="mt-1 text-xs text-rose-600">
            {g.nilai[0]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="komentar-ulasan" className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
          Technical Review & Impressions
        </label>
        <textarea
          id="komentar-ulasan"
          name="komentar"
          rows={3}
          required
          minLength={5}
          maxLength={500}
          placeholder="Describe build quality, clock speeds, coil whine, or cooler compatibility..."
          className={inputClass}
          aria-invalid={!!g?.komentar}
          aria-describedby="galat-ulasan-komentar"
        />
        {g?.komentar && (
          <p id="galat-ulasan-komentar" className="mt-1 text-xs text-rose-600">
            {g.komentar[0]}
          </p>
        )}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={pending}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-xs shadow-sm hover:shadow-md transition-all duration-150 disabled:opacity-50"
        >
          {pending ? "Publishing Review..." : "Submit Review"}
        </button>
      </div>
    </form>
  );
}
