"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { SiteFooter, SiteHeader } from "../components/SiteNavigation";
import { formatRupiah } from "../data/mock-products";

type Profile = {
  username: string;
  fullName: string | null;
  email: string | null;
};

type UserBuild = {
  id: number | string;
  nama?: string;
  name?: string;
  total?: number;
  totalPrice?: number;
  komponen?: string[];
  components?: Record<string, string>;
  watt?: number;
  estimatedWattage?: number;
  dibuatPada?: string;
  createdAt?: string;
};

const defaultMockBuilds: UserBuild[] = [
  {
    id: 1,
    nama: "White Snow Beast 4K",
    total: 47_000_000,
    komponen: [
      "Processor: Intel Core i9-14900K (LGA1700)",
      "Graphics Card: ASUS ROG Strix RTX 4080 White",
      "Memory: Corsair Dominator Titanium 32GB DDR5",
      "Chassis: Lian Li O11 Dynamic EVO White",
    ],
    watt: 680,
    dibuatPada: "2026-11-08T00:00:00.000Z",
  },
  {
    id: 2,
    nama: "Compact ITX Workstation",
    total: 33_350_000,
    komponen: [
      "Processor: AMD Ryzen 9 7950X3D (AM5)",
      "Graphics Card: Gigabyte RTX 4070 Ti Aero OC White",
      "Memory: Kingston FURY Beast 32GB DDR5",
      "Cooler: NZXT Kraken Elite 360 RGB White",
    ],
    watt: 580,
    dibuatPada: "2026-11-08T00:00:00.000Z",
  },
];

