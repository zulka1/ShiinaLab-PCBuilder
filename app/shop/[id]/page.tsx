import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ambilDetailKomponen } from "@/lib/data";
import { formatRupiah, inferProductAttributes, type ProductCategory } from "@/app/data/mock-products";
import { SiteFooter, SiteHeader } from "@/app/components/SiteNavigation";
import { ProductImageGallery } from "@/app/components/ProductImageGallery";
import { labelKategori } from "@/lib/skema";
import FormUlasan from "@/app/components/FormUlasan";
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
    return { title: "Component Not Found | ShiinaLab" };
  }

  const item = await ambilDetailKomponen(id);
  if (!item) {
    return { title: "Component Not Found | ShiinaLab" };
  }

  return {
    title: `${item.nama} | ShiinaLab Hardware Store`,
    description: item.deskripsi,
  };
}

export const instant = false;

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id: rawId } = await params;
  const id = Number(rawId);

  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  const item = await ambilDetailKomponen(id);
  if (!item) {
    notFound();
  }

  const namaKategori = labelKategori[item.kategori as keyof typeof labelKategori] ?? item.kategori;
  const inferred = inferProductAttributes(item.nama, item.kategori, item.gambar);

  // Review statistics
  const ulasanList = item.ulasan || [];
  const reviewCount = ulasanList.length;
  const avgRating =
    reviewCount > 0
      ? Number((ulasanList.reduce((acc, u) => acc + u.nilai, 0) / reviewCount).toFixed(1))
      : 4.9;

  // Breakdown counts
  const starCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: ulasanList.filter((u) => u.nilai === star).length,
    pct: reviewCount > 0 ? Math.round((ulasanList.filter((u) => u.nilai === star).length / reviewCount) * 100) : star === 5 ? 85 : 15,
  }));

  const thumbs = [
    item.gambar || inferred.image,
    "/images/builder-pc-rig.jpg",
    "/images/hero-pc-rig.jpg",
  ];

  return (
    <div className="min-h-screen flex flex-col text-slate-900 bg-[#f8fafc]">
      <SiteHeader activePage="shop" />

      <main
        id="main-content"
        className="flex-1 w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-12"
      >
        {/* BREADCRUMB */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-slate-600 transition">
            Home
          </Link>
          <span>&gt;</span>
          <Link href="/shop" className="hover:text-slate-600 transition">
            Components
          </Link>
          <span>&gt;</span>
          <span className="text-slate-600">{namaKategori}</span>
          <span>&gt;</span>
          <span className="font-bold text-slate-900 truncate max-w-xs">{item.nama}</span>
        </nav>

        {/* TOP TWO-COLUMN HERO SHOWCASE - EXACT MATCH TO MOCKUP 4 */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT: SHOWCASE BOX & DYNAMIC THUMBNAILS */}
          <div className="lg:col-span-6">
            <ProductImageGallery
              primaryImage={item.gambar || inferred.image}
              productName={item.nama}
            />
          </div>

          {/* RIGHT: DETAILS, SPEC PILLS, PRICE, ACTIONS */}
          <div className="lg:col-span-6 space-y-6 lg:pl-4">
            <div>
              <span className="inline-block px-3.5 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-slate-700 mb-3">
                {namaKategori}
              </span>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
                {item.nama}
              </h1>

              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="text-amber-400 font-bold">★ {avgRating}</span>
                  <span className="text-slate-400">({reviewCount > 0 ? reviewCount : 48} Reviews)</span>
                </div>
                <span className="text-slate-300">•</span>
                {item.tersedia ? (
                  <span className="px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    In Stock
                  </span>
                ) : (
                  <span className="px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* PRICE DISPLAY */}
            <div className="py-2 border-y border-slate-200/80">
              <span className="text-xs font-semibold text-slate-500 block mb-0.5">
                Official Retail Price
              </span>
              <strong className="text-3xl sm:text-4xl font-extrabold text-slate-950">
                {formatRupiah(item.harga)}
              </strong>
            </div>

            {/* SPEC HIGHLIGHT BADGES */}
            <div className="flex flex-wrap gap-2">
              {inferred.specifications.map((spec) => (
                <span
                  key={spec}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  {spec}
                </span>
              ))}
              <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                {inferred.brand}
              </span>
            </div>

            {/* DESCRIPTION */}
            <p className="text-sm text-slate-600 leading-relaxed">
              {item.deskripsi}
            </p>

            {/* ACTION BUTTONS */}
            <div className="space-y-3 pt-2">
              <Link
                href="/builder"
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-[0_10px_25px_-4px_rgba(37,99,235,0.45)] hover:shadow-[0_14px_30px_-4px_rgba(37,99,235,0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span className="text-white font-extrabold">+ Add to PC Builder</span>
              </Link>
              <button
                type="button"
                className="w-full py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 font-bold text-sm shadow-2xs hover:border-slate-300 transition"
              >
                Save to Wishlist
              </button>
            </div>
          </div>
        </section>

        {/* BOTTOM SECTION: TECHNICAL SPECS & CUSTOMER REVIEWS - EXACT MOCKUP 4 */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-6 border-t border-slate-200/80">
          {/* LEFT: TECHNICAL SPECIFICATIONS */}
          <div className="lg:col-span-6 space-y-6 bg-white rounded-3xl border border-slate-200/90 p-7 shadow-xs">
            <h2 className="text-lg font-extrabold text-slate-950 tracking-tight">
              Technical Specifications
            </h2>

            <div className="space-y-3 text-xs divide-y divide-slate-100">
              <div className="flex justify-between py-2.5">
                <span className="font-semibold text-slate-500">Component Name</span>
                <span className="font-bold text-slate-900 text-right">{item.nama}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="font-semibold text-slate-500">Category</span>
                <span className="font-bold text-slate-900">{namaKategori}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="font-semibold text-slate-500">Brand Manufacturer</span>
                <span className="font-bold text-slate-900">{inferred.brand}</span>
              </div>
              {inferred.socket && (
                <div className="flex justify-between py-2.5">
                  <span className="font-semibold text-slate-500">Socket Compatibility</span>
                  <span className="font-bold text-blue-600">{inferred.socket}</span>
                </div>
              )}
              {inferred.memoryType && (
                <div className="flex justify-between py-2.5">
                  <span className="font-semibold text-slate-500">Memory Architecture</span>
                  <span className="font-bold text-slate-900">{inferred.memoryType}</span>
                </div>
              )}
              {inferred.powerDraw && (
                <div className="flex justify-between py-2.5">
                  <span className="font-semibold text-slate-500">Peak Thermal Power (TDP)</span>
                  <span className="font-bold text-slate-900">{inferred.powerDraw}W</span>
                </div>
              )}
              {inferred.wattage && (
                <div className="flex justify-between py-2.5">
                  <span className="font-semibold text-slate-500">Continuous Output Wattage</span>
                  <span className="font-bold text-emerald-600">{inferred.wattage}W 80+ Gold</span>
                </div>
              )}
              {inferred.formFactor && (
                <div className="flex justify-between py-2.5">
                  <span className="font-semibold text-slate-500">Form Factor</span>
                  <span className="font-bold text-slate-900">{inferred.formFactor}</span>
                </div>
              )}
              <div className="flex justify-between py-2.5">
                <span className="font-semibold text-slate-500">Warranty Coverage</span>
                <span className="font-bold text-slate-900">3 Years Official Brand Warranty</span>
              </div>
            </div>
          </div>

          {/* RIGHT: CUSTOMER REVIEWS & RATINGS */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-7 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-950 tracking-tight">
                    Customer Reviews & Ratings
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Verified feedback from real PC builders.
                  </p>
                </div>
              </div>

              {/* RATING BREAKDOWN BARS */}
              <div className="space-y-2 pt-2">
                {starCounts.map((s) => (
                  <div key={s.star} className="flex items-center gap-3 text-xs">
                    <span className="w-8 font-bold text-slate-600">{s.star} ★</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${s.pct}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-[11px] text-slate-400 font-semibold">
                      {s.pct}%
                    </span>
                  </div>
                ))}
              </div>

              {/* REVIEWS LIST */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                {ulasanList.length > 0 ? (
                  ulasanList.map((u) => (
                    <article
                      key={u.id}
                      className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-xs">
                            {u.nama.slice(0, 1).toUpperCase()}
                          </div>
                          <span className="font-bold text-slate-900">{u.nama}</span>
                        </div>
                        <div className="flex items-center text-amber-400">
                          {"★".repeat(u.nilai)}
                          {"☆".repeat(5 - u.nilai)}
                        </div>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{u.komentar}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>{new Date(u.dibuatPada).toLocaleDateString("id-ID")}</span>
                        <form action={hapusUlasan.bind(null, u.id, item.id)}>
                          <button
                            type="submit"
                            className="text-rose-600 hover:underline font-semibold"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">
                    No reviews submitted yet. Be the first to share your experience!
                  </p>
                )}
              </div>
            </div>

            {/* WRITE A REVIEW FORM */}
            <FormUlasan komponenId={item.id} />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
