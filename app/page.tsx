import Image from "next/image";
import Link from "next/link";
import { BrandMarquee } from "./components/BrandMarquee";
import { SiteFooter, SiteHeader } from "./components/SiteNavigation";
import { formatRupiah } from "./data/mock-products";

const signatureRigs = [
  {
    id: "snow-beast-4k",
    name: "White Snow Beast 4K",
    badge: "Flagship 4K Rig",
    tagline: "Uncompromising 4K ray-tracing & AI workstation in a panoramic white glass chassis.",
    price: 47_000_000,
    wattage: "680W / 850W PSU",
    image: "/images/hero-pc-rig.jpg",
    specs: [
      "Intel Core i9-14900K (24-Core)",
      "ASUS ROG Strix RTX 4080 16GB White",
      "Corsair Dominator Titanium 32GB DDR5",
      "Lian Li O11 Dynamic EVO White",
    ],
  },
  {
    id: "aero-creator",
    name: "Aero Creator Studio",
    badge: "Creator Choice",
    tagline: "Whisper-quiet 1440p high-refresh gaming and 3D rendering powerhouse.",
    price: 33_350_000,
    wattage: "580W / 750W PSU",
    image: "/images/builder-pc-rig.jpg",
    specs: [
      "AMD Ryzen 9 7950X3D (16-Core)",
      "Gigabyte GeForce RTX 4070 Ti Aero OC",
      "32GB DDR5-6000MHz CL30",
      "WD_BLACK SN850X 2TB NVMe SSD",
    ],
  },
  {
    id: "esports-pro",
    name: "Apex 1440p Competitive",
    badge: "Best Value",
    tagline: "Balanced AM5 architecture tuned for high FPS esports and daily productivity.",
    price: 17_450_000,
    wattage: "420W / 750W PSU",
    image: "/images/hero-pc-rig.jpg",
    specs: [
      "AMD Ryzen 5 7600 (6-Core AM5)",
      "MSI GeForce RTX 4060 8GB Ventus 2X",
      "Kingston FURY Beast 32GB DDR5",
      "Samsung 980 PRO 1TB PCIe 4.0 NVMe",
    ],
  },
];

const engineeringSteps = [
  {
    step: "01",
    title: "Select Core Platform",
    description: "Choose Intel LGA1700 or AMD AM5 processors with automatic motherboard socket verification.",
  },
  {
    step: "02",
    title: "Match Memory & Graphics",
    description: "Pair DDR4/DDR5 kits and flagship white GPUs with real-time slot and clearance validation.",
  },
  {
    step: "03",
    title: "Live Power & Thermal Calc",
    description: "Monitor dynamic TDP wattage draw against your power supply capacity on the interactive gauge.",
  },
  {
    step: "04",
    title: "Save to Encrypted Vault",
    description: "Store your custom rig blueprints to your personal PostgreSQL account or AES-256-GCM local vault.",
  },
];

