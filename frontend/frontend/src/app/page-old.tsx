import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  RocketIcon, 
  LightningBoltIcon, 
  CheckCircledIcon,
  BarChartIcon,
  ChatBubbleIcon,
  CalendarIcon,
  ClockIcon,
  ReaderIcon,
  MixerHorizontalIcon
} from '@radix-ui/react-icons';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <RocketIcon className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold text-foreground">Scrum Master Pro</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground font-medium transition-colors">Features</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground font-medium transition-colors">How it Works</a>
              <a href="#benefits" className="text-muted-foreground hover:text-foreground font-medium transition-colors">Benefits</a>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/auth/login">
                <Button variant="ghost">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button>
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium">
                <LightningBoltIcon className="h-4 w-4" />
                <span>Smart Sprint Management</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Run sprints smarter, not harder
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Automate standups, track blockers, and get intelligent insights that help your team ship faster. 
                Built for agile teams who want results, not busywork.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/auth/signup">
                  <Button size="lg" className="w-full sm:w-auto px-8">
                    Start Free Trial
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto px-8">
                    See How It Works
                  </Button>
                </a>
              </div>

              <div className="flex items-center space-x-8 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <CheckCircledIcon className="h-5 w-5 text-success" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircledIcon className="h-5 w-5 text-success" />
                  <span>Setup in 5 minutes</span>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Placeholder for screenshot/demo - replace with actual image */}
              <div className="relative bg-gradient-to-br from-primary/10 to-accent rounded-2xl border border-border shadow-soft-lg aspect-[4/3] flex items-center justify-center overflow-hidden">
                <div className="relative z-10 text-muted-foreground text-center p-8">
                  <BarChartIcon className="h-24 w-24 mx-auto mb-4" />
                  <p className="text-lg font-medium">[Dashboard Screenshot]</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 lg:px-8 border-y border-border bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">60%</div>
              <div className="text-muted-foreground">Less time in meetings</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">90%</div>
              <div className="text-muted-foreground">Accurate sprint predictions</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">2x</div>
              <div className="text-muted-foreground">Faster blocker resolution</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Everything your team needs</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built-in tools and automation that eliminate repetitive work and surface actionable insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <ChatBubbleIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Automated Standups</h3>
              <p className="text-muted-foreground">
                Summarize team updates, identify blockers, and generate daily standup reports automatically.
              </p>
            </Card>

            <Card className="p-6">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <ReaderIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Sprint Planning</h3>
              <p className="text-muted-foreground">
                Get velocity predictions, workload balancing, and story point recommendations based on team history.
              </p>
            </Card>

            <Card className="p-6">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <LightningBoltIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Blocker Detection</h3>
              <p className="text-muted-foreground">
                Identify patterns in blockers and get suggested solutions before they derail your sprint.
              </p>
            </Card>

            <Card className="p-6">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChartIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Burndown & Velocity Charts</h3>
              <p className="text-muted-foreground">
                Real-time progress tracking with visual burndown charts and historical velocity analysis.
              </p>
            </Card>

            <Card className="p-6">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <CalendarIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sprint Timeline</h3>
              <p className="text-muted-foreground">
                Plan sprints, set milestones, and track progress across multiple teams in one unified view.
              </p>
            </Card>

            <Card className="p-6">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MixerHorizontalIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Team Assistant</h3>
              <p className="text-muted-foreground">
                Ask questions about your sprint and get contextual answers based on your team's data and history.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 lg:px-8 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">How it works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get up and running in minutes. No complex setup or learning curve.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="h-16 w-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Create Your Workspace</h3>
              <p className="text-muted-foreground">
                Sign up, invite your team, and configure your first sprint in under 5 minutes.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Run Daily Standups</h3>
              <p className="text-muted-foreground">
                Team members submit updates. The system automatically generates summaries and flags blockers.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Smart Insights</h3>
              <p className="text-muted-foreground">
                Review recommendations, track velocity, and ship better software faster.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Built for modern engineering teams</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircledIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Less meeting overhead</h3>
                    <p className="text-slate-600">Async standups mean your team spends less time in meetings and more time building.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircledIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Data-driven decisions</h3>
                    <p className="text-slate-600">Make sprint commitments based on actual velocity and team capacity, not gut feeling.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircledIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Spot problems early</h3>
                    <p className="text-slate-600">AI detects blocker patterns and sentiment shifts before they impact delivery.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircledIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Full transparency</h3>
                    <p className="text-slate-600">Everyone sees progress, blockers, and sprint health in real-time dashboards.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Placeholder for second visual - replace with actual image */}
              <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl shadow-xl aspect-square flex items-center justify-center">
                <div className="text-center p-8">
                  <ClockIcon className="h-24 w-24 mx-auto text-slate-400 mb-4" />
                  <p className="text-slate-600 font-medium">[Sprint Progress Screenshot Placeholder]</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-8 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-4">Ready to ship faster?</h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Join engineering teams running better sprints and delivering more value.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-background text-primary hover:bg-background/90 w-full sm:w-auto px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 w-full sm:w-auto px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-8 bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 text-white mb-4">
                <RocketIcon className="h-6 w-6" />
                <span className="font-bold text-lg">Scrum Master Pro</span>
              </div>
              <p className="text-sm">
                Intelligent sprint management for modern teams.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-sm text-center">
            © 2025 Scrum Master Pro. Built with TypeScript, Next.js, and intelligent automation.
          </div>
        </div>
      </footer>
    </div>
  );
}
