import { Header } from "./Header";
import { Hero } from "./Hero";
import { HowItWorks } from "./HowItWorks";
import { ServicesGrid } from "./ServicesGrid";
import { ProfessionalCTA } from "./ProfessionalCTA";
import { Footer } from "./Footer";
import { TrustIndicators } from "./TrustIndicators";
import { Testimonials } from "./Testimonials";
import { FeaturedProfessionals } from "./FeaturedProfessionals";
import { LiveBookingFeed } from "./LiveBookingFeed";
import { PricingPreview } from "./PricingPreview";
import { InteractiveCalculator } from "./InteractiveCalculator";
import { CoverageMap } from "./CoverageMap";
import { SafetyCertifications } from "./SafetyCertifications";
import { FAQ } from "./FAQ";
import { WhyChooseFireGuide } from "./WhyChooseFireGuide";
import { ServiceTimeline } from "./ServiceTimeline";
import { RecentActivityTicker } from "./RecentActivityTicker";
import { CoreBenefits } from "./CoreBenefits";

export interface User {
  name: string;
  role: "customer" | "professional" | "admin";
}

interface LandingPageProps {
  onGetStarted: () => void;
  onProfessionalLogin: () => void;
  onAdminLogin: () => void;
  onCustomerLogin: () => void;
  currentUser?: User | null;
  onLogout?: () => void;
  onAboutContact?: () => void;
  onNavigateToDashboard?: () => void;
}

export function LandingPage({ onGetStarted, onProfessionalLogin, onAdminLogin, onCustomerLogin, currentUser, onLogout, onAboutContact, onNavigateToDashboard }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header 
        onGetStarted={onGetStarted} 
        onProfessionalLogin={onProfessionalLogin} 
        onCustomerLogin={onCustomerLogin}
        currentUser={currentUser}
        onLogout={onLogout}
        onAboutContact={onAboutContact}
        onNavigateHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onNavigateServices={onGetStarted}
        onNavigateAbout={() => {
          if (onAboutContact) {
            onAboutContact();
          }
        }}
        onNavigateContact={() => {
          if (onAboutContact) {
            onAboutContact();
            // Scroll to contact section after navigation
            setTimeout(() => {
              const contactSection = document.getElementById('contact');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
              }
            }, 100);
          }
        }}
        onNavigateToDashboard={onNavigateToDashboard}
      />
      <Hero onGetStarted={onGetStarted} />
      {/* <RecentActivityTicker /> */}
      <TrustIndicators />
      <ProfessionalCTA onJoinNow={onProfessionalLogin} />
      <CoreBenefits />
      <HowItWorks />
      <ServicesGrid onSelectService={onGetStarted} />
      <FeaturedProfessionals onViewProfile={onGetStarted} />
      <LiveBookingFeed />
      <ServiceTimeline />
      <InteractiveCalculator onGetQuote={onGetStarted} />
      <PricingPreview onGetQuote={onGetStarted} />
      <WhyChooseFireGuide />
      <CoverageMap onCheckAvailability={onGetStarted} />
      <SafetyCertifications />
      <Testimonials />
      <FAQ onContactSupport={onGetStarted} />
      <Footer onAdminLogin={onAdminLogin} />
    </div>
  );
}