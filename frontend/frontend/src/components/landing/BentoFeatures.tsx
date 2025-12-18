'use client';

import { motion } from 'framer-motion';
import {
    LightningBoltIcon,
    RocketIcon,
    ChatBubbleIcon,
    BarChartIcon,
    TimerIcon,
    GlobeIcon,
} from '@radix-ui/react-icons';

const features = [
    {
        icon: LightningBoltIcon,
        title: 'AI-Powered Insights',
        description: 'Get intelligent predictions about sprint completion, blocker patterns, and team velocity trends.',
        gradient: 'from-purple-500 to-pink-500',
        size: 'large',
    },
    {
        icon: ChatBubbleIcon,
        title: 'Automated Standups',
        description: 'Never miss a standup. AI collects and summarizes updates automatically.',
        gradient: 'from-cyan-500 to-blue-500',
        size: 'small',
    },
    {
        icon: TimerIcon,
        title: 'Blocker Detection',
        description: 'Proactively identify and escalate blockers before they derail your sprint.',
        gradient: 'from-orange-500 to-red-500',
        size: 'small',
    },
    {
        icon: BarChartIcon,
        title: 'Velocity Analytics',
        description: 'Track sprint velocity, burndown charts, and team performance over time.',
        gradient: 'from-emerald-500 to-teal-500',
        size: 'medium',
    },
    {
        icon: RocketIcon,
        title: 'Sprint Planning',
        description: 'AI-assisted story point estimation and sprint capacity planning.',
        gradient: 'from-violet-500 to-purple-500',
        size: 'small',
    },
    {
        icon: GlobeIcon,
        title: 'Integrations',
        description: 'Connect with Jira, Slack, GitHub, and 50+ other tools.',
        gradient: 'from-blue-500 to-indigo-500',
        size: 'small',
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

export function BentoFeatures() {
    return (
        <section className="py-20 px-6 bg-[#09090B]">
            <div className="max-w-6xl mx-auto">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Everything you need to
                        <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"> ship faster</span>
                    </h2>
                    <p className="text-white/50 text-lg max-w-2xl mx-auto">
                        A complete toolkit for modern engineering teams. Automate the boring stuff and focus on what matters.
                    </p>
                </motion.div>

                {/* Bento grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]"
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
                                className={`group relative rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm overflow-hidden cursor-pointer hover:border-white/20 transition-colors ${gridClass}`}
                            >
                                {/* Gradient overlay on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                                {/* Content */}
                                <div className="relative z-10 h-full flex flex-col p-6">
                                    {/* Icon */}
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>

                                    {/* Text */}
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-white/50 text-sm leading-relaxed flex-1">
                                        {feature.description}
                                    </p>

                                    {/* Large card extras */}
                                    {feature.size === 'large' && (
                                        <div className="mt-4 flex items-center gap-2">
                                            <div className="h-1 flex-1 rounded-full bg-white/10 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: '0%' }}
                                                    whileInView={{ width: '75%' }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: 0.5, duration: 1 }}
                                                    className={`h-full rounded-full bg-gradient-to-r ${feature.gradient}`}
                                                />
                                            </div>
                                            <span className="text-xs text-white/40">75% accuracy</span>
                                        </div>
                                    )}
                                </div>

                                {/* Shine effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
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
