import Link from "next/link";
import { BrandMarquee } from "./components/BrandMarquee";
import { SiteFooter, SiteHeader } from "./components/SiteNavigation";

const productSteps = [
  { number: "01", title: "Pilih kebutuhan", description: "Mulai dari tujuan pemakaian dan anggaran yang kamu rencanakan." },
  { number: "02", title: "Susun komponen", description: "Pilih bagian utama PC dan lihat estimasi biaya konfigurasi." },
  { number: "03", title: "Periksa rancangan", description: "Tinjau kecocokan dasar antarkomponen sebelum melanjutkan riset." },
];

const productPrinciples = [
  { number: "01", title: "Mulai dari kebutuhan", description: "Rancang alur pemilihan komponen yang mudah diikuti, termasuk untuk perakit PC pertama kali." },
  { number: "02", title: "Periksa sebelum membeli", description: "Tampilkan catatan kompatibilitas dasar supaya pilihan komponen dapat ditinjau kembali." },
  { number: "03", title: "Harga dan stok yang jelas", description: "Katalog produk dirancang untuk berkembang menjadi sumber informasi harga dan ketersediaan." },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader activePage="home" />
      <main id="main-content">
        <section className="home-hero">
          <div className="hero-ambience" aria-hidden="true" />
          <div className="home-hero-copy">
            <p className="eyebrow"><span /> PC Builder & Parts Store</p>
            <h1>Rakit PC dengan lebih <span className="hero-headline-shimmer">terarah.</span></h1>
            <p className="home-hero-lede">
              ShiinaLab membantu perakit PC merencanakan komponen, meninjau kecocokan dasar,
              dan memahami estimasi biaya sebelum berbelanja.
            </p>
            <div className="home-hero-actions">
              <Link className="button button-primary" href="/builder">Coba PC Builder <span aria-hidden="true">↗</span></Link>
              <Link className="button button-quiet" href="/shop">Jelajahi katalog</Link>
            </div>
            <p className="hero-note">Milestone 1 · Prototipe antarmuka dengan data demonstrasi</p>
          </div>

          <div className="hero-board" aria-label="Contoh ringkasan rakitan PC">
            <div className="hero-board-header">
              <div>
                <span className="board-kicker">CONTOH RANCANGAN</span>
                <strong>Rakitan seimbang</strong>
              </div>
              <span className="mock-badge">DATA MOCK</span>
            </div>
            <div className="hero-component-list">
              {[
                { name: "Prosesor", model: "AMD Ryzen 5 7600", price: "Rp3.150.000" },
                { name: "Motherboard", model: "MSI PRO B650M-A WiFi", price: "Rp2.650.000" },
                { name: "Memori", model: "32 GB DDR5", price: "Rp1.350.000" },
                { name: "Kartu grafis", model: "MSI GeForce RTX 4060", price: "Rp5.050.000" },
              ].map((part, index) => (
                <div className="hero-component" key={part.name}>
                  <span className="hero-component-index">0{index + 1}</span>
                  <span className="hero-component-copy">
                    <small>{part.name}</small>
                    <strong>{part.model}</strong>
                  </span>
                  <span className="hero-component-price">{part.price}</span>
                </div>
              ))}
            </div>
            <div className="hero-board-footer">
              <span>Estimasi contoh</span>
              <strong>Rp12.200.000</strong>
            </div>
            <p className="hero-board-caption">Angka ilustrasi, bukan harga jual atau rekomendasi pembelian.</p>
          </div>
        </section>

        <BrandMarquee />

        <section className="home-section home-product" aria-labelledby="product-heading">
          <div className="home-section-intro">
            <p className="eyebrow">Tentang ShiinaLab</p>
            <h2 id="product-heading">Satu ruang untuk merencanakan rakitan dan komponen.</h2>
            <p>
              ShiinaLab adalah aplikasi web untuk pemula rakit PC, enthusiast, gamer,
              dan pembeli komponen yang ingin menyusun pilihan dengan lebih terarah.
            </p>
          </div>
          <div className="principle-list">
            {productPrinciples.map((principle) => (
              <article className="principle-item" key={principle.number}>
                <span>{principle.number}</span>
                <div>
                  <h3>{principle.title}</h3>
                  <p>{principle.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="home-section workflow-section" id="alur" aria-labelledby="workflow-heading">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">Alur utama</p>
              <h2 id="workflow-heading">Dari ide menuju rancangan.</h2>
            </div>
            <Link className="text-link" href="/builder">Mulai dari builder <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="workflow-grid">
            {productSteps.map((step) => (
              <article className="workflow-card" key={step.number}>
                <span className="workflow-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="home-cta" aria-labelledby="cta-heading">
          <div>
            <p className="eyebrow">Jelajahi prototipe</p>
            <h2 id="cta-heading">Buat rancangan pertamamu.</h2>
            <p>Pilih komponen mock, lihat estimasi, lalu periksa catatan kecocokannya.</p>
          </div>
          <Link className="button button-primary" href="/builder">Buka PC Builder <span aria-hidden="true">↗</span></Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
