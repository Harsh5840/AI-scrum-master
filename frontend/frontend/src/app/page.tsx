'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { loginUser, signupUser } from '@/store/slices/authSlice';
import { useToast } from '@/hooks/use-toast';
import { 
  RocketIcon, 
  LightningBoltIcon, 
  CheckCircledIcon,
  EnvelopeClosedIcon,
  LockClosedIcon,
  PersonIcon
} from '@radix-ui/react-icons';

export default function HomePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await dispatch(loginUser({ email: formData.email, password: formData.password })).unwrap();
        toast({
          title: "Welcome back!",
          description: "Successfully logged in",
          variant: "success",
        });
      } else {
        await dispatch(signupUser({ email: formData.email, password: formData.password, name: formData.name })).unwrap();
        toast({
          title: "Account created!",
          description: "Welcome to AI Scrum Master",
          variant: "success",
        });
      }
      router.push('/dashboard');
    } catch (err: any) {
      const errorMsg = err || 'Authentication failed';
      setError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-violet-50/20 flex">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-white">
            <RocketIcon className="h-8 w-8" />
            <span className="text-2xl font-bold">AI Scrum Master</span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
              Ship faster with<br />AI-powered agile
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed max-w-md">
              Intelligent sprint planning, automated insights, and seamless team collaboration.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3 text-white">
              <div className="rounded-lg bg-blue-500/30 p-2 mt-1">
                <LightningBoltIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">AI-Powered Insights</h3>
                <p className="text-blue-100">Get intelligent recommendations and predictions</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 text-white">
              <div className="rounded-lg bg-blue-500/30 p-2 mt-1">
                <CheckCircledIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Smart Automation</h3>
                <p className="text-blue-100">Automate standup summaries and sprint analysis</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 text-white">
              <div className="rounded-lg bg-blue-500/30 p-2 mt-1">
                <RocketIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Team Productivity</h3>
                <p className="text-blue-100">Track progress and identify blockers instantly</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-blue-200 text-sm">
          © 2025 AI Scrum Master. Built with Next.js & OpenAI
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="flex items-center justify-center space-x-2 text-blue-600 mb-2">
              <RocketIcon className="h-7 w-7" />
              <span className="text-2xl font-bold">AI Scrum Master</span>
            </div>
            <p className="text-slate-600">Ship faster with AI-powered agile</p>
          </div>

          <Card className="border-slate-200 shadow-xl">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-slate-900">
                {isLogin ? 'Welcome back' : 'Create account'}
              </CardTitle>
              <CardDescription className="text-slate-600">
                {isLogin 
                  ? 'Sign in to your account to continue' 
                  : 'Start managing your sprints with AI'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start space-x-2">
                  <div className="flex-1 text-sm">{error}</div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700 font-medium">Full Name</Label>
                    <div className="relative">
                      <PersonIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="name"
                        className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
                  <div className="relative">
                    <EnvelopeClosedIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type="password"
                      className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all h-11 font-medium" 
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Please wait...</span>
                    </div>
                  ) : (
                    <>{isLogin ? 'Sign In' : 'Create Account'}</>
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-500">Or continue with</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full border-slate-300 hover:bg-slate-50 h-11 font-medium"
                onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </Button>

              <div className="text-center text-sm">
                <button 
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setFormData({ email: '', password: '', name: '' });
                  }} 
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              </div>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs text-slate-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
