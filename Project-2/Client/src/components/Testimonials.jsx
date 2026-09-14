import { useState, useEffect } from "react";

const TESTIMONIALS = [
  {
    quote: "Rank & Ask doubled our organic traffic in 6 months. Their GEO strategy got us cited in ChatGPT responses — something no other agency even mentioned.",
    name: "Sarah Chen",
    title: "CMO, TechFlow SaaS",
    initials: "SC",
  },
  {
    quote: "The team is transparent, data-driven, and genuinely expert. We went from page 3 to page 1 for our core keywords, and AI visibility went from zero to consistent mentions.",
    name: "Marcus Williams",
    title: "Founder, GrowthLab",
    initials: "MW",
  },
  {
    quote: "Best investment we made in marketing. The free audit alone uncovered issues our previous agency missed for two years.",
    name: "Priya Sharma",
    title: "Head of Marketing, NovaRetail",
    initials: "PS",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="section section--alt">
      <div className="container">
        <div className="section-header">
          <h2>What Our Clients Say</h2>
        </div>
        <div className="testimonials__slider">
          <div
            className="testimonials__track"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="testimonial-card">
                <p className="testimonial-card__quote">&ldquo;{t.quote}&rdquo;</p>
                <div className="testimonial-card__avatar">{t.initials}</div>
                <div className="testimonial-card__name">{t.name}</div>
                <div className="testimonial-card__title">{t.title}</div>
              </div>
            ))}
          </div>
          <div className="testimonials__dots">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                className={`testimonials__dot ${i === active ? "active" : ""}`}
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
