'use client';

import React from 'react';
import { Navbar } from './navbar';
import { Hero } from './hero';
import { Features } from './features';
import { HowItWorks } from './how-it-works';
import { CTA } from './cta';
import { Footer } from './footer';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0c0b] overflow-hidden">
      <Navbar onGetStarted={onGetStarted} />
      <Hero onGetStarted={onGetStarted} />
      <Features />
      <HowItWorks />
      <CTA onGetStarted={onGetStarted} />
      <Footer />
    </div>
  );
}

// Re-export all components for direct imports if needed
export { Navbar } from './navbar';
export { Hero } from './hero';
export { Features } from './features';
export { HowItWorks } from './how-it-works';
export { CTA } from './cta';
export { Footer } from './footer';
export { DashboardPreview } from './dashboard-preview';