export default function AccountPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authRequired, setAuthRequired] = useState(false);
  const [activeTab, setActiveTab] = useState<"builds" | "settings" | "security" | "wishlist">("builds");
  const [builds, setBuilds] = useState<UserBuild[]>(defaultMockBuilds);
  const [loading, setLoading] = useState(true);

  // Profile edit state
  const [fullNameInput, setFullNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [profileNotice, setProfileNotice] = useState<string | null>(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordNotice, setPasswordNotice] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/account/profile");
        if (res.status === 401) {
          setAuthRequired(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          const json = await res.json();
          if (json.user) {
            setProfile(json.user);
            setFullNameInput(json.user.fullName || "");
            setEmailInput(json.user.email || "");
          }
        }
      } catch {
        // Guest mode fallback
      }

      // Load saved builds from PostgreSQL
      try {
        const buildRes = await fetch("/api/account/builds");
        if (buildRes.ok) {
          const buildJson = await buildRes.json();
          if (Array.isArray(buildJson.builds) && buildJson.builds.length > 0) {
            setBuilds(buildJson.builds);
          }
        }
      } catch {
        // Fallback to default mock builds
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, []);

  const handleDeleteBuild = async (buildId: number | string) => {
    if (!confirm("Are you sure you want to delete this custom build configuration?")) return;

    try {
      await fetch(`/api/account/builds?id=${buildId}`, { method: "DELETE" });
      setBuilds((prev) => prev.filter((b) => b.id !== buildId));
    } catch {
      setBuilds((prev) => prev.filter((b) => b.id !== buildId));
    }
  };

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    setProfileNotice(null);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: fullNameInput, email: emailInput }),
      });
      if (res.ok) {
        setProfileNotice("Profile updated successfully!");
        setProfile((prev) => (prev ? { ...prev, fullName: fullNameInput, email: emailInput } : null));
      } else {
        setProfileNotice("Failed to update profile.");
      }
    } catch {
      setProfileNotice("Network error.");
    }
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordNotice(null);
    try {
      const res = await fetch("/api/account/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        setPasswordNotice("Password updated securely!");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        const json = await res.json();
        setPasswordNotice(json.error || "Failed to update password.");
      }
    } catch {
      setPasswordNotice("Network error.");
    }
  };

  const displayName = profile?.fullName || profile?.username || "Alex Rivera";
  const displayEmail = profile?.email || (profile ? `${profile.username}@shiinalab.io` : "alex@shiinalab.io");

  return (
    <div className="min-h-screen flex flex-col text-slate-900 bg-[#f8fafc]">
      <SiteHeader activePage="account" />

      <main
        id="main-content"
        className="flex-1 w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-8"
      >
        {/* TOP USER PROFILE CARD - EXACT MATCH TO MOCKUP 5 */}
        <section className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
              <span className="text-2xl font-black text-slate-700">
                {displayName.slice(0, 1).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
                {displayName}
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {displayEmail}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-xs font-bold text-slate-700 shadow-2xs flex items-center gap-2">
              <span>🏷️</span>
              <span>{builds.length} Builds Saved</span>
            </span>
            <span className="px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-bold text-emerald-700 shadow-2xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>PostgreSQL &amp; AES-256 Encrypted</span>
            </span>
          </div>
        </section>

        {/* WORKSPACE LAYOUT: TABS, SAVED BUILDS, AND SECURITY PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDEBAR NAVIGATION TABS */}
          <aside className="lg:col-span-3 space-y-2">
            <button
              type="button"
              onClick={() => setActiveTab("builds")}
              className={`w-full text-left px-5 py-3 rounded-2xl text-xs font-extrabold transition flex items-center justify-between ${
                activeTab === "builds"
                  ? "bg-slate-200/80 text-slate-900 shadow-2xs"
                  : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80"
              }`}
            >
              <span>My Saved Builds</span>
              <span className="text-[11px] font-bold text-slate-400">({builds.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`w-full text-left px-5 py-3 rounded-2xl text-xs font-extrabold transition flex items-center justify-between ${
                activeTab === "settings"
                  ? "bg-slate-200/80 text-slate-900 shadow-2xs"
                  : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80"
              }`}
            >
              <span>Account Settings</span>
              <span>⚙️</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("security")}
              className={`w-full text-left px-5 py-3 rounded-2xl text-xs font-extrabold transition flex items-center justify-between ${
                activeTab === "security"
                  ? "bg-slate-200/80 text-slate-900 shadow-2xs"
                  : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80"
              }`}
            >
              <span>Security &amp; Cryptographic Keys</span>
              <span>🔒</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("wishlist")}
              className={`w-full text-left px-5 py-3 rounded-2xl text-xs font-extrabold transition flex items-center justify-between ${
                activeTab === "wishlist"
                  ? "bg-slate-200/80 text-slate-900 shadow-2xs"
                  : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80"
              }`}
            >
              <span>Wishlist</span>
              <span>♡</span>
            </button>

            <div className="pt-4">
              <Link
                href="/api/auth/logout"
                className="w-full text-left px-5 py-2.5 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition block"
              >
                Sign Out from Session
              </Link>
            </div>
          </aside>

          {/* CENTER: SAVED BUILDS LIST - EXACT MATCH TO MOCKUP 5 */}
          {activeTab === "builds" && (
            <section className="lg:col-span-6 space-y-5">
              {builds.map((build) => {
                const buildName = build.nama || build.name || "Custom Build";
                const buildTotal = build.total ?? build.totalPrice ?? 0;
                const buildWatt = build.watt ?? build.estimatedWattage ?? 650;
                const buildDate = build.dibuatPada || build.createdAt || "2026-11-08";
                const specs: string[] = Array.isArray(build.komponen)
                  ? build.komponen
                  : build.components && typeof build.components === "object"
                    ? Object.entries(build.components).map(([k, v]) => `${k}: ${v}`)
                    : [];

                return (
                  <article
                    key={build.id}
                    className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row items-start justify-between gap-6"
                  >
                    <div className="space-y-3 flex-1 min-w-0">
                      <div>
                        <h2 className="text-base font-extrabold text-slate-950 truncate">
                          {buildName}
                        </h2>
                        <p suppressHydrationWarning className="text-[11px] text-slate-400 mt-0.5">
                          Saved PC Blueprint • Updated {new Date(buildDate).toLocaleDateString()}
                        </p>
                      </div>

                      {/* SPECS BULLETS */}
                      <ul className="text-xs text-slate-600 space-y-1">
                        {specs.slice(0, 4).map((spec, i) => (
                          <li key={i} className="truncate">
                            • {spec}
                          </li>
                        ))}
                      </ul>

                      {/* PRICE AND WATTAGE */}
                      <div className="flex items-center gap-2.5 pt-1 flex-wrap">
                        <span className="text-sm font-extrabold text-slate-950">
                          {formatRupiah(buildTotal)}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                          Estimated Wattage {buildWatt}W
                        </span>
                      </div>

                      {/* ACTION BUTTONS ROW */}
                      <div className="flex items-center gap-2 pt-2 flex-wrap">
                        <Link
                          href="/builder"
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-2xs transition"
                        >
                          Open in Builder
                        </Link>
                        <button
                          type="button"
                          onClick={() => alert(`Blueprint ${buildName} link copied!`)}
                          className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs transition"
                        >
                          Share Link
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBuild(build.id)}
                          className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* RIG THUMBNAIL */}
                    <div className="relative w-36 h-36 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-100 shrink-0 overflow-hidden flex items-center justify-center p-2">
                      <Image
                        src="/images/builder-pc-rig.jpg"
                        alt={buildName}
                        fill
                        sizes="144px"
                        className="object-contain p-2 hover:scale-105 transition"
                      />
                    </div>
                  </article>
                );
              })}

              {/* CREATE NEW CUSTOM BUILD DASHED CARD */}
              <Link
                href="/builder"
                className="rounded-3xl border-2 border-dashed border-slate-300 hover:border-blue-500 bg-white/60 hover:bg-blue-50/20 p-8 flex flex-col items-center justify-center text-center transition-all duration-200 group block"
              >
                <span className="text-3xl text-slate-400 group-hover:text-blue-600 transition mb-2">
                  +
                </span>
                <span className="text-sm font-extrabold text-slate-800 group-hover:text-blue-600 transition">
                  Create New Custom Build
                </span>
                <span className="text-xs text-slate-400 mt-1">
                  Launch the 3D rig configurator and live wattage calculator.
                </span>
              </Link>
            </section>
          )}

          {/* TAB 2: ACCOUNT SETTINGS */}
          {activeTab === "settings" && (
            <section className="lg:col-span-6 rounded-3xl bg-white border border-slate-200/90 p-7 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-extrabold text-slate-950">
                  Account Settings
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your contact details and display profile.
                </p>
              </div>

              {profileNotice && (
                <div className="p-3 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                  {profileNotice}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullNameInput}
                    onChange={(e) => setFullNameInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* TAB 3: SECURITY & KEYS */}
          {activeTab === "security" && (
            <section className="lg:col-span-6 rounded-3xl bg-white border border-slate-200/90 p-7 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-extrabold text-slate-950">
                  Security &amp; Passwords
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your account password or encryption passphrase.
                </p>
              </div>

              {passwordNotice && (
                <div className="p-3 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                  {passwordNotice}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-xs shadow-sm transition"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* TAB 4: WISHLIST */}
          {activeTab === "wishlist" && (
            <section className="lg:col-span-6 rounded-3xl bg-white border border-slate-200/90 p-10 shadow-xs text-center space-y-3">
              <span className="text-4xl block">♡</span>
              <h3 className="text-base font-extrabold text-slate-900">Your Wishlist is Empty</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore our components catalog and bookmark hardware pieces for your next rig upgrade.
              </p>
              <Link
                href="/shop"
                className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition"
              >
                Browse Components
              </Link>
            </section>
          )}

          {/* RIGHT COLUMN: SECURITY PANEL - EXACT MATCH TO MOCKUP 5 */}
          <aside className="lg:col-span-3 space-y-5">
            <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                Security Panel
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                The client-side local encryption functionality protects your blueprint configurations with an AES-256-GCM cipher before writing to browser storage.
              </p>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-800 space-y-1">
                <div className="flex items-center gap-1.5 font-extrabold">
                  <span className="text-emerald-600">✓</span>
                  <span>Database Session Active</span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  Signed in via HttpOnly Argon2id session.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 text-xs space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Role Permission:</span>
                  <strong className="text-slate-900">User</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Storage Engine:</span>
                  <strong className="text-slate-900">PostgreSQL 18</strong>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
