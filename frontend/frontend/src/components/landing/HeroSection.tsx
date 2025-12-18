'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

// Animated beam component for Vercel-style rays
function AnimatedBeam({ delay = 0, duration = 3 }: { delay?: number; duration?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{
                opacity: [0, 1, 1, 0],
                y: [-100, 0, 100, 200]
            }}
            transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: "linear"
            }}
            className="absolute w-[2px] h-32 bg-gradient-to-b from-transparent via-purple-500/50 to-transparent"
        />
    );
}

// Floating dashboard mockup
function DashboardMockup() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 60, rotateX: 45 }}
            animate={{ opacity: 1, y: 0, rotateX: 8 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative mt-12 mx-auto max-w-5xl px-4 perspective-1000"
            style={{ transformStyle: 'preserve-3d' }}
        >
            {/* Glow effect behind dashboard */}
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 via-cyan-500/20 to-purple-600/20 blur-3xl opacity-60" />

            {/* Dashboard container */}
            <div className="relative rounded-xl border border-white/10 bg-[#0a0a0a] shadow-2xl overflow-hidden">
                {/* Window controls */}
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="flex-1 flex justify-center">
                        <div className="px-4 py-1 rounded-md bg-white/5 text-xs text-white/40">
                            app.scrummaster.ai/dashboard
                        </div>
                    </div>
                    <div className="text-xs text-white/20">⌘K</div>
                </div>

                {/* Mock dashboard content */}
                <div className="p-4 lg:p-6">
                    {/* Top bar */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">AI</div>
                            <div>
                                <div className="text-sm font-medium text-white">Sprint 24</div>
                                <div className="text-xs text-white/40">8 days remaining</div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                On Track
                            </div>
                            <div className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-xs text-purple-400">+ Standup</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-4">
                        {/* Left column - Main metrics */}
                        <div className="col-span-8 space-y-4">
                            {/* Sprint Health & Velocity */}
                            <div className="grid grid-cols-2 gap-3">
                                {/* Sprint Progress */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.0 }}
                                    className="p-4 rounded-lg bg-white/[0.03] border border-white/5"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs text-white/40">Sprint Progress</span>
                                        <span className="text-xs text-emerald-400">+12% vs last</span>
                                    </div>
                                    <div className="flex items-end gap-3">
                                        <span className="text-3xl font-bold text-white">68%</span>
                                        <span className="text-sm text-white/40 mb-1">24/35 pts</span>
                                    </div>
                                    <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '68%' }}
                                            transition={{ delay: 1.5, duration: 0.8 }}
                                            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
                                        />
                                    </div>
                                </motion.div>

                                {/* Team Velocity */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.1 }}
                                    className="p-4 rounded-lg bg-white/[0.03] border border-white/5"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs text-white/40">Velocity Trend</span>
                                        <span className="text-xs text-cyan-400">Last 5 sprints</span>
                                    </div>
                                    <div className="flex items-end gap-1 h-10">
                                        {[28, 32, 30, 38, 42].map((v, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${(v / 45) * 100}%` }}
                                                transition={{ delay: 1.3 + i * 0.1, duration: 0.4 }}
                                                className={`flex-1 rounded-t ${i === 4 ? 'bg-gradient-to-t from-purple-500 to-cyan-500' : 'bg-white/20'}`}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-2">
                                        <span className="text-xs text-white/30">S20</span>
                                        <span className="text-xs text-white/50 font-medium">42 pts avg</span>
                                        <span className="text-xs text-white/30">S24</span>
                                    </div>
                                </motion.div>
                            </div>

                            {/* AI Blocker Alert */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.3 }}
                                className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/30"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm flex-shrink-0">⚠️</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-medium text-amber-400">AI Detected Blocker</span>
                                            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-xs text-amber-400">High Priority</span>
                                        </div>
                                        <p className="text-sm text-white/50 mb-2">Auth API dependency blocking 3 stories. Estimated 2-day delay if unresolved.</p>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1 rounded-md bg-amber-500/20 text-xs text-amber-400 hover:bg-amber-500/30 transition-colors">Escalate to Lead</button>
                                            <button className="px-3 py-1 rounded-md bg-white/5 text-xs text-white/50 hover:bg-white/10 transition-colors">View Details</button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Team Standup Summary */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.4 }}
                                className="p-4 rounded-lg bg-white/[0.03] border border-white/5"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs text-white/40">Today's Standup Summary</span>
                                    <span className="text-xs text-emerald-400">8/10 submitted</span>
                                </div>
                                <p className="text-sm text-white/60 leading-relaxed">
                                    <span className="text-purple-400">AI:</span> "Team progressing well on payment module. Alex needs design review before EOD. Sarah flagged API dependency - recommend syncing with backend team."
                                </p>
                            </motion.div>
                        </div>

                        {/* Right column - Team & Activity */}
                        <div className="col-span-4 space-y-4">
                            {/* Team Pulse */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.2 }}
                                className="p-4 rounded-lg bg-white/[0.03] border border-white/5"
                            >
                                <div className="text-xs text-white/40 mb-3">Team Pulse</div>
                                <div className="space-y-2">
                                    {[
                                        { name: 'Alex', mood: '😊', status: 'Crushing it', load: 85 },
                                        { name: 'Sarah', mood: '😐', status: 'Blocked', load: 40 },
                                        { name: 'Mike', mood: '🙂', status: 'On track', load: 70 },
                                        { name: 'Lisa', mood: '😊', status: 'Ahead', load: 90 },
                                    ].map((member, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center text-[10px] text-white/60">{member.name[0]}</div>
                                            <span className="text-xs text-white/60 flex-1">{member.name}</span>
                                            <span className="text-sm">{member.mood}</span>
                                            <div className="w-12 h-1 rounded-full bg-white/10 overflow-hidden">
                                                <div className={`h-full rounded-full ${member.load > 80 ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{ width: `${member.load}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Quick Actions */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.3 }}
                                className="p-4 rounded-lg bg-white/[0.03] border border-white/5"
                            >
                                <div className="text-xs text-white/40 mb-3">Quick Actions</div>
                                <div className="space-y-2">
                                    <button className="w-full px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-xs text-purple-400 text-left hover:bg-purple-500/20 transition-colors">
                                        📊 Generate Sprint Report
                                    </button>
                                    <button className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white/50 text-left hover:bg-white/10 transition-colors">
                                        💬 Ask AI about sprint
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Gradient overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#09090B] to-transparent pointer-events-none" />
            </div>
        </motion.div>
    );
}

export function HeroSection() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start'],
    });

    const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section
            ref={ref}
            className="relative min-h-[90vh] flex flex-col items-center justify-start overflow-hidden pt-24 pb-8"
        >
            {/* Background */}
            <div className="absolute inset-0 z-0">
                {/* Base dark */}
                <div className="absolute inset-0 bg-[#09090B]" />

                {/* Full-width aurora gradient at top */}
                <div
                    className="absolute inset-x-0 top-0 h-[600px]"
                    style={{
                        background: `
                            linear-gradient(180deg, 
                                rgba(168, 85, 247, 0.15) 0%, 
                                rgba(139, 92, 246, 0.08) 25%, 
                                transparent 60%
                            )
                        `,
                    }}
                />

                {/* Left side glow */}
                <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-purple-600/20 blur-[150px] rounded-full" />

                {/* Right side glow */}
                <div className="absolute top-1/3 -right-32 w-[400px] h-[400px] bg-cyan-500/15 blur-[150px] rounded-full" />

                {/* Center accent glow */}
                <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-violet-500/10 blur-[100px] rounded-full" />

                {/* Bottom left accent */}
                <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-pink-500/10 blur-[120px] rounded-full" />

                {/* Bottom right accent */}
                <div className="absolute bottom-1/3 right-1/4 w-[250px] h-[250px] bg-indigo-500/10 blur-[100px] rounded-full" />

                {/* Grid pattern - full width */}
                <div
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                        `,
                        backgroundSize: '80px 80px',
                    }}
                />

                {/* Horizontal gradient lines */}
                <div className="absolute top-[15%] inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
                <div className="absolute top-[45%] inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent" />

                {/* Animated beams across full width */}
                <div className="absolute top-0 left-[10%] opacity-40">
                    <AnimatedBeam delay={0} duration={4} />
                </div>
                <div className="absolute top-0 left-[25%] opacity-25">
                    <AnimatedBeam delay={1.5} duration={5} />
                </div>
                <div className="absolute top-0 left-[50%] opacity-30">
                    <AnimatedBeam delay={0.8} duration={4.5} />
                </div>
                <div className="absolute top-0 right-[25%] opacity-25">
                    <AnimatedBeam delay={2} duration={5.5} />
                </div>
                <div className="absolute top-0 right-[10%] opacity-40">
                    <AnimatedBeam delay={0.3} duration={3.5} />
                </div>
            </div>

            {/* Content */}
            <motion.div
                style={{ y, opacity }}
                className="relative z-10 max-w-5xl mx-auto px-6 text-center"
            >
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-2 mb-8"
                >
                    <span className="group px-4 py-2 rounded-full bg-white/[0.05] backdrop-blur-sm border border-white/[0.08] text-sm text-white/60 hover:border-white/20 hover:bg-white/[0.08] transition-all cursor-default">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                        Introducing AI Sprint Predictions
                        <ArrowRightIcon className="inline-block w-3 h-3 ml-2 text-white/40 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                </motion.div>

                {/* Main Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-6 leading-[1.1]"
                >
                    <span className="text-white">
                        Ship faster with
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                        AI-powered sprints
                    </span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg sm:text-xl text-white/40 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    Automate standups, predict blockers, and accelerate your team's velocity.
                    The intelligent scrum master for modern engineering teams.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link
                        href="/auth/register"
                        className="group relative px-6 py-3 rounded-lg bg-white text-black font-medium text-sm overflow-hidden transition-all hover:bg-white/90"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Start Building
                            <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </span>
                    </Link>

                    <Link
                        href="/dashboard"
                        className="px-6 py-3 rounded-lg border border-white/10 text-white/70 font-medium text-sm hover:bg-white/[0.05] hover:border-white/20 hover:text-white transition-all"
                    >
                        View Demo
                    </Link>
                </motion.div>
            </motion.div>

            {/* Dashboard Mockup */}
            <DashboardMockup />

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#09090B] to-transparent pointer-events-none z-20" />
        </section>
    );
}
