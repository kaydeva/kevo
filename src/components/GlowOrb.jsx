// ── GlowOrb ──────────────────────────────────────────────────────────────
// Animated ambient glow orb for cinematic depth.
import { motion } from "framer-motion";

export const GlowOrb = ({
  color = "rgba(0, 240, 255, 0.15)",
  size = 400,
  x = "50%",
  y = "50%",
  blur = 100,
  duration = 8,
  className = "",
}) => (
  <motion.div
    animate={{
      scale: [1, 1.2, 0.95, 1.1, 1],
      opacity: [0.5, 0.8, 0.4, 0.7, 0.5],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className={`absolute rounded-full pointer-events-none ${className}`}
    style={{
      width: size,
      height: size,
      left: x,
      top: y,
      transform: "translate(-50%, -50%)",
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      filter: `blur(${blur}px)`,
    }}
  />
);
