"use client";

import { useId, useState } from "react";

export default function KolomCatatan({ label }: { label: string }) {
  const id = useId();
  const [catatan, setCatatan] = useState("");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 text-xs shadow-2xs my-2">
      <label htmlFor={id} className="font-bold text-slate-700 block mb-1">
        {label}
      </label>
      <input
        id={id}
        value={catatan}
        onChange={(e) => setCatatan(e.target.value)}
        placeholder="Ketik catatan sesi di sini..."
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
      />
    </div>
  );
}
