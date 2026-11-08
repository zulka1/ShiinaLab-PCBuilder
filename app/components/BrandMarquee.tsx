const partnerBrands = [
  "NVIDIA",
  "Intel",
  "AMD",
  "ASUS ROG",
  "Corsair",
  "Lian Li",
  "NZXT",
  "MSI",
  "Gigabyte",
  "Western Digital",
  "Kingston",
  "Samsung",
];

export function BrandMarquee() {
  return (
    <section aria-label="Supported Hardware Brands" className="w-full py-4">
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {partnerBrands.map((brand) => (
          <div
            key={brand}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200/80 shadow-2xs text-xs font-bold text-slate-700 hover:border-blue-300 hover:text-blue-600 transition"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" aria-hidden="true" />
            <span>{brand}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
