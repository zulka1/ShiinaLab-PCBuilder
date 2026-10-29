"use client";

import { useActionState } from "react";
import { masuk } from "@/app/masuk/actions";
import type { StatusForm } from "@/lib/status-form";

const awal: StatusForm = {};
const kolom =
  "mt-1 block w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-white focus:border-amber-400 focus:outline-none";

export default function FormMasuk() {
  const [status, aksi, pending] = useActionState(masuk, awal);
  const g = status.galat;

  return (
    <form action={aksi} className="mt-6 space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-200">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="pengelola@contoh.ac.id"
          className={kolom}
          aria-invalid={!!g?.email}
          aria-describedby="galat-email"
        />
        <p id="galat-email" className="mt-1 text-sm text-red-400">
          {g?.email?.[0]}
        </p>
      </div>

      <div>
        <label htmlFor="kataSandi" className="block text-sm font-medium text-neutral-200">
          Kata sandi
        </label>
        <input
          id="kataSandi"
          name="kataSandi"
          type="password"
          autoComplete="current-password"
          className={kolom}
          aria-invalid={!!g?.kataSandi}
          aria-describedby="galat-sandi"
        />
        <p id="galat-sandi" className="mt-1 text-sm text-red-400">
          {g?.kataSandi?.[0]}
        </p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="button button-primary disabled:opacity-60"
      >
        {pending ? "Memproses..." : "Masuk"}
      </button>

      <p role="status" aria-live="polite" className="text-sm text-red-400">
        {status.pesan}
      </p>
    </form>
  );
}

