import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ambilDetailKomponen } from "@/lib/data";
import { formatRupiah } from "@/app/data/mock-products";
import { SiteFooter, SiteHeader } from "@/app/components/SiteNavigation";
import { labelKategori } from "@/lib/skema";
import FormUlasan from "@/app/components/FormUlasan";
import { hapusKomponen } from "@/app/shop/actions";
import { hapusUlasan } from "@/app/shop/ulasan-actions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  await connection();
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    return { title: "Komponen Tidak Ditemukan | ShiinaLab" };
  }

  const item = await ambilDetailKomponen(id);
  if (!item) {
    return { title: "Komponen Tidak Ditemukan | ShiinaLab" };
  }

  return {
    title: `${item.nama} | ShiinaLab Parts Store`,
    description: item.deskripsi,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id: rawId } = await params;
  const id = Number(rawId);

  // Validasi ID: harus berupa bilangan bulat positif
  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  const item = await ambilDetailKomponen(id);
  if (!item) {
    notFound();
  }

  const namaKategori = labelKategori[item.kategori as keyof typeof labelKategori] ?? item.kategori;

  return (
    <>
      <SiteHeader activePage="shop" />
      <main id="main-content" className="site-page">
        <div className="page-container max-w-4xl mx-auto py-8">
          {/* Navigasi Balik / Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <Link
              href="/shop"
              className="text-sm text-neutral-400 hover:text-amber-200 transition-colors inline-flex items-center gap-1.5"
            >
              <span aria-hidden="true">&larr;</span> Kembali ke Katalog Toko
            </Link>
          </nav>

          <article className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-12">
            {/* Visual Box Komponen */}
            <div className="md:col-span-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[280px] relative overflow-hidden">
              <span
                className="absolute text-8xl font-black text-neutral-800/30 select-none pointer-events-none"
                aria-hidden="true"
              >
                #{item.id}
              </span>
              <div className="z-10 text-center space-y-3">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-400/10 text-amber-300 border border-amber-400/20">
                  {namaKategori}
                </span>
                <p className="text-xs text-neutral-500">PostgreSQL ID: #{item.id}</p>
                <div className="w-16 h-1 bg-amber-400/30 rounded-full mx-auto" />
              </div>
            </div>

            {/* Informasi Detail Produk */}
            <div className="md:col-span-7 space-y-6">
              <div>
                <p className="eyebrow">Komponen PC / Database Record</p>
                <h1 className="text-2xl sm:text-3xl font-bold mt-1 text-white">
                  {item.nama}
                </h1>
              </div>

              <div className="flex items-baseline gap-3 pb-4 border-b border-neutral-800">
                <strong className="text-3xl font-bold text-amber-300">
                  {formatRupiah(item.harga)}
                </strong>
                <span className={`text-xs px-2.5 py-1 rounded-md font-medium uppercase tracking-wide ${
                  item.tersedia
                    ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
                    : "bg-red-950/80 text-red-400 border border-red-800/60"
                }`}>
                  {item.tersedia ? "Stok Tersedia" : "Stok Habis"}
                </span>
              </div>

              <div>
                <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Deskripsi &amp; Spesifikasi
                </h2>
                <p className="text-neutral-300 leading-relaxed text-sm">
                  {item.deskripsi}
                </p>
              </div>

              <div className="pt-2">
                <form action={hapusKomponen.bind(null, item.id)}>
                  <button
                    type="submit"
                    className="button bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-700/50 text-xs py-2 px-4 transition-colors"
                  >
                    Hapus Komponen (Uji Transaksi)
                  </button>
                </form>
              </div>
            </div>
          </article>

          {/* Bagian Ulasan (Relasi 1:N) */}
          <section className="mt-12 pt-8 border-t border-neutral-800" aria-labelledby="ulasan-heading">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="eyebrow">Feedback &amp; Kompatibilitas</p>
                <h2 id="ulasan-heading" className="text-xl sm:text-2xl font-bold text-white mt-1">
                  Ulasan Pengguna ({item.ulasan.length})
                </h2>
              </div>
              <span className="text-xs text-neutral-400 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-full">
                Relasi 1:N Komponen &rarr; Ulasan
              </span>
            </div>

            {item.ulasan.length === 0 ? (
              <div className="rounded-xl border border-dashed border-neutral-800 p-8 text-center text-sm text-neutral-400">
                Belum ada ulasan untuk komponen ini. Jadilah yang pertama memberikan ulasan teknis!
              </div>
            ) : (
              <div className="space-y-4">
                {item.ulasan.map((u) => (
                  <div
                    key={u.id}
                    className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-4 transition-all hover:border-neutral-700"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-sm text-white font-semibold">
                            {u.nama}
                          </strong>
                          <span className="text-xs text-amber-400 font-medium">
                            {"★".repeat(u.nilai)}{"☆".repeat(5 - u.nilai)} ({u.nilai}/5)
                          </span>
                        </div>
                        <time className="text-xs text-neutral-500">
                          {new Date(u.dibuatPada).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </time>
                      </div>

                      <form action={hapusUlasan.bind(null, u.id, item.id)}>
                        <button
                          type="submit"
                          className="text-xs text-red-400 hover:text-red-300 hover:underline transition-colors"
                        >
                          Hapus Ulasan
                        </button>
                      </form>
                    </div>

                    <p className="mt-3 text-sm text-neutral-300 leading-relaxed">
                      {u.komentar}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Formulir Penambahan Ulasan */}
            <div className="mt-8">
              <FormUlasan komponenId={item.id} />
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
