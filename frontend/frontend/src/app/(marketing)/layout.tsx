import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AI Scrum Master | Intelligent Sprint Management',
    description: 'Your AI-powered engineering copilot. Automate standups, predict blockers, and accelerate your team\'s velocity with intelligent insights.',
    keywords: ['scrum', 'agile', 'AI', 'project management', 'sprint', 'standup', 'engineering'],
    openGraph: {
        title: 'AI Scrum Master',
        description: 'Your AI-powered engineering copilot',
        type: 'website',
    },
};

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#09090B]">
            {children}
        </div>
    );
}
