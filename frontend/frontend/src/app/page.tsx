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
              <RocketIcon className="h-7 w-7 text-blue-600" />
              <span className="text-xl font-bold text-slate-900">AI Scrum Master</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Features</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">How it Works</a>
              <a href="#benefits" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Benefits</a>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-slate-700 hover:text-slate-900">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-24 px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50/40 to-violet-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                <LightningBoltIcon className="h-4 w-4" />
                <span>Powered by AI</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Run sprints smarter, not harder
              </h1>
              
              <p className="text-xl text-slate-600 leading-relaxed">
                Automate standups, track blockers, and get intelligent insights that help your team ship faster. 
                Built for agile teams who want results, not busywork.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/auth/signup">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg w-full sm:w-auto text-base px-8">
                    Start Free Trial
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 w-full sm:w-auto text-base px-8">
                    See How It Works
                  </Button>
                </a>
              </div>

              <div className="flex items-center space-x-8 pt-4 text-sm text-slate-600">
                <div className="flex items-center space-x-2">
                  <CheckCircledIcon className="h-5 w-5 text-green-600" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircledIcon className="h-5 w-5 text-green-600" />
                  <span>Setup in 5 minutes</span>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Placeholder for screenshot/demo - replace with actual image */}
              <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-2xl aspect-[4/3] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
                <div className="relative z-10 text-white/90 text-center p-8">
                  <BarChartIcon className="h-24 w-24 mx-auto mb-4" />
                  <p className="text-lg font-medium">[Dashboard Screenshot Placeholder]</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 lg:px-8 border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">60%</div>
              <div className="text-slate-600">Less time in meetings</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">90%</div>
              <div className="text-slate-600">Accurate sprint predictions</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">2x</div>
              <div className="text-slate-600">Faster blocker resolution</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Everything your team needs</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Built-in tools and automation that eliminate repetitive work and surface actionable insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 border-slate-200 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <ChatBubbleIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Automated Standups</h3>
              <p className="text-slate-600">
                AI summarizes team updates, identifies blockers, and generates daily standup reports automatically.
              </p>
            </Card>

            <Card className="p-6 border-slate-200 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <ReaderIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Smart Sprint Planning</h3>
              <p className="text-slate-600">
                Get velocity predictions, workload balancing, and story point recommendations based on team history.
              </p>
            </Card>

            <Card className="p-6 border-slate-200 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <LightningBoltIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Blocker Detection</h3>
              <p className="text-slate-600">
                Identify patterns in blockers and get suggested solutions before they derail your sprint.
              </p>
            </Card>

            <Card className="p-6 border-slate-200 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <BarChartIcon className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Burndown & Velocity Charts</h3>
              <p className="text-slate-600">
                Real-time progress tracking with visual burndown charts and historical velocity analysis.
              </p>
            </Card>

            <Card className="p-6 border-slate-200 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <CalendarIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Sprint Timeline</h3>
              <p className="text-slate-600">
                Plan sprints, set milestones, and track progress across multiple teams in one unified view.
              </p>
            </Card>

            <Card className="p-6 border-slate-200 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <MixerHorizontalIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">RAG-Powered Q&A</h3>
              <p className="text-slate-600">
                Ask questions about your sprint and get contextual answers based on your team's data and history.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How it works</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get up and running in minutes. No complex setup or learning curve.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Create Your Workspace</h3>
              <p className="text-slate-600">
                Sign up, invite your team, and configure your first sprint in under 5 minutes.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Run Daily Standups</h3>
              <p className="text-slate-600">
                Team members submit updates. AI automatically generates summaries and flags blockers.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Get Smart Insights</h3>
              <p className="text-slate-600">
                Review AI-powered recommendations, track velocity, and ship better software faster.
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
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to ship faster?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join engineering teams using AI to run better sprints and deliver more value.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg w-full sm:w-auto text-base px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 w-full sm:w-auto text-base px-8">
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
                <span className="font-bold text-lg">AI Scrum Master</span>
              </div>
              <p className="text-sm">
                Intelligent sprint management powered by AI.
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
            © 2025 AI Scrum Master. Built with TypeScript, Next.js, and Google Gemini.
          </div>
        </div>
      </footer>
    </div>
  );
}
