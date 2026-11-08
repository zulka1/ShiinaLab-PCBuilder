"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  builderCategories,
  categoryLabels,
  formatRupiah,
  mockProducts,
  type Product,
  type ProductCategory,
} from "../data/mock-products";
import { encryptJson } from "../lib/saved-build-crypto";

type SelectedComponents = Partial<Record<ProductCategory, string>>;
type SavedBuild = {
  id?: number | string;
  name: string;
  budget?: number;
  total: number;
  savedAt: string;
  components?: string[];
  wattage?: number;
};
type CompatibilityResult = { label: string; state: "ok" | "warning" | "pending"; detail: string };

const savedBuildsKey = "shiinalab-saved-builds";
const savedBuildsEvent = "shiinalab-saved-builds-change";

function calculateCompatibility(
  selected: Partial<Record<ProductCategory, Product>>,
  estimatedPower: number,
): CompatibilityResult[] {
  const results: CompatibilityResult[] = [];
  const processor = selected.Processor;
  const motherboard = selected.Motherboard;
  const memory = selected.Memory;
  const caseProduct = selected.Case;
  const powerSupply = selected["Power supply"] || selected.PowerSupply;

  if (processor && motherboard) {
    const compatible = processor.socket && motherboard.socket ? processor.socket === motherboard.socket : true;
    results.push({
      label: "CPU Socket",
      state: compatible ? "ok" : "warning",
      detail: compatible
        ? `Socket ${processor.socket ?? "LGA1700"} matched perfectly.`
        : `Processor socket (${processor.socket}) does not match motherboard (${motherboard.socket}).`,
    });
  } else {
    results.push({ label: "CPU Socket", state: "pending", detail: "Select CPU and Motherboard to verify socket." });
  }

  if (memory && motherboard) {
    const compatible = memory.memoryType && motherboard.memoryType ? memory.memoryType === motherboard.memoryType : true;
    results.push({
      label: "RAM Architecture",
      state: compatible ? "ok" : "warning",
      detail: compatible
        ? `${memory.memoryType ?? "DDR5"} is natively supported by motherboard.`
        : `${memory.memoryType} memory is not compatible with ${motherboard.memoryType} motherboard.`,
    });
  } else {
    results.push({ label: "RAM Architecture", state: "pending", detail: "Select Memory and Motherboard to check." });
  }

  if (caseProduct && motherboard) {
    const compatible = caseProduct.supportedMotherboardSizes?.includes(motherboard.formFactor ?? "ATX") ?? true;
    results.push({
      label: "Chassis Clearance",
      state: compatible ? "ok" : "warning",
      detail: compatible
        ? `${motherboard.formFactor ?? "ATX"} form-factor fits inside chassis.`
        : `Chassis may not fit ${motherboard.formFactor} motherboard.`,
    });
  } else {
    results.push({ label: "Chassis Clearance", state: "pending", detail: "Select Chassis and Motherboard." });
  }

  if (powerSupply) {
    const adequate = (powerSupply.wattage ?? 750) >= estimatedPower;
    results.push({
      label: "Power Headroom",
      state: adequate ? "ok" : "warning",
      detail: adequate
        ? `${powerSupply.wattage}W PSU provides +${(powerSupply.wattage ?? 750) - estimatedPower}W safe buffer for ${estimatedPower}W TDP.`
        : `${powerSupply.wattage}W PSU is below estimated peak draw of ${estimatedPower}W.`,
    });
  } else {
    results.push({ label: "Power Headroom", state: "pending", detail: "Select Power Supply to evaluate." });
  }

  return results;
}

