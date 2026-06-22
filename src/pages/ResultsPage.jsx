// ── ResultsPage ───────────────────────────────────────────────────────────
// AI-generated personality results with job matches and learning roadmap.
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { matchJobs, generateRoadmap } from "../services/api";
import { ParticleField } from "../components/ParticleField";
import { GlowOrb } from "../components/GlowOrb";
import { PageTransition } from "../components/PageTransition";

const easing = [0.16, 1, 0.3, 1];

// ── Animated Trait Bar ────────────────────────────────────────────────────
const TraitBar = ({ label, value, delay = 0 }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-sm">
      <span className="text-white/70">{label}</span>
      <span className="text-cyan-400 font-medium">{value}%</span>
    </div>
    <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.2, delay: delay + 0.3, ease: easing }}
        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_12px_rgba(0,240,255,0.4)]"
      />
    </div>
  </div>
);

// ── Job Card ──────────────────────────────────────────────────────────────
const JobCard = ({ job, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 + index * 0.1, duration: 0.6, ease: easing }}
    className="group relative bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:border-cyan-400/30 hover:bg-white/[0.04] transition-all duration-500"
  >
    {/* Match badge */}
    <div className="absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-[0_0_15px_rgba(0,240,255,0.3)]">
      {job.match}% Match
    </div>

    <h3 className="text-lg font-heading font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
      {job.title}
    </h3>
    <p className="text-sm text-white/50 mb-4 leading-relaxed">{job.description}</p>

    <div className="flex items-center gap-3 mb-4">
      <span className="text-xs px-2.5 py-1 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20">
        {job.salary}
      </span>
      <span className="text-xs px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
        {job.growth} Growth
      </span>
    </div>

    <div className="flex flex-wrap gap-1.5">
      {job.skills.map((skill) => (
        <span
          key={skill}
          className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.04] text-white/40 border border-white/[0.06]"
        >
          {skill}
        </span>
      ))}
    </div>

    {/* Hover glow */}
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
  </motion.div>
);

