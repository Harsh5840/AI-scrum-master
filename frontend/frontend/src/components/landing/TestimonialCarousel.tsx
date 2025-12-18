'use client';

import { motion } from 'framer-motion';

// Extended testimonials data for 3 rows
const testimonials = {
    row1: [
        { quote: "AI Scrum Master identified a critical dependency blocker 3 days before it would have delayed our release.", author: "Sarah Chen", role: "Engineering Manager", company: "TechCorp" },
        { quote: "Our standups went from 30 minutes to 5 minutes of focused updates. Game changer.", author: "Marcus Rodriguez", role: "Tech Lead", company: "StartupXYZ" },
        { quote: "The velocity predictions are scary accurate. Finally, data-driven sprint planning.", author: "Emily Watson", role: "Product Manager", company: "ScaleUp Inc" },
        { quote: "Setup took 2 minutes. We were running smarter sprints by the second day.", author: "Alex Kim", role: "CTO", company: "DevShop" },
        { quote: "Best investment we made this year. Productivity up 40% in the first month.", author: "Priya Sharma", role: "VP Engineering", company: "CloudBase" },
    ],
    row2: [
        { quote: "Integration with Jira was seamless. Zero learning curve for the team.", author: "David Kim", role: "Scrum Master", company: "Fintech Labs" },
        { quote: "The blocker detection saved us from missing two critical deadlines.", author: "Lisa Wang", role: "Director of Product", company: "AI Startup" },
        { quote: "I can finally focus on unblocking my team instead of collecting status updates.", author: "Tom Bradley", role: "Engineering Lead", company: "SaaS Corp" },
        { quote: "The AI insights helped us reduce our sprint spillover by 60%.", author: "Nina Patel", role: "Agile Coach", company: "Enterprise Co" },
        { quote: "This is what I've been waiting for. Sprint management on autopilot.", author: "James Wilson", role: "Founder", company: "Series B Startup" },
    ],
    row3: [
        { quote: "The team health monitoring feature helped us improve morale significantly.", author: "Rachel Green", role: "People Ops", company: "Remote First Inc" },
        { quote: "Finally, retrospectives that actually lead to improvements.", author: "Mike Chen", role: "Staff Engineer", company: "Tech Giants" },
        { quote: "Reduced our meeting overhead by 70%. Developers love it.", author: "Sophie Martin", role: "CTO", company: "Fast Startup" },
        { quote: "The async standups work perfectly for our distributed team across 5 timezones.", author: "Omar Hassan", role: "Head of Engineering", company: "Global Tech" },
        { quote: "Our sprint velocity increased 25% in the first quarter of using this.", author: "Jennifer Lee", role: "Engineering Director", company: "Scale.io" },
    ],
};

function TestimonialCard({ quote, author, role, company }: { quote: string; author: string; role: string; company: string }) {
    return (
        <div className="flex-shrink-0 w-[400px] p-5 mx-3 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] hover:border-white/20 transition-all">
            <p className="text-white/70 text-sm leading-relaxed mb-4">"{quote}"</p>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center text-xs text-white/60 font-medium">
                    {author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                    <p className="text-white/90 text-sm font-medium">{author}</p>
                    <p className="text-white/40 text-xs">{role} at {company}</p>
                </div>
            </div>
        </div>
    );
}

function MarqueeRow({ items, direction = 'left', duration = 40 }: { items: typeof testimonials.row1; direction?: 'left' | 'right'; duration?: number }) {
    // Double items for seamless loop
    const allItems = [...items, ...items];

    return (
        <div className="relative overflow-hidden py-2">
            {/* Gradient masks */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#09090B] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#09090B] to-transparent z-10 pointer-events-none" />

            <motion.div
                className="flex"
                animate={{
                    x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
                }}
                transition={{
                    x: {
                        duration,
                        repeat: Infinity,
                        ease: 'linear',
                    },
                }}
            >
                {allItems.map((item, i) => (
                    <TestimonialCard key={i} {...item} />
                ))}
            </motion.div>
        </div>
    );
}

export function TestimonialCarousel() {
    return (
        <section className="py-20 bg-[#09090B] overflow-hidden">
            {/* Section header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12 px-6"
            >
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                    Loved by engineering teams
                </h2>
                <p className="text-white/50 text-lg">
                    Join 500+ teams shipping faster with AI-powered sprints
                </p>
            </motion.div>

            {/* 3-row marquee */}
            <div className="space-y-4">
                <MarqueeRow items={testimonials.row1} direction="left" duration={50} />
                <MarqueeRow items={testimonials.row2} direction="right" duration={45} />
                <MarqueeRow items={testimonials.row3} direction="left" duration={55} />
            </div>
        </section>
    );
}
