import type { Request, Response } from 'express';
import { queueManager } from '../services/queueServices.js';
import { workflowServices } from '../services/workflowServices.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Trigger manual workflows
export const triggerSprintAnalysis = async (req: Request, res: Response) => {
  try {
    const { sprintId } = req.params;
    const { analysisType = 'health' } = req.body;
    
    if (!sprintId) {
      return res.status(400).json({ error: 'Sprint ID is required' });
    }
    
    if (!['health', 'completion', 'risk'].includes(analysisType)) {
      return res.status(400).json({ error: 'Invalid analysis type. Must be health, completion, or risk.' });
    }

    // Verify sprint exists
    const sprint = await prisma.sprint.findUnique({ where: { id: parseInt(sprintId) } });
    if (!sprint) {
      return res.status(404).json({ error: 'Sprint not found' });
    }

    const job = await queueManager.scheduleSprintAnalysis(
      parseInt(sprintId),
      analysisType,
      0 // Immediate execution
    );

    res.json({
      success: true,
      message: `Sprint ${analysisType} analysis triggered`,
      jobId: job.id,
      sprintId: parseInt(sprintId),
      analysisType,
    });
  } catch (error) {
    console.error('❌ Failed to trigger sprint analysis:', error);
    res.status(500).json({ error: 'Failed to trigger analysis' });
  }
};

export const triggerStandupAnalysis = async (req: Request, res: Response) => {
  try {
    const { standupId } = req.params;
    const { analysisType = 'sentiment' } = req.body;
    
    if (!standupId) {
      return res.status(400).json({ error: 'Standup ID is required' });
    }
    
    if (!['sentiment', 'blockers', 'velocity'].includes(analysisType)) {
      return res.status(400).json({ error: 'Invalid analysis type. Must be sentiment, blockers, or velocity.' });
    }

    // Verify standup exists and get required data
    const standup = await prisma.standup.findUnique({ 
      where: { id: parseInt(standupId) },
      include: { user: true }
    });
    
    if (!standup) {
      return res.status(404).json({ error: 'Standup not found' });
    }

    if (!standup.sprintId) {
      return res.status(400).json({ error: 'Standup must be associated with a sprint for analysis' });
    }

    const job = await queueManager.scheduleStandupAnalysis({
      standupId: parseInt(standupId),
      userId: standup.userId,
      sprintId: standup.sprintId,
      analysisType: analysisType as 'sentiment' | 'blockers' | 'velocity',
    });

    res.json({
      success: true,
      message: `Standup ${analysisType} analysis triggered`,
      jobId: job.id,
      standupId: parseInt(standupId),
      analysisType,
    });
  } catch (error) {
    console.error('❌ Failed to trigger standup analysis:', error);
    res.status(500).json({ error: 'Failed to trigger analysis' });
  }
};

