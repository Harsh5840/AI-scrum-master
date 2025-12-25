'use client';

import { useEffect, useState, useCallback } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import {
    RocketIcon,
    PersonIcon,
    GearIcon,
    MagnifyingGlassIcon,
    HomeIcon,
    BarChartIcon,
    ChatBubbleIcon,
} from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    // Toggle with ⌘K or Ctrl+K
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
            if (e.key === 'Escape') {
                setOpen(false);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const runCommand = useCallback((command: () => void) => {
        setOpen(false);
        command();
    }, []);

    return (
        <>
            {/* Floating hint */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.5 }}
                className="fixed bottom-6 right-6 z-40"
            >
                <button
                    onClick={() => setOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white/60 text-sm hover:bg-white/10 hover:text-white transition-all group"
                >
                    <MagnifyingGlassIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Press</span>
                    <kbd className="px-2 py-0.5 rounded bg-white/10 font-mono text-xs group-hover:bg-white/20">
                        ⌘K
                    </kbd>
                </button>
            </motion.div>

            {/* Command Palette Modal */}
            <AnimatePresence>
                {open && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                            onClick={() => setOpen(false)}
                        />

                        {/* Command Dialog */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed left-1/2 top-[20%] z-50 w-full max-w-xl -translate-x-1/2"
                        >
                            <Command className="rounded-2xl border border-white/10 bg-[#0a0a0f]/95 backdrop-blur-2xl shadow-2xl overflow-hidden">
                                <div className="flex items-center border-b border-white/10 px-4">
                                    <MagnifyingGlassIcon className="w-5 h-5 text-white/40" />
                                    <Command.Input
                                        placeholder="Type a command or search..."
                                        className="flex-1 bg-transparent py-4 px-3 text-white placeholder:text-white/40 outline-none text-lg"
                                    />
                                    <kbd className="px-2 py-1 rounded bg-white/5 text-white/40 text-xs font-mono">
                                        ESC
                                    </kbd>
                                </div>

                                <Command.List className="max-h-80 overflow-y-auto p-2">
                                    <Command.Empty className="py-6 text-center text-white/40">
                                        No results found.
                                    </Command.Empty>

                                    <Command.Group heading="Navigation" className="text-white/40 text-xs uppercase tracking-wider px-2 py-2">
                                        <Command.Item
                                            onSelect={() => runCommand(() => router.push('/'))}
                                            className="flex items-center gap-3 px-3 py-3 rounded-lg text-white cursor-pointer hover:bg-white/5 aria-selected:bg-white/10 transition-colors"
                                        >
                                            <HomeIcon className="w-4 h-4 text-purple-400" />
                                            <span>Home</span>
                                        </Command.Item>
                                        <Command.Item
                                            onSelect={() => runCommand(() => router.push('/dashboard'))}
                                            className="flex items-center gap-3 px-3 py-3 rounded-lg text-white cursor-pointer hover:bg-white/5 aria-selected:bg-white/10 transition-colors"
                                        >
                                            <BarChartIcon className="w-4 h-4 text-cyan-400" />
                                            <span>Dashboard</span>
                                        </Command.Item>
                                        <Command.Item
                                            onSelect={() => runCommand(() => router.push('/sprints'))}
                                            className="flex items-center gap-3 px-3 py-3 rounded-lg text-white cursor-pointer hover:bg-white/5 aria-selected:bg-white/10 transition-colors"
                                        >
                                            <RocketIcon className="w-4 h-4 text-green-400" />
                                            <span>Sprints</span>
                                        </Command.Item>
                                    </Command.Group>

                                    <Command.Group heading="Actions" className="text-white/40 text-xs uppercase tracking-wider px-2 py-2 mt-2">
                                        <Command.Item
                                            onSelect={() => runCommand(() => router.push('/auth/login'))}
                                            className="flex items-center gap-3 px-3 py-3 rounded-lg text-white cursor-pointer hover:bg-white/5 aria-selected:bg-white/10 transition-colors"
                                        >
                                            <PersonIcon className="w-4 h-4 text-blue-400" />
                                            <span>Sign In</span>
                                        </Command.Item>
                                        <Command.Item
                                            onSelect={() => runCommand(() => router.push('/auth/signup'))}
                                            className="flex items-center gap-3 px-3 py-3 rounded-lg text-white cursor-pointer hover:bg-white/5 aria-selected:bg-white/10 transition-colors"
                                        >
                                            <RocketIcon className="w-4 h-4 text-emerald-400" />
                                            <span>Get Started Free</span>
                                        </Command.Item>
                                        <Command.Item
                                            onSelect={() => runCommand(() => {
                                                const el = document.getElementById('pricing');
                                                el?.scrollIntoView({ behavior: 'smooth' });
                                            })}
                                            className="flex items-center gap-3 px-3 py-3 rounded-lg text-white cursor-pointer hover:bg-white/5 aria-selected:bg-white/10 transition-colors"
                                        >
                                            <GearIcon className="w-4 h-4 text-orange-400" />
                                            <span>View Pricing</span>
                                        </Command.Item>
                                    </Command.Group>

                                    <Command.Group heading="Support" className="text-white/40 text-xs uppercase tracking-wider px-2 py-2 mt-2">
                                        <Command.Item
                                            onSelect={() => runCommand(() => window.open('https://github.com', '_blank'))}
                                            className="flex items-center gap-3 px-3 py-3 rounded-lg text-white cursor-pointer hover:bg-white/5 aria-selected:bg-white/10 transition-colors"
                                        >
                                            <ChatBubbleIcon className="w-4 h-4 text-pink-400" />
                                            <span>Documentation</span>
                                        </Command.Item>
                                    </Command.Group>
                                </Command.List>

                                <div className="border-t border-white/10 px-4 py-3 flex items-center justify-between text-white/30 text-xs">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1">
                                            <kbd className="px-1.5 py-0.5 rounded bg-white/5">↑↓</kbd> Navigate
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <kbd className="px-1.5 py-0.5 rounded bg-white/5">↵</kbd> Select
                                        </span>
                                    </div>
                                    <span>AI Scrum Master</span>
                                </div>
                            </Command>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
