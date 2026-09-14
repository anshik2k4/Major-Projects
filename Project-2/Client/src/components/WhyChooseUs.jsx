const FEATURES = [
  {
    title: "Data-Driven Strategy",
    description: "Every recommendation backed by analytics, not guesswork.",
    icon: "📊",
  },
  {
    title: "AI-First Approach",
    description: "Optimized for ChatGPT, Perplexity, Gemini, and emerging AI search.",
    icon: "🤖",
  },
  {
    title: "Transparent Reporting",
    description: "Real-time dashboards with clear KPIs and ROI tracking.",
    icon: "📈",
  },
  {
    title: "Dedicated Team",
    description: "Senior strategists, not junior account managers.",
    icon: "👥",
  },
  {
    title: "White-Hat Methods",
    description: "Sustainable growth that protects your brand reputation.",
    icon: "🛡️",
  },
  {
    title: "24/7 Monitoring",
    description: "Continuous tracking of rankings, mentions, and AI citations.",
    icon: "⚡",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section" id="about">
      <div className="container">
        <div className="section-header">
          <h2>Why Choose Us</h2>
          <p>The partner that understands both search engines and AI recommendation systems.</p>
        </div>
        <div className="why__grid">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="why__item">
              <div className="why__icon" aria-hidden="true">
                {feature.icon}
              </div>
              <div>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