// ── Roadmap Phase ─────────────────────────────────────────────────────────
const RoadmapPhase = ({ phase, index, total }) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.3 + index * 0.15, duration: 0.6, ease: easing }}
    className="relative pl-8 pb-8"
  >
    {/* Vertical connector line */}
    {index < total - 1 && (
      <div className="absolute left-[11px] top-6 bottom-0 w-px bg-gradient-to-b from-cyan-400/40 to-transparent" />
    )}

    {/* Node dot */}
    <div className="absolute left-0 top-1 w-[22px] h-[22px] rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 shadow-[0_0_12px_rgba(0,240,255,0.4)] flex items-center justify-center">
      <span className="text-[9px] font-bold text-black">{index + 1}</span>
    </div>

    {/* Content */}
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 hover:border-cyan-400/20 transition-colors duration-300">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs px-2.5 py-1 rounded-lg bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 font-medium">
          Week {phase.week}
        </span>
        <h4 className="text-base font-heading font-semibold text-white">
          {phase.title}
        </h4>
      </div>
      <ul className="space-y-2">
        {phase.tasks.map((task, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-white/50">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400/40 flex-shrink-0" />
            {task}
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
);

// ── Main Page ─────────────────────────────────────────────────────────────
const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const personality = location.state?.personality;

  const [jobs, setJobs] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingRoadmap, setLoadingRoadmap] = useState(true);

  useEffect(() => {
    if (!personality) return;
    matchJobs(personality).then((data) => {
      setJobs(data);
      setLoadingJobs(false);
    });
    generateRoadmap(personality).then((data) => {
      setRoadmap(data);
      setLoadingRoadmap(false);
    });
  }, [personality]);

  // Redirect if no data
  if (!personality) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6">
          <h1 className="text-3xl font-heading mb-4">No results yet</h1>
          <p className="text-white/50 mb-8">Complete the personality quiz first.</p>
          <button
            onClick={() => navigate("/journey")}
            className="px-6 py-3 rounded-xl font-semibold text-black bg-gradient-to-r from-cyan-400 to-blue-500 hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-shadow"
          >
            Start the quiz →
          </button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
        {/* Ambient background */}
        <ParticleField count={30} color="rgba(56, 189, 248, 0.25)" speed={0.1} />
        <GlowOrb color="rgba(0, 240, 255, 0.06)" size={700} x="70%" y="20%" blur={140} />
        <GlowOrb color="rgba(139, 92, 246, 0.05)" size={500} x="20%" y="80%" blur={120} duration={12} />

        <div className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-24 py-12 sm:py-20 max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: easing }}
            className="text-center mb-20"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/70 mb-4 font-medium">
              Your AI‑Generated Journey
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-medium text-white mb-6 leading-tight">
              Here&apos;s what the AI{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
                discovered
              </span>
            </h1>
            <p className="text-lg text-white/40 max-w-2xl mx-auto">
              Personality analysis, ideal career matches, and a personalized
              learning roadmap — all generated just for you.
            </p>
          </motion.div>

          {/* ── Personality Panel ─────────────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: easing }}
            className="mb-16"
          >
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-8 md:p-10 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-8">
                <span className="text-2xl">🧠</span>
                <h2 className="text-2xl font-heading font-semibold text-white">
                  Personality Analysis
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                {/* Left: type + style */}
                <div className="space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/30 mb-2">Personality Type</p>
                    <h3 className="text-2xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
                      {personality.type}
                    </h3>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/30 mb-2">Work Style</p>
                    <p className="text-sm text-white/60 leading-relaxed">{personality.workStyle}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-green-400/60 mb-2">Strengths</p>
                      <ul className="space-y-1.5">
                        {(Array.isArray(personality.strengths) ? personality.strengths : [personality.strengths]).map((s, i) => (
                          <li key={i} className="text-sm text-white/50 flex items-start gap-2">
                            <span className="text-green-400 mt-0.5">+</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-orange-400/60 mb-2">Weaknesses</p>
                      <ul className="space-y-1.5">
                        {(Array.isArray(personality.weaknesses) ? personality.weaknesses : [personality.weaknesses]).map((w, i) => (
                          <li key={i} className="text-sm text-white/50 flex items-start gap-2">
                            <span className="text-orange-400 mt-0.5">−</span> {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Right: trait bars */}
                {personality.traits && (
                  <div className="space-y-4">
                    <p className="text-xs uppercase tracking-wider text-white/30 mb-3">Trait Scores</p>
                    {Object.entries(personality.traits).map(([key, val], i) => (
                      <TraitBar
                        key={key}
                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                        value={val}
                        delay={i * 0.1}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.section>

          {/* ── Job Matches ───────────────────────────────────────────────── */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-2xl">💼</span>
              <h2 className="text-2xl font-heading font-semibold text-white">
                Career Matches
              </h2>
            </div>

            {loadingJobs ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-6 animate-pulse">
                    <div className="h-5 w-40 bg-white/[0.06] rounded mb-3" />
                    <div className="h-3 w-full bg-white/[0.04] rounded mb-2" />
                    <div className="h-3 w-3/4 bg-white/[0.04] rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {jobs?.jobs?.map((job, i) => (
                  <JobCard key={i} job={job} index={i} />
                ))}
              </div>
            )}
          </section>

          {/* ── Learning Roadmap ──────────────────────────────────────────── */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📚</span>
              <h2 className="text-2xl font-heading font-semibold text-white">
                Learning Roadmap
              </h2>
            </div>
            {roadmap?.timeline && (
              <p className="text-sm text-cyan-400/60 mb-8 ml-11">
                Estimated timeline: {roadmap.timeline}
              </p>
            )}

            {loadingRoadmap ? (
              <div className="space-y-4 pl-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-5 animate-pulse">
                    <div className="h-4 w-32 bg-white/[0.06] rounded mb-3" />
                    <div className="h-3 w-full bg-white/[0.04] rounded mb-2" />
                    <div className="h-3 w-2/3 bg-white/[0.04] rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {roadmap?.phases?.map((phase, i) => (
                  <RoadmapPhase
                    key={i}
                    phase={phase}
                    index={i}
                    total={roadmap.phases.length}
                  />
                ))}
              </div>
            )}
          </section>

          {/* ── Actions ───────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6, ease: easing }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 sm:gap-6 mt-12"
          >
            <button
              onClick={() => navigate("/journey")}
              className="px-8 py-3 rounded-xl text-sm font-semibold text-black bg-gradient-to-r from-cyan-400 to-blue-500 hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-shadow duration-500 w-full sm:w-auto"
            >
              Retake Quiz
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3 rounded-xl text-sm font-medium text-white/50 border border-white/[0.06] hover:bg-white/[0.04] transition-all duration-300 w-full sm:w-auto"
            >
              Back to Home
            </button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ResultsPage;
