const ROWS = [
  { feature: "Primary Goal", seo: "Rank in search results", geo: "Get recommended by AI" },
  { feature: "Target Platforms", seo: "Google, Bing", geo: "ChatGPT, Perplexity, Gemini" },
  { feature: "Content Focus", seo: "Keywords & backlinks", geo: "Authority & citations" },
  { feature: "Measurement", seo: "Rankings & traffic", geo: "AI mentions & referrals" },
  { feature: "Timeline", seo: "3–6 months", geo: "1–3 months" },
  { feature: "Best For", seo: "Established websites", geo: "Brand visibility in AI" },
];

export default function GeoComparison() {
  return (
    <section className="section" id="geo">
      <div className="container">
        <div className="section-header">
          <h2>What is GEO?</h2>
          <p>Generative Engine Optimization complements SEO — here's how they differ.</p>
        </div>
        <div className="geo__table">
          <div className="geo__row geo__row--head">
            <div className="geo__cell geo__cell--head">Feature</div>
            <div className="geo__cell geo__cell--head">SEO</div>
            <div className="geo__cell geo__cell--head">GEO</div>
          </div>
          {ROWS.map((row) => (
            <div key={row.feature} className="geo__row">
              <div className="geo__cell geo__cell--feature" data-label="Feature">
                {row.feature}
              </div>
              <div className="geo__cell" data-label="SEO">
                <span className="geo__check">✓</span> {row.seo}
              </div>
              <div className="geo__cell" data-label="GEO">
                <span className="geo__check">✓</span> {row.geo}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
