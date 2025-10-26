'use client'

import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RocketIcon, ClockIcon, CheckCircledIcon } from "@radix-ui/react-icons";

export default function WorkflowsPage() {
  // Mock data - replace with actual API calls
  const workflows = [
    {
      id: 1,
      name: "Sprint Planning AI",
      type: "sprint-planning",
      status: "completed" as const,
      lastRun: "2025-10-26 14:30",
      duration: "2.5 minutes",
    },
    {
      id: 2,
      name: "Daily Standup Analysis",
      type: "standup-analysis",
      status: "running" as const,
      lastRun: "2025-10-27 09:00",
      duration: "Running...",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">
          <ClockIcon className="mr-1 h-3 w-3" /> Running
        </Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-300">
          <CheckCircledIcon className="mr-1 h-3 w-3" /> Completed
        </Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Failed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <MainLayout title="Workflows">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">AI Workflows</h2>
            <p className="text-slate-600">Automated AI-powered task processing</p>
          </div>
          <Button className="bg-violet-600 hover:bg-violet-700">
            <RocketIcon className="mr-2 h-4 w-4" />
            New Workflow
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Workflows</CardDescription>
              <CardTitle className="text-3xl">{workflows.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Running</CardDescription>
              <CardTitle className="text-3xl text-blue-600">
                {workflows.filter(w => w.status === 'running').length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Completed Today</CardDescription>
              <CardTitle className="text-3xl text-green-600">
                {workflows.filter(w => w.status === 'completed').length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Failed</CardDescription>
              <CardTitle className="text-3xl text-red-600">0</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Workflows List */}
        <div className="grid gap-4">
          {workflows.map((workflow) => (
            <Card key={workflow.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-lg bg-violet-100 p-2">
                      <RocketIcon className="h-5 w-5 text-violet-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{workflow.name}</CardTitle>
                      <CardDescription className="mt-1">
                        Type: {workflow.type}
                      </CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(workflow.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Last run: {workflow.lastRun}</span>
                  <span>Duration: {workflow.duration}</span>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {workflows.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <RocketIcon className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No workflows yet</h3>
              <p className="text-slate-600 mb-4">Create your first AI workflow to automate your scrum processes</p>
              <Button className="bg-violet-600 hover:bg-violet-700">
                <RocketIcon className="mr-2 h-4 w-4" />
                Create Workflow
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
