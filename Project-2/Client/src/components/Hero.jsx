function TrafficChart() {
  return (
    <svg viewBox="0 0 400 180" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#51DF96" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#51DF96" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1="40"
          y1={30 + i * 35}
          x2="380"
          y2={30 + i * 35}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
      ))}
      <path
        d="M40 140 L80 130 L120 125 L160 110 L200 95 L240 80 L280 65 L320 50 L360 35"
        stroke="#51DF96"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M40 140 L80 130 L120 125 L160 110 L200 95 L240 80 L280 65 L320 50 L360 35 L360 160 L40 160 Z"
        fill="url(#chartFill)"
      />
      {[
        [40, 140], [80, 130], [120, 125], [160, 110], [200, 95],
        [240, 80], [280, 65], [320, 50], [360, 35],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="4" fill="#51DF96" />
      ))}
      {["Jan", "Mar", "May", "Jul", "Sep", "Nov"].map((label, i) => (
        <text
          key={label}
          x={40 + i * 64}
          y="175"
          fill="rgba(255,255,255,0.4)"
          fontSize="10"
          textAnchor="middle"
        >
          {label}
        </text>
      ))}
    </svg>
  );
}

const TRUST_ITEMS = [
  { name: "Clutch", rating: "4.9", reviews: "50+ reviews" },
  { name: "Google", rating: "5.0", reviews: "120+ reviews" },
  { name: "Trustpilot", rating: "4.8", reviews: "80+ reviews" },
];

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__glow" aria-hidden="true" />
      <div className="container hero__grid">
        <div className="hero__content">
          <h1>
            Rank on Google.
            <br />
            <span className="text-accent">Get recommended by AI.</span>
          </h1>
          <p>
            We help brands dominate traditional search and generative AI platforms —
            so customers find you on Google, ChatGPT, Perplexity, and beyond.
          </p>
          <div className="hero__ctas">
            <a href="#contact" className="btn btn--primary">
              Book Your Free Growth Audit
            </a>
            <a href="#geo" className="btn btn--outline">
              Run a Free AI Visibility Check
            </a>
          </div>
          <div className="hero__trust">
            {TRUST_ITEMS.map((item) => (
              <div key={item.name} className="hero__trust-item">
                <strong>{item.name}</strong>
                <span className="hero__trust-stars">★★★★★</span>
                <span>{item.rating} · {item.reviews}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero__chart-card">
          <div className="hero__chart-header">
            <div>
              <h4>Organic Traffic</h4>
              <small>Last 12 months</small>
            </div>
            <div className="hero__chart-stat">
              <span>+247%</span>
              <small>vs. previous year</small>
            </div>
          </div>
          <TrafficChart />
        </div>
      </div>
    </section>
  );
}
