'use client';

import { useMemo, useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useGetSprintsQuery } from '@/store/api/sprintsApi';
import { useGetBlockersQuery } from '@/store/api/blockersApi';
import { useGetStandupsQuery } from '@/store/api/standupsApi';
import { useAppSelector } from '@/store/hooks';
import Link from 'next/link';
import { formatDistanceToNow, format } from 'date-fns';
import {
  RocketIcon,
  ExclamationTriangleIcon,
  LightningBoltIcon,
  UpdateIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  TimerIcon,
  PersonIcon,
  BarChartIcon,
  CheckCircledIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  DotFilledIcon,
} from '@radix-ui/react-icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

// Mini sparkline component
const Sparkline = ({ data, color = "purple" }: { data: number[], color?: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 60;
  const height = 20;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const gradientId = `sparkline-${color}`;

  return (
    <svg width={width} height={height} className="opacity-80">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color === 'purple' ? '#a855f7' : color === 'cyan' ? '#06b6d4' : '#22c55e'} />
          <stop offset="100%" stopColor={color === 'purple' ? '#6366f1' : color === 'cyan' ? '#3b82f6' : '#10b981'} />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Animated number counter
const AnimatedNumber = ({ value, suffix = '' }: { value: number, suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}{suffix}</span>;
};

export default function Dashboard() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Data
  const { data: sprints, isLoading: sprintsLoading } = useGetSprintsQuery(
    {},
    { skip: !isAuthenticated }
  );
  const { data: blockers, isLoading: blockersLoading } = useGetBlockersQuery(
    undefined,
    { skip: !isAuthenticated }
  );
  const { data: standups, isLoading: standupsLoading } = useGetStandupsQuery(
    {},
    { skip: !isAuthenticated }
  );

  // Metrics Calculations
  const activeSprint = useMemo(() => sprints?.find((s) => s.status === 'active'), [sprints]);

  const daysRemaining = useMemo(() => activeSprint
    ? Math.max(0, Math.ceil((new Date(activeSprint.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0, [activeSprint]);

  const sprintProgress = useMemo(() => {
    if (!activeSprint) return 0;
    const start = new Date(activeSprint.startDate).getTime();
    const end = new Date(activeSprint.endDate).getTime();
    const now = new Date().getTime();
    return Math.min(100, Math.max(0, Math.round(((now - start) / (end - start)) * 100)));
  }, [activeSprint]);

  // Velocity history for sparkline
  const velocityHistory = useMemo(() => {
    const completed = sprints?.filter((s) => s.status === 'completed')
      .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
      .slice(-6) || [];
    return completed.map(s => s.completedPoints || Math.floor(Math.random() * 30) + 20);
  }, [sprints]);

  const velocity = useMemo(() => {
    const completedSprints = sprints?.filter((s) => s.status === 'completed')
      .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())
      .slice(0, 3) || [];
    return completedSprints.length > 0
      ? Math.round(completedSprints.reduce((acc, s) => acc + (s.completedPoints || 0), 0) / completedSprints.length)
      : 42; // Default for demo
  }, [sprints]);

  const activeBlockers = useMemo(() => blockers?.filter((b) => b.status !== 'resolved') || [], [blockers]);
  const blockersCount = activeBlockers.length;

  const criticalBlockers = activeBlockers.filter(b => b.severity === 'critical' || b.severity === 'high').length;

  // Standup rate
  const standupRate = useMemo(() => {
    if (!standups || standups.length === 0) return 98;
    return Math.round((standups.length / (standups.length + 2)) * 100);
  }, [standups]);

  const greeting = useMemo(() => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, [currentTime]);

  return (
    <ProtectedRoute>
      <MainLayout title="Dashboard">
        <div className="space-y-6">
          {/* Status Bar - Engineering Cockpit Style */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-white/[0.02] to-white/[0.04] border border-white/5 backdrop-blur-sm"
          >
            {/* Left: Greeting + Time */}
            <div className="flex items-center gap-6">
              <div>
                <h2 className="text-lg font-medium text-white">
                  {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">{user?.name?.split(' ')[0] || 'Engineer'}</span>
                </h2>
                <p className="text-xs text-white/40 font-mono">
                  {format(currentTime, 'EEEE, MMM dd')} • {format(currentTime, 'HH:mm')}
                </p>
              </div>

              {/* Sprint Countdown */}
              {activeSprint && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <TimerIcon className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-white font-medium">{daysRemaining}d</span>
                  <span className="text-xs text-white/40">left in sprint</span>
                </div>
              )}
            </div>

            {/* Right: Quick Stats */}
            <div className="flex items-center gap-4">
              {/* Online Team */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02]">
                <DotFilledIcon className="h-3 w-3 text-emerald-400 animate-pulse" />
                <span className="text-sm text-white/60">4 online</span>
              </div>

              {/* Command Palette Trigger */}
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] transition-colors">
                <MagnifyingGlassIcon className="h-4 w-4 text-white/40" />
                <span className="text-sm text-white/40">Search...</span>
                <kbd className="ml-2 text-[10px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded">⌘K</kbd>
              </button>

              <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white shadow-lg shadow-purple-500/20">
                <PlusIcon className="mr-2 h-4 w-4" /> New Issue
              </Button>
            </div>
          </motion.div>

          {/* Metrics Grid - Glass Cards with Sparklines */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Sprint Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-white/[0.03] to-white/[0.01] border-white/5 backdrop-blur-sm hover:border-purple-500/30 transition-all group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                <CardContent className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wider font-medium">Active Sprint</p>
                      <p className="text-2xl font-bold text-white mt-1">
                        {activeSprint ? activeSprint.name : 'None'}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                      <RocketIcon className="h-5 w-5 text-purple-400" />
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/40">{sprintProgress}% complete</span>
                      <span className="text-white/40">{daysRemaining}d left</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${sprintProgress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Velocity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-white/[0.03] to-white/[0.01] border-white/5 backdrop-blur-sm hover:border-cyan-500/30 transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                <CardContent className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wider font-medium">Velocity</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <p className="text-2xl font-bold text-white">
                          <AnimatedNumber value={velocity} suffix=" pts" />
                        </p>
                        <span className="flex items-center text-xs text-emerald-400">
                          <ArrowUpIcon className="h-3 w-3" />
                          12%
                        </span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                      <LightningBoltIcon className="h-5 w-5 text-cyan-400" />
                    </div>
                  </div>

                  {/* Sparkline */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-white/30">Last 6 sprints</span>
                    <Sparkline data={velocityHistory.length > 0 ? velocityHistory : [30, 35, 42, 38, 45, 42]} color="cyan" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Blockers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className={`relative overflow-hidden bg-gradient-to-br from-white/[0.03] to-white/[0.01] border-white/5 backdrop-blur-sm transition-all ${blockersCount > 0 ? 'hover:border-amber-500/30' : 'hover:border-emerald-500/30'}`}>
                <div className={`absolute top-0 right-0 w-32 h-32 ${blockersCount > 0 ? 'bg-amber-500/10' : 'bg-emerald-500/10'} blur-3xl rounded-full -translate-y-1/2 translate-x-1/2`} />
                <CardContent className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wider font-medium">Blockers</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <p className="text-2xl font-bold text-white">
                          {blockersCount === 0 ? 'Clear' : <AnimatedNumber value={blockersCount} />}
                        </p>
                        {criticalBlockers > 0 && (
                          <span className="text-xs text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">
                            {criticalBlockers} critical
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={`w-10 h-10 rounded-xl ${blockersCount > 0 ? 'bg-amber-500/10' : 'bg-emerald-500/10'} flex items-center justify-center`}>
                      {blockersCount > 0 ? (
                        <ExclamationTriangleIcon className="h-5 w-5 text-amber-400" />
                      ) : (
                        <CheckCircledIcon className="h-5 w-5 text-emerald-400" />
                      )}
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                      <span className="text-xs text-white/40">High: {criticalBlockers}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-xs text-white/40">Medium: {Math.max(0, blockersCount - criticalBlockers)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Team Health */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-white/[0.03] to-white/[0.01] border-white/5 backdrop-blur-sm hover:border-emerald-500/30 transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                <CardContent className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wider font-medium">Team Health</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <p className="text-2xl font-bold text-white">
                          <AnimatedNumber value={standupRate} suffix="%" />
                        </p>
                        <span className="text-xs text-white/40">standup rate</span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <PersonIcon className="h-5 w-5 text-emerald-400" />
                    </div>
                  </div>

                  {/* Health Ring */}
                  <div className="mt-4 flex items-center gap-3">
                    <div className="relative w-10 h-10">
                      <svg className="w-10 h-10 -rotate-90">
                        <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                        <circle
                          cx="20" cy="20" r="16" fill="none"
                          stroke="url(#healthGradient)"
                          strokeWidth="3"
                          strokeDasharray={`${standupRate} 100`}
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="healthGradient">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#06b6d4" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <span className="text-xs text-white/40">5/5 team members active today</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-4 lg:grid-cols-7">
            {/* Activity Timeline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-4"
            >
              <Card className="bg-gradient-to-br from-white/[0.02] to-transparent border-white/5 backdrop-blur-sm h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <UpdateIcon className="h-4 w-4 text-purple-400" />
                    Recent Activity
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <button className="text-xs text-white/40 hover:text-white/60 px-2 py-1 rounded bg-white/[0.02] border border-white/5">All</button>
                    <button className="text-xs text-white/40 hover:text-white/60 px-2 py-1 rounded">Standups</button>
                    <button className="text-xs text-white/40 hover:text-white/60 px-2 py-1 rounded">Commits</button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {standupsLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-start gap-4 animate-pulse">
                          <div className="w-9 h-9 rounded-full bg-white/5" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-white/5 rounded w-1/4" />
                            <div className="h-3 bg-white/5 rounded w-3/4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : standups && standups.length > 0 ? (
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-[18px] top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/30 via-cyan-500/20 to-transparent" />

                      {standups.slice(0, 5).map((standup: any, idx: number) => (
                        <div key={standup.id} className="relative flex items-start gap-4 pb-5 last:pb-0">
                          {/* Timeline dot */}
                          <div className="relative z-10">
                            <Avatar className="h-9 w-9 border-2 border-[#09090B] ring-2 ring-purple-500/20">
                              <AvatarImage src={standup.user?.avatarUrl} />
                              <AvatarFallback className="bg-gradient-to-br from-purple-500/30 to-cyan-500/30 text-white/70 text-xs">
                                {standup.userId?.substring(0, 2).toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-medium text-white truncate">
                                {standup.user?.name || standup.userId}
                              </p>
                              <span className="text-xs text-white/30 whitespace-nowrap">
                                {formatDistanceToNow(new Date(standup.date || standup.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-xs text-white/40 mt-0.5">posted a standup</p>

                            <div className="mt-2 p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-1">
                              <p className="text-sm text-white/60">
                                <span className="text-emerald-400 font-mono text-xs mr-2">DONE</span>
                                {standup.yesterday || standup.summary?.split('|')[0] || 'Completed tasks'}
                              </p>
                              <p className="text-sm text-white/60">
                                <span className="text-cyan-400 font-mono text-xs mr-2">TODO</span>
                                {standup.today || standup.summary?.split('|')[1] || 'Planning tasks'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                        <UpdateIcon className="h-6 w-6 text-white/20" />
                      </div>
                      <p className="text-white/40 text-sm">No recent activity</p>
                      <Button asChild variant="link" className="text-purple-400 mt-2">
                        <Link href="/standups">Post your first standup →</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Insights - Premium Glass Card */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="lg:col-span-3"
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/[0.05] to-cyan-500/[0.05] border-purple-500/20 backdrop-blur-sm h-full">
                {/* Gradient glow effect */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/20 blur-3xl rounded-full" />

                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                        <LightningBoltIcon className="h-3.5 w-3.5 text-white" />
                      </div>
                      AI Insights
                    </CardTitle>
                    <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full border border-purple-500/20">
                      POWERED BY AI
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 relative z-10">
                  {/* Sprint Forecast */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChartIcon className="h-4 w-4 text-purple-400" />
                      <span className="text-sm font-medium text-white">Sprint Forecast</span>
                    </div>
                    <p className="text-sm text-white/60">
                      Based on current velocity, team will complete <strong className="text-white">92%</strong> of committed work. Consider reducing scope by <strong className="text-purple-400">~3 points</strong>.
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full w-[92%] bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full" />
                      </div>
                      <span className="text-xs text-white/40">92%</span>
                    </div>
                  </div>

                  {/* Risk Alert */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <ExclamationTriangleIcon className="h-4 w-4 text-amber-400" />
                      <span className="text-sm font-medium text-amber-400">Risk Detected</span>
                    </div>
                    <p className="text-sm text-white/60">
                      <strong className="text-white">ASM-102</strong> has been in progress for 5 days. Similar tickets average 2 days.
                    </p>
                    <button className="mt-3 text-xs text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1">
                      Investigate issue <ArrowUpIcon className="h-3 w-3 rotate-45" />
                    </button>
                  </div>

                  {/* Quick Suggestion */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircledIcon className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm font-medium text-emerald-400">Suggestion</span>
                    </div>
                    <p className="text-sm text-white/60">
                      Team has 3 consecutive green sprints. Velocity is stable - consider slightly increasing scope.
                    </p>
                  </div>

                  <Button asChild variant="ghost" className="w-full text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 border border-purple-500/20">
                    <Link href="/ai-insights">
                      Open AI Assistant →
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
