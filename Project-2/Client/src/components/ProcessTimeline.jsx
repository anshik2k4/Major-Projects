const STEPS = [
  { title: "Discovery & SEO Audit", description: "Deep analysis of your site, competitors, and search landscape." },
  { title: "Strategy & Roadmap", description: "Custom plan aligned with your business goals and timeline." },
  { title: "Technical SEO", description: "Fix crawl issues, speed, schema, and core web vitals." },
  { title: "Content & On-Page SEO", description: "Optimize pages and create content that ranks and converts." },
  { title: "Authority Building", description: "Earn quality backlinks and brand mentions across the web." },
  { title: "Tracking & Reporting", description: "Monitor rankings, traffic, and AI visibility with live dashboards." },
  { title: "Continuous Growth", description: "Iterate and scale what works — SEO and GEO in lockstep." },
];

export default function ProcessTimeline() {
  return (
    <section className="section section--alt" id="case-studies">
      <div className="container">
        <div className="section-header">
          <h2>SEO Growth Process</h2>
          <p>A proven framework from audit to sustained organic growth.</p>
        </div>
        <div className="process__timeline">
          {STEPS.map((step, i) => (
            <div key={step.title} className="process__step">
              <span className="process__number">{String(i + 1).padStart(2, "0")}</span>
              <h4>{step.title}</h4>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
