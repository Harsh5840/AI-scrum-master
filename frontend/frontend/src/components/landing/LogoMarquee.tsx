'use client';

import { motion } from 'framer-motion';

const LOGOS = [
    { name: 'Vercel', letter: 'V' },
    { name: 'Stripe', letter: 'S' },
    { name: 'Linear', letter: 'L' },
    { name: 'Notion', letter: 'N' },
    { name: 'Figma', letter: 'F' },
    { name: 'GitHub', letter: 'G' },
    { name: 'Slack', letter: 'SL' },
    { name: 'Discord', letter: 'D' },
    { name: 'Atlassian', letter: 'A' },
    { name: 'Zoom', letter: 'Z' },
];

export function LogoMarquee() {
    // Double the logos for seamless loop
    const allLogos = [...LOGOS, ...LOGOS];

    return (
        <section className="py-12 border-y border-white/5 bg-[#09090B] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-8">
                <p className="text-center text-sm text-white/40 uppercase tracking-widest">
                    Trusted by engineering teams at
                </p>
            </div>

            {/* Marquee container */}
            <div className="relative">
                {/* Gradient masks */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#09090B] to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#09090B] to-transparent z-10" />

                {/* Scrolling logos */}
                <motion.div
                    animate={{ x: ['0%', '-50%'] }}
                    transition={{
                        x: {
                            duration: 30,
                            repeat: Infinity,
                            ease: 'linear',
                        },
                    }}
                    className="flex items-center gap-16 w-fit"
                >
                    {allLogos.map((logo, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 group cursor-pointer"
                        >
                            {/* Logo placeholder */}
                            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 font-bold text-sm group-hover:bg-white/10 group-hover:text-white/60 transition-all">
                                {logo.letter}
                            </div>
                            <span className="text-white/30 font-medium text-lg group-hover:text-white/50 transition-colors whitespace-nowrap">
                                {logo.name}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
