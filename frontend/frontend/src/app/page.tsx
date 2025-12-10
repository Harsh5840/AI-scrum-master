'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { 
  RocketIcon, 
  LightningBoltIcon, 
  CheckCircledIcon,
  BarChartIcon,
  ChatBubbleIcon,
  CalendarIcon,
  ReaderIcon,
  MixerHorizontalIcon,
  ArrowRightIcon,
  DashboardIcon,
  CodeIcon,
  PersonIcon,
  GlobeIcon,
  TimerIcon
} from '@radix-ui/react-icons';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports for client-side only
const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  { ssr: false }
);

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // View Transitions API support
  useEffect(() => {
    if (typeof window !== 'undefined' && 'startViewTransition' in document) {
      // Enable smooth page transitions
      const handleLinkClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const link = target.closest('a');
        if (link && link.href && link.href.startsWith(window.location.origin)) {
          e.preventDefault();
          (document as any).startViewTransition(() => {
            window.location.href = link.href;
          });
        }
      };
      document.addEventListener('click', handleLinkClick);
      return () => document.removeEventListener('click', handleLinkClick);
    }
  }, []);

  // GSAP ScrollTrigger animations
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Dynamically import GSAP on client side only
    import('gsap').then(({ default: gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
          // Hero parallax effect - REMOVED to prevent conflict with Framer Motion and scroll issues
          // The Framer Motion animations handle the entrance, and we don't need complex scroll scrubbing here
          // which was causing the text to disappear on scroll up.

          // Features cards stagger reveal
          gsap.from('.feature-card', {
            y: 50, // Reduced movement
            opacity: 0,
            stagger: 0.1,
            duration: 0.6,
            scrollTrigger: {
              trigger: featuresRef.current,
              start: 'top 85%', // Trigger earlier
              end: 'top 20%',
              toggleActions: 'play none none reverse', // Keep reverse for nice exit, but ensure it plays again
            },
          });

          // Floating elements
          gsap.to('.float-element', {
            y: -30,
            duration: 2,
            ease: 'power1.inOut',
            stagger: 0.2,
            repeat: -1,
            yoyo: true,
          });

          // Magnetic effect for buttons
          const buttons = document.querySelectorAll('.magnetic-button');
          buttons.forEach((button) => {
            const btn = button as HTMLElement;
            btn.addEventListener('mouseenter', () => {
              gsap.to(btn, { scale: 1.1, duration: 0.3 });
            });
            btn.addEventListener('mouseleave', () => {
              gsap.to(btn, { scale: 1, duration: 0.3 });
            });
            btn.addEventListener('mousemove', (e: any) => {
              const rect = btn.getBoundingClientRect();
              const x = e.clientX - rect.left - rect.width / 2;
              const y = e.clientY - rect.top - rect.height / 2;
              gsap.to(btn, {
                x: x * 0.2,
                y: y * 0.2,
                duration: 0.3,
              });
            });
            btn.addEventListener('mouseleave', () => {
              gsap.to(btn, { x: 0, y: 0, duration: 0.5 });
            });
          });
        });

        // Cleanup
        return () => ctx.revert();
      });
    });
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: <img src="https://cdn-icons-png.flaticon.com/512/2462/2462719.png" alt="chat" className="h-6 w-6" loading="lazy" />,
      title: "Async Standups",
      description: "Team updates without meetings. Smart summaries, blocker detection, and sentiment analysis.",
      color: "from-green-500/20 to-emerald-500/20"
    },
    {
      icon: <img src="https://cdn-icons-png.flaticon.com/512/1828/1828911.png" alt="analytics" className="h-6 w-6" loading="lazy" />,
      title: "Real-time Analytics",
      description: "Burndown charts, velocity tracking, and performance metrics updated live.",
      color: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: <img src="https://cdn-icons-png.flaticon.com/512/888/888879.png" alt="auto" className="h-6 w-6" loading="lazy" />,
      title: "Auto Blockers",
      description: "Detect blockers before they impact delivery. Get suggestions to resolve them.",
      color: "from-yellow-500/20 to-orange-500/20"
    },
    {
      icon: <img src="https://cdn-icons-png.flaticon.com/512/2922/2922563.png" alt="calendar" className="h-6 w-6" loading="lazy" />,
      title: "Smart Planning",
      description: "Velocity predictions, capacity planning, and data-driven sprint goals.",
      color: "from-purple-500/20 to-pink-500/20"
    },
    {
      icon: <img src="https://cdn-icons-png.flaticon.com/512/2462/2462714.png" alt="assistant" className="h-6 w-6" loading="lazy" />,
      title: "Team Assistant",
      description: "Ask questions about sprints. Get contextual answers from your data.",
      color: "from-indigo-500/20 to-violet-500/20"
    },
    {
      icon: <img src="https://cdn-icons-png.flaticon.com/512/747/747376.png" alt="docs" className="h-6 w-6" loading="lazy" />,
      title: "Auto Docs",
      description: "Generate sprint reports and retrospectives automatically.",
      color: "from-red-500/20 to-rose-500/20"
    }
  ];

  const stats = [
    { value: "10k+", label: "Active Teams", icon: <img src="https://cdn-icons-png.flaticon.com/512/747/747376.png" alt="teams" className="h-5 w-5" loading="lazy" /> },
    { value: "500k+", label: "Sprints Managed", icon: <img src="https://cdn-icons-png.flaticon.com/512/3047/3047145.png" alt="sprints" className="h-5 w-5" loading="lazy" /> },
    { value: "99.9%", label: "Uptime", icon: <img src="https://cdn-icons-png.flaticon.com/512/1048/1048316.png" alt="uptime" className="h-5 w-5" loading="lazy" /> },
    { value: "<2min", label: "Setup Time", icon: <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="setup" className="h-5 w-5" loading="lazy" /> }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden" ref={containerRef}>
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Custom Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
          scale: isHovering ? 1.5 : 1
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      >
        <div className="w-full h-full rounded-full bg-primary" />
      </motion.div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full z-40 border-b border-border/40 bg-background/60 backdrop-blur-2xl"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative">
                {/* Flaticon agile icon - attribution: https://www.flaticon.com/ */}
                <img src="https://cdn-icons-png.flaticon.com/512/4727/4727266.png" alt="ScrumMaster" className="h-8 w-8" />
                <motion.div
                  className="absolute inset-0 blur-md bg-primary/50 -z-10"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <span className="text-xl font-bold">
                Scrum<span className="text-primary">Master</span>
              </span>
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              {['Features', 'Workflow', 'Pricing'].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-muted-foreground hover:text-primary transition-colors relative"
                  whileHover={{ y: -2 }}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  {item}
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.a>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <Link href="/auth/login">
                <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="group">
                    Get Started
                    <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - 3D Layered */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 lg:px-8 overflow-hidden pt-20">
        {/* Animated Gradient Background - Enhanced */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-purple-500/20 blur-[120px] animate-pulse" />
          <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-500/20 blur-[120px] animate-pulse delay-1000" />
          <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 blur-[120px] animate-pulse delay-2000" />
        </div>

        {/* Grid Pattern - Enhanced visibility */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000,transparent)] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8 hero-content text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-primary/20 bg-background/50 backdrop-blur-md shadow-sm mx-auto lg:mx-0"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-foreground/80">AI-Powered Scrum Master v2.0</span>
              </motion.div>

              <motion.h1
                className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="block text-foreground drop-shadow-sm">Automate Your</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 pb-2">
                  Agile Workflow
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0"
              >
                Stop wasting time in standups. Let AI analyze updates, detect blockers, 
                and generate sprint insights in real-time.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link href="/auth/signup">
                  <Button size="lg" className="h-12 px-8 text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 rounded-full">
                    Start Free Trial
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-2 hover:bg-accent/50 rounded-full">
                    View Demo
                  </Button>
                </Link>
              </motion.div>

              <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 text-muted-foreground/60">
                <div className="flex items-center gap-2">
                  <CheckCircledIcon className="w-5 h-5 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircledIcon className="w-5 h-5 text-green-500" />
                  <span>14-day free trial</span>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Freepik Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative perspective-1000"
            >
              <motion.div
                className="relative rounded-2xl overflow-hidden"
                animate={{
                  y: [0, -20, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Freepik Illustration - Team Collaboration Interface 
                    Attribution: Designed by freepik - https://www.freepik.com/ */}
                <img 
                  src="https://img.freepik.com/free-vector/teamwork-concept-landing-page_52683-20164.jpg" 
                  alt="Team collaboration and project management illustration" 
                  className="w-full h-auto rounded-2xl shadow-2xl"
                  loading="lazy"
                />
                {/* Glassmorphism overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none rounded-2xl" />
              </motion.div>

              {/* Floating cards */}
              <motion.div
                className="absolute -top-6 -right-6 p-4 rounded-xl bg-card/80 backdrop-blur-xl border border-primary/20 float-element"
                animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm font-medium">5 active sprints</span>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-6 -left-6 p-4 rounded-xl bg-card/80 backdrop-blur-xl border border-primary/20 float-element"
                animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                <div className="flex items-center space-x-3">
                  <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="check" className="h-5 w-5 text-primary" loading="lazy" />
                  <span className="text-sm font-medium">23 tasks completed</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 px-6 lg:px-8 border-y border-border/40 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center space-y-2"
              >
                <motion.div
                  className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-2"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  {stat.icon}
                </motion.div>
                <motion.div
                  className="text-4xl font-bold text-primary stat-value"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", delay: index * 0.1 + 0.2 }}
                  viewport={{ once: true }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Card Carousel */}
      <section ref={featuresRef} id="features" className="py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              Powerful<span className="text-primary"> features</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to run high-performing sprints
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="feature-card"
              >
                <Card className="p-6 h-full relative overflow-hidden group">
                  {/* Gradient Background */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  
                  <div className="relative z-10 space-y-4">
                    <motion.div
                      className="inline-flex p-3 rounded-xl bg-primary/10 text-primary"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Visualization Section */}
      <section className="py-32 px-6 lg:px-8 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-primary/50 bg-primary/10">
                <img src="https://cdn-icons-png.flaticon.com/512/888/888879.png" alt="automation" className="h-4 w-4 text-primary" loading="lazy" />
                <span className="text-sm font-medium text-primary">Automated Workflow</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">
                Sprint automation that <span className="text-primary">just works</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                From standup reminders to blocker detection, our AI handles the tedious work 
                so your team can focus on building great products.
              </p>
              <ul className="space-y-4">
                {[
                  'Automatic standup collection via Slack',
                  'Smart blocker detection with AI',
                  'Real-time sprint analytics',
                  'Intelligent sprint planning suggestions'
                ].map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="check" className="h-5 w-5 text-primary flex-shrink-0" loading="lazy" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Freepik Illustration - Sprint Planning 
                  Attribution: Designed by pch.vector / Freepik - https://www.freepik.com/ */}
              <div className="relative rounded-2xl overflow-hidden">
                <img 
                  src="https://img.freepik.com/free-vector/kanban-method-concept-illustration_114360-9863.jpg" 
                  alt="Kanban board sprint planning illustration" 
                  className="w-full h-auto rounded-2xl shadow-2xl"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none rounded-2xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          {/* Freepik Illustration - Background 
              Attribution: Designed by freepik - https://www.freepik.com/ */}
          <div className="absolute right-0 bottom-0 w-1/3 opacity-10">
            <img 
              src="https://img.freepik.com/free-vector/teamwork-concept-illustration_114360-8914.jpg" 
              alt="Team collaboration background" 
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.h2
            className="text-4xl md:text-6xl font-bold mb-6"
            animate={{
              textShadow: [
                "0 0 10px hsl(var(--primary) / 0.3)",
                "0 0 20px hsl(var(--primary) / 0.5)",
                "0 0 10px hsl(var(--primary) / 0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Ready to <span className="text-primary">transform</span> your sprints?
          </motion.h2>
          <p className="text-xl text-muted-foreground mb-10">
            Join thousands of teams shipping faster with intelligent sprint management.
          </p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link href="/auth/signup">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="px-8 magnetic-button">
                  Start Free Trial
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
            <Link href="/auth/login">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="px-8 magnetic-button">
                  Sign In
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-8 border-t border-border/40">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <RocketIcon className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">ScrumMaster</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Sprint management for modern teams.
              </p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Workflow', 'Pricing'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Security'] }
            ].map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold mb-3">{section.title}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {section.links.map((link) => (
                    <motion.li
                      key={link}
                      whileHover={{ x: 5, color: 'hsl(var(--primary))' }}
                    >
                      <a href="#" className="hover:text-primary transition-colors">
                        {link}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border/40 pt-8 text-sm text-center text-muted-foreground">
            © 2025 ScrumMaster Pro. Built with Next.js, TypeScript & Framer Motion.
          </div>
        </div>
      </footer>
    </div>
  );
}
