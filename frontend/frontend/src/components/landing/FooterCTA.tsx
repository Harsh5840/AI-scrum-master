'use client';

import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, GitHubLogoIcon, TwitterLogoIcon, LinkedInLogoIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

export function FooterCTA() {
    return (
        <footer className="relative overflow-hidden">
            {/* CTA Section */}
            <section className="relative py-20 px-6">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#09090B] via-[#12121a] to-[#09090B]" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10" />

                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
                        backgroundSize: '40px 40px',
                    }}
                />

                <div className="relative max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                            Ready to accelerate your team?
                        </h2>
                        <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto">
                            Join 500+ engineering teams already using AI Scrum Master to ship faster and more predictably.
                        </p>

                        {/* Command palette trigger CTA */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex flex-col items-center gap-4"
                        >
                            <button
                                onClick={() => {
                                    const event = new KeyboardEvent('keydown', {
                                        key: 'k',
                                        metaKey: true,
                                        bubbles: true,
                                    });
                                    document.dispatchEvent(event);
                                }}
                                className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
                            >
                                <MagnifyingGlassIcon className="w-5 h-5 text-white/50 group-hover:text-white/70" />
                                <span className="text-white/70 group-hover:text-white">Press</span>
                                <kbd className="px-3 py-1.5 rounded-lg bg-white/10 text-white font-mono text-sm group-hover:bg-white/20 transition-colors">
                                    ⌘K
                                </kbd>
                                <span className="text-white/70 group-hover:text-white">to get started</span>
                            </button>

                            <span className="text-white/30 text-sm">or</span>

                            <Link
                                href="/auth/signup"
                                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                            >
                                Sign up with email →
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Footer links */}
            <div className="border-t border-white/5 bg-[#09090B] py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                        {/* Product */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Product</h4>
                            <ul className="space-y-2">
                                {['Features', 'Pricing', 'Changelog', 'Roadmap'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Resources */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Resources</h4>
                            <ul className="space-y-2">
                                {['Documentation', 'API Reference', 'Blog', 'Community'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Company</h4>
                            <ul className="space-y-2">
                                {['About', 'Careers', 'Contact', 'Press'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2">
                                {['Privacy', 'Terms', 'Security', 'Cookies'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                                AI
                            </div>
                            <span className="text-white font-semibold">Scrum Master</span>
                        </div>

                        <p className="text-white/30 text-sm">
                            © 2024 AI Scrum Master. All rights reserved.
                        </p>

                        <div className="flex items-center gap-4">
                            <a href="#" className="text-white/40 hover:text-white transition-colors">
                                <GitHubLogoIcon className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-white/40 hover:text-white transition-colors">
                                <TwitterLogoIcon className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-white/40 hover:text-white transition-colors">
                                <LinkedInLogoIcon className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
