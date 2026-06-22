// ── HowItWorks ────────────────────────────────────────────────────────────
// Deep-tech workflow architecture section with animated cards and glow effects.
import { motion } from 'framer-motion';
import { Database, BrainCircuit, Zap } from 'lucide-react';
import { GlowOrb } from './GlowOrb';

const phases = [
  {
    icon: <Database className="w-8 h-8 text-cyan-400" />,
    title: "Understand",
    description: "Kevo analyzes your goals, context, and constraints using advanced reasoning models.",
    gradient: "from-cyan-400/20 to-blue-500/5",
  },
  {
    icon: <BrainCircuit className="w-8 h-8 text-purple-400" />,
    title: "Plan",
    description: "It generates a structured, step‑by‑step strategy tailored to your objective.",
    gradient: "from-purple-400/20 to-indigo-500/5",
  },
  {
    icon: <Zap className="w-8 h-8 text-amber-400" />,
    title: "Execute",
    description: "Kevo deploys autonomous agents to complete tasks, gather data, and deliver results — without you lifting a finger.Simple for you. Powerful under the hood.",
    gradient: "from-amber-400/20 to-orange-500/5",
  },
];

export const HowItWorks = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 50, filter: "blur(8px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 50, damping: 20 },
    },
  };

  return (
    <section className="py-32 px-6 md:px-12 lg:px-24 bg-omnis-dark relative z-20 overflow-hidden">
      {/* Ambient background */}
      <GlowOrb color="rgba(139, 92, 246, 0.05)" size={500} x="10%" y="30%" blur={100} duration={10} />
      <GlowOrb color="rgba(0, 240, 255, 0.04)" size={400} x="90%" y="70%" blur={80} duration={8} />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/60 mb-4 font-medium">
            Architecture
          </p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
            How Kevo Works          </h2>
          <p className="text-xl text-white/40 max-w-2xl mx-auto leading-relaxed">
            Kevo transforms your input into intelligent action through three simple layers:          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {phases.map((phase, index) => (
            <motion.div
              key={index}
              variants={item}
              className="group relative"
            >
              {/* Hover glow */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700" />

              <div className="relative h-full bg-omnis-charcoal rounded-2xl p-8 border border-white/[0.06] overflow-hidden group-hover:border-white/[0.12] transition-colors duration-500">
                {/* Icon */}
                <div className="mb-6 p-4 inline-flex rounded-xl bg-white/[0.03] border border-white/[0.06] group-hover:border-white/[0.12] transition-all duration-500">
                  {phase.icon}
                </div>

                {/* Step number */}
                <div className="absolute top-6 right-6 text-6xl font-heading font-bold text-white/[0.03] group-hover:text-white/[0.06] transition-colors duration-500">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <h3 className="text-2xl font-heading font-semibold text-white mb-4 group-hover:text-cyan-400 transition-colors duration-300">
                  {phase.title}
                </h3>
                <p className="text-white/50 leading-relaxed">
                  {phase.description}
                </p>

                {/* Corner gradient */}
                <div className={`absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl ${phase.gradient} rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
