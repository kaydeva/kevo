import { HeroSection } from '../components/HeroSection';
import { JourneySection } from '../components/JourneySection';
import { HowItWorks } from '../components/HowItWorks';
import { WhyOmnis } from '../components/WhyOmnis';
import { EnterpriseCTA } from '../components/EnterpriseCTA';
import { PageTransition } from '../components/PageTransition';

// Generate frame URLs for the Hero canvas animation
const frameUrls = Array.from(
  { length: 265 },
  (_, i) => `/frames/ezgif-frame-${String(i + 1).padStart(3, "0")}.png`
);

export const HomePage = () => {
  return (
    <PageTransition>
      <HeroSection frameUrls={frameUrls} />
      <JourneySection />
      <HowItWorks />
      <WhyOmnis />
      <EnterpriseCTA />
    </PageTransition>
  );
};

export default HomePage;
