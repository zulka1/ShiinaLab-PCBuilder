"use client";

import { useId, useState } from "react";

export default function KolomCatatan({ label }: { label: string }) {
  const id = useId();
  const [catatan, setCatatan] = useState("");

  return (
    <div className="rounded-xl border border-dashed border-amber-400/40 bg-neutral-900/60 p-3 text-sm my-2">
      <label htmlFor={id} className="font-medium text-amber-300 block mb-1">
        {label}
      </label>
      <input
        id={id}
        value={catatan}
        onChange={(e) => setCatatan(e.target.value)}
        placeholder="Ketik teks uji coba di sini..."
        className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 text-sm"
      />
    </div>
  );
}
