import type { Metadata } from "next";
import FormMasuk from "@/app/components/FormMasuk";
import { SiteFooter, SiteHeader } from "@/app/components/SiteNavigation";

export const metadata: Metadata = {
  title: "Sign In & Register | ShiinaLab 2026",
  description: "Sign in to access your saved custom PC blueprints and super admin inventory controls.",
};

export default function HalamanMasuk() {
  return (
    <div className="min-h-screen flex flex-col text-slate-900 bg-[#f8fafc]">
      <SiteHeader activePage="account" />

      <main
        id="konten"
        className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-12 flex items-center justify-center"
      >
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-9 shadow-[0_16px_40px_-12px_rgba(15,23,42,0.06)] space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-950 text-white font-black text-xl flex items-center justify-center mx-auto shadow-md">
              S
            </div>
            <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">
              Welcome to ShiinaLab
            </h1>
            <p className="text-xs text-slate-500">
              Sign in to sync your custom PC builds or manage inventory.
            </p>
          </div>

          <FormMasuk />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
