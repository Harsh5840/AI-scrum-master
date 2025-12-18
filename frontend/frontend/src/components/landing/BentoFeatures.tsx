'use client';

import { motion } from 'framer-motion';
import {
    LightningBoltIcon,
    RocketIcon,
    ChatBubbleIcon,
    BarChartIcon,
    TimerIcon,
    FileTextIcon,
} from '@radix-ui/react-icons';

const features = [
    {
        icon: LightningBoltIcon,
        title: 'AI Sprint Predictions',
        description: 'Know what will ship before your sprint ends. Our AI analyzes patterns to predict completion with 85% accuracy.',
        gradient: 'from-purple-500 to-pink-500',
        size: 'large',
        visual: 'prediction',
    },
    {
        icon: TimerIcon,
        title: 'Smart Blocker Detection',
        description: 'Catch blockers before they derail your sprint. AI monitors patterns and alerts you proactively.',
        gradient: 'from-amber-500 to-orange-500',
        size: 'small',
        visual: 'blocker',
    },
    {
        icon: BarChartIcon,
        title: 'Team Pulse',
        description: 'Track team sentiment and workload balance. Prevent burnout before it happens.',
        gradient: 'from-emerald-500 to-teal-500',
        size: 'small',
        visual: 'pulse',
    },
    {
        icon: ChatBubbleIcon,
        title: 'Async Standups',
        description: 'No more meetings. Team updates collected via Slack with AI-generated summaries.',
        gradient: 'from-cyan-500 to-blue-500',
        size: 'medium',
        visual: 'standup',
    },
    {
        icon: FileTextIcon,
        title: 'One-Click Reports',
        description: 'Generate stakeholder reports instantly. Sprint summaries, velocity trends, and blockers - all automated.',
        gradient: 'from-violet-500 to-purple-500',
        size: 'small',
        visual: 'report',
    },
    {
        icon: RocketIcon,
        title: 'Velocity Analytics',
        description: 'Track trends across sprints. Compare performance, forecast capacity, and optimize planning.',
        gradient: 'from-rose-500 to-pink-500',
        size: 'small',
        visual: 'velocity',
    },
    {
        icon: LightningBoltIcon,
        title: 'Seamless Integrations',
        description: 'Connect with Jira, Slack, GitHub, and 50+ tools. Setup takes 2 minutes, no code required.',
        gradient: 'from-indigo-500 to-blue-500',
        size: 'small',
        visual: 'integrations',
    },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

// Mini visualization components for each feature
function FeatureVisual({ type }: { type: string }) {
    switch (type) {
        case 'prediction':
            return (
                <div className="mt-4 p-3 rounded-lg bg-black/20">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-white/40">Sprint 24 Prediction</span>
                        <span className="text-xs text-emerald-400">85% confidence</span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-white/50 w-20">Will ship:</span>
                            <div className="flex-1 h-2 rounded-full bg-emerald-500/30">
                                <div className="h-full w-[85%] rounded-full bg-emerald-500" />
                            </div>
                            <span className="text-xs text-emerald-400">28 pts</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-white/50 w-20">At risk:</span>
                            <div className="flex-1 h-2 rounded-full bg-amber-500/30">
                                <div className="h-full w-[15%] rounded-full bg-amber-500" />
                            </div>
                            <span className="text-xs text-amber-400">5 pts</span>
                        </div>
                    </div>
                </div>
            );
        case 'blocker':
            return (
                <div className="mt-3 flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <span className="text-amber-400">⚠️</span>
                    <span className="text-xs text-amber-400/80">3 blockers detected</span>
                </div>
            );
        case 'pulse':
            return (
                <div className="mt-3 flex items-center gap-1">
                    {['😊', '🙂', '😊', '😐', '😊'].map((emoji, i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">
                            {emoji}
                        </div>
                    ))}
                    <span className="text-xs text-emerald-400 ml-2">86% positive</span>
                </div>
            );
        case 'standup':
            return (
                <div className="mt-3 p-3 rounded-lg bg-black/20">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex -space-x-2">
                            {['A', 'S', 'M', 'L'].map((l, i) => (
                                <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500/40 to-cyan-500/40 flex items-center justify-center text-[10px] text-white/70 border border-black/30">
                                    {l}
                                </div>
                            ))}
                        </div>
                        <span className="text-xs text-emerald-400">8/10 submitted</span>
                    </div>
                    <p className="text-xs text-white/40 italic">"Team on track. 2 blockers flagged..."</p>
                </div>
            );
        case 'report':
            return (
                <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full bg-purple-500/30">
                        <div className="h-full w-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 animate-pulse" />
                    </div>
                    <span className="text-xs text-purple-400">Generating...</span>
                </div>
            );
        case 'velocity':
            return (
                <div className="mt-3 flex items-end gap-1 h-8">
                    {[60, 75, 70, 85, 90, 95].map((h, i) => (
                        <div
                            key={i}
                            className={`flex-1 rounded-t ${i === 5 ? 'bg-gradient-to-t from-purple-500 to-cyan-500' : 'bg-white/20'}`}
                            style={{ height: `${h}%` }}
                        />
                    ))}
                </div>
            );
        case 'integrations':
            return (
                <div className="mt-3 flex items-center gap-2">
                    {['J', 'S', 'G', 'N'].map((l, i) => (
                        <div key={i} className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-xs text-white/50 font-medium">
                            {l}
                        </div>
                    ))}
                    <span className="text-xs text-emerald-400">+46 more</span>
                </div>
            );
        default:
            return null;
    }
}

export function BentoFeatures() {
    return (
        <section id="features" className="py-20 px-6 bg-[#09090B]">
            <div className="max-w-6xl mx-auto">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                        Everything you need to
                        <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"> ship faster</span>
                    </h2>
                    <p className="text-white/50 text-lg max-w-2xl mx-auto">
                        Stop context-switching between tools. One platform for sprints, standups, blockers, and insights.
                    </p>
                </motion.div>

                {/* Bento grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[220px]"
                >
                    {features.map((feature, i) => {
                        const Icon = feature.icon;
                        const gridClass =
                            feature.size === 'large' ? 'lg:col-span-2 lg:row-span-2' :
                                feature.size === 'medium' ? 'lg:col-span-2' : '';

                        return (
                            <motion.div
                                key={i}
                                variants={itemVariants}
                                className={`group relative rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm overflow-hidden cursor-pointer hover:border-white/20 transition-all duration-300 ${gridClass}`}
                            >
                                {/* Gradient overlay on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                                {/* Content */}
                                <div className="relative z-10 h-full flex flex-col p-6">
                                    {/* Icon */}
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>

                                    {/* Text */}
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-white/50 text-sm leading-relaxed flex-1">
                                        {feature.description}
                                    </p>

                                    {/* Feature-specific visual */}
                                    <FeatureVisual type={feature.visual} />
                                </div>

                                {/* Shine effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
