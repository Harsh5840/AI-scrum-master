'use client'

import { useState, useMemo } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useGetBlockersQuery, useUpdateBlockerMutation } from '@/store/api/blockersApi'
import { formatDistanceToNow } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ExclamationTriangleIcon,
  CheckCircledIcon,
  LightningBoltIcon,
  PersonIcon,
  ClockIcon,
  CrossCircledIcon,
  ArrowUpIcon,
  ArrowRightIcon,
  MagicWandIcon,
  ChatBubbleIcon,
} from '@radix-ui/react-icons'

// Severity indicator
const SeverityBadge = ({ severity }: { severity: string }) => {
  const styles: Record<string, string> = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    low: 'bg-white/10 text-white/60 border-white/10',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles[severity] || styles.medium}`}>
      {severity}
    </span>
  );
};

// Type badge
const TypeBadge = ({ type }: { type: string }) => {
  const styles: Record<string, string> = {
    dependency: 'bg-purple-500/20 text-purple-400',
    technical: 'bg-cyan-500/20 text-cyan-400',
    resource: 'bg-emerald-500/20 text-emerald-400',
    external: 'bg-amber-500/20 text-amber-400',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${styles[type] || styles.technical}`}>
      {type}
    </span>
  );
};

// Blocker card for kanban
const BlockerCard = ({ blocker, onClick }: { blocker: any, onClick: () => void }) => {
  const severityColors: Record<string, string> = {
    critical: 'border-l-red-500',
    high: 'border-l-orange-500',
    medium: 'border-l-amber-500',
    low: 'border-l-white/20',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`p-4 rounded-lg bg-white/[0.02] border border-white/5 border-l-4 ${severityColors[blocker.severity] || severityColors.medium} cursor-pointer hover:bg-white/[0.04] transition-colors`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <SeverityBadge severity={blocker.severity} />
        <TypeBadge type={blocker.type} />
      </div>

      <p className="text-sm text-white font-medium line-clamp-2 mb-3">
        {blocker.description}
      </p>

      <div className="flex items-center justify-between text-xs text-white/40">
        <span className="flex items-center gap-1">
          <ClockIcon className="h-3 w-3" />
          {formatDistanceToNow(new Date(blocker.createdAt), { addSuffix: true })}
        </span>
        <span className="flex items-center gap-1">
          <PersonIcon className="h-3 w-3" />
          Team
        </span>
      </div>
    </motion.div>
  );
};

