'use client';

import { HeroSection } from '@/components/landing/HeroSection';
import { LogoMarquee } from '@/components/landing/LogoMarquee';
import { BentoFeatures } from '@/components/landing/BentoFeatures';
import { ProductWorkflow } from '@/components/landing/ProductWorkflow';
import { VideoDemo } from '@/components/landing/VideoDemo';
import { TestimonialCarousel } from '@/components/landing/TestimonialCarousel';
import { PricingCalculator } from '@/components/landing/PricingCalculator';
import { FooterCTA } from '@/components/landing/FooterCTA';
import { CommandPalette } from '@/components/landing/CommandPalette';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#09090B] text-white overflow-x-hidden">
      {/* Command Palette (⌘K) */}
      <CommandPalette />

      {/* Hero with Dashboard Mockup */}
      <HeroSection />

      {/* Social Proof - Logos */}
      <LogoMarquee />

      {/* Features - Bento Grid */}
      <BentoFeatures />

      {/* How It Works */}
      <ProductWorkflow />

      {/* Video Demo */}
      <VideoDemo />

      {/* Testimonials - 3 Row Marquee */}
      <TestimonialCarousel />

      {/* Pricing */}
      <PricingCalculator />

      {/* Footer CTA */}
      <FooterCTA />
    </div>
  );
}
