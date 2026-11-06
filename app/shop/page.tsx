import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { ShopCatalog } from "../components/ShopCatalog";
import { SiteFooter, SiteHeader } from "../components/SiteNavigation";
import { ambilDaftarKomponen } from "@/lib/data";
import type { Product, ProductCategory } from "../data/mock-products";

export const metadata: Metadata = {
  title: "Katalog Komponen | ShiinaLab",
  description: "Jelajahi katalog komponen PC tervalidasi dengan basis data PostgreSQL 18.",
};

function mapKategori(kat: string): ProductCategory {
  if (kat === "GraphicsCard") return "Graphics card";
  if (kat === "PowerSupply") return "Power supply";
  return kat as ProductCategory;
}

export default async function ShopPage() {
  await connection();
  const dataDb = await ambilDaftarKomponen();

  const products: Product[] = dataDb.map((item) => ({
    id: String(item.id),
    name: item.nama,
    category: mapKategori(item.kategori),
    price: item.harga,
    description: item.deskripsi,
    specifications: [
      item.tersedia ? "Stok Tersedia" : "Habis",
      `ID: #${item.id}`,
    ],
    available: item.tersedia,
  }));

  return (
    <>
      <SiteHeader activePage="shop" />
      <main id="main-content" className="site-page">
        <div className="page-container">
          <section className="page-intro">
            <p className="eyebrow"><span /> Katalog / PostgreSQL 18 &amp; Prisma 7</p>
            <h1>Komponen PC, untuk <span className="grad-text">rancanganmu.</span></h1>
            <p className="page-lede">
              Data komponen dimuat langsung dari basis data PostgreSQL 18 melalui Prisma Client.
              Jelajahi spesifikasi, beri ulasan teknis, atau tambahkan komponen baru.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <p className="preview-note">
                <span className="preview-note-dot" />
                Terhubung ke basis data PostgreSQL 18 (Prisma ORM 7).
              </p>
              <Link className="button button-primary" href="/shop/tambah">
                + Tambah Komponen
              </Link>
            </div>
          </section>

          <section className="shop-section" aria-labelledby="catalog-heading">
            <div className="section-title-row">
              <div>
                <p className="eyebrow">Parts Store</p>
                <h2 id="catalog-heading">Jelajahi katalog</h2>
              </div>
              <span className="section-index">{products.length} ITEM / POSTGRESQL</span>
            </div>
            <ShopCatalog initialProducts={products} />
          </section>

          <section className="next-step-panel" aria-labelledby="shop-next-heading">
            <div>
              <p className="eyebrow">Lanjutkan rancangan</p>
              <h2 id="shop-next-heading">Susun komponen di PC Builder</h2>
              <p>Uji ringkasan biaya dan pemeriksaan kompatibilitas pada data demonstrasi.</p>
            </div>
            <Link className="button button-quiet" href="/builder">Buka PC Builder <span aria-hidden="true">↗</span></Link>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
