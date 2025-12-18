'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { CheckIcon, RocketIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

const plans = [
    {
        name: 'Free',
        description: 'For small teams getting started',
        price: { monthly: 0, annual: 0 },
        highlight: false,
        features: [
            'Up to 5 team members',
            '10 AI insights/month',
            'Basic standup automation',
            'Sprint tracking',
            'Community support',
        ],
        cta: 'Get Started',
        ctaLink: '/auth/register',
    },
    {
        name: 'Pro',
        description: 'For growing engineering teams',
        price: { monthly: 29, annual: 24 },
        highlight: true,
        badge: 'Most Popular',
        features: [
            'Up to 50 team members',
            'Unlimited AI insights',
            'Advanced blocker detection',
            'Velocity analytics',
            'Jira & Slack integration',
            'Priority email support',
            'Custom dashboards',
        ],
        cta: 'Start Free Trial',
        ctaLink: '/auth/register',
    },
    {
        name: 'Enterprise',
        description: 'For large organizations',
        price: { monthly: 99, annual: 79 },
        highlight: false,
        features: [
            'Unlimited team members',
            'Unlimited everything',
            'Custom integrations',
            'SSO & SAML',
            'Dedicated account manager',
            'Custom SLA',
            'On-premise option',
            'Advanced security',
        ],
        cta: 'Contact Sales',
        ctaLink: '/contact',
    },
];

export function PricingCalculator() {
    const [isAnnual, setIsAnnual] = useState(true);

    return (
        <section id="pricing" className="py-20 px-6 bg-gradient-to-b from-[#09090B] via-[#0d0d14] to-[#09090B]">
            <div className="max-w-6xl mx-auto">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Simple, transparent pricing
                    </h2>
                    <p className="text-white/50 text-lg mb-8">
                        Start free. Upgrade when you need more.
                    </p>

                    {/* Billing toggle */}
                    <div className="inline-flex items-center gap-4 p-1.5 rounded-full bg-white/5 border border-white/10">
                        <button
                            onClick={() => setIsAnnual(false)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${!isAnnual ? 'bg-white text-black' : 'text-white/60 hover:text-white'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setIsAnnual(true)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${isAnnual ? 'bg-white text-black' : 'text-white/60 hover:text-white'
                                }`}
                        >
                            Annual
                            <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                                Save 20%
                            </span>
                        </button>
                    </div>
                </motion.div>

                {/* Pricing cards */}
                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative rounded-2xl p-6 lg:p-8 ${plan.highlight
                                    ? 'border-2 border-purple-500/50 bg-gradient-to-b from-purple-500/10 to-transparent'
                                    : 'border border-white/10 bg-white/[0.02]'
                                }`}
                        >
                            {/* Popular badge */}
                            {plan.badge && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs font-medium">
                                    {plan.badge}
                                </div>
                            )}

                            {/* Plan header */}
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                                <p className="text-white/50 text-sm">{plan.description}</p>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl lg:text-5xl font-bold text-white">
                                        ${isAnnual ? plan.price.annual : plan.price.monthly}
                                    </span>
                                    <span className="text-white/50">/month</span>
                                </div>
                                {isAnnual && plan.price.monthly > 0 && (
                                    <p className="text-emerald-400 text-sm mt-1">
                                        Billed annually (${(isAnnual ? plan.price.annual : plan.price.monthly) * 12}/year)
                                    </p>
                                )}
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-white/70 text-sm">
                                        <CheckIcon className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <Link
                                href={plan.ctaLink}
                                className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg font-medium transition-all ${plan.highlight
                                        ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:opacity-90'
                                        : 'border border-white/20 text-white hover:bg-white/5'
                                    }`}
                            >
                                {plan.highlight && <RocketIcon className="w-4 h-4" />}
                                {plan.cta}
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Trust badges */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center"
                >
                    <p className="text-white/30 text-sm">
                        ✓ 14-day free trial on Pro · ✓ No credit card required · ✓ Cancel anytime
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
