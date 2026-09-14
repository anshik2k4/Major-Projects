function SearchIcon() {
  return (
    <svg className="service-card__icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="22" cy="22" r="12" stroke="currentColor" strokeWidth="2.5" />
      <path d="M31 31l8 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function AiIcon() {
  return (
    <svg className="service-card__icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="8" y="8" width="32" height="32" rx="6" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="18" cy="22" r="3" fill="currentColor" />
      <circle cx="30" cy="22" r="3" fill="currentColor" />
      <path d="M16 32c2-3 6-3 8 0s6 3 8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg className="service-card__icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M16 16l-8 8 8 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 16l8 8-8 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M26 12l-4 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

const SERVICES = [
  {
    icon: SearchIcon,
    title: "SEO Services",
    description: "Technical audits, keyword strategy, and content optimization to climb Google rankings.",
    highlighted: false,
  },
  {
    icon: AiIcon,
    title: "GEO Services",
    description: "Generative Engine Optimization to get your brand cited and recommended by AI assistants.",
    highlighted: true,
  },
  {
    icon: CodeIcon,
    title: "Website Development",
    description: "Fast, SEO-ready websites built for performance, accessibility, and conversion.",
    highlighted: false,
  },
];

export default function Services() {
  return (
    <section className="section section--alt" id="services">
      <div className="container">
        <div className="section-header">
          <h2>Our Engineering Capabilities</h2>
          <p>End-to-end search visibility — from traditional SEO to AI-first discovery.</p>
        </div>
        <div className="services__grid">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className={`card service-card ${service.highlighted ? "card--highlight" : ""}`}
              >
                {service.highlighted && <span className="service-card__badge">Most Popular</span>}
                <Icon />
                <h4>{service.title}</h4>
                <p>{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
