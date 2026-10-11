import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/SiteNavigation";

export const metadata: Metadata = {
  title: "Shop | ShiinaLab",
  description: "Preview the planned component catalog for ShiinaLab.",
};

const categories = [
  "Processors",
  "Graphics cards",
  "Motherboards",
  "Memory",
  "Storage",
  "Power supplies",
  "Cases",
];

const productSlots = ["Processor", "Graphics card", "Motherboard"];

export default function ShopPage() {
  return (
    <>
      <SiteHeader activePage="shop" />
      <main className="site-page">
        <div className="page-container">
          <section className="page-intro">
            <p className="eyebrow"><span /> Component catalog / concept preview</p>
            <h1>
              Parts Store
              <span className="grad-text">, taking shape.</span>
            </h1>
            <p className="page-lede">
              A first look at how ShiinaLab could present PC components.
              This is a static layout, not a live store.
            </p>
            <p className="preview-note">
              <span className="preview-note-dot" />
              Product listings, prices, and stock have not been provided yet.
            </p>
          </section>

          <section className="shop-section" aria-labelledby="categories-heading">
            <div className="section-heading-row">
              <div>
                <p className="eyebrow">Browse by type</p>
                <h2 id="categories-heading">Planned categories</h2>
              </div>
              <span className="section-index">01 / 02</span>
            </div>
            <div className="category-list" aria-label="Planned component categories">
              {categories.map((category, index) => (
                <span className="category-chip" key={category}>
                  <span className="category-number">0{index + 1}</span>
                  {category}
                </span>
              ))}
            </div>
          </section>

          <section className="shop-section" aria-labelledby="products-heading">
            <div className="section-heading-row">
              <div>
                <p className="eyebrow">Catalog layout</p>
                <h2 id="products-heading">Product card preview</h2>
              </div>
              <span className="sample-label">Example layout only</span>
            </div>

            <div className="product-grid">
              {productSlots.map((category, index) => (
                <article className="product-card" key={category}>
                  <div className="product-image-placeholder">
                    <span className="placeholder-index">0{index + 1}</span>
                    <span>Product image<br />not supplied</span>
                    <span className="placeholder-corner" aria-hidden="true">+</span>
                  </div>
                  <div className="product-card-body">
                    <p className="product-category">{category}</p>
                    <h3>Product name</h3>
                    <p className="product-description">Specifications will appear here.</p>
                    <div className="product-card-bottom">
                      <span className="product-price">Price not set</span>
                      <span className="availability-label">Not listed</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="next-step-panel" aria-labelledby="shop-next-heading">
            <div>
              <p className="eyebrow">The other side of the build</p>
              <h2 id="shop-next-heading">See the PC Builder layout</h2>
              <p>Explore the companion page concept. Component selection is not active yet.</p>
            </div>
            <Link className="button-secondary" href="/builder">
              View PC Builder <span aria-hidden="true">↗</span>
            </Link>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
