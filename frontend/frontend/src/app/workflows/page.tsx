'use client'

import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RocketIcon, ClockIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import { useGetQueueStatusQuery } from "@/store/api/workflowsApi";

export default function WorkflowsPage() {
  const { data: queueStatus, isLoading } = useGetQueueStatusQuery();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
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

  const totalJobs = (queueStatus?.waiting || 0) + (queueStatus?.active || 0) + (queueStatus?.completed || 0) + (queueStatus?.failed || 0);

  return (
    <MainLayout title="Workflows">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">AI Workflows</h2>
            <p className="text-slate-600">Automated AI-powered task processing</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Jobs</CardDescription>
              <CardTitle className="text-3xl">{isLoading ? '...' : totalJobs}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active</CardDescription>
              <CardTitle className="text-3xl text-blue-600">
                {isLoading ? '...' : queueStatus?.active || 0}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Completed</CardDescription>
              <CardTitle className="text-3xl text-green-600">
                {isLoading ? '...' : queueStatus?.completed || 0}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Failed</CardDescription>
              <CardTitle className="text-3xl text-red-600">
                {isLoading ? '...' : queueStatus?.failed || 0}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Empty State */}
        {!isLoading && totalJobs === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <RocketIcon className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No workflows yet</h3>
              <p className="text-slate-600 mb-4">AI workflows will appear here when you enable AI features like sprint planning assistance, standup analysis, and risk assessment.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
