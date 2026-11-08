import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import FormKomponen from "@/app/components/FormKomponen";
import { SiteFooter, SiteHeader } from "@/app/components/SiteNavigation";
import { bacaSesi } from "@/lib/sesi";
import { keluar } from "@/app/masuk/actions";

export const metadata: Metadata = {
  title: "Tambah Komponen | ShiinaLab 2026",
  description: "Formulir penambahan komponen PC tervalidasi dengan Server Action dan Zod 4.",
};

export const instant = false;

async function KontenTambahKomponen() {
  const sesi = await bacaSesi();
  if (!sesi) redirect("/masuk");

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-9 shadow-xs space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wider block mb-1">
            PostgreSQL Inventory SKUs
          </span>
          <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">
            Tambah Komponen Baru
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Masuk sebagai: <strong className="text-slate-900">{sesi.email || sesi.username}</strong> ({sesi.peran})
          </p>
        </div>
        <form action={keluar}>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 font-bold text-xs transition"
          >
            Keluar Sesi
          </button>
        </form>
      </div>
      <FormKomponen />
    </div>
  );
}

export default function HalamanTambahKomponen() {
  return (
    <div className="min-h-screen flex flex-col text-slate-900 bg-[#f8fafc]">
      <SiteHeader activePage="shop" />

      <main id="konten" className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-6">
        <nav aria-label="Breadcrumb">
          <Link
            href="/shop"
            className="text-xs font-bold text-slate-500 hover:text-blue-600 transition inline-flex items-center gap-1.5"
          >
            <span aria-hidden="true">&larr;</span> Kembali ke Katalog Komponen
          </Link>
        </nav>

        <div className="max-w-2xl mx-auto">
          <Suspense
            fallback={
              <div className="rounded-3xl border border-slate-200 bg-white p-8 text-xs text-slate-500">
                Memeriksa sesi pengelola...
              </div>
            }
          >
            <KontenTambahKomponen />
          </Suspense>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
