'use client';

import { motion } from 'framer-motion';
import { PlayIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

export function VideoDemo() {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <section id="demo" className="py-20 px-6 bg-gradient-to-b from-[#09090B] via-[#0d0d14] to-[#09090B]">
            <div className="max-w-5xl mx-auto">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        See it in action
                    </h2>
                    <p className="text-white/50 text-lg">
                        2 minutes to understand how AI Scrum Master transforms your workflow
                    </p>
                </motion.div>

                {/* Video container with device frame */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                >
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-purple-500/20 blur-3xl -z-10 scale-95" />

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
                                <div className="max-w-md mx-auto px-4 py-1.5 rounded-lg bg-white/5 text-white/40 text-sm text-center">
                                    app.scrummaster.ai/dashboard
                                </div>
                            </div>
                        </div>

                        {/* Video area */}
                        <div className="relative aspect-video bg-gradient-to-br from-[#0f0f1a] to-[#0a0a0f]">
                            {!isPlaying ? (
                                <>
                                    {/* Placeholder with dashboard mockup */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {/* Fake dashboard UI */}
                                        <div className="w-full h-full p-6 opacity-50">
                                            <div className="grid grid-cols-4 gap-4 h-full">
                                                {/* Sidebar */}
                                                <div className="rounded-lg bg-white/5 p-4">
                                                    <div className="space-y-3">
                                                        {[...Array(6)].map((_, i) => (
                                                            <div key={i} className="h-8 rounded bg-white/10" />
                                                        ))}
                                                    </div>
                                                </div>
                                                {/* Main content */}
                                                <div className="col-span-3 space-y-4">
                                                    <div className="h-12 rounded bg-white/10" />
                                                    <div className="grid grid-cols-3 gap-4">
                                                        {[...Array(3)].map((_, i) => (
                                                            <div key={i} className="h-24 rounded bg-white/10" />
                                                        ))}
                                                    </div>
                                                    <div className="h-48 rounded bg-white/10" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Play button overlay */}
                                    <motion.button
                                        onClick={() => setIsPlaying(true)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="absolute inset-0 flex items-center justify-center group"
                                    >
                                        <div className="relative">
                                            {/* Pulse animation */}
                                            <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                                            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-xl group-hover:shadow-purple-500/40 transition-shadow">
                                                <PlayIcon className="w-8 h-8 text-white ml-1" />
                                            </div>
                                        </div>
                                    </motion.button>
                                </>
                            ) : (
                                /* Video embed placeholder */
                                <div className="w-full h-full flex items-center justify-center bg-black">
                                    <p className="text-white/50">
                                        Video player would load here
                                    </p>
                                    {/* In production, you'd embed a video player here:
                  <iframe 
                    src="https://www.youtube.com/embed/VIDEO_ID?autoplay=1" 
                    className="w-full h-full" 
                    allowFullScreen 
                  /> 
                  */}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Floating badges */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="absolute -left-4 top-1/4 hidden lg:block"
                    >
                        <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
                            ✓ No credit card required
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.7 }}
                        className="absolute -right-4 top-2/3 hidden lg:block"
                    >
                        <div className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm">
                            ⚡ Setup in 2 minutes
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
