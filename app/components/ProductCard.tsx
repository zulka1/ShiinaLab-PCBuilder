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
      <div className="product-visual" aria-hidden="true">
        <span className="product-visual-index">{product.id.slice(-2).toUpperCase()}</span>
        <span className="product-visual-label">{categoryLabels[product.category]}</span>
        <span className="product-visual-mark">Gambar belum tersedia</span>
      </div>
      <div className="product-card-body">
        <p className="product-category">{categoryLabels[product.category]}</p>
        <h3>{product.name}</h3>
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
    </article>
  );
}
