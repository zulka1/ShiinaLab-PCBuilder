import type { Metadata } from "next";
import { connection } from "next/server";
import { SiteFooter, SiteHeader } from "../components/SiteNavigation";
import { BuilderWorkspace } from "../components/BuilderWorkspace";
import { ambilDaftarKomponen } from "@/lib/data";
import { inferProductAttributes, mockProducts, type Product, type ProductCategory } from "../data/mock-products";

export const metadata: Metadata = {
  title: "PC Builder Studio | ShiinaLab",
  description: "PC configuration studio with real-time wattage gauge and socket compatibility verification.",
};

export const instant = false;

export default async function BuilderPage() {
  await connection();
  let products: Product[] = mockProducts;

  try {
    const dbKomponen = await ambilDaftarKomponen();
    if (dbKomponen && dbKomponen.length > 0) {
      const mappedDb: Product[] = dbKomponen.map((k) => {
        const inferred = inferProductAttributes(k.nama, k.kategori, k.gambar);
        return {
          id: String(k.id),
          name: k.nama,
          category: k.kategori as ProductCategory,
          price: k.harga,
          description: k.deskripsi,
          available: k.tersedia,
          image: k.gambar || inferred.image,
          brand: inferred.brand,
          socket: inferred.socket,
          memoryType: inferred.memoryType,
          formFactor: inferred.formFactor,
          supportedMotherboardSizes: inferred.supportedMotherboardSizes,
          wattage: inferred.wattage,
          powerDraw: inferred.powerDraw,
          specifications: inferred.specifications,
        };
      });

      // Merge mock flagship items that might have IDs used in default selection
      const dbIds = new Set(mappedDb.map((p) => p.name.toLowerCase()));
      const uniqueMock = mockProducts.filter((m) => !dbIds.has(m.name.toLowerCase()));
      products = [...mappedDb, ...uniqueMock];
    }
  } catch (err) {
    console.error("Failed to load components from database, falling back to mock:", err);
  }

  return (
    <div className="min-h-screen flex flex-col text-slate-900 bg-gradient-to-b from-white via-slate-50/40 to-slate-100/50">
      <SiteHeader activePage="builder" />

      <main
        id="main-content"
        className="flex-1 w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8 space-y-6"
      >
        {/* TOP INTRO BANNER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              PC Rig Configurator
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Select components, verify socket &amp; memory compatibility, and monitor real-time wattage.
            </p>
          </div>
        </div>

        {/* WORKSPACE - EXACT MATCH TO MOCKUP 2 */}
        <BuilderWorkspace allProducts={products} />
      </main>

      <SiteFooter />
    </div>
  );
}