export function BuilderWorkspace({
  allProducts = mockProducts,
}: {
  allProducts?: Product[];
}) {
  // Default selected items to showcase flagship white rig from Mockup 2
  const [selectedIds, setSelectedIds] = useState<SelectedComponents>({
    Processor: "flagship-i9-14900k",
    "Graphics card": "flagship-rtx-4080-white",
    Memory: "flagship-corsair-dominator-32gb",
    Motherboard: "flagship-asus-z790-white",
    Storage: "flagship-wd-sn850x-2tb",
    Case: "flagship-lianli-o11-white",
    Cooler: "flagship-nzxt-kraken-360-white",
    "Power supply": "corsair-rm750",
  });

  const [activePickerCategory, setActivePickerCategory] = useState<ProductCategory | null>(null);
  const [activeLighting, setActiveLighting] = useState<"cyan" | "neon" | "amber" | "stealth">("cyan");
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [buildName, setBuildName] = useState("White Snow Beast 4K");
  const [passphrase, setPassphrase] = useState("");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const selectedProducts = useMemo(() => {
    const map: Partial<Record<ProductCategory, Product>> = {};
    for (const [cat, id] of Object.entries(selectedIds)) {
      if (id) {
        const found = allProducts.find((p) => p.id === id);
        if (found) {
          map[cat as ProductCategory] = found;
        }
      }
    }
    return map;
  }, [selectedIds, allProducts]);

  const selectedCount = Object.keys(selectedProducts).length;

  const estimatedPower = useMemo(() => {
    let tdp = 60; // baseline motherboard + fans
    for (const prod of Object.values(selectedProducts)) {
      if (!prod) continue;
      tdp += prod.powerDraw ?? 0;
    }
    return tdp;
  }, [selectedProducts]);

  const psuWattage = useMemo(() => {
    const psu = selectedProducts["Power supply"] || selectedProducts.PowerSupply;
    return psu?.wattage ?? 850;
  }, [selectedProducts]);

  const totalPrice = useMemo(() => {
    return Object.values(selectedProducts).reduce((acc, p) => acc + (p?.price ?? 0), 0);
  }, [selectedProducts]);

  const compatibilityResults = useMemo(() => {
    return calculateCompatibility(selectedProducts, estimatedPower);
  }, [selectedProducts, estimatedPower]);

  const allCompatible = compatibilityResults.every((r) => r.state === "ok" || r.state === "pending");

  const handleSelectProduct = (cat: ProductCategory, productId: string) => {
    setSelectedIds((prev) => ({ ...prev, [cat]: productId }));
    setActivePickerCategory(null);
  };

  const handleSaveBuild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buildName.trim()) return;
    setIsSaving(true);
    setSaveStatus(null);

    const componentNames = Object.values(selectedProducts)
      .filter((p): p is Product => Boolean(p))
      .map((p) => p.name);

    try {
      // 1. Try to save to PostgreSQL authenticated session API
      const res = await fetch("/api/account/builds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: buildName,
          total: totalPrice,
          komponen: componentNames,
          watt: estimatedPower,
        }),
      });

      if (res.ok) {
        setSaveStatus("Success! Blueprint saved to your account vault.");
        setTimeout(() => {
          setIsSaveModalOpen(false);
          setSaveStatus(null);
        }, 1500);
        return;
      }

      // 2. If guest / unauthenticated, save to local storage
      const existingRaw = window.localStorage.getItem(savedBuildsKey) ?? "[]";
      let existingList: SavedBuild[] = [];
      try {
        const parsed = JSON.parse(existingRaw);
        if (Array.isArray(parsed)) existingList = parsed;
      } catch {
        existingList = [];
      }

      const newBuild: SavedBuild = {
        name: buildName,
        total: totalPrice,
        savedAt: new Date().toISOString(),
        components: componentNames,
        wattage: estimatedPower,
      };

      const updated = [newBuild, ...existingList];
      if (passphrase) {
        const encrypted = await encryptJson(updated, passphrase);
        window.localStorage.setItem(savedBuildsKey, JSON.stringify(encrypted));
      } else {
        window.localStorage.setItem(savedBuildsKey, JSON.stringify(updated));
      }
      window.dispatchEvent(new Event(savedBuildsEvent));
      setSaveStatus("Saved locally! Sign in anytime to sync to PostgreSQL.");
      setTimeout(() => {
        setIsSaveModalOpen(false);
        setSaveStatus(null);
      }, 1500);
    } catch {
      setSaveStatus("Failed to save build. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // SVG Gauge calculations
  const wattagePct = Math.min(100, Math.round((estimatedPower / psuWattage) * 100));
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * wattagePct) / 100;

  const lightingGlow = {
    cyan: "shadow-[0_0_60px_rgba(6,182,212,0.3)]",
    neon: "shadow-[0_0_60px_rgba(168,85,247,0.3)]",
    amber: "shadow-[0_0_60px_rgba(245,158,11,0.25)]",
    stealth: "shadow-[0_0_30px_rgba(15,23,42,0.08)]",
  }[activeLighting];

  return (
    <div className="w-full space-y-8">
      {/* 3-COLUMN STUDIO LAYOUT - EXACT MATCH TO MOCKUP 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
        {/* LEFT COLUMN: CPU & GPU CARDS */}
        <aside className="lg:col-span-3 space-y-5">
          {/* CPU CARD */}
          <ComponentCard
            slotLabel="CPU"
            category="Processor"
            product={selectedProducts.Processor}
            isCompatible={true}
            onOpenPicker={() => setActivePickerCategory("Processor")}
          />

          {/* GPU CARD */}
          <ComponentCard
            slotLabel="GPU"
            category="Graphics card"
            product={selectedProducts["Graphics card"] || selectedProducts.GraphicsCard}
            isCompatible={true}
            onOpenPicker={() => setActivePickerCategory("Graphics card")}
          />

          {/* QUICK COMPATIBILITY BADGE */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Compatibility Status
              </span>
              <span
                className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  allCompatible
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                {allCompatible ? "100% Compatible" : "Checks Needed"}
              </span>
            </div>
            <ul className="text-xs space-y-1.5 text-slate-600">
              {compatibilityResults.map((item) => (
                <li key={item.label} className="flex items-start gap-1.5">
                  <span
                    className={`font-bold mt-0.5 ${
                      item.state === "ok"
                        ? "text-emerald-600"
                        : item.state === "warning"
                          ? "text-amber-500"
                          : "text-slate-400"
                    }`}
                  >
                    {item.state === "ok" ? "✓" : item.state === "warning" ? "!" : "•"}
                  </span>
                  <span>{item.detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* CENTER COLUMN: 3D RIG VISUALIZER & BOTTOM COMPONENTS */}
        <section className="lg:col-span-6 space-y-6">
          {/* 3D RIG SHOWCASE BOX */}
          <div
            className={`relative rounded-[32px] bg-gradient-to-b from-white via-slate-50/70 to-white border border-slate-200/90 p-6 flex flex-col items-center justify-between transition-all duration-500 overflow-hidden ${lightingGlow}`}
          >
            {/* TOP BAR: LIGHTING CONTROLS & INSTALLED PILL */}
            <div className="w-full flex items-center justify-between z-10 gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-xs">
                <span className="text-[11px] font-bold text-slate-600">Ambient Aura:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveLighting("cyan")}
                    aria-label="Set Ice Cyan Aura"
                    className={`w-4 h-4 rounded-full bg-cyan-400 transition-transform ${
                      activeLighting === "cyan" ? "ring-2 ring-blue-600 scale-125" : "opacity-70 hover:opacity-100"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setActiveLighting("neon")}
                    aria-label="Set Cyber Neon Aura"
                    className={`w-4 h-4 rounded-full bg-purple-500 transition-transform ${
                      activeLighting === "neon" ? "ring-2 ring-purple-600 scale-125" : "opacity-70 hover:opacity-100"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setActiveLighting("amber")}
                    aria-label="Set Warm Amber Aura"
                    className={`w-4 h-4 rounded-full bg-amber-400 transition-transform ${
                      activeLighting === "amber" ? "ring-2 ring-amber-500 scale-125" : "opacity-70 hover:opacity-100"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setActiveLighting("stealth")}
                    aria-label="Set Stealth Dark Aura"
                    className={`w-4 h-4 rounded-full bg-slate-700 transition-transform ${
                      activeLighting === "stealth" ? "ring-2 ring-slate-900 scale-125" : "opacity-70 hover:opacity-100"
                    }`}
                  />
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/80 text-slate-700 text-xs font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{selectedCount} / 8 Parts Installed</span>
              </div>
            </div>

            {/* MAIN 3D CHASSIS RIG IMAGE */}
            <div className="relative w-full h-[360px] sm:h-[420px] flex items-center justify-center my-2 group">
              <div
                className={`absolute inset-0 rounded-full blur-3xl -z-10 transition-colors duration-500 ${
                  activeLighting === "cyan"
                    ? "bg-cyan-400/20"
                    : activeLighting === "neon"
                      ? "bg-purple-500/20"
                      : activeLighting === "amber"
                        ? "bg-amber-400/20"
                        : "bg-slate-300/10"
                }`}
              />
              <Image
                src="/images/builder-pc-rig.jpg"
                alt="Custom 3D Liquid Cooled White Ceramic Gaming PC Chassis"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain scale-115 sm:scale-125 group-hover:scale-130 transition-transform duration-500"
                priority
              />
            </div>

            {/* RIG FOOTER SPEC SUMMARY */}
            <div className="w-full flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span className="font-semibold text-slate-700">Lian Li O11 Dynamic EVO (Ceramic White)</span>
              <span>Panoramic Glass • Vertical Dual Chamber</span>
            </div>
          </div>

          {/* BOTTOM SHELF: RAM, MOTHERBOARD, STORAGE, COOLER */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <ComponentCardSmall
              slotLabel="RAM"
              category="Memory"
              product={selectedProducts.Memory}
              onOpenPicker={() => setActivePickerCategory("Memory")}
            />
            <ComponentCardSmall
              slotLabel="Motherboard"
              category="Motherboard"
              product={selectedProducts.Motherboard}
              onOpenPicker={() => setActivePickerCategory("Motherboard")}
            />
            <ComponentCardSmall
              slotLabel="Storage"
              category="Storage"
              product={selectedProducts.Storage}
              onOpenPicker={() => setActivePickerCategory("Storage")}
            />
            <ComponentCardSmall
              slotLabel="Liquid Cooling"
              category="Cooler"
              product={selectedProducts.Cooler}
              onOpenPicker={() => setActivePickerCategory("Cooler")}
            />
            <ComponentCardSmall
              slotLabel="Chassis"
              category="Case"
              product={selectedProducts.Case}
              onOpenPicker={() => setActivePickerCategory("Case")}
            />
            <ComponentCardSmall
              slotLabel="Power Supply"
              category="Power supply"
              product={selectedProducts["Power supply"] || selectedProducts.PowerSupply}
              onOpenPicker={() => setActivePickerCategory("Power supply")}
            />
          </div>
        </section>

        {/* RIGHT COLUMN: REAL-TIME BUILD SUMMARY & WATTAGE GAUGE */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-7 shadow-[0_16px_40px_-12px_rgba(15,23,42,0.06)] space-y-6">
            <h2 className="text-lg font-extrabold text-slate-950 tracking-tight">
              Real-time build summary
            </h2>

            {/* CIRCULAR WATTAGE GAUGE - EXACT MOCKUP 2 */}
            <div className="relative flex flex-col items-center justify-center py-2">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="transparent"
                    stroke="#f1f5f9"
                    strokeWidth="12"
                    strokeDasharray={arcLength}
                    strokeDashoffset={0}
                    strokeLinecap="round"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="transparent"
                    stroke="url(#wattageGradient)"
                    strokeWidth="12"
                    strokeDasharray={arcLength}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                  <defs>
                    <linearGradient id="wattageGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Wattage
                  </span>
                  <span className="text-3xl font-extrabold text-slate-950 tracking-tight">
                    {estimatedPower}W
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    / {psuWattage}W
                  </span>
                </div>
              </div>

              <div className="w-44 flex justify-between text-[11px] font-bold text-slate-400 px-2 mt-[-10px]">
                <span>0</span>
                <span>{psuWattage}W</span>
              </div>
            </div>

            {/* COMPONENT BREAKDOWN PRICE LIST */}
            <div className="space-y-3 pt-2 border-t border-slate-100 text-sm">
              <PriceLine
                label="CPU"
                product={selectedProducts.Processor}
              />
              <PriceLine
                label="GPU"
                product={selectedProducts["Graphics card"] || selectedProducts.GraphicsCard}
              />
              <PriceLine
                label="RAM"
                product={selectedProducts.Memory}
              />
              <PriceLine
                label="Motherboard"
                product={selectedProducts.Motherboard}
              />
              <PriceLine
                label="Storage"
                product={selectedProducts.Storage}
              />
              <PriceLine
                label="Cooling"
                product={selectedProducts.Cooler}
              />
              <PriceLine
                label="Chassis"
                product={selectedProducts.Case}
              />
              <PriceLine
                label="Power Supply"
                product={selectedProducts["Power supply"] || selectedProducts.PowerSupply}
              />
            </div>

            {/* TOTAL AND ORDER BUILD CTA */}
            <div className="pt-4 border-t border-slate-200/80 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold text-slate-600">Total</span>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-slate-950 block">
                    {formatRupiah(totalPrice)}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Incl. VAT & Hardware Assembly
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSaveModalOpen(true)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-extrabold text-sm shadow-[0_12px_28px_-4px_rgba(37,99,235,0.45)] hover:shadow-[0_16px_32px_-4px_rgba(37,99,235,0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                Order Build / Save Blueprint
              </button>

              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const json = JSON.stringify(selectedProducts, null, 2);
                    navigator.clipboard?.writeText(json);
                    alert("Build configuration copied to clipboard as JSON!");
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-blue-600 transition"
                >
                  Export JSON
                </button>
                <span className="text-slate-300">•</span>
                <Link
                  href="/account"
                  className="text-xs font-bold text-slate-500 hover:text-blue-600 transition"
                >
                  View My Builds
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* COMPONENT PICKER MODAL */}
      {activePickerCategory && (
        <ComponentPickerModal
          category={activePickerCategory}
          availableProducts={allProducts.filter(
            (p) =>
              p.category === activePickerCategory ||
              (activePickerCategory === "Graphics card" && p.category === "GraphicsCard") ||
              (activePickerCategory === "Power supply" && p.category === "PowerSupply"),
          )}
          currentSelectedId={selectedIds[activePickerCategory]}
          onSelect={(productId) => handleSelectProduct(activePickerCategory, productId)}
          onClose={() => setActivePickerCategory(null)}
        />
      )}

      {/* SAVE BUILD MODAL */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-950">
                  Save Custom Build Blueprint
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Save to your PostgreSQL account or encrypt locally.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSaveModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBuild} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Blueprint / Rig Name
                </label>
                <input
                  type="text"
                  value={buildName}
                  onChange={(e) => setBuildName(e.target.value)}
                  placeholder="e.g. White Snow Beast 4K"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Passphrase (Optional for Guest Encryption)
                </label>
                <input
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Leave empty for standard account sync"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Total Configuration Value:</span>
                  <span>{formatRupiah(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Estimated Peak Draw:</span>
                  <span>{estimatedPower}W</span>
                </div>
              </div>

              {saveStatus && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold ${
                    saveStatus.startsWith("Success")
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}
                >
                  {saveStatus}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSaveModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Lock & Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ComponentCard({
  slotLabel,
  category,
  product,
  isCompatible,
  onOpenPicker,
}: {
  slotLabel: string;
  category: ProductCategory;
  product?: Product;
  isCompatible: boolean;
  onOpenPicker: () => void;
}) {
  return (
    <article className="rounded-3xl bg-white border border-slate-200/90 p-5 shadow-xs hover:border-blue-200 hover:shadow-md transition-all duration-200 space-y-3.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
          {slotLabel}
        </span>
        <span className="text-[11px] font-extrabold px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          100% Compatible
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 shrink-0 overflow-hidden p-1 flex items-center justify-center">
          <Image
            src={product?.image || "/images/intel-i9-14900k.jpg"}
            alt={product?.name || slotLabel}
            fill
            sizes="64px"
            className="object-contain p-1"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-extrabold text-slate-900 truncate">
            {product?.name || `Select ${categoryLabels[category]}`}
          </h3>
          <p className="text-xs font-extrabold text-blue-600 mt-0.5">
            {product ? formatRupiah(product.price) : "Not equipped"}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenPicker}
          aria-label={`Change ${slotLabel}`}
          className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-bold flex items-center justify-center text-sm transition"
        >
          +
        </button>
      </div>
    </article>
  );
}

function ComponentCardSmall({
  slotLabel,
  category,
  product,
  onOpenPicker,
}: {
  slotLabel: string;
  category: ProductCategory;
  product?: Product;
  onOpenPicker: () => void;
}) {
  return (
    <article className="rounded-2xl bg-white border border-slate-200/80 p-4 shadow-2xs hover:border-blue-200 hover:shadow-sm transition-all duration-200 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 shrink-0 overflow-hidden flex items-center justify-center">
          <Image
            src={product?.image || "/images/corsair-dominator-ram.jpg"}
            alt={product?.name || slotLabel}
            fill
            sizes="48px"
            className="object-contain p-1"
          />
        </div>
        <div className="min-w-0">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            {slotLabel}
          </span>
          <h4 className="text-xs font-bold text-slate-900 truncate">
            {product?.name || "Choose component"}
          </h4>
          <span className="text-xs font-extrabold text-slate-950 block mt-0.5">
            {product ? formatRupiah(product.price) : "—"}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenPicker}
        aria-label={`Select ${slotLabel}`}
        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 transition"
      >
        +
      </button>
    </article>
  );
}

function PriceLine({ label, product }: { label: string; product?: Product }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-slate-500">{label}</span>
      <span className="font-bold text-slate-900">
        {product ? formatRupiah(product.price) : "—"}
      </span>
    </div>
  );
}

function ComponentPickerModal({
  category,
  availableProducts,
  currentSelectedId,
  onSelect,
  onClose,
}: {
  category: ProductCategory;
  availableProducts: Product[];
  currentSelectedId?: string;
  onSelect: (productId: string) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = availableProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-950">
              Select {categoryLabels[category]}
            </h3>
            <p className="text-xs text-slate-500">
              {filtered.length} hardware models available in catalog.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold"
          >
            ✕
          </button>
        </div>

        <div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${categoryLabels[category]} by brand or model...`}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filtered.map((item) => {
            const isEquipped = item.id === currentSelectedId;
            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all duration-150 flex items-center justify-between gap-4 ${
                  isEquipped
                    ? "border-blue-500 bg-blue-50/40 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 shrink-0 overflow-hidden flex items-center justify-center p-1">
                    <Image
                      src={item.image || "/images/intel-i9-14900k.jpg"}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {item.brand || "Hardware"}
                      </span>
                      {item.powerDraw ? (
                        <span className="text-[10px] font-semibold text-slate-400">
                          {item.powerDraw}W TDP
                        </span>
                      ) : null}
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900 truncate">
                      {item.name}
                    </h4>
                    <span className="text-xs font-extrabold text-blue-600 block mt-0.5">
                      {formatRupiah(item.price)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelect(item.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition shrink-0 ${
                    isEquipped
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm hover:shadow-md"
                  }`}
                >
                  {isEquipped ? "Equipped ✓" : "Equip Component"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
