// ── WhyOmnis ──────────────────────────────────────────────────────────────
// Metrics showcase with parallax backgrounds and animated counters.
import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { GlowOrb } from './GlowOrb';

const metrics = [
  { label: "Personality Accuracy", value: "98.7", suffix: "%" },
  { label: "Analysis Speed", value: "1.2", suffix: "s" },
  { label: "Career Matches", value: "3,200", suffix: "+" },
  { label: "User Satisfaction", value: "97.4", suffix: "%" }

];

const features = [
  "Kevo analyzes your inputs, personality traits, strengths, and work style using advanced AI reasoning — giving you a level of self‑insight that traditional tests can’t reach.",
  "Instead of vague results, Kevo generates a clear, personalized career match that fits your mindset, motivations, and long‑term potential.",
  "Beyond choosing a career, Kevo provides actionable steps, guidance, and a roadmap to help you grow into the role that suits you best.",
];

export const WhyOmnis = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  return (
    <section
      ref={containerRef}
      className="py-32 px-6 md:px-12 lg:px-24 bg-omnis-charcoal relative z-20 overflow-hidden"
    >
      {/* Parallax Background Elements */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-20 left-10 w-64 h-64 border border-cyan-400/5 rounded-full blur-[1px] opacity-30 pointer-events-none"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-20 right-10 w-96 h-96 border border-white/[0.03] rounded-full blur-[1px] opacity-20 pointer-events-none"
      />

      <GlowOrb color="rgba(0, 240, 255, 0.04)" size={500} x="80%" y="50%" blur={100} duration={9} />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/60 mb-4 font-medium">
            Why us
          </p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
            Why Kevo?
          </h2>
          <p className="text-xl text-white/40 mb-10 leading-relaxed">
            Because the future doesn’t wait.
            Kevo turns your ideas into actions, your actions into outcomes, and your outcomes into momentum — all powered by autonomous intelligence.
          </p>

          <ul className="space-y-5">
            {features.map((feature, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="flex items-start gap-4 text-white/70 group"
              >
                <span className="mt-1.5 w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0 shadow-[0_0_8px_rgba(56,189,248,0.8)] group-hover:shadow-[0_0_16px_rgba(56,189,248,1)] transition-shadow" />
                <span className="group-hover:text-white/90 transition-colors duration-300">
                  {feature}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Asymmetrical Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {metrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Animated Metric Card ──────────────────────────────────────────────────
const MetricCard = ({ metric, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }}
      animate={
        inView
          ? { opacity: 1, scale: 1, filter: "blur(0px)" }
          : { opacity: 0, scale: 0.9, filter: "blur(6px)" }
      }
      transition={{ delay: index * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`group p-6 sm:p-8 rounded-2xl glass-panel hover:border-white/[0.12] transition-all duration-500 ${index % 2 === 1 ? "mt-0 sm:mt-8 lg:mt-12" : ""
        }`}
    >
      <div className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-cyan-400 mb-2 group-hover:drop-shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all duration-500">
        {metric.prefix}
        {metric.value}
        {metric.suffix}
      </div>
      <div className="text-xs sm:text-sm uppercase tracking-wider text-white/30 font-medium group-hover:text-white/50 transition-colors">
        {metric.label}
      </div>
    </motion.div>
  );
};
