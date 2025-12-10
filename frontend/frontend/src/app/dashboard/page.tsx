'use client'

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetSprintsQuery } from "@/store/api/sprintsApi";
import { useGetQueueStatusQuery } from "@/store/api/workflowsApi";
import Link from "next/link";
import { 
  RocketIcon, 
  CalendarIcon, 
  ChatBubbleIcon, 
  LightningBoltIcon,
  BarChartIcon,
  StarIcon,
  ArrowRightIcon,
  DashboardIcon,
  PersonIcon,
  MagicWandIcon
} from "@radix-ui/react-icons";
import { useAppSelector } from "@/store/hooks";

export default function Home() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: sprints, isLoading: sprintsLoading } = useGetSprintsQuery({}, {
    skip: !isAuthenticated,
    refetchOnMountOrArgChange: true,
  });
  const { data: queueStatus } = useGetQueueStatusQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval: 0,
  });

  const activeSprints = sprints?.filter(sprint => {
    const now = new Date();
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    return startDate <= now && endDate >= now;
  }) || [];

  const calculateSprintProgress = (sprint: any) => {
    const now = new Date().getTime();
    const start = new Date(sprint.startDate).getTime();
    const end = new Date(sprint.endDate).getTime();
    const total = end - start;
    const elapsed = now - start;
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  };

  const averageProgress = activeSprints.length > 0 
    ? activeSprints.reduce((acc, sprint) => acc + calculateSprintProgress(sprint), 0) / activeSprints.length 
    : 0;

  return (
    <ProtectedRoute>
      <MainLayout title="Dashboard">
        <div className="space-y-8">
        {/* Hero Section - Jira/Linear Inspired */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-10 text-white shadow-lg">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-md bg-blue-500/30 px-3 py-1.5 backdrop-blur-sm border border-blue-400/30">
                  <MagicWandIcon className="mr-2 h-4 w-4 text-blue-200" />
                  <span className="text-sm font-medium text-blue-100">AI-Powered Agile Management</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight">
                  Ship faster with AI
                </h1>
                <p className="text-lg text-blue-100 max-w-xl leading-relaxed">
                  Plan sprints, track progress, and get intelligent insights to keep your team moving forward.
                </p>
                <div className="flex gap-3 pt-2">
                  <Link href="/sprints">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all">
                      <RocketIcon className="mr-2 h-5 w-5" />
                      New Sprint
                    </Button>
                  </Link>
                  <Link href="/ai-insights">
                    <Button size="lg" variant="outline" className="border-blue-300/50 text-white hover:bg-blue-500/20 hover:border-blue-300 transition-all">
                      <LightningBoltIcon className="mr-2 h-5 w-5" />
                      AI Insights
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="relative h-48 w-48 opacity-20">
                  <DashboardIcon className="h-full w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards - Linear/Monday.com Style */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border border-slate-200 bg-white hover:shadow-md transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">Active Sprints</CardTitle>
              <div className="rounded-lg bg-blue-50 p-2.5">
                <CalendarIcon className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {sprintsLoading ? '...' : activeSprints.length}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Currently in progress
              </p>
              <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                  style={{ width: `${averageProgress}%` }} 
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 bg-white hover:shadow-md transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">Total Sprints</CardTitle>
              <div className="rounded-lg bg-emerald-50 p-2.5">
                <BarChartIcon className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {sprintsLoading ? '...' : sprints?.length || 0}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                All time count
              </p>
              {/* Removed meaningless progress bar */}
            </CardContent>
          </Card>

          <Card className="border border-slate-200 bg-white hover:shadow-md transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">AI Workflows</CardTitle>
              <div className="rounded-lg bg-violet-50 p-2.5">
                <LightningBoltIcon className="h-4 w-4 text-violet-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {queueStatus ? (queueStatus.active + queueStatus.waiting) : 0}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Active & queued jobs
              </p>
              {/* Removed meaningless progress bar */}
            </CardContent>
          </Card>

          <Card className="border border-slate-200 bg-white hover:shadow-md transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">Standups</CardTitle>
              <div className="rounded-lg bg-amber-50 p-2.5">
                <ChatBubbleIcon className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">0</div>
              <p className="text-xs text-slate-500 mt-1">
                Completed today
              </p>
              {/* Removed meaningless progress bar */}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid - Notion/Linear Inspired */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 border border-slate-200 bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-900">Recent Activity</CardTitle>
                  <CardDescription className="mt-1 text-sm text-slate-500">
                    Latest updates from your team
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  View All <ArrowRightIcon className="ml-1 h-3.5 w-3.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeSprints.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-xl bg-slate-50 p-5 mb-4 border border-slate-200">
                      <CalendarIcon className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 mb-1">No active sprints</h3>
                    <p className="text-sm text-slate-500 mb-4 max-w-sm">
                      Create your first sprint to start tracking progress and see activity here.
                    </p>
                    <Link href="/sprints">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                        <RocketIcon className="mr-2 h-4 w-4" />
                        Create Sprint
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeSprints.map((sprint) => (
                      <div key={sprint.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-200 hover:bg-blue-50/50 transition-all group">
                        <div className="rounded-md bg-blue-100 p-2 group-hover:bg-blue-200 transition-colors">
                          <CalendarIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 truncate">{sprint.name}</p>
                          <p className="text-xs text-slate-500">In Progress</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3 border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-violet-50/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
                <div className="rounded-lg bg-violet-100 p-1.5 mr-2">
                  <LightningBoltIcon className="h-4 w-4 text-violet-600" />
                </div>
                AI Insights
              </CardTitle>
              <CardDescription className="text-slate-600">
                Intelligent recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="rounded-lg bg-white border border-violet-100 p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="rounded-md bg-violet-100 p-2 mt-0.5">
                      <StarIcon className="h-4 w-4 text-violet-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900 text-sm mb-1">Get Started</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        AI insights will appear as you create sprints and add standup updates.
                      </p>
                    </div>
                  </div>
                </div>
                <Link href="/ai-insights">
                  <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white shadow-sm">
                    <MagicWandIcon className="mr-2 h-4 w-4" />
                    Explore AI Features
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions - Jira/Asana Style */}
        <Card className="border border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">Quick Actions</CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Common tasks to get you started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <Link href="/sprints">
                <Button 
                  variant="outline" 
                  className="h-24 flex-col w-full border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                >
                  <div className="rounded-lg bg-blue-100 p-2.5 mb-2 group-hover:bg-blue-200 transition-colors">
                    <CalendarIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-slate-900">New Sprint</span>
                </Button>
              </Link>
              <Link href="/standups">
                <Button 
                  variant="outline" 
                  className="h-24 flex-col w-full border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all group"
                >
                  <div className="rounded-lg bg-emerald-100 p-2.5 mb-2 group-hover:bg-emerald-200 transition-colors">
                    <ChatBubbleIcon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="font-medium text-slate-900">Add Standup</span>
                </Button>
              </Link>
              <Link href="/ai-insights">
                <Button 
                  variant="outline" 
                  className="h-24 flex-col w-full border-slate-200 hover:border-violet-300 hover:bg-violet-50 transition-all group"
                >
                  <div className="rounded-lg bg-violet-100 p-2.5 mb-2 group-hover:bg-violet-200 transition-colors">
                    <LightningBoltIcon className="h-5 w-5 text-violet-600" />
                  </div>
                  <span className="font-medium text-slate-900">AI Insights</span>
                </Button>
              </Link>
              <Link href="/analytics">
                <Button 
                  variant="outline" 
                  className="h-24 flex-col w-full border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition-all group"
                >
                  <div className="rounded-lg bg-amber-100 p-2.5 mb-2 group-hover:bg-amber-200 transition-colors">
                    <BarChartIcon className="h-5 w-5 text-amber-600" />
                  </div>
                  <span className="font-medium text-slate-900">Analytics</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
    </ProtectedRoute>
  );
}

