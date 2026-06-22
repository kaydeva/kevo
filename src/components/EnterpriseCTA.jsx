// ── EnterpriseCTA ─────────────────────────────────────────────────────────
// Premium enterprise call-to-action section with animated glow and form.
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { GlowOrb } from './GlowOrb';

export const EnterpriseCTA = () => {
  const [focused, setFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.elements.email.value;

    try {
      // Connect to the same origin monolithic server
      const response = await fetch('/enterprise-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setError(null);
        e.target.reset(); // Clear the form
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        setError(data.error || 'Failed to submit request');
        // Clear error after 3 seconds
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      console.error('Network Error:', err);
      setError('Network error. Is the server running?');
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <section className="py-32 px-6 md:px-12 lg:px-24 bg-omnis-dark relative z-20 flex justify-center overflow-hidden">
      {/* Ambient glow */}
      <GlowOrb color="rgba(14, 165, 233, 0.08)" size={800} x="50%" y="50%" blur={120} duration={8} />

      <motion.div
        initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl bg-omnis-charcoal rounded-3xl p-6 sm:p-10 md:p-20 text-center border border-white/[0.06] relative overflow-hidden group"
      >
        {/* Hover gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <ShieldCheck className="w-12 h-12 text-cyan-400 mb-6" />
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
            Secure Your Fleet
          </h2>
          <p className="text-xl text-white/40 max-w-2xl mb-12 leading-relaxed">
            Join elite organizations deploying autonomous agents securely within
            their private cloud. Pilot programs opening Q3.
          </p>

          {/* Email form */}
          <form
            className="w-full max-w-md relative flex items-center"
            onSubmit={handleSubmit}
          >
            <div
              className={`absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 blur transition-opacity duration-500 ${focused ? "opacity-20" : "opacity-0"
                }`}
            />
            <input
              type="email"
              name="email"
              placeholder="Enter enterprise email"
              className="w-full bg-omnis-dark border border-white/[0.08] rounded-full py-3 sm:py-4 pl-5 sm:pl-6 pr-[130px] sm:pr-32 text-sm sm:text-base text-white placeholder-white/20 outline-none focus:border-cyan-400/40 relative z-10 transition-all duration-300"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              required
            />
            <button
              type="submit"
              className="absolute right-1.5 sm:right-2 top-1.5 sm:top-2 bottom-1.5 sm:bottom-2 bg-white text-omnis-dark font-semibold rounded-full px-4 sm:px-6 flex items-center justify-center gap-2 hover:bg-cyan-50 transition-colors z-20 group/btn text-sm sm:text-base"
            >
              {submitted ? (
                <span className="text-green-600">Sent ✓</span>
              ) : (
                <>
                  Request Access
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="absolute -bottom-8 text-red-400 text-sm font-medium animate-pulse">
              {error}
            </div>
          )}

          {/* Trust badge */}
          <div className="mt-8 text-sm text-white/25 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            SOC2 Type II Certified
          </div>
        </div>
      </motion.div>
    </section>
  );
};