export default function BlockersPage() {
  const { data: blockers, isLoading, refetch } = useGetBlockersQuery()
  const [updateBlocker] = useUpdateBlockerMutation()

  const [selectedBlocker, setSelectedBlocker] = useState<any>(null)
  const [view, setView] = useState<'kanban' | 'list'>('kanban')

  // Group blockers by status
  const groupedBlockers = useMemo(() => {
    if (!blockers) return { active: [], investigating: [], resolved: [] };

    return {
      active: blockers.filter((b: any) => b.status === 'active'),
      investigating: blockers.filter((b: any) => b.status === 'investigating' || b.status === 'in_progress'),
      resolved: blockers.filter((b: any) => b.status === 'resolved'),
    };
  }, [blockers]);

  // Stats
  const stats = useMemo(() => {
    if (!blockers) return { total: 0, critical: 0, avgResolutionTime: 0 };

    const critical = blockers.filter((b: any) => b.severity === 'critical' || b.severity === 'high').length;
    const resolved = blockers.filter((b: any) => b.status === 'resolved');

    return {
      total: blockers.filter((b: any) => b.status !== 'resolved').length,
      critical,
      resolvedThisWeek: resolved.length,
      avgResolutionTime: 2.4, // placeholder
    };
  }, [blockers]);

  // Change blocker status
  const handleStatusChange = async (blockerId: number, newStatus: string) => {
    try {
      await updateBlocker({ id: blockerId, status: newStatus }).unwrap();
      refetch();
      setSelectedBlocker(null);
    } catch (error) {
      console.error('Failed to update blocker:', error);
    }
  };

  // AI suggestions for resolution
  const getAISuggestion = (blocker: any) => {
    const suggestions: Record<string, string> = {
      dependency: "Try reaching out to the blocking team directly. Consider a temporary workaround if available.",
      technical: "Check recent deployments or changes. Consider rolling back if this is a regression.",
      resource: "Review team capacity. Consider delegating lower priority tasks.",
      external: "Escalate to stakeholders. Document impact for future planning.",
    };
    return suggestions[blocker?.type] || "Investigate the root cause and document findings for the team.";
  };

  return (
    <MainLayout title="Blockers">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4">
          <Card className={`border-white/5 ${stats.total > 0 ? 'bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20' : 'bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20'}`}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl ${stats.total > 0 ? 'bg-amber-500/20' : 'bg-emerald-500/20'} flex items-center justify-center`}>
                {stats.total > 0 ? (
                  <ExclamationTriangleIcon className="h-6 w-6 text-amber-400" />
                ) : (
                  <CheckCircledIcon className="h-6 w-6 text-emerald-400" />
                )}
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
                <p className="text-xs text-white/40">Active Blockers</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.02] border-white/5">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <CrossCircledIcon className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{stats.critical}</p>
                <p className="text-xs text-white/40">High Priority</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.02] border-white/5">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircledIcon className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{stats.resolvedThisWeek}</p>
                <p className="text-xs text-white/40">Resolved</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.02] border-white/5">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <ClockIcon className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{stats.avgResolutionTime}d</p>
                <p className="text-xs text-white/40">Avg Resolution</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Blocker Board</h2>
          <div className="flex items-center gap-2 bg-white/[0.02] rounded-lg p-1">
            <button
              onClick={() => setView('kanban')}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${view === 'kanban' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/70'}`}
            >
              Kanban
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${view === 'list' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/70'}`}
            >
              List
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        {isLoading ? (
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-8 bg-white/5 rounded animate-pulse" />
                <div className="h-32 bg-white/5 rounded animate-pulse" />
                <div className="h-32 bg-white/5 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {/* Active Column */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm font-medium text-white">Active</span>
                  <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
                    {groupedBlockers.active.length}
                  </span>
                </div>
              </div>

              <div className="space-y-3 min-h-[200px] p-2 rounded-xl bg-white/[0.01] border border-white/5">
                <AnimatePresence>
                  {groupedBlockers.active.map((blocker: any) => (
                    <BlockerCard
                      key={blocker.id}
                      blocker={blocker}
                      onClick={() => setSelectedBlocker(blocker)}
                    />
                  ))}
                </AnimatePresence>

                {groupedBlockers.active.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-white/30">
                    <CheckCircledIcon className="h-8 w-8 mb-2" />
                    <p className="text-sm">No active blockers</p>
                  </div>
                )}
              </div>
            </div>

            {/* Investigating Column */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-sm font-medium text-white">Investigating</span>
                  <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
                    {groupedBlockers.investigating.length}
                  </span>
                </div>
              </div>

              <div className="space-y-3 min-h-[200px] p-2 rounded-xl bg-white/[0.01] border border-white/5">
                <AnimatePresence>
                  {groupedBlockers.investigating.map((blocker: any) => (
                    <BlockerCard
                      key={blocker.id}
                      blocker={blocker}
                      onClick={() => setSelectedBlocker(blocker)}
                    />
                  ))}
                </AnimatePresence>

                {groupedBlockers.investigating.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-white/30">
                    <ArrowRightIcon className="h-8 w-8 mb-2" />
                    <p className="text-sm">Drag blockers here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Resolved Column */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-sm font-medium text-white">Resolved</span>
                  <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
                    {groupedBlockers.resolved.length}
                  </span>
                </div>
              </div>

              <div className="space-y-3 min-h-[200px] p-2 rounded-xl bg-white/[0.01] border border-white/5">
                <AnimatePresence>
                  {groupedBlockers.resolved.slice(0, 5).map((blocker: any) => (
                    <BlockerCard
                      key={blocker.id}
                      blocker={blocker}
                      onClick={() => setSelectedBlocker(blocker)}
                    />
                  ))}
                </AnimatePresence>

                {groupedBlockers.resolved.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-white/30">
                    <CheckCircledIcon className="h-8 w-8 mb-2" />
                    <p className="text-sm">Resolved blockers appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Blocker Detail Dialog */}
        <Dialog open={!!selectedBlocker} onOpenChange={() => setSelectedBlocker(null)}>
          <DialogContent className="bg-[#0a0a0f] border-white/10 max-w-2xl">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedBlocker?.severity === 'critical' || selectedBlocker?.severity === 'high' ? 'bg-red-500/20' : 'bg-amber-500/20'}`}>
                  <ExclamationTriangleIcon className={`h-5 w-5 ${selectedBlocker?.severity === 'critical' || selectedBlocker?.severity === 'high' ? 'text-red-400' : 'text-amber-400'}`} />
                </div>
                <div>
                  <DialogTitle className="text-white">Blocker Details</DialogTitle>
                  <DialogDescription className="text-white/40">
                    Review and manage this blocker
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {selectedBlocker && (
              <div className="space-y-6">
                {/* Badges */}
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={selectedBlocker.severity} />
                  <TypeBadge type={selectedBlocker.type} />
                  <span className="text-xs text-white/30 ml-auto">
                    Created {formatDistanceToNow(new Date(selectedBlocker.createdAt), { addSuffix: true })}
                  </span>
                </div>

                {/* Description */}
                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                  <p className="text-white">{selectedBlocker.description}</p>
                </div>

                {/* AI Suggestion */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <MagicWandIcon className="h-4 w-4 text-purple-400" />
                    <span className="text-sm font-medium text-purple-400">AI Suggestion</span>
                  </div>
                  <p className="text-sm text-white/60">{getAISuggestion(selectedBlocker)}</p>
                </div>

                {/* Status Actions */}
                <div className="space-y-2">
                  <p className="text-sm text-white/40">Change Status</p>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(selectedBlocker.id, 'investigating')}
                      disabled={selectedBlocker.status === 'investigating'}
                      className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 disabled:opacity-50"
                    >
                      <ArrowRightIcon className="mr-2 h-4 w-4" />
                      Investigate
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(selectedBlocker.id, 'resolved')}
                      disabled={selectedBlocker.status === 'resolved'}
                      className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 disabled:opacity-50"
                    >
                      <CheckCircledIcon className="mr-2 h-4 w-4" />
                      Mark Resolved
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}
