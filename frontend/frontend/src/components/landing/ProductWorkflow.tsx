'use client';

import { motion } from 'framer-motion';

const steps = [
    {
        number: '01',
        title: 'Connect Your Tools',
        description: 'Integrate with Jira, Slack, GitHub in 2 minutes. No code changes needed.',
        icon: '🔗',
        color: 'from-purple-500 to-violet-500',
    },
    {
        number: '02',
        title: 'AI Learns Your Team',
        description: 'Our AI analyzes sprint patterns, blockers, and velocity to understand your workflow.',
        icon: '🧠',
        color: 'from-cyan-500 to-blue-500',
    },
    {
        number: '03',
        title: 'Get Proactive Insights',
        description: 'Receive predictions, blocker alerts, and recommendations before problems occur.',
        icon: '💡',
        color: 'from-amber-500 to-orange-500',
    },
    {
        number: '04',
        title: 'Ship Faster',
        description: 'Teams using AI Scrum Master ship 40% more features with fewer surprises.',
        icon: '🚀',
        color: 'from-emerald-500 to-teal-500',
    },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const stepVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
};

export function ProductWorkflow() {
    return (
        <section className="py-20 px-6 bg-gradient-to-b from-[#09090B] via-[#0a0a12] to-[#09090B] overflow-hidden">
            <div className="max-w-6xl mx-auto">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        How it works
                    </h2>
                    <p className="text-white/50 text-lg max-w-xl mx-auto">
                        Go from chaos to clarity in 4 simple steps
                    </p>
                </motion.div>

                {/* Steps */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    className="relative"
                >
                    {/* Connection line */}
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent hidden lg:block" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.number}
                                variants={stepVariants}
                                className="relative group"
                            >
                                {/* Card */}
                                <div className="relative p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300">
                                    {/* Step number */}
                                    <div className="absolute -top-3 -left-3 w-8 h-8 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-xs text-white/50 font-mono">
                                        {step.number}
                                    </div>

                                    {/* Icon */}
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-2xl mb-4 shadow-lg`}
                                    >
                                        {step.icon}
                                    </motion.div>

                                    {/* Content */}
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-white/50 leading-relaxed">
                                        {step.description}
                                    </p>

                                    {/* Arrow for desktop */}
                                    {index < steps.length - 1 && (
                                        <div className="absolute top-1/2 -right-3 w-6 h-6 hidden lg:flex items-center justify-center">
                                            <motion.div
                                                animate={{ x: [0, 4, 0] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                                className="text-white/20"
                                            >
                                                →
                                            </motion.div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center"
                >
                    <p className="text-white/40 text-sm mb-4">
                        Most teams are up and running in under 5 minutes
                    </p>
                    <div className="inline-flex items-center gap-6 text-xs text-white/30">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            No code changes
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Free trial included
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Cancel anytime
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
