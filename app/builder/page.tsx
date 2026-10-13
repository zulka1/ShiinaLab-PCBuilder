import type { Metadata } from "next";
import { BuilderWorkspace } from "../components/BuilderWorkspace";
import { SiteFooter, SiteHeader } from "../components/SiteNavigation";

export const metadata: Metadata = {
  title: "PC Builder | ShiinaLab",
  description: "Susun konfigurasi PC dan tinjau kompatibilitas komponen demonstrasi.",
};

export default function BuilderPage() {
  return (
    <>
      <SiteHeader activePage="builder" />
      <main id="main-content" className="site-page">
        <div className="page-container">
          <section className="page-intro builder-intro">
            <p className="eyebrow"><span /> PC Builder / konfigurasi demonstrasi</p>
            <h1>Rancang PC yang <span className="grad-text">sesuai kebutuhan.</span></h1>
            <p className="page-lede">
              Pilih komponen, periksa kecocokan dasar, dan simpan rancangan mock di browser
              sebagai titik awal untuk pengembangan berikutnya.
            </p>
            <p className="preview-note">
              <span className="preview-note-dot" />
              Bukan validasi teknis final. Periksa spesifikasi resmi sebelum membeli.
            </p>
          </section>
          <BuilderWorkspace />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
