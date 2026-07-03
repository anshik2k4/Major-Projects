import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: "🎯",
    title: "Role-Specific Questions",
    desc: "AI generates questions tailored to your exact job role and experience level.",
  },
  {
    icon: "🧠",
    title: "Smart Feedback",
    desc: "Instant analysis of your answers with tips to improve every response.",
  },
  {
    icon: "📄",
    title: "Resume-Based Prep",
    desc: "Upload your resume and get interview questions based on your own experience.",
  },
  {
    icon: "📈",
    title: "Progress Tracking",
    desc: "Track your improvement over time with detailed session reports.",
  },
];

const quotes = [
  "The more you practice, the luckier you get.",
  "Confidence is the result of preparation.",
  "Your dream job is one interview away.",
  "Don't wish for it. Prepare for it.",
];

const steps = [
  { step: "01", title: "Sign in", desc: "Login with your Google account in one click." },
  { step: "02", title: "Set your role", desc: "Tell us the job you're preparing for." },
  { step: "03", title: "Practice", desc: "Answer AI-generated questions at your own pace." },
  { step: "04", title: "Improve", desc: "Read feedback, refine answers, repeat." },
];

export default function Home() {
  const navigate = useNavigate();
  const [quoteIdx, setQuoteIdx] = useState(0);
  const featuresRef = useRef(null);
  const stepsRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, margin: "-80px" });
  const stepsInView = useInView(stepsRef, { once: true, margin: "-80px" });

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % quotes.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans overflow-x-hidden">

      {/* NAV */}
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 backdrop-blur-md bg-[#0a0a0f]/80 border-b border-white/5"
      >
        <span className="text-xl font-bold tracking-tight">
          Prep<span className="text-violet-400">AI</span>
        </span>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/auth")}
          className="px-5 py-2 rounded-full text-sm font-medium bg-violet-600 hover:bg-violet-500 transition-colors"
        >
          Get started
        </motion.button>
      </motion.nav>

      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center text-center min-h-screen px-6 pt-24 pb-16">
        {/* glow blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-700/10 blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          AI-powered mock interviews
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold tracking-tight leading-tight max-w-4xl"
        >
          Practice smart.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-300">
            Interview confident.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-6 text-lg text-white/50 max-w-xl leading-relaxed"
        >
          PrepAI gives you a personal AI interviewer — tailored questions, instant feedback, and the confidence to walk into any room ready.
        </motion.p>

        {/* Rotating quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="mt-8 h-8 flex items-center justify-center"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={quoteIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45 }}
              className="text-sm text-white/30 italic"
            >
              "{quotes[quoteIdx]}"
            </motion.p>
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row gap-3 items-center"
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/auth")}
            className="px-8 py-3.5 rounded-full bg-violet-600 hover:bg-violet-500 transition-colors text-base font-semibold shadow-lg shadow-violet-900/40"
          >
            Start practicing free
          </motion.button>
          <button className="px-8 py-3.5 rounded-full border border-white/10 hover:border-white/20 text-white/60 hover:text-white transition-all text-base">
            See how it works ↓
          </button>
        </motion.div>

        {/* scroll cue */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20 text-xs flex flex-col items-center gap-1"
        >
          <span>scroll</span>
          <span>↓</span>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section ref={featuresRef} className="px-6 py-24 max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          animate={featuresInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center text-violet-400 text-sm font-medium tracking-widest uppercase mb-3"
        >
          What PrepAI does
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={featuresInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center text-3xl md:text-4xl font-bold mb-14"
        >
          Everything you need to get hired
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              whileHover={{ y: -4, borderColor: "rgba(167,139,250,0.35)" }}
              className="p-6 rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm transition-all cursor-default"
            >
              <span className="text-3xl mb-4 block">{f.icon}</span>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-white/45 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section ref={stepsRef} className="px-6 py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            animate={stepsInView ? { opacity: 1 } : {}}
            className="text-center text-violet-400 text-sm font-medium tracking-widest uppercase mb-3"
          >
            How it works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={stepsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-center text-3xl md:text-4xl font-bold mb-14"
          >
            From signup to confident in minutes
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 25 }}
                animate={stepsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center text-violet-300 font-bold text-sm mb-4">
                  {s.step}
                </div>
                <h3 className="font-semibold mb-1.5">{s.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
            Your dream job is{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-300">
              one interview away.
            </span>
          </h2>
          <p className="text-white/40 text-lg mb-10">
            Join thousands of candidates who prepared with PrepAI and walked into interviews ready.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/auth")}
            className="px-10 py-4 rounded-full bg-violet-600 hover:bg-violet-500 transition-colors text-base font-semibold shadow-xl shadow-violet-900/40"
          >
            Get started — it's free
          </motion.button>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-8 text-center text-white/20 text-sm">
        © 2026 PrepAI · Built to help you get hired
      </footer>
    </div>
  );
}
