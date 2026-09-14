const BRANDS = ["Microsoft", "Adobe", "Amazon", "Logitech", "TATA"];

export default function LogoCloud() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2>Trusted by Leading Brands</h2>
        </div>
        <div className="logo-cloud__grid">
          {BRANDS.map((brand) => (
            <span key={brand} className="logo-cloud__item">
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
