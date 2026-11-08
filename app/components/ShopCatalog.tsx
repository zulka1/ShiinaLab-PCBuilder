"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { categoryLabels, formatRupiah, mockProducts, type Product, type ProductCategory } from "../data/mock-products";
import { ProductCard } from "./ProductCard";

const allCategoriesList: Array<{ key: string; label: string }> = [
  { key: "all", label: "All Categories" },
  { key: "Processor", label: "Processors" },
  { key: "Graphics card", label: "Graphics Cards" },
  { key: "Motherboard", label: "Motherboards" },
  { key: "Memory", label: "Memory" },
  { key: "Storage", label: "Storage" },
  { key: "Case", label: "Cases" },
  { key: "Cooler", label: "Liquid Cooling" },
  { key: "Power supply", label: "Power Supply" },
];

const availableBrands = [
  "Intel",
  "AMD",
  "ASUS",
  "Corsair",
  "NVIDIA",
  "Gigabyte",
  "MSI",
  "Lian Li",
  "NZXT",
  "Kingston",
  "WD",
];

export function ShopCatalog({
  initialProducts = mockProducts,
}: {
  initialProducts?: Product[];
}) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(50_000_000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState("recommended");
  const [cart, setCart] = useState<Product[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
    setCurrentPage(1);
  };

  const visibleProducts = useMemo(() => {
    const filtered = initialProducts.filter((product) => {
      // 1. Text Search
      const searchTarget = `${product.name} ${product.description} ${product.specifications.join(" ")} ${product.brand ?? ""}`.toLowerCase();
      const matchesQuery = query === "" || searchTarget.includes(query.toLowerCase());

      // 2. Category
      const matchesCategory =
        selectedCategory === "all" ||
        product.category === selectedCategory ||
        (selectedCategory === "Graphics card" && product.category === "GraphicsCard") ||
        (selectedCategory === "Power supply" && product.category === "PowerSupply");

      // 3. Brand
      const matchesBrand =
        selectedBrands.length === 0 || (product.brand && selectedBrands.includes(product.brand));

      // 4. Price
      const matchesPrice = product.price <= maxPrice;

      // 5. In Stock Only
      const matchesStock = !inStockOnly || product.available !== false;

      return matchesQuery && matchesCategory && matchesBrand && matchesPrice && matchesStock;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "price-ascending") return a.price - b.price;
      if (sort === "price-descending") return b.price - a.price;
      return (b.rating ?? 4.5) - (a.rating ?? 4.5);
    });
  }, [initialProducts, query, selectedCategory, selectedBrands, maxPrice, inStockOnly, sort]);

  const totalPages = Math.max(1, Math.ceil(visibleProducts.length / itemsPerPage));
  const paginatedProducts = visibleProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const addToCart = (product: Product) => {
    setCart((prev) => [...prev, product]);
    setToastMessage(`✓ ${product.name} added to PC build list.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="w-full space-y-8">
      {/* TOAST NOTICE */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* CATALOG GRID LAYOUT - EXACT MATCH TO MOCKUP 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT SIDEBAR: FILTERS */}
        <aside className="lg:col-span-3 space-y-7 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                Filters
              </h2>
              {(selectedCategory !== "all" || selectedBrands.length > 0 || maxPrice < 50_000_000 || inStockOnly) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedBrands([]);
                    setMaxPrice(50_000_000);
                    setInStockOnly(false);
                    setQuery("");
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* CATEGORIES PILLS */}
          <div className="space-y-3">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
              Categories
            </span>
            <div className="flex flex-wrap gap-2">
              {allCategoriesList.map((cat) => {
                const isActive = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.key);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-150 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* PRICE RANGE SLIDER */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-extrabold text-slate-800">
              <span>Price Cap</span>
              <span className="text-blue-600">{formatRupiah(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="500000"
              max="50000000"
              step="500000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
              <span>Rp 500rb</span>
              <span>Rp 50jt+</span>
            </div>
          </div>

          {/* BRAND CHECKBOXES */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
              Brand
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
              {availableBrands.map((brand) => {
                const isChecked = selectedBrands.includes(brand);
                return (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleBrandToggle(brand)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span>{brand}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* IN STOCK ONLY SWITCH */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-800">
              In Stock Only
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* QUICK BUILDER SHORTCUT */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-xs text-blue-900 space-y-2">
            <span className="font-extrabold block">Assembling a full PC?</span>
            <p className="text-blue-700 text-[11px] leading-relaxed">
              Launch our 3D configurator for automatic socket and RAM matching.
            </p>
            <Link
              href="/builder"
              className="inline-block mt-1 font-bold text-blue-600 hover:underline text-[11px]"
            >
              Open PC Builder Studio →
            </Link>
          </div>
        </aside>

        {/* RIGHT MAIN CATALOG */}
        <section className="lg:col-span-9 space-y-6">
          {/* TOP CONTROLS & BREADCRUMB */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <Link href="/" className="hover:text-slate-600 transition">
                  Home
                </Link>
                <span>&gt;</span>
                <span className="font-bold text-slate-700">Components</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                Components Catalog
              </h1>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
                {visibleProducts.length} Components Available
              </span>

              {/* SEARCH INPUT */}
              <div className="relative">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search components..."
                  className="w-48 sm:w-64 pl-8 pr-4 py-2 rounded-full border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                />
                <span className="absolute left-3 top-2.5 text-slate-400 text-xs">
                  🔍
                </span>
              </div>

              {/* SORT DROPDOWN */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-3 py-2 rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
              >
                <option value="recommended">Sort by: Top Rated</option>
                <option value="price-ascending">Price: Low to High</option>
                <option value="price-descending">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* 3-COLUMN PRODUCT GRID - EXACT MATCH TO MOCKUP 3 */}
          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={addToCart} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-white border border-slate-200/90 p-12 text-center space-y-3">
              <span className="text-4xl block">🔍</span>
              <h3 className="text-lg font-extrabold text-slate-900">
                No matching components found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your price range, unchecking brand filters, or clearing your search term.
              </p>
            </div>
          )}

          {/* PAGINATION ROW */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <span className="text-xs font-bold text-slate-500 mr-2">Page</span>
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-9 h-9 rounded-xl text-xs font-extrabold transition ${
                      isActive
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
