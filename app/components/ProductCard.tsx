import Image from "next/image";
import Link from "next/link";
import { categoryLabels, formatRupiah, type Product } from "../data/mock-products";

export function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (product: Product) => void;
}) {
  const rating = product.rating ?? 4.8;
  const reviewsCount = product.reviewsCount ?? 112;

  return (
    <article className="group bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs hover:shadow-lg hover:border-blue-200 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* IMAGE CONTAINER */}
        <Link
          href={`/shop/${product.id}`}
          className="relative w-full h-44 sm:h-48 rounded-2xl bg-gradient-to-b from-slate-50/80 via-white to-slate-50/60 border border-slate-100 flex items-center justify-center p-3 mb-4 overflow-hidden"
          aria-label={`View details of ${product.name}`}
        >
          <Image
            src={product.image || "/images/rtx-4080-white.jpg"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain scale-105 group-hover:scale-115 transition-transform duration-300"
          />
        </Link>

        {/* SPECIFICATION TAGS ROW */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
          {product.specifications.slice(0, 3).map((spec) => (
            <span
              key={spec}
              className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
            >
              {spec}
            </span>
          ))}
          {product.available ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
              In Stock
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700">
              Sold Out
            </span>
          )}
        </div>

        {/* PRODUCT TITLE */}
        <h3 className="text-sm font-extrabold text-slate-900 leading-snug line-clamp-2 min-h-[2.5rem]">
          <Link
            href={`/shop/${product.id}`}
            className="hover:text-blue-600 transition-colors"
          >
            {product.name}
          </Link>
        </h3>

        {/* RATING ROW */}
        <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
          <div className="flex items-center text-amber-400 text-xs">
            {"★".repeat(Math.floor(rating))}
            {"☆".repeat(5 - Math.floor(rating))}
          </div>
          <span className="font-bold text-slate-700">{rating}/5</span>
          <span className="text-slate-300">•</span>
          <span className="text-[11px] text-slate-400">{reviewsCount} Reviews</span>
        </div>
      </div>

      {/* PRICE AND CTA ROW */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            Unit Price
          </span>
          <strong className="text-base font-extrabold text-slate-950 block">
            {formatRupiah(product.price)}
          </strong>
        </div>

        <button
          type="button"
          onClick={() => onAdd(product)}
          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-xs hover:shadow-md transition-all duration-150 flex items-center gap-1"
        >
          <span className="text-white font-extrabold">+ Add to Build</span>
        </button>
      </div>
    </article>
  );
}
