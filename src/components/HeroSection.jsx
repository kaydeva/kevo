// ── HeroSection ───────────────────────────────────────────────────────────
// Cinematic scroll-driven hero with canvas frame animation, parallax layers,
// floating particles, ambient glow, and premium typography.
import { useEffect, useRef, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import { ParticleField } from "./ParticleField";
import { GlowOrb } from "./GlowOrb";

const premiumEasing = [0.16, 1, 0.3, 1];

export const HeroSection = ({ frameUrls }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);

  // Cursor tracking for ambient light
  const cursorX = useMotionValue(0.5);
  const cursorY = useMotionValue(0.5);
  const smoothCursorX = useSpring(cursorX, { stiffness: 40, damping: 20 });
  const smoothCursorY = useSpring(cursorY, { stiffness: 40, damping: 20 });

  const handleMouseMove = useCallback(
    (e) => {
      cursorX.set(e.clientX / window.innerWidth);
      cursorY.set(e.clientY / window.innerHeight);
    },
    [cursorX, cursorY]
  );

  // Staggered Preload frames
  useEffect(() => {
    if (!frameUrls?.length) return;
    
    let isCancelled = false;
    
    // 1. Load the first frame immediately so it draws instantly
    const loadFirstFrame = () => {
      const img = new Image();
      img.onload = () => {
        if (!isCancelled) {
          imagesRef.current[0] = img;
        }
      };
      img.src = frameUrls[0];
    };
    
    loadFirstFrame();

    // 2. Load remaining frames in small deferred batches to prevent network congestion
    const BATCH_SIZE = 15;
    const DELAY_MS = 25;
    let currentIdx = 1;

    const loadNextBatch = () => {
      if (isCancelled || currentIdx >= frameUrls.length) return;

      const limit = Math.min(currentIdx + BATCH_SIZE, frameUrls.length);
      for (let i = currentIdx; i < limit; i++) {
        const img = new Image();
        img.src = frameUrls[i];
        imagesRef.current[i] = img;
      }

      currentIdx = limit;
      
      if (currentIdx < frameUrls.length) {
        if (typeof window.requestIdleCallback === "function") {
          window.requestIdleCallback(() => loadNextBatch(), { timeout: 100 });
        } else {
          setTimeout(loadNextBatch, DELAY_MS);
        }
      }
    };

    const initialTimeout = setTimeout(loadNextBatch, 150);

    return () => {
      isCancelled = true;
      clearTimeout(initialTimeout);
    };
  }, [frameUrls]);

  // Scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Canvas frame mapping
  const totalFrames = frameUrls?.length || 0;
  const rawFrame = useTransform(
    scrollYProgress,
    [0, 1],
    [0, Math.max(0, totalFrames - 1)]
  );
  const smoothFrame = useSpring(rawFrame, {
    stiffness: 60,
    damping: 15,
    mass: 0.5,
  });

  // Canvas rendering
  useEffect(() => {
    let raf;
    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      const idx = Math.floor(smoothFrame.get());
      const img = imagesRef.current[idx];

      if (img && img.complete) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const scale = Math.max(
          canvas.width / img.width,
          canvas.height / img.height
        );
        const x = canvas.width / 2 - (img.width / 2) * scale;
        const y = canvas.height / 2 - (img.height / 2) * scale;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      }

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [smoothFrame]);

  // ── Parallax transforms ────────────────────────────────────────────────
  // Title reveal
  const titleOpacity = useTransform(scrollYProgress, [0.12, 0.35], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.12, 0.35], [60, 0]);
  const titleBlurRaw = useTransform(scrollYProgress, [0.12, 0.35], [18, 0]);
  const titleBlur = useMotionTemplate`blur(${titleBlurRaw}px)`;

  // Title exit
  const titleExitOpacity = useTransform(scrollYProgress, [0.55, 0.72], [1, 0]);
  const titleExitY = useTransform(scrollYProgress, [0.55, 0.72], [0, -50]);

  // Subtitle reveal (slightly later than title)
  const subtitleOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  const subtitleY = useTransform(scrollYProgress, [0.2, 0.4], [30, 0]);

  // Canvas cinematic exit
  const exitScale = useTransform(scrollYProgress, [0.6, 1], [1, 1.08]);
  const exitOpacity = useTransform(scrollYProgress, [0.62, 0.92], [1, 0]);
  const exitBlurRaw = useTransform(scrollYProgress, [0.6, 0.95], [0, 16]);
  const exitBlur = useMotionTemplate`blur(${exitBlurRaw}px)`;

  // Black overlay dissolve
  const blackOverlay = useTransform(scrollYProgress, [0.72, 1], [0, 1]);

  // Parallax depth layers
  const dustY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const orbY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  // Scan line position
  const scanLineY = useTransform(scrollYProgress, [0, 1], ["-10%", "110%"]);

  return (
    <section
      ref={containerRef}
      className="relative h-[300vh] bg-[#050505]"
      onMouseMove={handleMouseMove}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* ── Particle field layer (behind canvas) ────────────────────── */}
        <motion.div style={{ y: dustY }} className="absolute inset-0 z-[1]">
          <ParticleField
            count={50}
            color="rgba(56, 189, 248, 0.3)"
            speed={0.15}
            maxSize={1.8}
          />
        </motion.div>

        {/* ── Animated glow orbs ──────────────────────────────────────── */}
        <motion.div style={{ y: orbY }} className="absolute inset-0 z-[2] pointer-events-none">
          <GlowOrb color="rgba(0, 240, 255, 0.08)" size={600} x="25%" y="35%" blur={120} duration={7} />
          <GlowOrb color="rgba(99, 102, 241, 0.06)" size={500} x="75%" y="65%" blur={100} duration={9} />
          <GlowOrb color="rgba(56, 189, 248, 0.04)" size={400} x="50%" y="20%" blur={80} duration={11} />
        </motion.div>

        {/* ── Cursor-following ambient light ──────────────────────────── */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full pointer-events-none z-[3]"
          style={{
            left: useTransform(smoothCursorX, (v) => `${v * 100}%`),
            top: useTransform(smoothCursorY, (v) => `${v * 100}%`),
            translateX: "-50%",
            translateY: "-50%",
            background:
              "radial-gradient(circle, rgba(0,240,255,0.06) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* ── Canvas (main visual) ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(30px)", scale: 1.1 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          transition={{ duration: 2.5, ease: premiumEasing }}
          style={{
            opacity: exitOpacity,
            scale: exitScale,
            filter: exitBlur,
          }}
          className="absolute inset-0 z-[5] flex items-center justify-center"
        >
          <canvas
            ref={canvasRef}
            width={1920}
            height={1080}
            className="w-full h-full object-cover object-center"
          />
        </motion.div>

        {/* ── Scan line effect ────────────────────────────────────────── */}
        <motion.div
          style={{ top: scanLineY }}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent z-[6] pointer-events-none"
        />

        {/* ── Noise / grain overlay ──────────────────────────────────── */}
        <div
          className="absolute inset-0 z-[7] pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
            backgroundSize: "128px 128px",
          }}
        />

        {/* ── Vignette overlay ───────────────────────────────────────── */}
        <div
          className="absolute inset-0 z-[8] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
          }}
        />

        {/* ── Black overlay (exit transition) ────────────────────────── */}

        {/* ── Title & Subtitle ───────────────────────────────────────── */}
        <motion.div
          style={{
            opacity: titleOpacity,
            y: titleY,
            filter: titleBlur,
          }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center pointer-events-none px-6 md:px-12 lg:px-24"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: premiumEasing }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-white/[0.06] bg-white/[0.02] backdrop-blur-md text-white/50 text-xs font-medium tracking-[0.2em] uppercase mb-10"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            </span>
            Your Assistant - Kevo -
          </motion.div>

          {/* Main heading */}
          <motion.h1
            style={{
              opacity: titleExitOpacity,
              y: titleExitY,
            }}
            className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-heading font-medium tracking-tighter text-white leading-[1.05]"
          >
            Intelligence,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400 drop-shadow-[0_0_30px_rgba(0,240,255,0.15)]">
              Materialized.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            style={{ opacity: subtitleOpacity, y: subtitleY }}
            className="mt-6 text-lg md:text-xl text-white/30 max-w-2xl font-light leading-relaxed"
          >
            AI-powered career intelligence that understands who you are
            <br className="hidden md:block" /> and builds your future path.
          </motion.p>

          {/* Scroll hint */}
          <motion.div
            style={{
              opacity: useTransform(scrollYProgress, [0, 0.05, 0.15], [1, 1, 0]),
            }}
            className="absolute bottom-12 flex flex-col items-center gap-2"
          >
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/20">
              Scroll to explore
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center pt-1.5"
            >
              <div className="w-1 h-2 rounded-full bg-white/30" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
