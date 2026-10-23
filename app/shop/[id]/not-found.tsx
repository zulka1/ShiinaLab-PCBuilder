import Link from "next/link";
import { SiteFooter, SiteHeader } from "../../components/SiteNavigation";

export default function ProductNotFound() {
  return (
    <>
      <SiteHeader activePage="shop" />
      <main id="main-content" className="site-page">
        <div className="page-container" style={{ textAlign: "center", padding: "80px 20px" }}>
          <p className="eyebrow"><span /> 404 / Komponen Tidak Ditemukan</p>
          <h1 className="text-3xl font-bold mt-3 mb-4">
            Komponen <span className="grad-text">tidak terdaftar.</span>
          </h1>
          <p className="page-lede max-w-md mx-auto mb-8 text-neutral-400">
            ID komponen yang kamu masukkan tidak ditemukan di basis data katalog ShiinaLab.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/shop" className="button button-primary">
              Kembali ke Katalog
            </Link>
            <Link href="/builder" className="button button-quiet">
              Buka PC Builder
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
