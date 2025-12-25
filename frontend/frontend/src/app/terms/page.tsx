'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeftIcon } from '@radix-ui/react-icons'

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#09090B] text-white">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
                        backgroundSize: '64px 64px',
                    }}
                />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto px-6 py-16">
                {/* Back link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back to home
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
                    <p className="text-white/50 mb-8">Last updated: December 2024</p>

                    <div className="prose prose-invert prose-purple max-w-none space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                            <p className="text-white/70 leading-relaxed">
                                By accessing and using AI Scrum Master ("the Service"), you agree to be bound by these Terms of Service.
                                If you do not agree to these terms, please do not use our Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
                            <p className="text-white/70 leading-relaxed">
                                AI Scrum Master is a productivity and project management tool that uses artificial intelligence to help
                                engineering teams manage sprints, standups, and blockers. We provide features including but not limited to
                                automated standup summaries, blocker detection, and sprint analytics.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts</h2>
                            <p className="text-white/70 leading-relaxed">
                                You are responsible for maintaining the confidentiality of your account credentials and for all activities
                                that occur under your account. You must immediately notify us of any unauthorized use of your account.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">4. Acceptable Use</h2>
                            <p className="text-white/70 leading-relaxed">
                                You agree not to misuse the Service. This includes but is not limited to: attempting to gain unauthorized
                                access, interfering with other users, or using the Service for illegal purposes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">5. Data Privacy</h2>
                            <p className="text-white/70 leading-relaxed">
                                Your privacy is important to us. Please refer to our{' '}
                                <Link href="/privacy" className="text-purple-400 hover:text-purple-300">
                                    Privacy Policy
                                </Link>{' '}
                                for information on how we collect, use, and protect your data.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">6. Limitation of Liability</h2>
                            <p className="text-white/70 leading-relaxed">
                                The Service is provided "as is" without warranties of any kind. We shall not be liable for any indirect,
                                incidental, special, or consequential damages arising from your use of the Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">7. Contact</h2>
                            <p className="text-white/70 leading-relaxed">
                                If you have any questions about these Terms, please contact us at{' '}
                                <a href="mailto:legal@scrummaster.ai" className="text-purple-400 hover:text-purple-300">
                                    legal@scrummaster.ai
                                </a>
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
