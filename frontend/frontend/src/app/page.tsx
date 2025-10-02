'use client'

import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetSprintsQuery } from "@/store/api/sprintsApi";
import { useGetQueueStatusQuery } from "@/store/api/workflowsApi";
import { 
  RocketIcon, 
  CalendarIcon, 
  ChatBubbleIcon, 
  LightningBoltIcon,
  BarChartIcon,
  ExclamationTriangleIcon 
} from "@radix-ui/react-icons";

export default function Home() {
  const { data: sprints, isLoading: sprintsLoading } = useGetSprintsQuery({});
  const { data: queueStatus, isLoading: queueLoading } = useGetQueueStatusQuery();

  const activeSprints = sprints?.filter(sprint => {
    const now = new Date();
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    return startDate <= now && endDate >= now;
  }) || [];

  return (
    <MainLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome to AI Scrum Master</h1>
            <p className="text-muted-foreground">
              Your intelligent project management companion
            </p>
          </div>
          <Button>
            <RocketIcon className="mr-2 h-4 w-4" />
            Quick Start
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sprints</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sprintsLoading ? '...' : activeSprints.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently running
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sprints</CardTitle>
              <BarChartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sprintsLoading ? '...' : sprints?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                All time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Workflows</CardTitle>
              <LightningBoltIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {queueLoading ? '...' : '0'}
              </div>
              <p className="text-xs text-muted-foreground">
                Processing
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Standups</CardTitle>
              <ChatBubbleIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Today
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates from your sprints and team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">No recent activity</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Start by creating your first sprint or standup to see activity here.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
              <CardDescription>
                AI-powered recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <LightningBoltIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">No insights available</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  AI insights will appear as you add standups and sprint data.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Get started with common tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-20 flex-col">
                <CalendarIcon className="mb-2 h-6 w-6" />
                Create Sprint
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <ChatBubbleIcon className="mb-2 h-6 w-6" />
                Add Standup
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <LightningBoltIcon className="mb-2 h-6 w-6" />
                View AI Insights
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <BarChartIcon className="mb-2 h-6 w-6" />
                Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
