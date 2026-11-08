"use client";

import { useActionState, useState } from "react";
import { daftar, masuk } from "@/app/masuk/actions";
import type { StatusForm } from "@/lib/status-form";

const awal: StatusForm = {};
const inputClass =
  "mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm transition";

export default function FormMasuk() {
  const [mode, setMode] = useState<"masuk" | "daftar">("masuk");

  const [statusMasuk, aksiMasuk, pendingMasuk] = useActionState(masuk, awal);
  const [statusDaftar, aksiDaftar, pendingDaftar] = useActionState(daftar, awal);

  const status = mode === "masuk" ? statusMasuk : statusDaftar;
  const pending = mode === "masuk" ? pendingMasuk : pendingDaftar;
  const g = status.galat;

  return (
    <div className="space-y-6">
      {/* TABS: SIGN IN / REGISTER */}
      <div className="flex rounded-2xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setMode("masuk")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition ${
            mode === "masuk"
              ? "bg-white text-slate-950 shadow-2xs"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setMode("daftar")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition ${
            mode === "daftar"
              ? "bg-white text-slate-950 shadow-2xs"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Create Account
        </button>
      </div>

      {status.pesan && (
        <div
          role="status"
          className="rounded-2xl p-3.5 text-xs font-bold bg-rose-50 border border-rose-200 text-rose-800"
        >
          {status.pesan}
        </div>
      )}

      {mode === "masuk" ? (
        <form action={aksiMasuk} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              Email or Username
            </label>
            <input
              id="email"
              name="email"
              type="text"
              autoComplete="username"
              required
              defaultValue={status.nilai?.email ? String(status.nilai.email) : ""}
              placeholder="Enter your email or username"
              className={inputClass}
              aria-invalid={!!g?.email}
              aria-describedby="galat-email"
            />
            {g?.email && (
              <p id="galat-email" className="mt-1 text-xs text-rose-600 font-medium">
                {g.email[0]}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="kataSandi" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              Password
            </label>
            <input
              id="kataSandi"
              name="kataSandi"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Enter your password"
              className={inputClass}
              aria-invalid={!!g?.kataSandi}
              aria-describedby="galat-sandi"
            />
            {g?.kataSandi && (
              <p id="galat-sandi" className="mt-1 text-xs text-rose-600 font-medium">
                {g.kataSandi[0]}
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={pending}
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-[0_10px_25px_-4px_rgba(37,99,235,0.4)] hover:shadow-[0_14px_30px_-4px_rgba(37,99,235,0.5)] transition-all duration-200 disabled:opacity-50"
            >
              {pending ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>
      ) : (
        <form action={aksiDaftar} className="space-y-4">
          <div>
            <label htmlFor="username-daftar" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              Username
            </label>
            <input
              id="username-daftar"
              name="username"
              type="text"
              required
              placeholder="Choose a username"
              className={inputClass}
              aria-invalid={!!g?.username}
            />
            {g?.username && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{g.username[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="namaLengkap" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              Full Name
            </label>
            <input
              id="namaLengkap"
              name="namaLengkap"
              type="text"
              required
              placeholder="Your full name"
              className={inputClass}
              aria-invalid={!!g?.namaLengkap}
            />
            {g?.namaLengkap && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{g.namaLengkap[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="email-daftar" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              Email Address
            </label>
            <input
              id="email-daftar"
              name="email"
              type="email"
              required
              placeholder="name@example.com"
              className={inputClass}
              aria-invalid={!!g?.email}
            />
            {g?.email && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{g.email[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="kataSandi-daftar" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              Password
            </label>
            <input
              id="kataSandi-daftar"
              name="kataSandi"
              type="password"
              required
              minLength={8}
              placeholder="Create a strong password (min. 8 characters)"
              className={inputClass}
              aria-invalid={!!g?.kataSandi}
            />
            {g?.kataSandi && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{g.kataSandi[0]}</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={pending}
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-[0_10px_25px_-4px_rgba(37,99,235,0.4)] hover:shadow-[0_14px_30px_-4px_rgba(37,99,235,0.5)] transition-all duration-200 disabled:opacity-50"
            >
              {pending ? "Creating Account..." : "Register Account"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
