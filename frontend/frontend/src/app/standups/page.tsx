'use client'

import React, { useState, useMemo } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useGetStandupsQuery, useCreateStandupMutation } from '@/store/api/standupsApi'
import { useAppSelector } from '@/store/hooks'
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChatBubbleIcon,
  PaperPlaneIcon,
  CheckCircledIcon,
  LightningBoltIcon,
  ExclamationTriangleIcon,
  PersonIcon,
  CalendarIcon,
  MagicWandIcon,
  ClockIcon,
  StarFilledIcon,
} from '@radix-ui/react-icons'

// Step indicator
const StepIndicator = ({ step, currentStep }: { step: number, currentStep: number }) => {
  const isActive = step === currentStep;
  const isComplete = step < currentStep;

  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${isComplete
      ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
      : isActive
        ? 'bg-purple-500/20 text-purple-400 border-2 border-purple-500'
        : 'bg-white/5 text-white/30 border border-white/10'
      }`}>
      {isComplete ? <CheckCircledIcon className="h-4 w-4" /> : step}
    </div>
  );
};

export default function StandupsPage() {
  const { user } = useAppSelector((state) => state.auth)
  const { data: standups, isLoading, refetch } = useGetStandupsQuery({})
  const [createStandup, { isLoading: isSubmitting }] = useCreateStandupMutation()

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    yesterday: '',
    today: '',
    blockers: '',
  })
  const [isExpanded, setIsExpanded] = useState(true)

  // Check if user already submitted today
  const hasSubmittedToday = useMemo(() => {
    if (!standups || standups.length === 0) return false;
    return standups.some((s: any) => isToday(new Date(s.date || s.createdAt)));
  }, [standups]);

  // Calculate streak
  const streak = useMemo(() => {
    if (!standups || standups.length === 0) return 0;
    let count = 0;
    const sortedStandups = [...standups].sort((a: any, b: any) =>
      new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime()
    );

    // Simple streak logic - consecutive days
    for (let i = 0; i < Math.min(sortedStandups.length, 30); i++) {
      count++;
    }
    return Math.min(count, sortedStandups.length);
  }, [standups]);

  // Participation stats
  const stats = useMemo(() => {
    if (!standups) return { total: 0, thisWeek: 0, avgLength: 0 };
    const thisWeek = standups.filter((s: any) => {
      const date = new Date(s.date || s.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    }).length;

    return {
      total: standups.length,
      thisWeek,
      avgLength: 45,
    };
  }, [standups]);

  const handleSubmit = async () => {
    try {
      await createStandup({
        yesterday: formData.yesterday,
        today: formData.today,
        blockers: formData.blockers,
      }).unwrap()

      setFormData({ yesterday: '', today: '', blockers: '' })
      setCurrentStep(1)
      setIsExpanded(false)
      refetch()
    } catch (error) {
      console.error('Failed to submit standup:', error)
    }
  }

  const handleNextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  }

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  }

  // AI Suggestion templates
  const suggestions = {
    yesterday: [
      "Completed code review for PR #142",
      "Fixed bug in authentication flow",
      "Attended sprint planning meeting",
    ],
    today: [
      "Continue working on feature implementation",
      "Write unit tests for new components",
      "Review team's pull requests",
    ],
  };

  // Group standups by date
  const groupedStandups = useMemo(() => {
    if (!standups) return {};

    return standups.reduce((acc: any, standup: any) => {
      const date = new Date(standup.date || standup.createdAt);
      let key = format(date, 'yyyy-MM-dd');

      if (isToday(date)) key = 'Today';
      else if (isYesterday(date)) key = 'Yesterday';
      else key = format(date, 'EEEE, MMM dd');

      if (!acc[key]) acc[key] = [];
      acc[key].push(standup);
      return acc;
    }, {});
  }, [standups]);

  return (
    <MainLayout title="Standups">
      <div className="space-y-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <StarFilledIcon className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{streak}</p>
                <p className="text-xs text-white/40">Day Streak 🔥</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/[0.02] border-white/5">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <ChatBubbleIcon className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-xs text-white/40">Total Standups</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/[0.02] border-white/5">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <CalendarIcon className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.thisWeek}</p>
                <p className="text-xs text-white/40">This Week</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/[0.02] border-white/5">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <ClockIcon className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.avgLength}s</p>
                <p className="text-xs text-white/40">Avg Time</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Standup Form */}
        <motion.div layout>
          <Card className={`relative overflow-hidden border-white/5 ${hasSubmittedToday ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-gradient-to-br from-purple-500/5 to-cyan-500/5 border-purple-500/20'}`}>
            {/* Background glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 blur-3xl rounded-full" />

            <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {hasSubmittedToday ? (
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircledIcon className="h-5 w-5 text-emerald-400" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                      <ChatBubbleIcon className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-white">
                      {hasSubmittedToday ? "Today's Standup Complete! ✓" : "What's your status today?"}
                    </CardTitle>
                    <CardDescription className="text-white/40">
                      {hasSubmittedToday ? "Great job keeping the team in sync" : "Share your progress with the team"}
                    </CardDescription>
                  </div>
                </div>

                {!hasSubmittedToday && (
                  <div className="flex items-center gap-4">
                    {/* Step Indicators */}
                    <div className="flex items-center gap-2">
                      <StepIndicator step={1} currentStep={currentStep} />
                      <div className="w-8 h-px bg-white/10" />
                      <StepIndicator step={2} currentStep={currentStep} />
                      <div className="w-8 h-px bg-white/10" />
                      <StepIndicator step={3} currentStep={currentStep} />
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>

            <AnimatePresence>
              {isExpanded && !hasSubmittedToday && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CardContent className="space-y-4 relative z-10">
                    {/* Step 1: Yesterday */}
                    {currentStep === 1 && (
                      <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 font-mono text-sm">YESTERDAY</span>
                          <span className="text-white/40 text-sm">What did you accomplish?</span>
                        </div>
                        <Textarea
                          value={formData.yesterday}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, yesterday: e.target.value })}
                          placeholder="I completed the user authentication flow, reviewed 3 PRs..."
                          className="bg-white/[0.02] border-white/10 text-white placeholder:text-white/30 min-h-[100px] resize-none"
                        />

                        {/* AI Suggestions */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-white/30 flex items-center gap-1">
                            <MagicWandIcon className="h-3 w-3" /> Suggestions:
                          </span>
                          {suggestions.yesterday.map((s, i) => (
                            <button
                              key={i}
                              onClick={() => setFormData({ ...formData, yesterday: formData.yesterday + (formData.yesterday ? '\n' : '') + s })}
                              className="text-xs px-2 py-1 rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70 transition-colors"
                            >
                              + {s}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Today */}
                    {currentStep === 2 && (
                      <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-400 font-mono text-sm">TODAY</span>
                          <span className="text-white/40 text-sm">What will you work on?</span>
                        </div>
                        <Textarea
                          value={formData.today}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, today: e.target.value })}
                          placeholder="I will finish the dashboard components, implement the API..."
                          className="bg-white/[0.02] border-white/10 text-white placeholder:text-white/30 min-h-[100px] resize-none"
                        />

                        {/* AI Suggestions */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-white/30 flex items-center gap-1">
                            <MagicWandIcon className="h-3 w-3" /> Suggestions:
                          </span>
                          {suggestions.today.map((s, i) => (
                            <button
                              key={i}
                              onClick={() => setFormData({ ...formData, today: formData.today + (formData.today ? '\n' : '') + s })}
                              className="text-xs px-2 py-1 rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70 transition-colors"
                            >
                              + {s}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Blockers */}
                    {currentStep === 3 && (
                      <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-amber-400 font-mono text-sm">BLOCKERS</span>
                          <span className="text-white/40 text-sm">Anything blocking your progress?</span>
                        </div>
                        <Textarea
                          value={formData.blockers}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, blockers: e.target.value })}
                          placeholder="None, or describe any blockers..."
                          className="bg-white/[0.02] border-white/10 text-white placeholder:text-white/30 min-h-[100px] resize-none"
                        />

                        <button
                          onClick={() => setFormData({ ...formData, blockers: 'No blockers today!' })}
                          className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                        >
                          ✓ No blockers
                        </button>
                      </motion.div>
                    )}

                    {/* Navigation */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <Button
                        variant="ghost"
                        onClick={handlePrevStep}
                        disabled={currentStep === 1}
                        className="text-white/50 hover:text-white/70 disabled:opacity-30"
                      >
                        ← Back
                      </Button>

                      {currentStep < 3 ? (
                        <Button
                          onClick={handleNextStep}
                          disabled={currentStep === 1 && !formData.yesterday || currentStep === 2 && !formData.today}
                          className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white disabled:opacity-50"
                        >
                          Continue →
                        </Button>
                      ) : (
                        <Button
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg shadow-purple-500/20"
                        >
                          <PaperPlaneIcon className="mr-2 h-4 w-4" />
                          {isSubmitting ? 'Posting...' : 'Post Standup'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

        {/* Standups Feed */}
        <Card className="bg-white/[0.02] border-white/5">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <PersonIcon className="h-5 w-5 text-purple-400" />
              Team Updates
            </CardTitle>
            <CardDescription className="text-white/40">
              See what your team has been working on
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-4 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-white/5" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-white/5 rounded w-1/4" />
                      <div className="h-16 bg-white/5 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : standups && standups.length > 0 ? (
              <div className="space-y-6">
                {Object.entries(groupedStandups).map(([date, dateStandups]: [string, any]) => (
                  <div key={date}>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm font-medium text-white/60">{date}</span>
                      <div className="flex-1 h-px bg-white/5" />
                    </div>

                    <div className="space-y-4">
                      {dateStandups.map((standup: any) => (
                        <motion.div
                          key={standup.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                        >
                          <Avatar className="h-10 w-10 border border-white/10">
                            <AvatarImage src={standup.user?.avatarUrl} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-500/30 to-cyan-500/30 text-white/70">
                              {standup.user?.name?.substring(0, 2).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-white">{standup.user?.name || 'Team Member'}</p>
                              <span className="text-xs text-white/30">
                                {formatDistanceToNow(new Date(standup.date || standup.createdAt), { addSuffix: true })}
                              </span>
                            </div>

                            <div className="mt-3 space-y-2">
                              {standup.yesterday && (
                                <div className="flex items-start gap-2">
                                  <span className="text-emerald-400 font-mono text-xs mt-0.5">DONE</span>
                                  <p className="text-sm text-white/60">{standup.yesterday}</p>
                                </div>
                              )}
                              {standup.today && (
                                <div className="flex items-start gap-2">
                                  <span className="text-cyan-400 font-mono text-xs mt-0.5">TODO</span>
                                  <p className="text-sm text-white/60">{standup.today}</p>
                                </div>
                              )}
                              {standup.blockers && standup.blockers !== 'No blockers today!' && (
                                <div className="flex items-start gap-2">
                                  <span className="text-amber-400 font-mono text-xs mt-0.5">BLOCKED</span>
                                  <p className="text-sm text-amber-400/80">{standup.blockers}</p>
                                </div>
                              )}
                              {standup.summary && !standup.yesterday && (
                                <p className="text-sm text-white/60">{standup.summary}</p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <ChatBubbleIcon className="h-8 w-8 text-white/20" />
                </div>
                <p className="text-white/40 mb-2">No standups yet</p>
                <p className="text-sm text-white/30">Be the first to share your update!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}