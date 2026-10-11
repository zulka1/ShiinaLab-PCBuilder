import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/SiteNavigation";

export const metadata: Metadata = {
  title: "PC Builder | ShiinaLab",
  description: "Preview the planned PC Builder layout for ShiinaLab.",
};

const componentTypes = [
  { name: "Processor", number: "01", hint: "CPU" },
  { name: "Motherboard", number: "02", hint: "Mainboard" },
  { name: "Graphics card", number: "03", hint: "GPU" },
  { name: "Memory", number: "04", hint: "RAM" },
  { name: "Storage", number: "05", hint: "SSD / HDD" },
  { name: "Power supply", number: "06", hint: "PSU" },
  { name: "Case", number: "07", hint: "Chassis" },
];

export default function BuilderPage() {
  return (
    <>
      <SiteHeader activePage="builder" />
      <main className="site-page">
        <div className="page-container">
          <section className="page-intro builder-intro">
            <p className="eyebrow"><span /> Configuration workspace / concept preview</p>
            <h1>
              PC Builder
              <span className="grad-text">, in outline.</span>
            </h1>
            <p className="page-lede">
              A static preview of the planned build workspace. No parts are
              selectable and no compatibility or performance simulation runs here.
            </p>
            <p className="preview-note">
              <span className="preview-note-dot" />
              Layout concept only — component data and builder logic are not ready.
            </p>
          </section>

          <div className="builder-layout">
            <section className="builder-components" aria-labelledby="components-heading">
              <div className="section-heading-row builder-section-heading">
                <div>
                  <p className="eyebrow">Build outline</p>
                  <h2 id="components-heading">Choose your components</h2>
                </div>
                <span className="section-index">0 / 7 selected</span>
              </div>

              <div className="component-list">
                {componentTypes.map((component) => (
                  <article className="component-row" key={component.number}>
                    <span className="component-number">{component.number}</span>
                    <span className="component-copy">
                      <span className="component-name">{component.name}</span>
                      <span className="component-hint">{component.hint}</span>
                    </span>
                    <span className="component-status">Not selected</span>
                    <span className="component-plus" aria-hidden="true">+</span>
                  </article>
                ))}
              </div>

              <p className="builder-footnote">
                Component rows show the planned structure; they are not interactive controls.
              </p>
            </section>

            <aside className="build-summary" aria-labelledby="summary-heading">
              <div className="summary-topline">
                <span>BUILD SUMMARY</span>
                <span className="summary-state">PREVIEW</span>
              </div>
              <h2 id="summary-heading">Your configuration</h2>
              <p className="summary-copy">Selected components will appear here.</p>

              <div className="summary-stat">
                <span>Components selected</span>
                <strong>0 / 7</strong>
              </div>
              <div className="summary-stat">
                <span>Estimated total</span>
                <strong className="summary-price">Not calculated</strong>
              </div>
              <div className="compatibility-status">
                <span className="compatibility-mark" aria-hidden="true">—</span>
                <span>
                  <strong>Compatibility check</strong>
                  <small>Not available in this preview</small>
                </span>
              </div>

              <button className="builder-disabled-action" type="button" disabled>
                Builder not active yet
              </button>
              <Link className="summary-shop-link" href="/shop">
                Browse planned categories <span aria-hidden="true">↗</span>
              </Link>
            </aside>
          </div>

          <section className="builder-disclaimer">
            <span className="disclaimer-symbol" aria-hidden="true">i</span>
            <p>
              <strong>Static wireframe.</strong> This page does not select real
              products, calculate a build, check compatibility, or place orders.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
