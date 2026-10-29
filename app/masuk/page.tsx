import type { Metadata } from "next";
import FormMasuk from "@/app/components/FormMasuk";
import { SiteFooter, SiteHeader } from "@/app/components/SiteNavigation";

export const metadata: Metadata = {
  title: "Masuk Pengelola | ShiinaLab",
  description: "Halaman masuk pengelola katalog komponen ShiinaLab.",
};

export default function HalamanMasuk() {
  return (
    <>
      <SiteHeader activePage="shop" />
      <main id="konten" className="site-page">
        <div className="page-container max-w-md mx-auto py-8">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8">
            <p className="eyebrow">Sesi Pengelola / Modul 5</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Masuk
            </h1>
            <p className="mt-2 text-sm text-neutral-400">
              Gunakan akun demo dari <code>.env.local</code> untuk mengakses formulir tambah komponen.
            </p>
            <FormMasuk />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

