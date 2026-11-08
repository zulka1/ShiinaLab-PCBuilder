import type { Metadata } from "next";
import { connection } from "next/server";
import { SiteFooter, SiteHeader } from "../components/SiteNavigation";
import { ShopCatalog } from "../components/ShopCatalog";
import { ambilDaftarKomponen } from "@/lib/data";
import { inferProductAttributes, mockProducts, type Product, type ProductCategory } from "../data/mock-products";

export const metadata: Metadata = {
  title: "Components Catalog | ShiinaLab 2026",
  description: "Browse verified PC hardware components with instant socket and wattage specifications.",
};

export const instant = false;

export default async function ShopPage() {
  await connection();
  let products: Product[] = mockProducts;

  try {
    const dataDb = await ambilDaftarKomponen();
    if (dataDb && dataDb.length > 0) {
      const mappedDb: Product[] = dataDb.map((item) => {
        const inferred = inferProductAttributes(item.nama, item.kategori, item.gambar);
        const avgRating =
          item.ulasan && item.ulasan.length > 0
            ? Number((item.ulasan.reduce((a, b) => a + b.nilai, 0) / item.ulasan.length).toFixed(1))
            : 4.8;

        return {
          id: String(item.id),
          name: item.nama,
          category: item.kategori as ProductCategory,
          price: item.harga,
          description: item.deskripsi,
          available: item.tersedia,
          image: item.gambar || inferred.image,
          brand: inferred.brand,
          socket: inferred.socket,
          memoryType: inferred.memoryType,
          formFactor: inferred.formFactor,
          supportedMotherboardSizes: inferred.supportedMotherboardSizes,
          wattage: inferred.wattage,
          powerDraw: inferred.powerDraw,
          specifications: inferred.specifications,
          rating: avgRating,
          reviewsCount: item.ulasan?.length || 12,
        };
      });

      // Keep mock items that haven't been shadowed by DB names
      const dbNames = new Set(mappedDb.map((p) => p.name.toLowerCase()));
      const uniqueMock = mockProducts.filter((m) => !dbNames.has(m.name.toLowerCase()));
      products = [...mappedDb, ...uniqueMock];
    }
  } catch (err) {
    console.error("Failed to load components from database in ShopPage:", err);
  }

  return (
    <div className="min-h-screen flex flex-col text-slate-900 bg-[#f8fafc]">
      <SiteHeader activePage="shop" />

      <main
        id="main-content"
        className="flex-1 w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-8"
      >
        <ShopCatalog initialProducts={products} />
      </main>

      <SiteFooter />
    </div>
  );
}
