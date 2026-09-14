const STATS = [
  { number: "500+", label: "Projects Completed" },
  { number: "8+", label: "Years Experience" },
  { number: "4.9/5", label: "Star Rating" },
  { number: "24/7", label: "AI Monitoring" },
];

export default function TrustStats() {
  return (
    <section className="stats section--alt">
      <div className="container stats__grid">
        {STATS.map((stat) => (
          <div key={stat.label} className="stats__item">
            <span className="stats__number">{stat.number}</span>
            <span className="stats__label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
