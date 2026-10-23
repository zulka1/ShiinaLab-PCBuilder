import Link from "next/link";
import { SiteFooter, SiteHeader } from "./components/SiteNavigation";

export default function GlobalNotFound() {
  return (
    <>
      <SiteHeader activePage="home" />
      <main id="main-content" className="site-page">
        <div className="page-container" style={{ textAlign: "center", padding: "100px 20px" }}>
          <p className="eyebrow"><span /> 404 / Halaman Tidak Ditemukan</p>
          <h1 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
            Halaman <span className="grad-text">tidak ditemukan.</span>
          </h1>
          <p className="page-lede max-w-md mx-auto mb-8 text-neutral-400">
            Tautan yang kamu tuju salah, telah dipindahkan, atau rute belum terdaftar.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/" className="button button-primary">
              Kembali ke Beranda
            </Link>
            <Link href="/shop" className="button button-quiet">
              Jelajahi Katalog
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
