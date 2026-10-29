import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import FormKomponen from "@/app/components/FormKomponen";
import { SiteFooter, SiteHeader } from "@/app/components/SiteNavigation";
import { bacaSesi } from "@/lib/sesi";
import { keluar } from "@/app/masuk/actions";

export const metadata: Metadata = {
  title: "Tambah Komponen | ShiinaLab",
  description: "Formulir penambahan komponen PC tervalidasi dengan Server Action dan Zod 4.",
};

async function KontenTambahKomponen() {
  const sesi = await bacaSesi();
  if (!sesi) redirect("/masuk");

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <p className="eyebrow">Parts Store / Server Action</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Tambah Komponen
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Masuk sebagai <strong className="text-amber-300">{sesi.email}</strong>
          </p>
        </div>
        <form action={keluar}>
          <button type="submit" className="button button-quiet text-sm">
            Keluar
          </button>
        </form>
      </div>
      <FormKomponen />
    </div>
  );
}

export default function HalamanTambahKomponen() {
  return (
    <>
      <SiteHeader activePage="shop" />
      <main id="konten" className="site-page">
        <div className="page-container max-w-2xl mx-auto py-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <Link
              href="/shop"
              className="text-sm text-neutral-400 hover:text-amber-200 transition-colors inline-flex items-center gap-1.5"
            >
              <span aria-hidden="true">&larr;</span> Kembali ke Katalog
            </Link>
          </nav>
          <Suspense
            fallback={
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 text-sm text-neutral-400">
                Memeriksa sesi pengelola...
              </div>
            }
          >
            <KontenTambahKomponen />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

