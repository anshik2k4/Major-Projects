import { useState } from "react";

const FAQS = [
  {
    question: "What is GEO and how is it different from SEO?",
    answer: "GEO (Generative Engine Optimization) focuses on getting your brand recommended by AI assistants like ChatGPT and Perplexity. SEO targets traditional search engines. We combine both for complete visibility.",
  },
  {
    question: "How long before I see results?",
    answer: "GEO improvements can appear within 1–3 months. SEO typically takes 3–6 months for meaningful ranking gains. We set realistic timelines during your free audit.",
  },
  {
    question: "Do you work with startups or only enterprise?",
    answer: "Both. We've helped 500+ companies from early-stage startups to Fortune 500 brands. Our strategies scale to your budget and goals.",
  },
  {
    question: "What's included in the free growth audit?",
    answer: "A comprehensive review of your SEO health, AI visibility score, competitor analysis, and a prioritized action plan — no obligation, delivered within 48 hours.",
  },
  {
    question: "How do you measure AI visibility?",
    answer: "We track brand mentions, citation frequency, and recommendation rates across major AI platforms using proprietary monitoring tools, with 24/7 dashboards.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="section" id="blog">
      <div className="container">
        <div className="section-header">
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="faq__list">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="faq__item">
                <button
                  className="faq__question"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <span className="faq__number">{String(i + 1).padStart(2, "0")}</span>
                  {faq.question}
                  <svg
                    className={`faq__chevron ${isOpen ? "open" : ""}`}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
                <div className={`faq__answer ${isOpen ? "open" : ""}`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
