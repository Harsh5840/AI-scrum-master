'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, EnvelopeClosedIcon, ChatBubbleIcon, RocketIcon } from '@radix-ui/react-icons'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        teamSize: '',
        message: ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle form submission
        console.log('Form submitted:', formData)
    }

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
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-600/15 blur-[150px] rounded-full" />
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-cyan-500/10 blur-[150px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
                {/* Back link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back to home
                </Link>

                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Left side - Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                            Let's talk about your{' '}
                            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                                enterprise needs
                            </span>
                        </h1>
                        <p className="text-lg text-white/50 mb-12">
                            Our team is ready to help you scale your engineering processes with AI-powered sprint management.
                        </p>

                        {/* Contact options */}
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                    <EnvelopeClosedIcon className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-1">Email us</h3>
                                    <p className="text-white/50 text-sm">
                                        <a href="mailto:enterprise@scrummaster.ai" className="hover:text-purple-400 transition-colors">
                                            enterprise@scrummaster.ai
                                        </a>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                                    <ChatBubbleIcon className="w-5 h-5 text-cyan-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-1">Live chat</h3>
                                    <p className="text-white/50 text-sm">Available Monday - Friday, 9am - 6pm EST</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                    <RocketIcon className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-1">Book a demo</h3>
                                    <p className="text-white/50 text-sm">See AI Scrum Master in action with a personalized demo</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right side - Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="relative">
                            <div className="absolute -inset-[1px] bg-gradient-to-b from-white/20 via-white/5 to-white/10 rounded-2xl" />

                            <div className="relative bg-[#0a0a0f]/90 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                                <h2 className="text-xl font-semibold mb-6">Contact Sales</h2>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-white/70 text-sm">Name</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="John Doe"
                                                className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 outline-none transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-white/70 text-sm">Work email</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="john@company.com"
                                                className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 outline-none transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-white/70 text-sm">Company</label>
                                            <input
                                                type="text"
                                                value={formData.company}
                                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                                placeholder="Acme Inc."
                                                className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 outline-none transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-white/70 text-sm">Team size</label>
                                            <select
                                                value={formData.teamSize}
                                                onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                                                className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 outline-none transition-colors"
                                            >
                                                <option value="" className="bg-[#0a0a0f]">Select team size</option>
                                                <option value="1-10" className="bg-[#0a0a0f]">1-10</option>
                                                <option value="11-50" className="bg-[#0a0a0f]">11-50</option>
                                                <option value="51-200" className="bg-[#0a0a0f]">51-200</option>
                                                <option value="201-500" className="bg-[#0a0a0f]">201-500</option>
                                                <option value="500+" className="bg-[#0a0a0f]">500+</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-white/70 text-sm">How can we help?</label>
                                        <textarea
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            placeholder="Tell us about your team's needs..."
                                            rows={4}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 outline-none transition-colors resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full h-11 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-medium rounded-lg transition-all duration-300"
                                    >
                                        Send message
                                    </button>

                                    <p className="text-xs text-white/30 text-center">
                                        By submitting, you agree to our{' '}
                                        <Link href="/privacy" className="text-purple-400 hover:text-purple-300">
                                            Privacy Policy
                                        </Link>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
