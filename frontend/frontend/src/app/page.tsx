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
  CodeIcon
} from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <RocketIcon className="h-7 w-7 text-primary animate-pulse-slow" />
                <div className="absolute inset-0 blur-md bg-primary/50 -z-10" />
              </div>
              <span className="text-xl font-bold text-foreground">Scrum<span className="text-primary">Master</span></span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-primary transition-colors duration-300">Features</a>
              <a href="#workflow" className="text-muted-foreground hover:text-primary transition-colors duration-300">Workflow</a>
              <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors duration-300">Pricing</a>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <Link href="/auth/login">
                <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="group">
                  Get Started
                  <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Completely Redesigned */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8 overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000,transparent)]" />
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-8 animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-primary/50 bg-primary/10 backdrop-blur-sm animate-fade-in">
              <LightningBoltIcon className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Smart Sprint Management</span>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              <span className="text-foreground">Ship Faster</span>
              <br />
              <span className="text-primary neon-glow">Work Smarter</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              The modern way to manage sprints. Automate standups, detect blockers, 
              and get intelligent insights—all in one place.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link href="/auth/signup">
                <Button size="lg" className="group text-base px-8 neon-border">
                  Start Building Free
                  <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="text-base px-8 border-primary/50 hover:bg-primary/10">
                  <DashboardIcon className="mr-2 h-5 w-5" />
                  View Demo
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <CheckCircledIcon className="h-5 w-5 text-primary" />
                <span>Free forever</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircledIcon className="h-5 w-5 text-primary" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircledIcon className="h-5 w-5 text-primary" />
                <span>2 min setup</span>
              </div>
            </div>
          </div>

          {/* Dashboard Preview - Floating Card */}
          <div className="mt-20 relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="relative rounded-2xl overflow-hidden border border-primary/20 shadow-2xl shadow-primary/10">
              <div className="aspect-video bg-gradient-to-br from-card to-card/50 backdrop-blur-xl p-8">
                <div className="h-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <BarChartIcon className="h-24 w-24 mx-auto text-primary/50" />
                    <p className="text-lg font-medium text-muted-foreground">[Dashboard Preview]</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section id="features" className="py-32 px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Everything you need to
              <span className="text-primary"> ship faster</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed for modern agile teams
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Large Feature Card */}
            <Card className="md:col-span-2 p-8 group hover:border-primary/50 transition-all duration-300">
              <div className="space-y-4">
                <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary">
                  <ChatBubbleIcon className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold">Automated Standups</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Team members submit updates asynchronously. Get instant summaries, 
                  blocker detection, and sentiment analysis—no meetings required.
                </p>
                <div className="pt-4">
                  <Button variant="ghost" className="group/btn text-primary hover:text-primary">
                    Learn more
                    <ArrowRightIcon className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Tall Feature Card */}
            <Card className="lg:row-span-2 p-8 flex flex-col justify-between group hover:border-primary/50 transition-all duration-300">
              <div className="space-y-4">
                <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary">
                  <BarChartIcon className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold">Real-time Analytics</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Burndown charts, velocity tracking, and team performance metrics—all updated in real-time.
                </p>
              </div>
              <div className="mt-8 aspect-square bg-gradient-to-br from-primary/5 to-primary/20 rounded-xl flex items-center justify-center">
                <BarChartIcon className="h-32 w-32 text-primary/30" />
              </div>
            </Card>

            {/* Regular Feature Cards */}
            <Card className="p-6 group hover:border-primary/50 transition-all duration-300">
              <div className="space-y-3">
                <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary">
                  <LightningBoltIcon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold">Blocker Detection</h3>
                <p className="text-muted-foreground text-sm">
                  Automatically identify and track blockers before they impact delivery.
                </p>
              </div>
            </Card>

            <Card className="p-6 group hover:border-primary/50 transition-all duration-300">
              <div className="space-y-3">
                <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary">
                  <CalendarIcon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold">Sprint Planning</h3>
                <p className="text-muted-foreground text-sm">
                  Data-driven sprint planning with velocity predictions and capacity planning.
                </p>
              </div>
            </Card>

            <Card className="md:col-span-2 p-6 group hover:border-primary/50 transition-all duration-300">
              <div className="space-y-3">
                <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary">
                  <MixerHorizontalIcon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold">Team Assistant</h3>
                <p className="text-muted-foreground">
                  Ask questions about your sprints and get contextual answers based on your team's data.
                </p>
              </div>
            </Card>

            <Card className="p-6 group hover:border-primary/50 transition-all duration-300">
              <div className="space-y-3">
                <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary">
                  <ReaderIcon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold">Documentation</h3>
                <p className="text-muted-foreground text-sm">
                  Auto-generate sprint reports and retrospective summaries.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Workflow Section - Timeline Style */}
      <section id="workflow" className="py-32 px-6 lg:px-8 bg-card/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple<span className="text-primary"> workflow</span>
            </h2>
            <p className="text-xl text-muted-foreground">Up and running in minutes</p>
          </div>

          <div className="space-y-12">
            {[
              {
                step: '01',
                title: 'Create Workspace',
                description: 'Sign up and invite your team. Configure your first sprint in under 2 minutes.',
                icon: <RocketIcon className="h-6 w-6" />
              },
              {
                step: '02',
                title: 'Daily Updates',
                description: 'Team members submit standup updates. The system generates summaries and flags blockers automatically.',
                icon: <ChatBubbleIcon className="h-6 w-6" />
              },
              {
                step: '03',
                title: 'Track & Ship',
                description: 'Monitor progress with real-time dashboards. Get insights to ship faster and improve continuously.',
                icon: <BarChartIcon className="h-6 w-6" />
              }
            ].map((item, index) => (
              <div key={index} className="flex gap-8 items-start group">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    {item.icon}
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <div className="text-sm font-mono text-primary mb-2">{item.step}</div>
                  <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to <span className="text-primary neon-glow">transform</span> your sprints?
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            Join teams shipping faster with intelligent sprint management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="group text-base px-8">
                Start Free Trial
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="text-base px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
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
            <div>
              <h3 className="font-semibold mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#workflow" className="hover:text-primary transition-colors">Workflow</a></li>
                <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 pt-8 text-sm text-center text-muted-foreground">
            © 2025 ScrumMaster Pro. Built with Next.js & TypeScript.
          </div>
        </div>
      </footer>
    </div>
  );
}
