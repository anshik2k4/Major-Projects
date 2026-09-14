const EXAMPLES = [
  "Quiet mountain cabin under ₹4000 near Manali",
  "Luxury beach stay in Goa for a weekend",
  "Family lakeside cottage with a view",
];

export default function AiStayMatcher({ query = "", loading, onSearch }) {
  function handleSubmit(e) {
    e.preventDefault();
    const value = new FormData(e.currentTarget).get("ai")?.toString().trim() || "";
    onSearch(value);
  }

  return (
    <section className="ai-matcher" aria-labelledby="ai-matcher-title">
      <div className="ai-matcher__inner">
        <div className="ai-matcher__heading">
          <span className="ai-matcher__badge">
            <i className="fas fa-wand-magic-sparkles" aria-hidden="true" />
            Gemini
          </span>
          <h2 id="ai-matcher-title" className="ai-matcher__title">
            Tell us the stay you want
          </h2>
          <p className="ai-matcher__sub">
            Describe budget, place, and vibe. We match real StayHub listings — no made-up stays.
          </p>
        </div>

        <form className="ai-matcher__form" onSubmit={handleSubmit}>
          <label className="visually-hidden" htmlFor="ai-stay-query">
            Describe your ideal stay
          </label>
          <input
            id="ai-stay-query"
            name="ai"
            type="search"
            className="ai-matcher__input"
            placeholder="e.g. peaceful lakeside stay under ₹5000"
            defaultValue={query}
            key={query}
            maxLength={280}
            autoComplete="off"
            disabled={loading}
          />
          <button className="ai-matcher__submit" type="submit" disabled={loading}>
            {loading ? "Matching…" : "Find stays"}
          </button>
        </form>

        <div className="ai-matcher__examples">
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              className="ai-matcher__chip"
              disabled={loading}
              onClick={() => onSearch(example)}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
