"use client";

import { useMemo, useState } from "react";
import { categoryLabels, mockProducts, type Product } from "../data/mock-products";
import { ProductCard } from "./ProductCard";

const categories = ["Semua kategori", ...Object.values(categoryLabels)];

export function ShopCatalog({
  initialProducts = mockProducts,
}: {
  initialProducts?: Product[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua kategori");
  const [sort, setSort] = useState("recommended");
  const [cart, setCart] = useState<Product[]>([]);
  const [notice, setNotice] = useState("");

  const visibleProducts = useMemo(() => {
    const filtered = initialProducts.filter((product) => {
      const matchesQuery = `${product.name} ${product.description} ${product.specifications.join(" ")}`
        .toLocaleLowerCase("id")
        .includes(query.toLocaleLowerCase("id"));
      const matchesCategory =
        category === "Semua kategori" || categoryLabels[product.category] === category;
      return matchesQuery && matchesCategory;
    });

    return [...filtered].sort((first, second) => {
      if (sort === "price-ascending") return first.price - second.price;
      if (sort === "price-descending") return second.price - first.price;
      return first.name.localeCompare(second.name);
    });
  }, [category, initialProducts, query, sort]);

  function addToCart(product: Product) {
    setCart((currentCart) => [...currentCart, product]);
    setNotice(`${product.name} ditambahkan ke keranjang.`);
  }

  return (
    <>
      <div className="catalog-controls">
        <div className="catalog-search">
          <label htmlFor="catalog-search">Cari komponen</label>
          <input
            id="catalog-search"
            type="search"
            placeholder="Contoh: Ryzen, DDR5, NVMe"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="catalog-select">
          <label htmlFor="catalog-category">Kategori</label>
          <select
            id="catalog-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div className="catalog-select">
          <label htmlFor="catalog-sort">Urutkan</label>
          <select id="catalog-sort" value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="recommended">Nama produk</option>
            <option value="price-ascending">Harga terendah</option>
            <option value="price-descending">Harga tertinggi</option>
          </select>
        </div>
      </div>

      <div className="catalog-status-row">
        <p aria-live="polite">{visibleProducts.length} komponen mock ditampilkan</p>
        <p>Keranjang <strong>{cart.length}</strong></p>
      </div>

      {visibleProducts.length > 0 ? (
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={addToCart} />
          ))}
        </div>
      ) : (
        <div className="empty-state" role="status">
          <h3>Komponen tidak ditemukan</h3>
          <p>Coba kata kunci atau kategori lain.</p>
        </div>
      )}

      <p className="form-feedback" role="status" aria-live="polite">{notice}</p>
      <p className="mock-disclaimer">
        Keranjang hanya simulasi antarmuka; belum ada checkout atau pesanan yang dibuat.
      </p>
    </>
  );
}
