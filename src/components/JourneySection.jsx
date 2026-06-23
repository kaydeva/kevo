// ── JourneySection ────────────────────────────────────────────────────────
// Interactive video section with mouse-scrub, cursor glow, and navigation.
import { useRef, useEffect, useCallback, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll, useMotionTemplate } from 'framer-motion';
import { useNavigate } from "react-router-dom";

const premiumEasing = [0.16, 1, 0.3, 1];
const SCRUB_SENSITIVITY = 2.5;
const MOBILE_BREAKPOINT = 1024;

export const JourneySection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const prevMouseX = useRef(null);
  const isSeeking = useRef(false);
  const pendingTime = useRef(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= MOBILE_BREAKPOINT : true
  );

  // ── Scroll-linked entry transition ──────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.95', 'start 0.0'],
  });

  const sectionOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const sectionScale = useTransform(scrollYProgress, [0, 0.4], [1.04, 1]);
  const sectionBlurRaw = useTransform(scrollYProgress, [0, 0.3], [18, 0]);
  const sectionBlur = useMotionTemplate`blur(${sectionBlurRaw}px)`;

  // Black curtain that lifts as video section enters
  const curtainOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  // Text / button reveal
  const textOpacity = useTransform(scrollYProgress, [0.4, 1], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.4, 1], [30, 0]);

  // ── Mouse-scrub mechanic ─────────────────────────────────────────────────
  const applyNextFrame = useCallback(() => {
    const video = videoRef.current;
    if (!video || pendingTime.current === null) return;
    video.currentTime = pendingTime.current;
    pendingTime.current = null;
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onSeeked = () => {
      isSeeking.current = false;
      if (pendingTime.current !== null) {
        isSeeking.current = true;
        applyNextFrame();
      }
    };

    video.addEventListener('seeked', onSeeked);
    return () => video.removeEventListener('seeked', onSeeked);
  }, [applyNextFrame]);

  // ── Intersection Observer for Lazy Loading ──────────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Start preloading 200px before section enters viewport
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= MOBILE_BREAKPOINT;
      setIsDesktop(desktop);
      const video = videoRef.current;
      if (!video || !shouldLoadVideo) return;
      if (!desktop) {
        video.loop = true;
        video.play().catch(() => {});
      } else {
        video.pause();
        video.loop = false;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [shouldLoadVideo]);

  useEffect(() => {
    let frameId = null;
    let targetTime = null;

    const handleMouseMove = (e) => {
      if (!isDesktop || !shouldLoadVideo) return;
      const video = videoRef.current;
      if (!video || !video.duration) return;

      const currentX = e.clientX;
      if (prevMouseX.current === null) {
        prevMouseX.current = currentX;
        return;
      }

      const delta = currentX - prevMouseX.current;
      prevMouseX.current = currentX;

      const scrubOffset = (delta / window.innerWidth) * SCRUB_SENSITIVITY * video.duration;
      
      if (targetTime === null) {
        targetTime = video.currentTime;
      }
      targetTime = Math.min(
        Math.max(targetTime + scrubOffset, 0),
        video.duration
      );

      if (!frameId) {
        frameId = requestAnimationFrame(() => {
          frameId = null;
          if (video && targetTime !== null) {
            if (isSeeking.current) {
              pendingTime.current = targetTime;
            } else {
              isSeeking.current = true;
              pendingTime.current = targetTime;
              applyNextFrame();
            }
          }
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (frameId) cancelAnimationFrame(frameId);
      prevMouseX.current = null;
    };
  }, [isDesktop, shouldLoadVideo, applyNextFrame]);

  // ── Cursor glow ──────────────────────────────────────────────────────────
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 500);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 400);
  const smoothMouseX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  const handleSectionMouseMove = useCallback((e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }, [mouseX, mouseY]);

  return (
    <motion.section
      ref={sectionRef}
      onMouseMove={handleSectionMouseMove}
      style={{ opacity: sectionOpacity, scale: sectionScale, filter: sectionBlur }}
      className="relative min-h-screen overflow-hidden flex items-center justify-center"
    >
      {/* ── Video background ─────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          src={shouldLoadVideo ? "/roboty.mp4" : undefined}
          poster="/thinking-bot.png"
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          style={{ pointerEvents: 'none' }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.75) 100%)',
          }}
        />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* ── Black curtain ── */}
      <motion.div
        style={{ opacity: curtainOpacity }}
        className="absolute inset-0 bg-black pointer-events-none z-30"
      />

      {/* ── Cursor glow ──────────────────────────────────────────────────── */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none z-10"
        style={{
          x: smoothMouseX,
          y: smoothMouseY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(0,240,255,0.09) 0%, rgba(14,165,233,0.04) 40%, transparent 70%)',
          filter: 'blur(25px)',
        }}
      />

      {/* ── Scrub hint (desktop) ─────────────────────────────────────── */}
      {isDesktop && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute top-8 right-8 z-30 text-white/25 text-xs tracking-widest uppercase font-light select-none"
        >
          Move cursor to explore ←→
        </motion.p>
      )}

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="relative z-20 flex flex-col items-center text-center gap-8 px-6"
      >
        {/* Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-black/30 backdrop-blur-md text-cyan-400/80 text-xs font-medium tracking-widest uppercase">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          </span>
          Neural Interface Active
        </div>

        {/* Headline */}
        <h2 className="text-5xl md:text-7xl font-heading font-medium tracking-tighter text-white leading-[1.08] drop-shadow-[0_2px_40px_rgba(0,0,0,0.8)]">
          Ready to begin<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-400">
            your journey?
          </span>
        </h2>

        <p className="text-lg text-white/50 max-w-md font-light leading-relaxed">
          Step into the next generation of AI-powered career intelligence. Your personalised path awaits.
        </p>

        {/* Buttons — FIXED: no more opacity:0, uses proper Framer Motion transitions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          {/* Start Journey */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(0,240,255,0.5)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3, ease: premiumEasing }}
            onClick={() => navigate('/journey')}
            className="px-9 py-4 rounded-full font-semibold text-black bg-gradient-to-r from-cyan-300 to-sky-400 shadow-[0_0_40px_rgba(0,240,255,0.3)] transition-shadow duration-500 flex items-center gap-3 text-base"
          >
            <span>Start my journey</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </motion.button>

          {/* How it works */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3, ease: premiumEasing }}
            onClick={() => navigate('/how-it-works')}
            className="px-9 py-4 rounded-full font-medium text-white/90 border border-white/15 bg-white/[0.06] backdrop-blur-md hover:bg-white/[0.10] hover:border-cyan-500/40 hover:text-white transition-all duration-500 flex items-center gap-3 text-base"
          >
            <svg className="w-4 h-4 text-cyan-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            See how it works
          </motion.button>

          {/* AI Features */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3, ease: premiumEasing }}
            onClick={() => navigate('/ai-features')}
            className="px-9 py-4 rounded-full font-medium text-white/90 border border-cyan-400/20 bg-cyan-400/10 backdrop-blur-md hover:bg-cyan-400/20 hover:border-cyan-400/40 hover:text-white transition-all duration-500 flex items-center gap-3 text-base"
          >
            <svg className="w-4 h-4 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            AI Features
          </motion.button>
        </div>
      </motion.div>
    </motion.section>
  );
};
