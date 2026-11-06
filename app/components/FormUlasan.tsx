"use client";

import { useActionState } from "react";
import { tambahUlasan } from "@/app/shop/ulasan-actions";
import type { StatusForm } from "@/lib/status-form";

const awal: StatusForm = {};
const inputClass =
  "mt-1 block w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none text-sm";

export default function FormUlasan({ komponenId }: { komponenId: number }) {
  const [status, aksi, pending] = useActionState(
    tambahUlasan.bind(null, komponenId),
    awal,
  );
  const g = status.galat;

  return (
    <form action={aksi} className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 space-y-4">
      <h3 className="text-lg font-semibold text-white">Tulis Ulasan Pengalaman</h3>
      
      {status.pesan && (
        <div
          role="status"
          className={`rounded-lg p-3 text-sm font-medium ${
            status.pesan.includes("berhasil") || status.pesan.includes("tersimpan")
              ? "bg-emerald-950/60 border border-emerald-700 text-emerald-200"
              : "bg-red-950/60 border border-red-700 text-red-200"
          }`}
        >
          {status.pesan}
        </div>
      )}

      <div>
        <label htmlFor="nama-ulasan" className="block text-xs font-medium text-neutral-300 uppercase tracking-wider">
          Nama Anda
        </label>
        <input
          id="nama-ulasan"
          name="nama"
          type="text"
          required
          minLength={2}
          maxLength={60}
          placeholder="Contoh: Rian Pratama"
          className={inputClass}
          aria-invalid={!!g?.nama}
          aria-describedby="galat-ulasan-nama"
        />
        {g?.nama && (
          <p id="galat-ulasan-nama" className="mt-1 text-xs text-red-400">
            {g.nama[0]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="nilai-ulasan" className="block text-xs font-medium text-neutral-300 uppercase tracking-wider">
          Rating / Penilaian (1 - 5 Bintang)
        </label>
        <select
          id="nilai-ulasan"
          name="nilai"
          defaultValue="5"
          required
          className={inputClass}
          aria-invalid={!!g?.nilai}
          aria-describedby="galat-ulasan-nilai"
        >
          <option value="5">⭐⭐⭐⭐⭐ (5 - Sangat Direkomendasikan)</option>
          <option value="4">⭐⭐⭐⭐ (4 - Performa Bagus)</option>
          <option value="3">⭐⭐⭐ (3 - Standar / Cukup)</option>
          <option value="2">⭐⭐ (2 - Kurang Memuaskan)</option>
          <option value="1">⭐ (1 - Bermasalah / Kecewa)</option>
        </select>
        {g?.nilai && (
          <p id="galat-ulasan-nilai" className="mt-1 text-xs text-red-400">
            {g.nilai[0]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="komentar-ulasan" className="block text-xs font-medium text-neutral-300 uppercase tracking-wider">
          Komentar Ulasan Teknis
        </label>
        <textarea
          id="komentar-ulasan"
          name="komentar"
          rows={3}
          required
          minLength={5}
          maxLength={500}
          placeholder="Bagikan pengalaman perakitan, suhu, kecocokan, atau performanya..."
          className={inputClass}
          aria-invalid={!!g?.komentar}
          aria-describedby="galat-ulasan-komentar"
        />
        {g?.komentar && (
          <p id="galat-ulasan-komentar" className="mt-1 text-xs text-red-400">
            {g.komentar[0]}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="button button-primary text-sm w-full sm:w-auto"
      >
        {pending ? "Mengirim Ulasan..." : "Kirim Ulasan"}
      </button>
    </form>
  );
}
