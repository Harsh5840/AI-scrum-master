'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeftIcon } from '@radix-ui/react-icons'

export default function PrivacyPage() {
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
                    <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
                    <p className="text-white/50 mb-8">Last updated: December 2024</p>

                    <div className="prose prose-invert prose-purple max-w-none space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
                            <p className="text-white/70 leading-relaxed">
                                We collect information you provide directly to us, including your name, email address, and any other
                                information you choose to provide. We also collect usage data and analytics to improve our Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
                            <p className="text-white/70 leading-relaxed mb-4">
                                We use the information we collect to:
                            </p>
                            <ul className="list-disc list-inside text-white/70 space-y-2">
                                <li>Provide, maintain, and improve our Service</li>
                                <li>Send you technical notices and support messages</li>
                                <li>Respond to your comments and questions</li>
                                <li>Analyze usage patterns to improve user experience</li>
                                <li>Detect and prevent fraud or abuse</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">3. Data Security</h2>
                            <p className="text-white/70 leading-relaxed">
                                We implement appropriate technical and organizational measures to protect your personal data against
                                unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers,
                                and regular security audits.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">4. Data Retention</h2>
                            <p className="text-white/70 leading-relaxed">
                                We retain your personal data only for as long as necessary to fulfill the purposes for which it was
                                collected, or as required by law. You can request deletion of your data at any time.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">5. Third-Party Services</h2>
                            <p className="text-white/70 leading-relaxed">
                                We may use third-party services for analytics, payment processing, and authentication. These services
                                have their own privacy policies and we encourage you to review them.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">6. Your Rights</h2>
                            <p className="text-white/70 leading-relaxed mb-4">
                                You have the right to:
                            </p>
                            <ul className="list-disc list-inside text-white/70 space-y-2">
                                <li>Access your personal data</li>
                                <li>Correct inaccurate data</li>
                                <li>Request deletion of your data</li>
                                <li>Object to processing of your data</li>
                                <li>Data portability</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">7. Cookies</h2>
                            <p className="text-white/70 leading-relaxed">
                                We use cookies and similar technologies to collect usage data and improve our Service. You can control
                                cookie settings through your browser preferences.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">8. Contact Us</h2>
                            <p className="text-white/70 leading-relaxed">
                                If you have any questions about this Privacy Policy, please contact us at{' '}
                                <a href="mailto:privacy@scrummaster.ai" className="text-purple-400 hover:text-purple-300">
                                    privacy@scrummaster.ai
                                </a>
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