const testimonials = [
  {
    name: "Marcus Vance",
    role: "3D Technical Artist",
    rating: 5,
    comment: "The compatibility engine immediately flagged a DDR4 vs DDR5 motherboard mismatch before I ordered. Saved me days of troubleshooting.",
  },
  {
    name: "Elena Rostova",
    role: "Competitive Gamer & Streamer",
    rating: 5,
    comment: "Assembled my all-white RTX 4080 build in under 10 minutes. The real-time wattage meter made picking an 850W PSU effortless.",
  },
  {
    name: "Daniel Kurniawan",
    role: "Software Engineer",
    rating: 5,
    comment: "Clean ceramic interface, instant price calculation in Rupiah, and my saved builds sync right to my account dashboard.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col text-slate-900">
      <SiteHeader activePage="home" />

      <main
        id="main-content"
        className="flex-1 w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-14 py-8 sm:py-12 space-y-20"
      >
        {/* HERO SECTION - EXACT REFERENCE MOCKUP 1 */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-2">
          {/* LEFT: HEADLINE & CTA BUTTONS */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" aria-hidden="true" />
              <span>ShiinaLab PC Engineering Studio</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[64px] font-extrabold tracking-tight text-slate-950 leading-[1.08]">
              Build Your Dream PC <br />
              With Zero Guesswork.
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-xl leading-relaxed">
              Smart compatibility checking, real-time power calculation, and instant price estimates.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/builder"
                className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-[0_12px_28px_-4px_rgba(37,99,235,0.5)] hover:shadow-[0_16px_34px_-4px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 transition-all duration-200"
              >
                Start Building Now
              </Link>
              <Link
                href="/shop"
                className="px-8 py-4 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 font-bold text-sm shadow-xs hover:border-slate-300 transition-all duration-200"
              >
                Explore Parts
              </Link>
            </div>
          </div>

          {/* RIGHT: 3D WHITE PC RIG SHOWCASE */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div
              className="absolute w-80 h-80 sm:w-[480px] sm:h-[480px] rounded-full bg-cyan-400/20 blur-3xl -z-10 pointer-events-none"
              aria-hidden="true"
            />
            <div className="relative w-full h-[440px] sm:h-[520px] lg:h-[580px] xl:h-[620px] rounded-[32px] bg-gradient-to-b from-slate-50/50 via-white to-slate-50/80 border border-slate-200/90 shadow-[0_24px_60px_-15px_rgba(15,23,42,0.08)] flex items-center justify-center overflow-hidden group">
              <div className="relative w-full h-full">
                <Image
                  src="/images/hero-pc-rig.jpg"
                  alt="Flagship All-White Custom Water-Cooled Gaming PC Rig"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>
              <div className="absolute bottom-5 right-5 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200/90 text-xs font-bold text-slate-800 shadow-sm flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" aria-hidden="true" />
                <span>Ceramic White Edition</span>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE HIGHLIGHT PANEL - EXACT MATCH TO MOCKUP 1 BOTTOM BAR */}
        <section
          aria-labelledby="feature-highlight-heading"
          className="rounded-[32px] bg-white/90 backdrop-blur-md border border-slate-200/90 p-6 sm:p-8 lg:p-10 shadow-[0_16px_40px_-12px_rgba(15,23,42,0.06)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* LEFT: FEATURE HIGHLIGHT INTRO */}
            <div className="lg:col-span-4 flex flex-col justify-center pr-2">
              <h2
                id="feature-highlight-heading"
                className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-tight"
              >
                Feature <br />
                Highlight
              </h2>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                Clean ceramic cards with frosted glass telemetry, real-time wattage calculation, and automated socket compatibility verification.
              </p>
            </div>

            {/* MIDDLE CARD: REAL-TIME WATTAGE CALC */}
            <div className="lg:col-span-4 rounded-2xl bg-[#f8fafc] border border-slate-200/80 p-6 flex flex-col justify-between shadow-2xs hover:border-blue-200 transition">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-950">
                    Real-time Wattage Calc
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Interactive power meter
                  </p>
                </div>
                <Link
                  href="/builder"
                  aria-label="Open Real-time Wattage Calculator in PC Builder"
                  className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-300 transition shrink-0"
                >
                  ›
                </Link>
              </div>

              <div className="mt-6 space-y-2">
                <div className="h-2.5 w-full rounded-full bg-slate-200/90 overflow-hidden">
                  <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" />
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span>Est. 680W Draw</span>
                  <span className="text-blue-600">850W PSU Optimal</span>
                </div>
              </div>
            </div>

            {/* RIGHT CARD: SOCKET & RAM COMPATIBILITY ENGINE */}
            <div className="lg:col-span-4 rounded-2xl bg-[#f8fafc] border border-slate-200/80 p-6 flex flex-col justify-between shadow-2xs hover:border-emerald-200 transition">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-950">
                    Socket &amp; RAM <br />
                    Compatibility Engine
                  </h3>
                </div>
                <Link
                  href="/builder"
                  aria-label="Check Socket and RAM Compatibility in PC Builder"
                  className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-emerald-600 hover:border-emerald-300 transition shrink-0"
                >
                  ›
                </Link>
              </div>

              <div className="mt-6 flex items-center gap-2.5 text-xs font-bold text-emerald-700 bg-emerald-50/90 border border-emerald-200/80 px-3.5 py-2.5 rounded-xl">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.8"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Socket &amp; RAM Compatibility Engine</span>
              </div>
            </div>
          </div>
        </section>

        {/* SIGNATURE PRE-BUILT CONFIGURATIONS */}
        <section className="space-y-8" aria-labelledby="prebuilt-heading">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 block mb-1">
                Curated Blueprints
              </span>
              <h2
                id="prebuilt-heading"
                className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight"
              >
                Signature Pre-Built Configurations
              </h2>
            </div>
            <Link
              href="/builder"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Customize in PC Builder</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {signatureRigs.map((rig) => (
              <article
                key={rig.id}
                className="group bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
                      {rig.badge}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {rig.wattage}
                    </span>
                  </div>

                  <div className="relative w-full h-56 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-100 mb-5 overflow-hidden flex items-center justify-center">
                    <Image
                      src={rig.image}
                      alt={rig.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-contain scale-110 group-hover:scale-120 transition-transform duration-300"
                    />
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-950">
                    {rig.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
                    {rig.tagline}
                  </p>

                  <ul className="space-y-1.5 py-3.5 border-y border-slate-100 text-xs text-slate-700 font-medium">
                    {rig.specs.map((spec) => (
                      <li key={spec} className="flex items-center gap-2">
                        <span className="text-emerald-500 font-bold" aria-hidden="true">✓</span>
                        <span className="truncate">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 mt-4 flex items-center justify-between gap-3">
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                      Estimated Total
                    </span>
                    <strong className="text-base font-extrabold text-slate-950">
                      {formatRupiah(rig.price)}
                    </strong>
                  </div>
                  <Link
                    href="/builder"
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-xs shadow-sm hover:shadow-md transition flex items-center gap-1.5"
                  >
                    <span className="text-white font-bold">Open in Builder</span>
                    <span className="text-blue-200" aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 4-STEP ENGINEERING WORKFLOW */}
        <section
          aria-labelledby="workflow-heading"
          className="rounded-[32px] bg-white border border-slate-200/90 p-8 sm:p-12 shadow-xs space-y-8"
        >
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 block">
              How It Works
            </span>
            <h2
              id="workflow-heading"
              className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight"
            >
              Engineered for Precision PC Building
            </h2>
            <p className="text-sm text-slate-500">
              From processor selection to encrypted blueprint storage in four guided steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {engineeringSteps.map((item) => (
              <div
                key={item.step}
                className="rounded-2xl bg-[#f8fafc] border border-slate-200/70 p-6 space-y-3"
              >
                <span className="w-9 h-9 rounded-xl bg-blue-600 text-white text-xs font-extrabold flex items-center justify-center shadow-xs">
                  {item.step}
                </span>
                <h3 className="text-base font-extrabold text-slate-950">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SUPPORTED BRANDS */}
        <section className="space-y-3 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Supported Hardware Manufacturers &amp; Ecosystem
          </p>
          <BrandMarquee />
        </section>

        {/* CUSTOMER REVIEWS */}
        <section className="space-y-8" aria-labelledby="reviews-heading">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 block">
              Community Feedback
            </span>
            <h2
              id="reviews-heading"
              className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight"
            >
              Trusted by PC Builders &amp; Enthusiasts
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <article
                key={item.name}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="text-amber-400 text-sm tracking-wide" aria-label={`${item.rating} out of 5 stars`}>
                    {"★".repeat(item.rating)}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    &ldquo;{item.comment}&rdquo;
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 font-extrabold text-xs flex items-center justify-center">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-slate-400">{item.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
