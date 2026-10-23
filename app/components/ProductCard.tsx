import Link from "next/link";
import { categoryLabels, formatRupiah, type Product } from "../data/mock-products";

export function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (product: Product) => void;
}) {
  return (
    <article className="product-card">
      <Link
        href={`/shop/${product.id}`}
        className="product-visual block"
        aria-label={`Lihat detail ${product.name}`}
      >
        <span className="product-visual-index">{product.id.slice(-2).toUpperCase()}</span>
        <span className="product-visual-label">{categoryLabels[product.category]}</span>
        <span className="product-visual-mark">Lihat Detail &rarr;</span>
      </Link>
      <div className="product-card-body">
        <p className="product-category">{categoryLabels[product.category]}</p>
        <h3>
          <Link
            href={`/shop/${product.id}`}
            className="hover:text-amber-200 transition-colors"
          >
            {product.name}
          </Link>
        </h3>
        <p className="product-description">{product.description}</p>
        <ul className="specification-list" aria-label={`Spesifikasi ${product.name}`}>
          {product.specifications.map((specification) => (
            <li key={specification}>{specification}</li>
          ))}
        </ul>
        <div className="product-card-bottom">
          <div>
            <span className="product-price-label">Harga mock</span>
            <strong className="product-price">{formatRupiah(product.price)}</strong>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <Link
              href={`/shop/${product.id}`}
              className="button button-quiet"
              aria-label={`Detail ${product.name}`}
            >
              Detail
            </Link>
            <button
              className="button button-quiet product-add-button"
              type="button"
              onClick={() => onAdd(product)}
              aria-label={`Tambahkan ${product.name} ke keranjang simulasi`}
            >
              Tambah
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
