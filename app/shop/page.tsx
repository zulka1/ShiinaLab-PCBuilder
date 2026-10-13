import type { Metadata } from "next";
import Link from "next/link";
import { ShopCatalog } from "../components/ShopCatalog";
import { SiteFooter, SiteHeader } from "../components/SiteNavigation";

export const metadata: Metadata = {
  title: "Katalog Komponen | ShiinaLab",
  description: "Jelajahi katalog komponen PC demonstrasi ShiinaLab.",
};

export default function ShopPage() {
  return (
    <>
      <SiteHeader activePage="shop" />
      <main id="main-content" className="site-page">
        <div className="page-container">
          <section className="page-intro">
            <p className="eyebrow"><span /> Katalog / data demonstrasi</p>
            <h1>Komponen PC, untuk <span className="grad-text">rancanganmu.</span></h1>
            <p className="page-lede">
              Cari komponen berdasarkan nama atau spesifikasi, lalu tambahkan ke keranjang 
              untuk mencoba alur katalog.
            </p>
            <p className="preview-note">
              <span className="preview-note-dot" />
              Harga dan detail adalah mock data; katalog ini bukan toko aktif.
            </p>
          </section>

          <section className="shop-section" aria-labelledby="catalog-heading">
            <div className="section-title-row">
              <div>
                <p className="eyebrow">Parts Store</p>
                <h2 id="catalog-heading">Jelajahi katalog</h2>
              </div>
              <span className="section-index">12 ITEM / MOCK</span>
            </div>
            <ShopCatalog />
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
