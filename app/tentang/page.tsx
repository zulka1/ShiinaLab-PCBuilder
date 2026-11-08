import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/SiteNavigation";

export const metadata: Metadata = {
  title: "About ShiinaLab | Engineering Architecture",
  description: "ShiinaLab PC Builder platform architecture, tech stack specifications, and development philosophy.",
};

export default function TentangPage() {
  return (
    <div className="min-h-screen flex flex-col text-slate-900 bg-[#f8fafc]">
      <SiteHeader activePage="tentang" />

      <main
        id="main-content"
        className="flex-1 w-full max-w-[1280px] mx-auto px-6 sm:px-10 py-12 space-y-12"
      >
        {/* HERO INTRO */}
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Platform Specification</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight">
            Engineering Precision. <br />
            Zero Compromise.
          </h1>

          <p className="text-base text-slate-600 leading-relaxed">
            ShiinaLab is an enterprise-grade PC architecture studio and hardware catalog designed to eliminate configuration guesswork with deterministic compatibility algorithms and real-time electrical telemetry.
          </p>
        </div>

        {/* 3 CORE PILLARS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-white border border-slate-200/90 p-7 shadow-xs space-y-3">
            <span className="text-3xl block">⚡</span>
            <h2 className="text-base font-extrabold text-slate-950">
              Deterministic Compatibility
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automated rule verification ensures socket matching (LGA1700 / AM5), memory generation alignment (DDR4 / DDR5), form-factor clearances (ATX / mATX / ITX), and safe PSU wattage overhead calculations.
            </p>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200/90 p-7 shadow-xs space-y-3">
            <span className="text-3xl block">🛡️</span>
            <h2 className="text-base font-extrabold text-slate-950">
              PostgreSQL 18 &amp; Prisma 7
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Backed by ACID-compliant PostgreSQL relational database with atomic transactions, cascaded review deletions, and indexed query execution for enterprise reliability.
            </p>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200/90 p-7 shadow-xs space-y-3">
            <span className="text-3xl block">🔐</span>
            <h2 className="text-base font-extrabold text-slate-950">
              Argon2id &amp; Vault Encryption
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Authenticated sessions use Argon2id cryptographic password hashing with HttpOnly partitioned cookies, coupled with optional AES-256-GCM client-side vault encryption for guest blueprints.
            </p>
          </div>
        </section>

        {/* SYSTEM SPECIFICATIONS TABLE */}
        <section className="rounded-3xl bg-white border border-slate-200/90 p-8 shadow-xs space-y-6">
          <h2 className="text-xl font-extrabold text-slate-950 tracking-tight">
            Technology Stack &amp; Architecture
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Framework</span>
              <strong className="text-slate-900 block text-sm">Next.js 16 (App Router)</strong>
              <p className="text-slate-500 text-[11px]">Server Components, Server Actions &amp; PPR</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Language</span>
              <strong className="text-slate-900 block text-sm">TypeScript 5 (Strict)</strong>
              <p className="text-slate-500 text-[11px]">End-to-end typed contracts &amp; Zod schemas</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Persistence</span>
              <strong className="text-slate-900 block text-sm">PostgreSQL 18 + Prisma 7</strong>
              <p className="text-slate-500 text-[11px]">Type-safe ORM &amp; idempotent seeds</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Styling Engine</span>
              <strong className="text-slate-900 block text-sm">Tailwind CSS v4</strong>
              <p className="text-slate-500 text-[11px]">Ceramic white aesthetic &amp; WCAG AA contrast</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              ShiinaLab PC Builder Engineering Laboratory
            </span>
            <Link
              href="/builder"
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              Launch Configurator →
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
