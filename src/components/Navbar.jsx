// ── Navbar ────────────────────────────────────────────────────────────────
// Highly optimized, elegant floating glassmorphism navbar.
// Responsive dynamic scroll-to-hide and top-transparency behavior.
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const links = [
  { label: "Home", path: "/" },
  { label: "How It Works", path: "/how-it-works" },
  { label: "AI Features", path: "/ai-features" },
];

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Navigation visibility state (scroll-to-hide)
  const [visible, setVisible] = useState(true);
  // Transparency state (transparent at top of home page)
  const [isTransparent, setIsTransparent] = useState(location.pathname === "/");

  const lastScrollY = useRef(0);

  useEffect(() => {
    // Reset state on location change
    setIsTransparent(location.pathname === "/");
    setMenuOpen(false);
    setVisible(true);
    lastScrollY.current = window.scrollY;
  }, [location.pathname]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 1. Transparency logic (homepage only)
      if (location.pathname === "/") {
        // Transparent at top, fade-in past hero / 200px
        setIsTransparent(currentScrollY < 200);
      } else {
        setIsTransparent(false);
      }

      // 2. Hide on scroll down, show on scroll up logic
      if (currentScrollY > 120) {
        if (currentScrollY > lastScrollY.current) {
          // Scrolling down -> hide navbar
          setVisible(false);
          setMenuOpen(false); // Close mobile menu when scrolling down
        } else {
          // Scrolling up -> show navbar
          setVisible(true);
        }
      } else {
        // Keep visible near the top
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", requestTick, { passive: true });
    return () => window.removeEventListener("scroll", requestTick);
  }, [location.pathname]);

  // Handle transparent vs glassmorphic styling class
  const navStyleClass = isTransparent
    ? "bg-transparent border-transparent shadow-none"
    : "bg-black/20 backdrop-blur-lg border border-white/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.15)]";

  return (
    <nav
      className="fixed top-4 left-1/2 z-[100] w-[95%] max-w-5xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        transform: visible 
          ? "translate(-50%, 0) scale(1)" 
          : "translate(-50%, -100px) scale(0.95)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        willChange: "transform, opacity",
      }}
    >
      <div className={`flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-300 ${navStyleClass}`}>
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.2)] group-hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all duration-300">
            <span className="text-black font-heading font-bold text-sm select-none">
              K
            </span>
          </div>
          <span className="font-heading font-semibold text-white text-lg tracking-tight transition-opacity duration-300">
            Kevo
          </span>
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                location.pathname === link.path
                  ? "text-cyan-400 bg-cyan-400/10"
                  : "text-white/60 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* CTA & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/journey")}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-black bg-gradient-to-r from-cyan-300 to-sky-400 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:brightness-105 active:scale-95 transition-all duration-300"
          >
            Start Journey
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white/70 hover:text-white p-1 focus:outline-none transition-colors duration-200"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown - GPU Optimized scale/fade transition */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{ originY: 0, willChange: "transform, opacity" }}
            className="md:hidden mt-2 overflow-hidden rounded-2xl bg-black/30 backdrop-blur-xl border border-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
          >
            <div className="p-4 space-y-1">
              {links.map((link) => (
                <button
                  key={link.path}
                  onClick={() => {
                    navigate(link.path);
                    setMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.path
                      ? "text-cyan-400 bg-cyan-400/10"
                      : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
