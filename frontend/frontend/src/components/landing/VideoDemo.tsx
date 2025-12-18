'use client';

import { motion } from 'framer-motion';
import { PlayIcon, CheckCircledIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

const features = [
    'AI-powered sprint predictions',
    'Automated standup summaries',
    'Real-time blocker detection',
    'Team sentiment tracking',
];

export function VideoDemo() {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <section id="demo" className="py-20 px-6 bg-gradient-to-b from-[#09090B] via-[#0d0d14] to-[#09090B]">
            <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left side - Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="order-2 lg:order-1"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                            See AI Scrum Master
                            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"> in action</span>
                        </h2>
                        <p className="text-white/50 text-lg mb-8 leading-relaxed">
                            Watch how engineering teams are shipping 40% faster with AI-powered sprint management. No more missed standups or surprise blockers.
                        </p>

                        {/* Feature checklist */}
                        <ul className="space-y-4 mb-8">
                            {features.map((feature, i) => (
                                <motion.li
                                    key={feature}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-3"
                                >
                                    <CheckCircledIcon className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                    <span className="text-white/70">{feature}</span>
                                </motion.li>
                            ))}
                        </ul>

                        {/* CTA */}
                        <div className="flex flex-wrap gap-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium hover:opacity-90 transition-opacity"
                            >
                                Start Free Trial
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-6 py-3 rounded-lg border border-white/20 text-white/70 font-medium hover:bg-white/5 hover:text-white transition-all"
                            >
                                Book a Demo
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Right side - Video/Demo */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="order-1 lg:order-2 relative"
                    >
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-purple-500/20 blur-3xl -z-10 scale-90" />

                        {/* Browser frame */}
                        <div className="relative rounded-2xl border border-white/10 bg-[#0a0a0f] overflow-hidden shadow-2xl">
                            {/* Browser header */}
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.02]">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                                </div>
                                <div className="flex-1 mx-4">
                                    <div className="max-w-xs mx-auto px-4 py-1.5 rounded-lg bg-white/5 text-white/40 text-sm text-center">
                                        app.scrummaster.ai
                                    </div>
                                </div>
                            </div>

                            {/* Dashboard preview */}
                            <div className="relative aspect-video bg-gradient-to-br from-[#0f0f1a] to-[#0a0a0f] p-6">
                                {/* Mini dashboard UI */}
                                <div className="h-full flex gap-4">
                                    {/* Sidebar */}
                                    <div className="w-1/4 space-y-3">
                                        <div className="h-8 rounded-lg bg-white/10" />
                                        <div className="h-6 rounded bg-white/5" />
                                        <div className="h-6 rounded bg-white/5" />
                                        <div className="h-6 rounded bg-purple-500/20" />
                                        <div className="h-6 rounded bg-white/5" />
                                    </div>
                                    {/* Main content */}
                                    <div className="flex-1 space-y-3">
                                        <div className="h-8 rounded-lg bg-white/10" />
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="h-16 rounded-lg bg-emerald-500/10 border border-emerald-500/20" />
                                            <div className="h-16 rounded-lg bg-amber-500/10 border border-amber-500/20" />
                                            <div className="h-16 rounded-lg bg-purple-500/10 border border-purple-500/20" />
                                        </div>
                                        <div className="h-24 rounded-lg bg-white/5" />
                                        <div className="h-16 rounded-lg bg-white/5" />
                                    </div>
                                </div>

                                {/* Play button overlay */}
                                {!isPlaying && (
                                    <motion.button
                                        onClick={() => setIsPlaying(true)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="absolute inset-0 flex items-center justify-center group bg-black/40 hover:bg-black/30 transition-colors"
                                    >
                                        <div className="relative">
                                            <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                                            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                                                <PlayIcon className="w-6 h-6 text-white ml-1" />
                                            </div>
                                        </div>
                                    </motion.button>
                                )}

                                {isPlaying && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black">
                                        <p className="text-white/50 text-sm">Demo video would play here</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Floating badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="absolute -bottom-4 -right-4 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm hidden lg:block"
                        >
                            ⚡ 2-min setup
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
