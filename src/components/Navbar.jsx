// ── Navbar ────────────────────────────────────────────────────────────────
// Floating glassmorphism nav bar — appears after scrolling past the hero.
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const links = [
  { label: "Home", path: "/" },
  { label: "How It Works", path: "/how-it-works" },
  { label: "AI Features", path: "/ai-features" },
];

export const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Always show on sub-pages
  const show = visible || location.pathname !== "/";

  return (
    <AnimatePresence>
      {show && (
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-5xl"
        >
          <div className="flex items-center justify-between px-6 py-3 rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            {/* Logo */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.3)] group-hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-shadow">
                <span className="text-black font-heading font-bold text-sm">
                  K
                </span>
              </div>
              <span className="font-heading font-semibold text-white text-lg tracking-tight">
                Kevo
              </span>
            </button>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${location.pathname === link.path
                      ? "text-cyan-400 bg-cyan-400/10"
                      : "text-white/60 hover:text-white hover:bg-white/[0.06]"
                    }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/journey")}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-black bg-gradient-to-r from-cyan-300 to-sky-400 hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-shadow duration-500"
              >
                Start Journey
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden text-white/70 hover:text-white p-1"
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

          {/* Mobile dropdown */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden mt-2 overflow-hidden rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/[0.06]"
              >
                <div className="p-4 space-y-1">
                  {links.map((link) => (
                    <button
                      key={link.path}
                      onClick={() => {
                        navigate(link.path);
                        setMenuOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${location.pathname === link.path
                          ? "text-cyan-400 bg-cyan-400/10"
                          : "text-white/60 hover:text-white hover:bg-white/[0.06]"
                        }`}
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};
