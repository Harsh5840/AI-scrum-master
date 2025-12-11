'use client'

import { useState } from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExclamationTriangleIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import { useGetBlockersQuery, useCreateBlockerMutation, useResolveBlockerMutation } from "@/store/api/blockersApi";

export default function BlockersPage() {
  const { data: blockers = [], isLoading } = useGetBlockersQuery();
  const [createBlocker] = useCreateBlockerMutation();
  const [resolveBlocker] = useResolveBlockerMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<{
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    type: string;
  }>({
    description: '',
    severity: 'medium',
    type: 'technical'
  });

  const handleCreate = async () => {
    try {
      await createBlocker(formData).unwrap();
      setIsOpen(false);
      setFormData({ description: '', severity: 'medium' as const, type: 'technical' });
    } catch (error) {
      console.error('Failed to create blocker:', error);
    }
  };

  const handleResolve = async (id: number) => {
    try {
      await resolveBlocker(id).unwrap();
    } catch (error) {
      console.error('Failed to resolve blocker:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <MainLayout title="Blockers">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Blockers</h2>
            <p className="text-slate-600">Track and resolve team blockers</p>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ExclamationTriangleIcon className="mr-2 h-4 w-4" />
                Report Blocker
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Report a Blocker</DialogTitle>
                <DialogDescription>
                  Describe the issue blocking your progress.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g., API endpoint returning 500 error"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="severity">Severity</Label>
                  <select
                    id="severity"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value as 'low' | 'medium' | 'high' | 'critical' })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="technical">Technical</option>
                    <option value="dependency">Dependency</option>
                    <option value="resource">Resource</option>
                    <option value="external">External</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate}>Report Blocker</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Blockers</CardDescription>
              <CardTitle className="text-3xl">
                {blockers.filter(b => !b.resolved).length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Resolved This Week</CardDescription>
              <CardTitle className="text-3xl">
                {blockers.filter(b => b.resolved).length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>High Priority</CardDescription>
              <CardTitle className="text-3xl">
                {blockers.filter(b => b.severity === 'high' && !b.resolved).length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Blockers Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Blockers</CardTitle>
            <CardDescription>
              Current and resolved blockers from your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">Loading blockers...</TableCell>
                  </TableRow>
                ) : blockers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-center">
                        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No blockers</h3>
                        <p className="text-slate-600 mb-4">No blockers have been reported yet.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  blockers.map((blocker) => (
                    <TableRow key={blocker.id}>
                      <TableCell className="font-medium">{blocker.description}</TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(blocker.severity)}>
                          {blocker.severity.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {blocker.resolved ? (
                          <Badge className="bg-green-100 text-green-800 border-green-300">
                            <CheckCircledIcon className="mr-1 h-3 w-3" />
                            Resolved
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                            Active
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>Standup #{blocker.standupId || 'Manual'}</TableCell>
                      <TableCell>{new Date(blocker.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {!blocker.resolved && (
                          <Button size="sm" variant="outline" onClick={() => handleResolve(blocker.id)}>
                            Resolve
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
