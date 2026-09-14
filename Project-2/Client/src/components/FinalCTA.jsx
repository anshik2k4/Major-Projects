const AVATARS = ["JD", "AK", "MR", "LS", "TW"];

export default function FinalCTA() {
  return (
    <section className="section section--alt final-cta" id="contact">
      <div className="final-cta__glow" aria-hidden="true" />
      <div className="container final-cta__inner">
        <h2>Ready to be found everywhere your customers search?</h2>
        <p style={{ marginTop: "16px", marginBottom: "24px", fontSize: "16px" }}>
          Get your free growth audit and discover how SEO + GEO can transform your visibility.
        </p>
        <a href="#contact" className="btn btn--primary">
          Book Your Free Growth Audit
        </a>
        <div className="final-cta__trust">
          <div className="final-cta__avatars">
            {AVATARS.map((initials) => (
              <span key={initials} className="final-cta__avatar">
                {initials}
              </span>
            ))}
          </div>
          <span>Loved by 500+ founders</span>
        </div>
      </div>
    </section>
  );
}
