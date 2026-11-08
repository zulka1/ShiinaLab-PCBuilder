"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

export type SitePage = "home" | "shop" | "builder" | "account" | "about" | "tentang" | "admin";

const navigation = [
  { label: "Home", href: "/", page: "home" },
  { label: "PC Builder", href: "/builder", page: "builder" },
  { label: "Catalog", href: "/shop", page: "shop" },
  { label: "About", href: "/tentang", page: "about" },
] as const;

export function SiteHeader({ activePage }: { activePage: SitePage }) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<{
    id: number;
    username: string;
    fullName: string | null;
    email: string | null;
    role: string;
  } | null>(null);

  useEffect(() => {
    const updateScrollState = () => setScrolled(window.scrollY > 12);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/account/profile");
        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            setUser(data.user);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };
    void fetchUser();

    const syncCart = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("shiinalab-cart") || "[]");
        const count = Array.isArray(cart)
          ? cart.reduce(
              (acc: number, item: { qty?: number; quantity?: number }) =>
                acc + (item.qty || item.quantity || 1),
              0,
            )
          : 0;
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    };
    syncCart();
    window.addEventListener("storage", syncCart);
    window.addEventListener("shiinalab-cart-change", syncCart);

    return () => {
      window.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("storage", syncCart);
      window.removeEventListener("shiinalab-cart-change", syncCart);
    };
  }, []);

  function handleSearchSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/shop?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/shop");
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200/80"
          : "bg-white/80 backdrop-blur-sm border-b border-slate-200/50"
      }`}
    >
      <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-14 h-20 flex items-center justify-between gap-6">
        {/* BRAND LOGO */}
        <Link
          className="flex items-center gap-3 group shrink-0"
          href="/"
          aria-label="ShiinaLab Home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-0.5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="4" y="4" width="16" height="16" rx="3" />
                <rect x="9" y="9" width="6" height="6" rx="1" fill="#38bdf8" stroke="#2563eb" />
                <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
              </svg>
            </div>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-950">
            ShiinaLab
          </span>
        </Link>

        {/* DESKTOP NAVIGATION LINKS */}
        <nav
          className="hidden md:flex items-center gap-2 lg:gap-6"
          aria-label="Navigasi utama"
        >
          {navigation.map((item) => {
            const isActive = activePage === item.page;
            return (
              <Link
                key={item.page}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative px-3 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "text-blue-600 font-bold"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-blue-600" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT CONTROLS: SEARCH, CART, SIGN IN / PROFILE */}
        <div className="flex items-center gap-3">
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex items-center relative"
            role="search"
          >
            <label htmlFor="header-search" className="visually-hidden">
              Search components
            </label>
            <input
              id="header-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search components..."
              className="w-56 xl:w-64 pl-9 pr-4 py-2 rounded-full bg-slate-100/90 border border-slate-200/90 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
            <svg
              className="absolute left-3.5 text-slate-400 pointer-events-none"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </form>

          {/* CART BUTTON */}
          <Link
            href="/shop"
            className="relative w-10 h-10 rounded-full bg-white border border-slate-200 hover:border-slate-300 flex items-center justify-center text-slate-700 hover:text-slate-950 shadow-2xs transition"
            aria-label="Shopping Cart and Catalog"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-extrabold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* AUTHENTICATION STATE */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 shadow-2xs transition"
                aria-expanded={userDropdownOpen}
                aria-haspopup="menu"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center uppercase shadow-2xs">
                  {(user.fullName || user.username).charAt(0)}
                </div>
                <span className="text-xs font-bold text-slate-800 max-w-[110px] truncate hidden sm:inline">
                  {user.fullName || user.username}
                </span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="text-slate-400"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {userDropdownOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 text-xs"
                >
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="font-extrabold text-slate-900 truncate">
                      {user.fullName || user.username}
                    </p>
                    <p className="text-slate-400 text-[11px] truncate">
                      {user.email || `@${user.username}`}
                    </p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60 uppercase">
                      {user.role === "admin" ? "Super Admin" : "User"}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 font-semibold"
                    >
                      <span>My Saved Builds &amp; Account</span>
                    </Link>

                    {user.role === "admin" && (
                      <>
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-blue-600 hover:bg-blue-50 font-bold"
                        >
                          <span>Admin Console</span>
                        </Link>
                        <Link
                          href="/shop/tambah"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 font-semibold"
                        >
                          <span>+ Add Component (Form)</span>
                        </Link>
                      </>
                    )}
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <Link
                      href="/api/auth/logout"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-red-600 hover:bg-red-50 font-bold"
                    >
                      <span>Sign Out</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/masuk"
              className="px-5 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-900 font-bold text-xs shadow-2xs transition"
            >
              Sign In
            </Link>
          )}

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700"
            aria-label={menuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={menuOpen}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              aria-hidden="true"
            >
              {menuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION DRAWER */}
      {menuOpen && (
        <nav
          className="md:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-2"
          aria-label="Navigasi seluler"
        >
          {navigation.map((item) => {
            const isActive = activePage === item.page;
            return (
              <Link
                key={item.page}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={`block px-4 py-2.5 rounded-xl text-sm font-bold ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          {user ? (
            <Link
              href="/account"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              My Account ({user.username})
            </Link>
          ) : (
            <Link
              href="/masuk"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-bold text-blue-600 hover:bg-blue-50"
            >
              Sign In
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-slate-200/80 bg-white">
      <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-14 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-sm shadow-xs">
                S
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-950">
                ShiinaLab
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Next-generation PC Builder Studio &amp; official hardware catalog with real-time compatibility checking and power calculation.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-3.5">
              Platform
            </h3>
            <ul className="space-y-2 text-xs text-slate-500 font-medium">
              <li><Link href="/builder" className="hover:text-blue-600 transition">PC Builder Studio</Link></li>
              <li><Link href="/shop" className="hover:text-blue-600 transition">Components Catalog</Link></li>
              <li><Link href="/tentang" className="hover:text-blue-600 transition">About &amp; Architecture</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-3.5">
              Account &amp; Vault
            </h3>
            <ul className="space-y-2 text-xs text-slate-500 font-medium">
              <li><Link href="/masuk" className="hover:text-blue-600 transition">Sign In / Register</Link></li>
              <li><Link href="/account" className="hover:text-blue-600 transition">My Saved Builds</Link></li>
              <li><Link href="/admin" className="hover:text-blue-600 transition">Staff Admin Console</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-3.5">
              Hardware Verification
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every custom build is checked for CPU socket alignment, DDR4/DDR5 memory generation, motherboard form factor, and PSU wattage headroom.
            </p>
            <div className="mt-3 flex items-center gap-2 text-[11px] font-bold text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Compatibility Engine Online</span>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 ShiinaLab PC Builder &amp; Parts Store. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/tentang" className="hover:text-slate-600">About</Link>
            <Link href="/shop" className="hover:text-slate-600">Catalog</Link>
            <Link href="/builder" className="hover:text-slate-600">PC Builder</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
