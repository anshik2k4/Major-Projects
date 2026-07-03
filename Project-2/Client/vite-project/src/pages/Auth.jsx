import { motion } from "framer-motion";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-violet-500/30 border-t-violet-400 animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Sirf yeh ek function rakho — Supabase wala
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
    if (error) console.error(error)
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-violet-700/10 blur-3xl pointer-events-none" />

      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 text-white/30 hover:text-white/70 text-sm transition-colors flex items-center gap-1.5"
      >
        ← Back
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md bg-white/[0.04] border border-white/10 rounded-3xl p-10 backdrop-blur-xl relative z-10"
      >
        <div className="text-center mb-8">
          <span className="text-2xl font-bold tracking-tight">
            Prep<span className="text-violet-400">AI</span>
          </span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-white/40 text-sm leading-relaxed">
            Sign in to continue your interview preparation journey.
          </p>
        </div>

        <div className="mb-8 px-4 py-3 rounded-xl bg-violet-500/8 border border-violet-500/15 text-center">
          <p className="text-violet-300/80 text-sm italic">
            "Confidence is the result of preparation."
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.09)" }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl border border-white/12 bg-white/5 hover:bg-white/8 transition-all text-sm font-medium"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </motion.button>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-white/20 text-xs">secure login</span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        <div className="space-y-2.5">
          {["No password needed", "Your data is private and secure", "Free to start — no credit card"].map((point) => (
            <div key={point} className="flex items-center gap-2.5 text-white/35 text-xs">
              <span className="text-violet-400 text-base leading-none">✓</span>
              {point}
            </div>
          ))}
        </div>

        <p className="text-center text-white/20 text-xs mt-8">
          By continuing, you agree to our{" "}
          <span className="text-white/40 hover:text-white/60 cursor-pointer transition-colors">Terms</span>{" "}
          and{" "}
          <span className="text-white/40 hover:text-white/60 cursor-pointer transition-colors">Privacy Policy</span>.
        </p>
      </motion.div>
    </div>
  );
}