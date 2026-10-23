// app/uji/lambat/page.tsx
import { connection } from "next/server";
import Link from "next/link";

export default async function HalamanLambat() {
  await connection(); // Memastikan dirender saat request, bukan prerender build
  await new Promise((selesai) => setTimeout(selesai, 4000)); // Simulasi tunda 4 detik

  return (
    <main id="konten" className="page-container py-12 text-center">
      <div className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-white mb-2">
          ✓ Data uji selesai dimuat!
        </h1>
        <p className="text-neutral-400 text-sm mb-6">
          Halaman ini selesai streaming setelah jeda simulasi 4 detik.
        </p>
        <Link href="/uji/lambat" className="button button-quiet">
          Muat Ulang Halaman
        </Link>
      </div>
    </main>
  );
}
