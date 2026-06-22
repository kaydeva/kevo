// ── JourneyLandingPage ────────────────────────────────────────────────────
// Step-by-step personality quiz with premium UI and animated transitions.
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { analyzePersonality } from "../services/api";
import { ParticleField } from "../components/ParticleField";
import { GlowOrb } from "../components/GlowOrb";
import { PageTransition } from "../components/PageTransition";

const easing = [0.16, 1, 0.3, 1];

const questions = [
  {
    q: "How do you usually solve problems?",
    placeholder: "e.g. I break them into smaller pieces, research first, or trust my intuition...",
    icon: "🧩",
  },
  {
    q: "What motivates you the most?",
    placeholder: "e.g. Impact, learning, money, recognition, creativity...",
    icon: "🔥",
  },
  {
    q: "How do you behave under pressure?",
    placeholder: "e.g. I stay calm, get energized, feel anxious but push through...",
    icon: "⚡",
  },
  {
    q: "How do you prefer to work with others?",
    placeholder: "e.g. I like leading, prefer solo work, thrive in small teams...",
    icon: "🤝",
  },
  {
    q: "What type of tasks energize you?",
    placeholder: "e.g. Creative projects, data analysis, building things, strategy...",
    icon: "✨",
  },
  {
    q: "How do you learn new skills?",
    placeholder: "e.g. Hands-on practice, watching tutorials, reading docs, trial & error...",
    icon: "📚",
  },
];

const JourneyLandingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

  const progress = ((step + 1) / questions.length) * 100;
  const canContinue = answers[step]?.trim().length > 5;
  const isLast = step === questions.length - 1;

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      const personality = await analyzePersonality(answers);
      navigate("/results", { state: { personality, answers } });
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setLoading(false);
    }
  }, [answers, navigate]);

  const goNext = useCallback(() => {
    if (!canContinue) return;
    if (isLast) {
      handleSubmit();
    } else {
      setDirection(1);
      setStep((s) => s + 1);
    }
  }, [canContinue, isLast, step, handleSubmit]);

  const goBack = useCallback(() => {
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  }, [step]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && canContinue) {
      e.preventDefault();
      goNext();
    }
  };

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      filter: "blur(10px)",
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: easing },
    },
    exit: (dir) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      filter: "blur(10px)",
      transition: { duration: 0.3, ease: easing },
    }),
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden flex flex-col">
        {/* Background effects */}
        <ParticleField count={40} color="rgba(56, 189, 248, 0.3)" speed={0.15} />
        <GlowOrb color="rgba(0, 240, 255, 0.08)" size={600} x="20%" y="30%" blur={120} />
        <GlowOrb color="rgba(99, 102, 241, 0.06)" size={500} x="80%" y="70%" blur={100} duration={10} />

        {/* Progress bar */}
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/[0.03]">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_20px_rgba(0,240,255,0.5)]"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: easing }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easing }}
            className="text-center mb-12"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/70 mb-3 font-medium">
              Step {step + 1} of {questions.length} · Personality Analyzer
            </p>
            <h1 className="text-2xl md:text-3xl font-heading font-medium text-white/90">
              Let&apos;s understand how you work
            </h1>
          </motion.div>

          {/* Question card */}
          <div className="w-full max-w-2xl relative" style={{ minHeight: 320 }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full"
              >
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 sm:p-8 md:p-10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                  {/* Question icon + text */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6">
                    <span className="text-3xl">{questions[step].icon}</span>
                    <h2 className="text-xl md:text-2xl font-heading text-white leading-snug pt-1">
                      {questions[step].q}
                    </h2>
                  </div>

                  {/* Answer textarea */}
                  <textarea
                    value={answers[step]}
                    onChange={(e) => {
                      const updated = [...answers];
                      updated[step] = e.target.value;
                      setAnswers(updated);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={questions[step].placeholder}
                    rows={4}
                    autoFocus
                    className="w-full bg-black/30 border border-white/[0.08] rounded-xl p-4 text-base text-white placeholder-white/20 focus:outline-none focus:border-cyan-400/40 focus:shadow-[0_0_20px_rgba(0,240,255,0.1)] transition-all duration-300 resize-none"
                  />

                  {/* Hint */}
                  <p className="text-xs text-white/20 mt-3">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-white/40 text-[10px] font-mono">Enter</kbd> to continue · Be as detailed as you like
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: easing }}
            className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-8 sm:mt-10 w-full max-w-sm sm:max-w-none"
          >
            {/* Back */}
            {step > 0 && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={goBack}
                className="px-6 py-3 rounded-xl text-sm font-medium text-white/50 border border-white/[0.06] hover:bg-white/[0.04] hover:text-white/80 transition-all duration-300 w-full sm:w-auto text-center"
              >
                ← Back
              </motion.button>
            )}

            {/* Continue / Submit */}
            <motion.button
              whileHover={{ scale: canContinue ? 1.03 : 1 }}
              whileTap={{ scale: canContinue ? 0.97 : 1 }}
              onClick={goNext}
              disabled={!canContinue || loading}
              className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-500 flex items-center justify-center gap-2 w-full sm:w-auto ${canContinue
                ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:shadow-[0_0_50px_rgba(0,240,255,0.5)]"
                : "bg-white/[0.04] text-white/20 cursor-not-allowed"
                }`}
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-20" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <span>Analyzing…</span>
                </>
              ) : isLast ? (
                <>
                  <span>Analyze my personality</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Step dots */}
          <div className="flex gap-2 mt-8">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > step ? 1 : -1);
                  setStep(i);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === step
                  ? "bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.6)] w-6"
                  : i < step
                    ? "bg-cyan-400/40"
                    : "bg-white/10"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default JourneyLandingPage;
