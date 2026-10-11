"use client";

import { SiteHeader } from "./components/SiteNavigation";

/* ─────────────────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section style={{
      position: "relative", minHeight: "100vh",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      overflow: "hidden", padding: "120px 24px 80px",
    }}>

      {/* Glow orbs */}
      <div className="glow-blob" style={{ width: 600, height: 600, background: "radial-gradient(circle, rgba(201,168,76,.18) 0%, transparent 70%)", top: "5%", left: "50%", transform: "translateX(-50%)" }} />
      <div className="glow-blob" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(96,165,250,.08) 0%, transparent 70%)", top: "20%", right: "8%", animation: "pulse-glow 5s ease-in-out infinite" }} />
      <div className="glow-blob" style={{ width: 300, height: 300, background: "radial-gradient(circle, rgba(74,222,128,.06) 0%, transparent 70%)", bottom: "20%", left: "5%", animation: "pulse-glow 7s ease-in-out infinite .5s" }} />

      {/* Grid overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(rgba(238,210,146,.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(238,210,146,.03) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)",
      }} />

      {/* Announcement badge */}
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "5px 14px 5px 6px",
          background: "rgba(201,168,76,.08)", border: "1px solid rgba(201,168,76,.2)",
          borderRadius: 99, fontSize: ".78rem",
        }}>
          <span style={{
            background: "linear-gradient(135deg, #C9A84C, #EED292)",
            color: "#0C0C10", padding: "2px 9px", borderRadius: 99,
            fontWeight: 700, fontSize: ".72rem", letterSpacing: ".06em",
          }}>NEW</span>
          <span style={{ color: "var(--text-muted)" }}>ShiinaLab v2.0 — Smarter builds, instant results</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="var(--flaxen-dark)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6h8M6 2l4 4-4 4"/></svg>
        </div>
      </div>

      {/* Headline */}
      <h1 className="fade-up delay-100" style={{
        fontSize: "clamp(2.8rem, 7.5vw, 6rem)", fontWeight: 800,
        letterSpacing: "-.04em", lineHeight: 1.04, textAlign: "center",
        maxWidth: 900,
      }}>
        <span style={{ color: "var(--text)" }}>Your dream PC,</span>
        <br />
        <span className="grad-text-shimmer">engineered perfectly.</span>
      </h1>

      {/* Sub */}
      <p className="fade-up delay-200" style={{
        marginTop: 24, fontSize: "clamp(1rem, 2vw, 1.2rem)",
        color: "var(--text-muted)", textAlign: "center", maxWidth: 560,
        lineHeight: 1.75, letterSpacing: ".01em",
      }}>
        Select components, verify compatibility in real-time, and get precise performance
        estimates — all before you spend a single dollar.
      </p>

      {/* CTA row */}
      <div className="fade-up delay-300" style={{ display: "flex", gap: 12, marginTop: 40, flexWrap: "wrap", justifyContent: "center" }}>
        <a href="/builder" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "14px 32px", borderRadius: 10, fontWeight: 700, fontSize: "1rem",
          background: "linear-gradient(135deg, #C9A84C, #EED292)",
          color: "#0C0C10", textDecoration: "none",
          boxShadow: "0 0 32px rgba(238,210,146,.28), 0 2px 8px rgba(0,0,0,.4)",
          transition: "all .2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 48px rgba(238,210,146,.45), 0 4px 12px rgba(0,0,0,.5)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 32px rgba(238,210,146,.28), 0 2px 8px rgba(0,0,0,.4)"; e.currentTarget.style.transform = "none"; }}
        >
          Start Building Free
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M8 3l5 5-5 5"/></svg>
        </a>
        <a href="#how" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "14px 28px", borderRadius: 10, fontWeight: 600, fontSize: "1rem",
          background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)",
          color: "var(--text)", textDecoration: "none",
          transition: "all .2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.07)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.14)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.08)"; }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4"/><line x1="7" y1="6" x2="7" y2="9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="7" cy="4.5" r=".7" fill="currentColor"/></svg>
          See how it works
        </a>
      </div>

      {/* Social proof */}
      <div className="fade-up delay-400" style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 48 }}>
        {/* Avatars */}
        <div style={{ display: "flex" }}>
          {["#EED292","#60A5FA","#4ADE80","#F87171","#A78BFA"].map((c, i) => (
            <div key={i} style={{
              width: 28, height: 28, borderRadius: "50%",
              background: `${c}22`, border: `2px solid var(--bg)`,
              marginLeft: i === 0 ? 0 : -8,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: ".65rem", fontWeight: 700, color: c,
            }}>
              {["ZK","AR","MS","DL","FN"][i]}
            </div>
          ))}
        </div>
        <div style={{ fontSize: ".82rem", color: "var(--text-muted)" }}>
          Trusted by <span style={{ color: "var(--text)", fontWeight: 600 }}>12,000+</span> builders worldwide
        </div>
        <div style={{ display: "flex", gap: 2 }}>
          {[...Array(5)].map((_, i) => (
            <svg key={i} width="13" height="13" viewBox="0 0 12 12" fill="#C9A84C"><polygon points="6,1 7.5,4.5 11,4.8 8.5,7 9.3,10.5 6,8.5 2.7,10.5 3.5,7 1,4.8 4.5,4.5"/></svg>
          ))}
          <span style={{ fontSize: ".8rem", color: "var(--text-muted)", marginLeft: 4 }}>4.9/5</span>
        </div>
      </div>

      {/* Hero mockup / dashboard preview */}
      <div className="fade-up delay-500" style={{ marginTop: 72, width: "100%", maxWidth: 900, position: "relative" }}>
        {/* Glow under card */}
        <div style={{ position: "absolute", bottom: -40, left: "50%", transform: "translateX(-50%)", width: "70%", height: 80, background: "rgba(201,168,76,.12)", filter: "blur(40px)", borderRadius: "50%" }} />

        <div style={{
          borderRadius: 18,
          border: "1px solid rgba(238,210,146,.12)",
          overflow: "hidden",
          background: "var(--bg2)",
          boxShadow: "0 32px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.04)",
        }}>
          {/* Window chrome */}
          <div style={{ height: 42, background: "var(--bg3)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", padding: "0 16px", gap: 8 }}>
            {["#F87171","#FBBF24","#4ADE80"].map((c, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: .7 }} />
            ))}
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <div style={{ background: "var(--bg4)", borderRadius: 6, padding: "3px 14px", fontSize: ".72rem", color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4" stroke="var(--text-dim)" strokeWidth="1.2"/><path d="M5 3v2.5l1.5 1" stroke="var(--text-dim)" strokeWidth="1.2" strokeLinecap="round"/></svg>
                shiinalab.app/builder
              </div>
            </div>
          </div>

          {/* Fake builder UI snapshot */}
          <div style={{ padding: "20px 20px 0", background: "var(--bg2)", display: "grid", gridTemplateColumns: "1fr 260px", gap: 16 }}>
            {/* Left — part rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { icon:"🧠", label:"CPU",           name:"Intel Core i7-13700K", price:"$359", sel:true },
                { icon:"🔌", label:"Motherboard",   name:"MSI MAG Z790 TOMAHAWK", price:"$259", sel:true },
                { icon:"💾", label:"Memory",        name:"G.Skill 32GB DDR5-6000",price:"$139", sel:true },
                { icon:"🎮", label:"Graphics Card", name:"NVIDIA RTX 4070",       price:"$599", sel:true },
                { icon:"💿", label:"Storage",       name:"Click to select…",      price:"",    sel:false },
                { icon:"⚡", label:"Power Supply",  name:"Click to select…",      price:"",    sel:false },
              ].map((row, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 14px", borderRadius: 10,
                  background: row.sel ? "rgba(238,210,146,.04)" : "var(--bg3)",
                  border: `1px solid ${row.sel ? "rgba(238,210,146,.15)" : "var(--border)"}`,
                }}>
                  <div style={{ width: 32, height: 32, borderRadius: 7, background: "var(--bg4)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".95rem" }}>{row.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: ".65rem", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: ".08em" }}>{row.label}</div>
                    <div style={{ fontSize: ".82rem", fontWeight: row.sel ? 600 : 400, color: row.sel ? "var(--text)" : "var(--text-dim)", fontStyle: row.sel ? "normal" : "italic", marginTop: 1 }}>{row.name}</div>
                  </div>
                  {row.price && <div style={{ fontSize: ".85rem", fontWeight: 700, color: "var(--flaxen)" }}>{row.price}</div>}
                </div>
              ))}
              <div style={{ height: 24 }} />
            </div>

            {/* Right — sidebar preview */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {/* Budget */}
              <div style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: ".65rem", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>Budget</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--flaxen)" }}>$1,356</div>
                <div style={{ height: 4, background: "var(--bg4)", borderRadius: 2, marginTop: 10, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: "72%", background: "linear-gradient(90deg,#C9A84C,#EED292)", borderRadius: 2 }} />
                </div>
                <div style={{ fontSize: ".7rem", color: "var(--text-dim)", marginTop: 5 }}>of $2,000 budget</div>
              </div>

              {/* Scores */}
              <div style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: ".65rem", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 10 }}>Performance</div>
                {[
                  { label: "Gaming", val: 86, color: "#EED292" },
                  { label: "Productivity", val: 79, color: "#60A5FA" },
                  { label: "Rendering", val: 74, color: "#4ADE80" },
                ].map(bar => (
                  <div key={bar.label} style={{ marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".7rem", marginBottom: 4 }}>
                      <span style={{ color: "var(--text-muted)" }}>{bar.label}</span>
                      <span style={{ fontWeight: 700, color: bar.color }}>{bar.val}</span>
                    </div>
                    <div style={{ height: 4, background: "var(--bg4)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${bar.val}%`, background: bar.color, borderRadius: 2, opacity: .9 }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Compat */}
              <div style={{ background: "var(--bg3)", border: "1px solid rgba(74,222,128,.2)", borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: ".65rem", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>Compatibility</div>
                {["CPU socket matches","DDR5 RAM compatible","PSU is adequate"].map((msg, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80", flexShrink: 0 }} />
                    <div style={{ fontSize: ".72rem", color: "var(--text-muted)" }}>{msg}</div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   BRAND MARQUEE
───────────────────────────────────────────────────────────────── */
function Marquee() {
  const brands = ["Intel", "AMD", "NVIDIA", "ASUS", "MSI", "Corsair", "G.Skill", "Samsung", "Noctua", "be quiet!", "Lian Li", "NZXT", "Gigabyte", "WD Black", "Fractal Design", "Seasonic"];
  const doubled = [...brands, ...brands];
  return (
    <div style={{ overflow: "hidden", padding: "32px 0", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)", background: "var(--bg2)", position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(90deg, var(--bg2), transparent)", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(-90deg, var(--bg2), transparent)", zIndex: 1, pointerEvents: "none" }} />
      <div className="marquee-track">
        {doubled.map((b, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 32, paddingRight: 32 }}>
            <span style={{ fontSize: ".85rem", fontWeight: 600, color: "var(--text-dim)", whiteSpace: "nowrap", letterSpacing: ".05em" }}>{b}</span>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--flaxen-dark)", opacity: .5 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   FEATURES
───────────────────────────────────────────────────────────────── */
const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3 6.5L22 9.5l-5 5 1 7L12 18l-6 3.5 1-7-5-5 7-1z"/>
      </svg>
    ),
    title: "Smart Compatibility Engine",
    desc: "Real-time socket, RAM type, PSU wattage, and form factor checks as you build — no surprises at checkout.",
    color: "#EED292",
    tag: "Zero conflicts",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: "Real-World Performance Scores",
    desc: "Gaming, productivity, rendering, and content creation scores modelled from real benchmarks — not marketing numbers.",
    color: "#60A5FA",
    tag: "Benchmark-driven",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><polyline points="8 21 12 17 16 21"/>
      </svg>
    ),
    title: "FPS Estimates",
    desc: "See projected frame rates for today's top titles at your chosen resolution — Cyberpunk, Elden Ring, CS2, and more.",
    color: "#4ADE80",
    tag: "Game-specific",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
    ),
    title: "One-Click Presets",
    desc: "Start from a curated Budget, Gaming, Creative, Workstation, or Mini-ITX build — then customize to your liking.",
    color: "#FBBF24",
    tag: "Start in seconds",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    title: "Bottleneck Detection",
    desc: "Instantly spot CPU/GPU imbalances and receive a clear recommendation before you buy.",
    color: "#A78BFA",
    tag: "No regrets",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    ),
    title: "Export & Share",
    desc: "Download a clean build summary to share with friends, your local shop, or your future self.",
    color: "#F87171",
    tag: "Print-ready",
  },
];

function Features() {
  return (
    <section id="features" style={{ padding: "100px 24px", position: "relative" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Label */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <span style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--flaxen-dark)", padding: "4px 14px", background: "rgba(201,168,76,.08)", border: "1px solid rgba(201,168,76,.18)", borderRadius: 99 }}>
            Features
          </span>
        </div>

        <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-.03em", textAlign: "center", marginBottom: 16 }}>
          Everything you need,<br />
          <span className="grad-text">nothing you don't.</span>
        </h2>
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "1rem", maxWidth: 480, margin: "0 auto 64px", lineHeight: 1.7 }}>
          ShiinaLab removes the guesswork from building a PC — so you can focus on what matters.
        </p>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {features.map((f, i) => (
            <div key={i} className="glass" style={{
              borderRadius: 16, padding: "28px 28px 24px",
              transition: "border-color .2s, box-shadow .2s, transform .2s",
              cursor: "default",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${f.color}30`;
                e.currentTarget.style.boxShadow = `0 0 32px ${f.color}14`;
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,.06)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "none";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 12,
                  background: `${f.color}14`, border: `1px solid ${f.color}25`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: f.color,
                }}>
                  {f.icon}
                </div>
                <span style={{ fontSize: ".68rem", fontWeight: 700, letterSpacing: ".08em", padding: "3px 10px", borderRadius: 99, background: `${f.color}10`, color: f.color, border: `1px solid ${f.color}20` }}>
                  {f.tag}
                </span>
              </div>
              <h3 style={{ fontSize: "1.02rem", fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: ".87rem", color: "var(--text-muted)", lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   HOW IT WORKS
───────────────────────────────────────────────────────────────── */
const steps = [
  { n: "01", title: "Pick your use case",     desc: "Gaming, creative work, streaming, or a workstation — choose a starting preset or start fresh." },
  { n: "02", title: "Select your components", desc: "Browse curated CPUs, GPUs, RAM, storage, and more. The engine filters out incompatible parts automatically." },
  { n: "03", title: "Review compatibility",   desc: "Every selection is cross-checked in real time — sockets, power draw, form factors, and RAM types." },
  { n: "04", title: "Analyze performance",    desc: "See your build's gaming FPS, rendering scores, and bottleneck analysis before committing." },
];

function HowItWorks() {
  return (
    <section id="how" style={{ padding: "100px 24px", background: "var(--bg2)", position: "relative", overflow: "hidden" }}>
      <div className="glow-blob" style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(201,168,76,.08) 0%, transparent 70%)", top: "-10%", right: "-5%", pointerEvents: "none" }} />

      <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>

        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <span style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--flaxen-dark)", padding: "4px 14px", background: "rgba(201,168,76,.08)", border: "1px solid rgba(201,168,76,.18)", borderRadius: 99 }}>
            How it works
          </span>
        </div>

        <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-.03em", textAlign: "center", marginBottom: 56 }}>
          From zero to <span className="grad-text">dream build</span><br />in four steps.
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 24 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 20, padding: "24px", borderRadius: 14, background: "var(--bg3)", border: "1px solid var(--border)" }}>
              <div style={{
                fontSize: "1.4rem", fontWeight: 900, color: "var(--flaxen-dark)",
                opacity: .35, letterSpacing: "-.04em", lineHeight: 1, flexShrink: 0, minWidth: 36,
                fontVariantNumeric: "tabular-nums",
              }}>{s.n}</div>
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 6 }}>{s.title}</h3>
                <p style={{ fontSize: ".87rem", color: "var(--text-muted)", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SPECS / STATS
───────────────────────────────────────────────────────────────── */
const stats = [
  { val: "200+",   label: "Components in catalogue" },
  { val: "5",      label: "One-click presets"        },
  { val: "100%",   label: "Real-time compatibility"  },
  { val: "4 games",label: "FPS benchmarks included"  },
];

function Stats() {
  return (
    <section id="specs" style={{ padding: "80px 24px", borderTop: "1px solid var(--border-subtle)" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 1 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ padding: "36px 28px", textAlign: "center" }}>
              <div style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, letterSpacing: "-.04em" }} className="grad-text">{s.val}</div>
              <div style={{ fontSize: ".88rem", color: "var(--text-muted)", marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   TESTIMONIALS
───────────────────────────────────────────────────────────────── */
const testimonials = [
  { name: "Alex R.", role: "First-time builder", avatar: "AR", color: "#EED292", quote: "I had zero idea what was compatible. ShiinaLab walked me through everything and I ended up with a killer rig under budget." },
  { name: "Mei S.", role: "Game developer", avatar: "MS", color: "#60A5FA", quote: "The performance scores are scary accurate. I built a workstation and the rendering estimate matched real-world tests within 5%." },
  { name: "Dani L.", role: "Content creator", avatar: "DL", color: "#4ADE80", quote: "The preset system is brilliant. Started with the Creative preset, swapped the GPU up, checked compatibility — done in 3 minutes." },
  { name: "Faris N.", role: "PC enthusiast", avatar: "FN", color: "#A78BFA", quote: "Finally, a builder that doesn't let you select a DDR5 kit on a DDR4 board. The real-time checks saved me from a $300 mistake." },
];

function Testimonials() {
  return (
    <section style={{ padding: "80px 24px", background: "var(--bg2)", overflow: "hidden" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <span style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--flaxen-dark)", padding: "4px 14px", background: "rgba(201,168,76,.08)", border: "1px solid rgba(201,168,76,.18)", borderRadius: 99 }}>
            Testimonials
          </span>
        </div>
        <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 800, letterSpacing: "-.03em", textAlign: "center", marginBottom: 48 }}>
          Builders love it.
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
          {testimonials.map((t, i) => (
            <div key={i} className="glass" style={{ borderRadius: 14, padding: 22, transition: "transform .2s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "none"}
            >
              <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                {[...Array(5)].map((_, j) => <svg key={j} width="12" height="12" viewBox="0 0 12 12" fill="#C9A84C"><polygon points="6,1 7.5,4.5 11,4.8 8.5,7 9.3,10.5 6,8.5 2.7,10.5 3.5,7 1,4.8 4.5,4.5"/></svg>)}
              </div>
              <p style={{ fontSize: ".88rem", color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 16 }}>"{t.quote}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${t.color}18`, border: `1.5px solid ${t.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".7rem", fontWeight: 700, color: t.color }}>{t.avatar}</div>
                <div>
                  <div style={{ fontSize: ".85rem", fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: ".75rem", color: "var(--text-dim)" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



/* ─────────────────────────────────────────────────────────────────
   CTA BANNER
───────────────────────────────────────────────────────────────── */
function CTABanner() {
  return (
    <section style={{ padding: "80px 24px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
        <div style={{
          borderRadius: 24, padding: "64px 48px",
          background: "linear-gradient(135deg, rgba(201,168,76,.1) 0%, rgba(201,168,76,.04) 60%, rgba(96,165,250,.04) 100%)",
          border: "1px solid rgba(201,168,76,.18)",
          boxShadow: "0 0 80px rgba(201,168,76,.08)",
          position: "relative", overflow: "hidden",
        }}>
          <div className="glow-blob" style={{ width: 360, height: 360, background: "radial-gradient(circle, rgba(201,168,76,.14) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1.1, marginBottom: 16 }}>
              Ready to build your<br /><span className="grad-text">perfect machine?</span>
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "1rem", lineHeight: 1.7, marginBottom: 36, maxWidth: 440, margin: "0 auto 36px" }}>
              Start free, configure in minutes, and never second-guess a part pick again.
            </p>
            <a href="/builder" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "14px 36px", borderRadius: 10, fontWeight: 700, fontSize: "1rem",
              background: "linear-gradient(135deg, #C9A84C, #EED292)",
              color: "#0C0C10", textDecoration: "none",
              boxShadow: "0 0 40px rgba(238,210,146,.25)",
              transition: "all .2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 56px rgba(238,210,146,.42)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 40px rgba(238,210,146,.25)"; e.currentTarget.style.transform = "none"; }}
            >
              Start Building — It's Free
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M8 3l5 5-5 5"/></svg>
            </a>
            <p style={{ marginTop: 16, fontSize: ".78rem", color: "var(--text-dim)" }}>No account required · No credit card · No limits</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────────────── */
function Footer() {
  const cols = [
    { label: "Product",  links: ["Features", "How it works", "Changelog"] },
    { label: "Resources",links: ["Documentation", "Blog", "Community", "Status"] },
    { label: "Company",  links: ["About", "Careers", "Privacy", "Terms"] },
  ];

  return (
    <footer style={{ borderTop: "1px solid var(--border-subtle)", background: "var(--bg2)", padding: "64px 24px 32px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 48, marginBottom: 48 }}>
          {/* Brand */}
          <div style={{ maxWidth: 300 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 30, height: 30, borderRadius: 7, background: "linear-gradient(135deg, #C9A84C, #EED292)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <rect x="1" y="4" width="16" height="10" rx="2" fill="none" stroke="#0C0C10" strokeWidth="1.4"/>
                  <rect x="3.5" y="6.5" width="3" height="3" rx=".8" fill="#0C0C10" opacity=".8"/>
                  <rect x="7.5" y="6.5" width="3" height="3" rx=".8" fill="#0C0C10" opacity=".5"/>
                  <rect x="11.5" y="6.5" width="3" height="3" rx=".8" fill="#0C0C10" opacity=".3"/>
                </svg>
              </div>
              <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--flaxen)" }}>ShiinaLab</span>
            </div>
            <p style={{ fontSize: ".85rem", color: "var(--text-dim)", lineHeight: 1.7, marginBottom: 20 }}>
              Build. Analyze. Optimize.<br />A product by <span style={{ color: "var(--text-muted)" }}>Zulka Group</span>.
            </p>
            {/* Socials */}
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { label:"Twitter", path:"M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" },
                { label:"GitHub",  path:"M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" },
              ].map(s => (
                <a key={s.label} href="#" title={s.label} style={{
                  width: 32, height: 32, borderRadius: 7,
                  background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--text-dim)", transition: "all .15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.08)"; e.currentTarget.style.color = "var(--text-muted)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.04)"; e.currentTarget.style.color = "var(--text-dim)"; }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={s.path}/>
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link cols */}
          <div style={{ display: "flex", gap: 64 }}>
            {cols.map(col => (
              <div key={col.label}>
                <div style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: 14 }}>{col.label}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map(l => (
                    <a key={l} href="#" style={{ fontSize: ".85rem", color: "var(--text-dim)", textDecoration: "none", transition: "color .15s" }}
                      onMouseEnter={e => e.currentTarget.style.color = "var(--text-muted)"}
                      onMouseLeave={e => e.currentTarget.style.color = "var(--text-dim)"}
                    >{l}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: ".78rem", color: "var(--text-dim)" }}>
            © 2026 Zulka Group. All rights reserved.
          </div>
          <div style={{ fontSize: ".78rem", color: "var(--text-dim)", display: "flex", gap: 4, alignItems: "center" }}>
            Made with <span style={{ color: "#F87171" }}>♥</span> for PC builders everywhere.
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      <SiteHeader activePage="home" />
      <main>
        <Hero />
        <Marquee />
        <Features />
        <HowItWorks />
        <Stats />
        <Testimonials />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
