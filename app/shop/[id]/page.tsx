import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  categoryLabels,
  formatRupiah,
  getProductById,
  mockProducts,
} from "../../data/mock-products";
import { SiteFooter, SiteHeader } from "../../components/SiteNavigation";

export function generateStaticParams() {
  return mockProducts.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return {
      title: "Komponen Tidak Ditemukan | ShiinaLab",
      description: "Komponen yang dicari tidak ditemukan dalam katalog.",
    };
  }

  return {
    title: `${product.name} | ShiinaLab Parts Store`,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const categoryName = categoryLabels[product.category] ?? product.category;

  return (
    <>
      <SiteHeader activePage="shop" />
      <main id="main-content" className="site-page">
        <div className="page-container">
          {/* Navigasi Balik / Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <Link
              href="/shop"
              className="text-sm text-neutral-400 hover:text-amber-200 transition-colors inline-flex items-center gap-1.5"
            >
              <span aria-hidden="true">&larr;</span> Kembali ke Katalog
            </Link>
          </nav>

          <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
            {/* Visual Box / Placeholder Visual Komponen */}
            <div className="lg:col-span-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[320px] relative overflow-hidden">
              <span
                className="absolute text-8xl font-black text-neutral-800/40 select-none pointer-events-none"
                aria-hidden="true"
              >
                {product.id.slice(-4).toUpperCase()}
              </span>
              <div className="z-10 text-center space-y-3">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider bg-amber-400/10 text-amber-300 border border-amber-400/20">
                  {categoryName}
                </span>
                <p className="text-xs text-neutral-500">Visual Demonstrasi Produk</p>
                <div className="w-16 h-1 bg-amber-400/30 rounded-full mx-auto" />
              </div>
            </div>

            {/* Informasi Detail Produk */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <p className="eyebrow">Detail Komponen / {product.id}</p>
                <h1 className="text-2xl sm:text-3xl font-bold mt-1 text-white">
                  {product.name}
                </h1>
              </div>

              <div className="flex items-baseline gap-3 pb-4 border-b border-neutral-800">
                <strong className="text-3xl font-bold text-amber-300">
                  {formatRupiah(product.price)}
                </strong>
                <span className="text-xs text-neutral-500 uppercase tracking-wide">
                  (Harga Simulasi / Mock)
                </span>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                  Deskripsi
                </h2>
                <p className="text-neutral-400 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Spesifikasi Teknis */}
              <div>
                <h2 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-3">
                  Spesifikasi Teknis
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-lg p-3">
                    <span className="text-xs text-neutral-500 block">Kategori</span>
                    <span className="font-medium text-neutral-200">{categoryName}</span>
                  </div>

                  {product.socket && (
                    <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-lg p-3">
                      <span className="text-xs text-neutral-500 block">Socket</span>
                      <span className="font-medium text-neutral-200">{product.socket}</span>
                    </div>
                  )}

                  {product.memoryType && (
                    <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-lg p-3">
                      <span className="text-xs text-neutral-500 block">Tipe Memori</span>
                      <span className="font-medium text-neutral-200">{product.memoryType}</span>
                    </div>
                  )}

                  {product.formFactor && (
                    <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-lg p-3">
                      <span className="text-xs text-neutral-500 block">Form Factor</span>
                      <span className="font-medium text-neutral-200">{product.formFactor}</span>
                    </div>
                  )}

                  {product.wattage && (
                    <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-lg p-3">
                      <span className="text-xs text-neutral-500 block">Daya Keluaran (Wattage)</span>
                      <span className="font-medium text-neutral-200">{product.wattage} W</span>
                    </div>
                  )}

                  {product.powerDraw && (
                    <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-lg p-3">
                      <span className="text-xs text-neutral-500 block">Konsumsi Daya (TDP)</span>
                      <span className="font-medium text-neutral-200">{product.powerDraw} W</span>
                    </div>
                  )}

                  {product.supportedMotherboardSizes && (
                    <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-lg p-3 sm:col-span-2">
                      <span className="text-xs text-neutral-500 block">Ukuran Motherboard yang Didukung</span>
                      <span className="font-medium text-neutral-200">
                        {product.supportedMotherboardSizes.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tag Spesifikasi */}
              {product.specifications.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    Fitur & Sorotan
                  </h3>
                  <ul className="flex flex-wrap gap-2">
                    {product.specifications.map((spec) => (
                      <li
                        key={spec}
                        className="text-xs px-2.5 py-1 rounded-md bg-neutral-800/70 text-neutral-300 border border-neutral-700/50"
                      >
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Aksi */}
              <div className="pt-4 flex flex-wrap items-center gap-4 border-t border-neutral-800">
                <Link href="/builder" className="button button-primary">
                  Gunakan di PC Builder <span aria-hidden="true">&rarr;</span>
                </Link>
                <Link href="/shop" className="button button-quiet">
                  Lihat Komponen Lain
                </Link>
              </div>
            </div>
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
