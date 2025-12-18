'use client'

import { useState } from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { ExclamationTriangleIcon, CheckCircledIcon, PlusIcon } from "@radix-ui/react-icons";
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
      case 'critical': return 'bg-red-500/20 text-red-400';
      case 'high': return 'bg-orange-500/20 text-orange-400';
      case 'medium': return 'bg-amber-500/20 text-amber-400';
      case 'low': return 'bg-white/10 text-white/60';
      default: return 'bg-white/10 text-white/60';
    }
  };

  return (
    <MainLayout title="Blockers">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Blockers</h2>
            <p className="text-white/40 text-sm mt-1">Track and resolve team blockers</p>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white">
                <PlusIcon className="mr-2 h-4 w-4" />
                Report Blocker
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0a0a0f] border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white">Report a Blocker</DialogTitle>
                <DialogDescription className="text-white/50">
                  Describe the issue blocking your progress.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="description" className="text-white/70">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g., API endpoint returning 500 error"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="severity" className="text-white/70">Severity</Label>
                  <select
                    id="severity"
                    className="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-purple-500/50 focus:outline-none"
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value as 'low' | 'medium' | 'high' | 'critical' })}
                  >
                    <option value="low" className="bg-[#0a0a0f]">Low</option>
                    <option value="medium" className="bg-[#0a0a0f]">Medium</option>
                    <option value="high" className="bg-[#0a0a0f]">High</option>
                    <option value="critical" className="bg-[#0a0a0f]">Critical</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type" className="text-white/70">Type</Label>
                  <select
                    id="type"
                    className="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-purple-500/50 focus:outline-none"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="technical" className="bg-[#0a0a0f]">Technical</option>
                    <option value="dependency" className="bg-[#0a0a0f]">Dependency</option>
                    <option value="resource" className="bg-[#0a0a0f]">Resource</option>
                    <option value="external" className="bg-[#0a0a0f]">External</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)} className="border-white/10 text-white hover:bg-white/5">
                  Cancel
                </Button>
                <Button onClick={handleCreate} className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
                  Report Blocker
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-white/[0.02] border-white/5">
            <CardHeader className="pb-3">
              <CardDescription className="text-white/50">Active Blockers</CardDescription>
              <CardTitle className="text-3xl text-white">
                {blockers.filter(b => !b.resolved).length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-white/[0.02] border-white/5">
            <CardHeader className="pb-3">
              <CardDescription className="text-white/50">Resolved This Week</CardDescription>
              <CardTitle className="text-3xl text-emerald-400">
                {blockers.filter(b => b.resolved).length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-white/[0.02] border-white/5">
            <CardHeader className="pb-3">
              <CardDescription className="text-white/50">High Priority</CardDescription>
              <CardTitle className="text-3xl text-red-400">
                {blockers.filter(b => (b.severity === 'high' || b.severity === 'critical') && !b.resolved).length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Blockers Table */}
        <Card className="bg-white/[0.02] border-white/5">
          <CardHeader>
            <CardTitle className="text-white">All Blockers</CardTitle>
            <CardDescription className="text-white/40">
              Current and resolved blockers from your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-white/50">Description</TableHead>
                  <TableHead className="text-white/50">Severity</TableHead>
                  <TableHead className="text-white/50">Status</TableHead>
                  <TableHead className="text-white/50">Source</TableHead>
                  <TableHead className="text-white/50">Date</TableHead>
                  <TableHead className="text-white/50">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow className="border-white/5">
                    <TableCell colSpan={6} className="text-center text-white/40">Loading blockers...</TableCell>
                  </TableRow>
                ) : blockers.length === 0 ? (
                  <TableRow className="border-white/5">
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="text-center">
                        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-white/20 mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">No blockers</h3>
                        <p className="text-white/40 mb-4">No blockers have been reported yet.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  blockers.map((blocker) => (
                    <TableRow key={blocker.id} className="border-white/5 hover:bg-white/[0.02]">
                      <TableCell className="font-medium text-white">{blocker.description}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getSeverityColor(blocker.severity)}`}>
                          {blocker.severity.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>
                        {blocker.resolved ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400">
                            <CheckCircledIcon className="h-3 w-3" />
                            Resolved
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400">
                            Active
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-white/60">Standup #{blocker.standupId || 'Manual'}</TableCell>
                      <TableCell className="text-white/60">{new Date(blocker.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {!blocker.resolved && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleResolve(blocker.id)}
                            className="border-white/10 text-white/70 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30"
                          >
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
