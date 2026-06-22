import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { Navbar } from "./components/Navbar";

// Pages
import HomePage from "./pages/HomePage";
import JourneyLandingPage from "./pages/JourneyLandingPage";
import ResultsPage from "./pages/ResultsPage";

// Other components for standalone routes
import { HowItWorks } from "./components/HowItWorks";
import { WhyOmnis } from "./components/WhyOmnis";

// ScrollToTop component
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const location = useLocation();

  return (
    <div className="bg-[#050505] min-h-screen text-omnis-silver font-sans selection:bg-cyan-500/30 selection:text-cyan-50">
      <ScrollToTop />
      <Navbar />
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/journey" element={<JourneyLandingPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/how-it-works" element={<div className="pt-24"><HowItWorks /></div>} />
          <Route path="/ai-features" element={<div className="pt-24"><WhyOmnis /></div>} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
