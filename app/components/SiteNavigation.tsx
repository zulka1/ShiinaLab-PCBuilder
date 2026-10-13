"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type SitePage = "home" | "shop" | "builder" | "account";

const navigation = [
  { label: "Beranda", href: "/", page: "home" },
  { label: "Katalog", href: "/shop", page: "shop" },
  { label: "PC Builder", href: "/builder", page: "builder" },
  { label: "Akun", href: "/account", page: "account" },
] as const;

export function SiteHeader({ activePage }: { activePage: SitePage }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setScrolled(window.scrollY > 20);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  return (
    <header
      className={`site-header${scrolled || activePage !== "home" ? " site-header-solid" : ""}`}
    >
      <div className="site-header-inner">
        <Link className="site-brand" href="/" aria-label="ShiinaLab home">
          <span className="site-brand-mark" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="1" y="4" width="16" height="10" rx="2" fill="none" stroke="#0C0C10" strokeWidth="1.4" />
              <rect x="3.5" y="6.5" width="3" height="3" rx=".8" fill="#0C0C10" opacity=".8" />
              <rect x="7.5" y="6.5" width="3" height="3" rx=".8" fill="#0C0C10" opacity=".5" />
              <rect x="11.5" y="6.5" width="3" height="3" rx=".8" fill="#0C0C10" opacity=".3" />
              <rect x="3.5" y="11" width="11" height="1.2" rx=".6" fill="#0C0C10" opacity=".25" />
              <line x1="9" y1="14" x2="9" y2="16.5" stroke="#0C0C10" strokeWidth="1.2" />
              <line x1="6" y1="16.5" x2="12" y2="16.5" stroke="#0C0C10" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </span>
          <span className="site-brand-copy">
            <span className="site-brand-name">ShiinaLab</span>
            <span className="site-brand-tagline">PC Builder</span>
          </span>
        </Link>

        <nav className="site-desktop-nav" aria-label="Navigasi utama">
          {navigation.map((item) => (
            <Link
              key={item.page}
              href={item.href}
              className={`site-nav-link${activePage === item.page ? " is-active" : ""}`}
              aria-current={activePage === item.page ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link className="site-header-cta" href="/builder">
          Mulai merakit
          <span aria-hidden="true">↗</span>
        </Link>

        <button
          className="site-menu-toggle"
          type="button"
          aria-label={menuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          aria-expanded={menuOpen}
          aria-controls="site-mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </div>

      <nav
        id="site-mobile-navigation"
        className={`site-mobile-nav${menuOpen ? " is-open" : ""}`}
        aria-label="Navigasi seluler"
        hidden={!menuOpen}
      >
        {navigation.map((item) => (
          <Link
            key={item.page}
            href={item.href}
            className={`site-mobile-nav-link${activePage === item.page ? " is-active" : ""}`}
            aria-current={activePage === item.page ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
            <span aria-hidden="true">↗</span>
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <Link className="site-footer-brand" href="/">
          ShiinaLab <span>Rakit. Analisis. Optimalkan.</span>
        </Link>
        <nav className="site-footer-nav" aria-label="Navigasi footer">
          {navigation.map((item) => (
            <Link key={item.page} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <p>By Zulka Group</p>
      </div>
    </footer>
  );
}
