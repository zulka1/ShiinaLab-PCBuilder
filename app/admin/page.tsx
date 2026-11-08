import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { bacaSesi } from "@/lib/sesi";
import { prisma } from "@/lib/prisma";
import { AdminWorkspace } from "./AdminWorkspace";

export const metadata: Metadata = {
  title: "Admin Console | ShiinaLab 2026",
  description: "Super Admin hardware inventory management, stock controls, and system telemetry.",
};

export const instant = false;

export default async function AdminPage() {
  await connection();
  const sesi = await bacaSesi();

  if (!sesi || sesi.peran !== "admin") {
    redirect("/masuk?pesan=Akses+khusus+Super+Admin.+Silakan+masuk+dengan+akun+admin.");
  }

  // Fetch real inventory and builds from PostgreSQL
  const [komponenList, totalBuilds] = await Promise.all([
    prisma.komponen.findMany({
      orderBy: { dibuatPada: "desc" },
    }),
    prisma.rakitanTersimpan.count(),
  ]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc] text-slate-900">
      {/* LEFT ADMIN NAVIGATION SIDEBAR - EXACT MATCH TO MOCKUP 6 */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200/90 p-6 flex flex-col justify-between shrink-0 space-y-8">
        <div className="space-y-6">
          {/* LOGO */}
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-950 via-slate-800 to-slate-900 flex items-center justify-center text-white font-black text-base shadow-sm">
              S
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-950 block leading-none">
                ShiinaLab
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block mt-1">
                Admin Console
              </span>
            </div>
          </Link>

          {/* NAV ITEMS */}
          <nav className="space-y-1.5 text-xs font-bold text-slate-600">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-100 text-slate-950 shadow-2xs font-extrabold"
            >
              <span>🏠</span>
              <span>Dashboard</span>
            </Link>
            <Link
              href="/shop"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition"
            >
              <span>📦</span>
              <span>Products &amp; Inventory</span>
            </Link>
            <Link
              href="/builder"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition"
            >
              <span>🖥️</span>
              <span>PC Builder Logic</span>
            </Link>
            <div className="pt-2 pb-1 px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Operations
            </div>
            <span className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-slate-400 cursor-not-allowed">
              <span>📋</span>
              <span>Orders &amp; Quotations</span>
            </span>
            <span className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-slate-400 cursor-not-allowed">
              <span>👥</span>
              <span>User Management</span>
            </span>
            <span className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-slate-400 cursor-not-allowed">
              <span>💬</span>
              <span>Reviews &amp; Moderation</span>
            </span>
            <span className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-slate-400 cursor-not-allowed">
              <span>⚙️</span>
              <span>System Settings</span>
            </span>
          </nav>
        </div>

        {/* BOTTOM SHORTCUT: STORE & LOGOUT */}
        <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-600 font-bold transition"
          >
            <span>Store Front</span>
            <span>↗</span>
          </Link>
          <Link
            href="/api/auth/logout"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold transition"
          >
            <span>Sign Out</span>
            <span>⎋</span>
          </Link>
        </div>
      </aside>

      {/* RIGHT MAIN ADMIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP BAR - EXACT MATCH TO MOCKUP 6 */}
        <header className="h-16 bg-white border-b border-slate-200/90 px-6 sm:px-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200/80">
              Role: Super Admin
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <input
                type="search"
                placeholder="Search..."
                className="w-48 sm:w-64 pl-8 pr-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute left-3 top-2 text-slate-400 text-xs">
                🔍
              </span>
            </div>

            <span className="text-slate-400 cursor-pointer text-sm">🔔</span>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-extrabold flex items-center justify-center text-xs">
                A
              </div>
              <span className="text-xs font-extrabold text-slate-900 hidden sm:inline">
                {sesi.namaLengkap || sesi.username || "admin"}
              </span>
            </div>
          </div>
        </header>

        {/* WORKSPACE CONTENT */}
        <main className="flex-1 p-6 sm:p-10 max-w-[1680px] w-full mx-auto space-y-8">
          <AdminWorkspace
            initialComponents={komponenList}
            totalBuildsCount={totalBuilds || 4}
          />
        </main>
      </div>
    </div>
  );
}