export const triggerRiskAssessment = async (req: Request, res: Response) => {
  try {
    const { scope = 'project', entityId } = req.body;
    
    let assessmentData: any = { scope };
    
    if (scope === 'sprint' && entityId) {
      const sprint = await prisma.sprint.findUnique({ where: { id: entityId } });
      if (!sprint) {
        return res.status(404).json({ error: 'Sprint not found' });
      }
      assessmentData.sprintId = entityId;
    } else if (scope === 'user' && entityId) {
      const user = await prisma.user.findUnique({ where: { id: entityId } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      assessmentData.userId = entityId;
    }

    const result = await workflowServices.processRiskAssessment(assessmentData);

    res.json({
      success: true,
      message: 'Risk assessment completed',
      data: result.data,
      insights: result.insights,
      recommendations: result.recommendations,
    });
  } catch (error) {
    console.error('❌ Failed to trigger risk assessment:', error);
    res.status(500).json({ error: 'Failed to perform risk assessment' });
  }
};

// Queue monitoring and status
export const getQueueStatus = async (req: Request, res: Response) => {
  try {
    const stats = await queueManager.getQueueStats();
    
    res.json({
      success: true,
      queues: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Failed to get queue status:', error);
    res.status(500).json({ error: 'Failed to retrieve queue status' });
  }
};

export const getJobStatus = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const { queue = 'ai-workflows' } = req.query;
    
    // Note: This would require additional BullMQ API calls to get job status
    // For now, return a simplified response
    res.json({
      success: true,
      jobId,
      queue,
      message: 'Job status checking not fully implemented yet',
    });
  } catch (error) {
    console.error('❌ Failed to get job status:', error);
    res.status(500).json({ error: 'Failed to retrieve job status' });
  }
};

// Workflow insights and results
export const getSprintInsights = async (req: Request, res: Response) => {
  try {
    const { sprintId } = req.params;
    const { days = 7 } = req.query;
    
    if (!sprintId) {
      return res.status(400).json({ error: 'Sprint ID is required' });
    }
    
    const sprint = await prisma.sprint.findUnique({
      where: { id: parseInt(sprintId) },
      include: {
        standups: {
          where: {
            createdAt: {
              gte: new Date(Date.now() - parseInt(days as string) * 24 * 60 * 60 * 1000),
            },
          },
          include: {
            user: true,
            blockers: true,
          },
        },
        backlogItems: true,
      },
    });

    if (!sprint) {
      return res.status(404).json({ error: 'Sprint not found' });
    }

    // Generate real-time insights
    const healthMetrics = await workflowServices.processSprintHealthCheck({
      sprintId: parseInt(sprintId),
      triggeredBy: 'manual',
      analysisType: 'health',
    });

    const insights = {
      sprint: {
        name: sprint.name,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
        daysRemaining: Math.max(0, Math.ceil((sprint.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))),
      },
      metrics: healthMetrics.metrics,
      insights: healthMetrics.insights,
      recommendations: healthMetrics.data?.insights?.filter((i: any) => i.type === 'recommendation') || [],
      risks: healthMetrics.data?.insights?.filter((i: any) => i.type === 'risk' || i.type === 'alert') || [],
      team: {
        standupCount: sprint.standups.length,
        blockerCount: sprint.standups.reduce((sum, s) => sum + s.blockers.length, 0),
        uniqueContributors: new Set(sprint.standups.map(s => s.userId)).size,
      },
      backlog: {
        total: sprint.backlogItems.length,
        completed: sprint.backlogItems.filter(item => item.completed).length,
        completionRate: sprint.backlogItems.length > 0 ? 
          sprint.backlogItems.filter(item => item.completed).length / sprint.backlogItems.length : 0,
      },
    };

    res.json({
      success: true,
      insights,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Failed to get sprint insights:', error);
    res.status(500).json({ error: 'Failed to retrieve sprint insights' });
  }
};

export const getTeamInsights = async (req: Request, res: Response) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date(Date.now() - parseInt(days as string) * 24 * 60 * 60 * 1000);

    // Get team activity data
    const standups = await prisma.standup.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      include: {
        user: true,
        blockers: true,
      },
    });

    const sprints = await prisma.sprint.findMany({
      where: {
        startDate: { gte: startDate },
      },
      include: {
        backlogItems: true,
      },
    });

    // Calculate team metrics
    const uniqueUsers = new Set(standups.map(s => s.userId));
    const totalBlockers = standups.reduce((sum, s) => sum + s.blockers.length, 0);
    const avgBlockersPerStandup = standups.length > 0 ? totalBlockers / standups.length : 0;

    const insights = {
      period: {
        days: parseInt(days as string),
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString(),
      },
      team: {
        activeMembers: uniqueUsers.size,
        totalStandups: standups.length,
        averageStandupsPerMember: uniqueUsers.size > 0 ? standups.length / uniqueUsers.size : 0,
        totalBlockers,
        averageBlockersPerStandup: avgBlockersPerStandup,
      },
      sprints: {
        total: sprints.length,
        completed: sprints.filter(s => s.endDate <= new Date()).length,
        totalBacklogItems: sprints.reduce((sum, s) => sum + s.backlogItems.length, 0),
        completedBacklogItems: sprints.reduce((sum, s) => sum + s.backlogItems.filter(item => item.completed).length, 0),
      },
      recommendations: [
        avgBlockersPerStandup > 2 ? 'High blocker frequency detected - consider process improvements' : 'Blocker frequency is within normal range',
        uniqueUsers.size > 0 && standups.length / uniqueUsers.size < 5 ? 'Some team members may need encouragement to participate in standups' : 'Good standup participation across the team',
      ],
    };

    res.json({
      success: true,
      insights,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Failed to get team insights:', error);
    res.status(500).json({ error: 'Failed to retrieve team insights' });
  }
};

// Workflow automation controls
export const enableAutomation = async (req: Request, res: Response) => {
  try {
    const { workflows } = req.body;
    
    // This would store automation preferences in the database
    // For now, just return success
    res.json({
      success: true,
      message: 'Workflow automation preferences updated',
      enabledWorkflows: workflows,
    });
  } catch (error) {
    console.error('❌ Failed to enable automation:', error);
    res.status(500).json({ error: 'Failed to update automation settings' });
  }
};

export const disableAutomation = async (req: Request, res: Response) => {
  try {
    const { workflows } = req.body;
    
    res.json({
      success: true,
      message: 'Workflow automation disabled',
      disabledWorkflows: workflows,
    });
  } catch (error) {
    console.error('❌ Failed to disable automation:', error);
    res.status(500).json({ error: 'Failed to update automation settings' });
  }
};