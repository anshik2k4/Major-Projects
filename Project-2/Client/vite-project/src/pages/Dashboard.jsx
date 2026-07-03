import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const quickActions = [
  {
    icon: "🎯",
    title: "Set your role",
    desc: "Tell us the job you're preparing for.",
    status: "Coming soon",
  },
  {
    icon: "💬",
    title: "Start mock interview",
    desc: "Practice with AI-generated questions.",
    status: "Coming soon",
  },
  {
    icon: "📄",
    title: "Upload resume",
    desc: "Get questions based on your experience.",
    status: "Coming soon",
  },
  {
    icon: "📈",
    title: "View progress",
    desc: "Track sessions and improvement over time.",
    status: "Coming soon",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "there";

  const avatarUrl = user?.user_metadata?.avatar_url;

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-violet-700/8 blur-3xl pointer-events-none" />

      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 backdrop-blur-md bg-[#0a0a0f]/80 border-b border-white/5"
      >
        <span className="text-xl font-bold tracking-tight">
          Prep<span className="text-violet-400">AI</span>
        </span>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                className="w-8 h-8 rounded-full border border-white/10"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-sm font-medium text-violet-300">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-sm text-white/60 max-w-[160px] truncate">
              {user?.email}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            className="px-4 py-2 rounded-full text-sm font-medium border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
          >
            Log out
          </motion.button>
        </div>
      </motion.nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 py-10 md:py-14">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-violet-400 text-sm font-medium tracking-widest uppercase mb-2">
            Dashboard
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {displayName}!
          </h1>
          <p className="text-white/45 text-base max-w-xl">
            You're signed in and ready to prepare. Pick an action below to get
            started with your interview prep.
          </p>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
        >
          {[
            { label: "Credits", value: "100", sub: "Free starter balance" },
            { label: "Sessions", value: "0", sub: "Interviews completed" },
            { label: "Streak", value: "—", sub: "Days in a row" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-5 rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-sm"
            >
              <p className="text-white/40 text-xs uppercase tracking-wider mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-violet-300">{stat.value}</p>
              <p className="text-white/30 text-xs mt-1">{stat.sub}</p>
            </div>
          ))}
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-5">Quick actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, i) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.08 }}
                className="p-6 rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-sm opacity-75 cursor-not-allowed"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="text-2xl">{action.icon}</span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-white/5 text-white/35 border border-white/8">
                    {action.status}
                  </span>
                </div>
                <h3 className="font-semibold mb-1.5">{action.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  {action.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
}
