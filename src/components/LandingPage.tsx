import React, { lazy, Suspense } from "react";
import { Header } from "./Header";
import { Hero } from "./Hero";

// Lazy load heavy components for better initial load performance
const HowItWorks = lazy(() => import("./HowItWorks").then(m => ({ default: m.HowItWorks })));
const ServicesGrid = lazy(() => import("./ServicesGrid").then(m => ({ default: m.ServicesGrid })));
const ProfessionalCTA = lazy(() => import("./ProfessionalCTA").then(m => ({ default: m.ProfessionalCTA })));
const Footer = lazy(() => import("./Footer").then(m => ({ default: m.Footer })));
const TrustIndicators = lazy(() => import("./TrustIndicators").then(m => ({ default: m.TrustIndicators })));
const Testimonials = lazy(() => import("./Testimonials").then(m => ({ default: m.Testimonials })));
const FeaturedProfessionals = lazy(() => import("./FeaturedProfessionals").then(m => ({ default: m.FeaturedProfessionals })));
const LiveBookingFeed = lazy(() => import("./LiveBookingFeed").then(m => ({ default: m.LiveBookingFeed })));
const PricingPreview = lazy(() => import("./PricingPreview").then(m => ({ default: m.PricingPreview })));
const InteractiveCalculator = lazy(() => import("./InteractiveCalculator").then(m => ({ default: m.InteractiveCalculator })));
const CoverageMap = lazy(() => import("./CoverageMap").then(m => ({ default: m.CoverageMap })));
const SafetyCertifications = lazy(() => import("./SafetyCertifications").then(m => ({ default: m.SafetyCertifications })));
const FAQ = lazy(() => import("./FAQ").then(m => ({ default: m.FAQ })));
const WhyChooseFireGuide = lazy(() => import("./WhyChooseFireGuide").then(m => ({ default: m.WhyChooseFireGuide })));
const ServiceTimeline = lazy(() => import("./ServiceTimeline").then(m => ({ default: m.ServiceTimeline })));
const CoreBenefits = lazy(() => import("./CoreBenefits").then(m => ({ default: m.CoreBenefits })));

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
      <Suspense fallback={null}>
        <TrustIndicators />
      </Suspense>
      <Suspense fallback={null}>
        <ProfessionalCTA onJoinNow={onProfessionalLogin} />
      </Suspense>
      <Suspense fallback={null}>
        <CoreBenefits />
      </Suspense>
      <Suspense fallback={null}>
        <HowItWorks />
      </Suspense>
      <Suspense fallback={null}>
        <ServicesGrid onSelectService={onGetStarted} />
      </Suspense>
      <Suspense fallback={null}>
        <FeaturedProfessionals onViewProfile={onGetStarted} />
      </Suspense>
      <Suspense fallback={null}>
        <LiveBookingFeed />
      </Suspense>
      <Suspense fallback={null}>
        <ServiceTimeline />
      </Suspense>
      <Suspense fallback={null}>
        <InteractiveCalculator onGetQuote={onGetStarted} />
      </Suspense>
      <Suspense fallback={null}>
        <PricingPreview onGetQuote={onGetStarted} />
      </Suspense>
      <Suspense fallback={null}>
        <WhyChooseFireGuide />
      </Suspense>
      <Suspense fallback={null}>
        <CoverageMap onCheckAvailability={onGetStarted} />
      </Suspense>
      <Suspense fallback={null}>
        <SafetyCertifications />
      </Suspense>
      <Suspense fallback={null}>
        <Testimonials />
      </Suspense>
      <Suspense fallback={null}>
        <FAQ onContactSupport={onGetStarted} />
      </Suspense>
      <Suspense fallback={null}>
        <Footer onAdminLogin={onAdminLogin} />
      </Suspense>
    </div>
  );
}