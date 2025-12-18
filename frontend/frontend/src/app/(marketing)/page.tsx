'use client';

import { HeroSection } from '@/components/landing/HeroSection';
import { LogoMarquee } from '@/components/landing/LogoMarquee';
import { BentoFeatures } from '@/components/landing/BentoFeatures';
import { VideoDemo } from '@/components/landing/VideoDemo';
import { TestimonialCarousel } from '@/components/landing/TestimonialCarousel';
import { PricingCalculator } from '@/components/landing/PricingCalculator';
import { FooterCTA } from '@/components/landing/FooterCTA';
import { CommandPalette } from '@/components/landing/CommandPalette';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#09090B] text-white overflow-x-hidden">
            {/* Command Palette (⌘K) - No visible nav */}
            <CommandPalette />

            {/* S2: Shader Hero */}
            <HeroSection />

            {/* S3: Infinite Logo Scroll */}
            <LogoMarquee />

            {/* S4: Bento Features */}
            <BentoFeatures />

            {/* S5: Video Demo */}
            <VideoDemo />

            {/* S6: Testimonials Carousel */}
            <TestimonialCarousel />

            {/* S7: Pricing Calculator */}
            <PricingCalculator />

            {/* S8: Footer CTA */}
            <FooterCTA />
        </div>
    );
}
