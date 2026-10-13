const mockBrands = [
  "AMD",
  "Intel",
  "MSI",
  "ASUS",
  "Corsair",
  "Kingston",
  "WD Black",
  "Cooler Master",
  "FSP",
  "DeepCool",
  "Sapphire",
];

export function BrandMarquee() {
  return (
    <section className="brand-marquee" aria-labelledby="brand-marquee-heading">
      <div className="brand-marquee-heading">
        <p className="eyebrow" id="brand-marquee-heading">Merek pada data demonstrasi</p>
        <span>Bukan daftar sponsor atau mitra resmi</span>
      </div>
      <ul className="visually-hidden">
        {mockBrands.map((brand) => <li key={brand}>{brand}</li>)}
      </ul>
      <div className="brand-marquee-viewport" aria-hidden="true">
        <div className="brand-marquee-track">
          {[0, 1].map((copy) => (
            <div className={`brand-marquee-group${copy > 0 ? " is-copy" : ""}`} key={copy}>
              {mockBrands.map((brand) => (
                <span className="brand-marquee-item" key={`${copy}-${brand}`}>
                  {brand}
                  <span className="brand-marquee-separator" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
