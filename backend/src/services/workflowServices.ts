import { PrismaClient } from '@prisma/client';
import { vectorStore } from './vectorServices.js';
import { queueManager, type SprintAnalysisJobData, type StandupAnalysisJobData, type JobResult } from './queueServices.js';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface WorkflowInsight {
  type: 'risk' | 'opportunity' | 'recommendation' | 'alert';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  actionItems?: string[];
  confidence: number;
  metadata?: Record<string, any>;
}

export interface SprintHealthMetrics {
  velocityTrend: number; // -1 to 1 (negative = declining, positive = improving)
  blockerSeverity: number; // 0 to 1 (1 = severe blockers)
  teamSentiment: number; // -1 to 1 (negative = poor sentiment)
  riskScore: number; // 0 to 1 (1 = high risk)
  completionProbability: number; // 0 to 1
  insights: WorkflowInsight[];
}

export interface TeamVelocityAnalysis {
  currentVelocity: number;
  historicalAverage: number;
  trend: 'improving' | 'declining' | 'stable';
  predictedVelocity: number;
  bottlenecks: string[];
  recommendations: string[];
}

class WorkflowServices {
  // Sprint Analysis Workflows
  async processSprintAnalysis(jobData: SprintAnalysisJobData): Promise<JobResult> {
    console.log(`🔍 Processing sprint analysis for sprint ${jobData.sprintId}`);
    
    try {
      const sprint = await prisma.sprint.findUnique({
        where: { id: jobData.sprintId },
        include: {
          standups: {
            include: {
              user: true,
              blockers: true,
            },
          },
          backlogItems: true,
        },
      });

      if (!sprint) {
        throw new Error(`Sprint ${jobData.sprintId} not found`);
      }

      let analysis: any;
      
      switch (jobData.analysisType) {
        case 'health':
          analysis = await this.analyzeSprintHealth(sprint);
          break;
        case 'completion':
          analysis = await this.analyzeSprintCompletion(sprint);
          break;
        case 'risk':
          analysis = await this.assessSprintRisks(sprint);
          break;
        default:
          throw new Error(`Unknown analysis type: ${jobData.analysisType}`);
      }

      // Schedule follow-up notifications if critical issues detected
      if (analysis.insights.some((insight: WorkflowInsight) => insight.priority === 'critical')) {
        await queueManager.scheduleNotification({
          type: 'slack',
          recipient: '#scrum-alerts',
          message: `🚨 Critical issues detected in Sprint ${sprint.name}: ${analysis.insights.filter((i: WorkflowInsight) => i.priority === 'critical').map((i: WorkflowInsight) => i.title).join(', ')}`,
          priority: 'urgent',
          metadata: { sprintId: sprint.id, analysisType: jobData.analysisType },
        });
      }

      return {
        success: true,
        data: analysis,
        insights: analysis.insights.map((i: WorkflowInsight) => i.description),
        recommendations: analysis.insights.filter((i: WorkflowInsight) => i.type === 'recommendation').map((i: WorkflowInsight) => i.description),
        metrics: {
          riskScore: analysis.riskScore || 0,
          velocityTrend: analysis.velocityTrend || 0,
          completionProbability: analysis.completionProbability || 0,
        },
      };
    } catch (error) {
      console.error('❌ Sprint analysis failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async processSprintHealthCheck(jobData: SprintAnalysisJobData): Promise<JobResult> {
    console.log(`🏥 Processing sprint health check for sprint ${jobData.sprintId}`);
    
    try {
      const healthMetrics = await this.calculateSprintHealthMetrics(jobData.sprintId);
      
      // Auto-schedule deep analysis if health is concerning
      if (healthMetrics.riskScore > 0.7) {
        await queueManager.scheduleSprintAnalysis(jobData.sprintId, 'risk', 300000); // 5 minutes delay
      }

      return {
        success: true,
        data: healthMetrics,
        insights: healthMetrics.insights.map(i => i.description),
        metrics: {
          riskScore: healthMetrics.riskScore,
          velocityTrend: healthMetrics.velocityTrend,
          blockerSeverity: healthMetrics.blockerSeverity,
          teamSentiment: healthMetrics.teamSentiment,
        },
      };
    } catch (error) {
      console.error('❌ Sprint health check failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Standup Analysis Workflows
  async processStandupSentimentAnalysis(jobData: StandupAnalysisJobData): Promise<JobResult> {
    console.log(`😊 Processing sentiment analysis for standup ${jobData.standupId}`);
    
    try {
      const standup = await prisma.standup.findUnique({
        where: { id: jobData.standupId },
        include: {
          user: true,
          blockers: true,
        },
      });

      if (!standup) {
        throw new Error(`Standup ${jobData.standupId} not found`);
      }

      const sentimentAnalysis = await this.analyzeSentiment(standup);
      
      // Index for future RAG queries
      if (standup.sprintId) {
        await vectorStore.addDocument(
          `Standup sentiment analysis: ${sentimentAnalysis.summary}`,
          {
            type: 'standup',
            id: standup.id,
            userId: standup.userId,
            sprintId: standup.sprintId,
            createdAt: standup.createdAt.toISOString(),
          }
        );
      }

      return {
        success: true,
        data: sentimentAnalysis,
        insights: [sentimentAnalysis.summary],
        metrics: {
          sentimentScore: sentimentAnalysis.score,
          confidenceLevel: sentimentAnalysis.confidence,
        },
      };
    } catch (error) {
      console.error('❌ Sentiment analysis failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async processBlockerPatternDetection(jobData: StandupAnalysisJobData): Promise<JobResult> {
    console.log(`🚧 Processing blocker pattern detection for standup ${jobData.standupId}`);
    
    try {
      const standup = await prisma.standup.findUnique({
        where: { id: jobData.standupId },
        include: {
          user: true,
          blockers: true,
        },
      });

      if (!standup) {
        throw new Error(`Standup ${jobData.standupId} not found`);
      }

      // Analyze blockers and detect patterns
      const blockerAnalysis = await this.detectBlockerPatterns(standup);
      
      // If recurring patterns detected, alert team
      if (blockerAnalysis.recurringPatterns.length > 0) {
        await queueManager.scheduleNotification({
          type: 'slack',
          recipient: '#dev-team',
          message: `🔄 Recurring blocker patterns detected: ${blockerAnalysis.recurringPatterns.join(', ')}`,
          priority: 'high',
          metadata: { standupId: standup.id, patterns: blockerAnalysis.recurringPatterns },
        });
      }

      return {
        success: true,
        data: blockerAnalysis,
        insights: blockerAnalysis.insights,
        recommendations: blockerAnalysis.recommendations,
      };
    } catch (error) {
      console.error('❌ Blocker pattern detection failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async processTeamVelocityAnalysis(jobData: StandupAnalysisJobData): Promise<JobResult> {
    console.log(`⚡ Processing team velocity analysis for sprint ${jobData.sprintId}`);
    
    try {
      const velocityAnalysis = await this.analyzeTeamVelocity(jobData.sprintId, jobData.userId);
      
      return {
        success: true,
        data: velocityAnalysis,
        insights: [`Velocity trend: ${velocityAnalysis.trend}`, ...velocityAnalysis.recommendations],
        metrics: {
          currentVelocity: velocityAnalysis.currentVelocity,
          historicalAverage: velocityAnalysis.historicalAverage,
          predictedVelocity: velocityAnalysis.predictedVelocity,
        },
      };
    } catch (error) {
      console.error('❌ Team velocity analysis failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async processRiskAssessment(data: any): Promise<JobResult> {
    console.log(`⚠️ Processing risk assessment`);
    
    try {
      const riskAssessment = await this.performRiskAssessment(data);
      
      return {
        success: true,
        data: riskAssessment,
        insights: riskAssessment.risks.map((r: any) => r.description),
        recommendations: riskAssessment.mitigations,
      };
    } catch (error) {
      console.error('❌ Risk assessment failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Core Analysis Methods
  private async analyzeSprintHealth(sprint: any): Promise<SprintHealthMetrics> {
    const standups = sprint.standups;
    const insights: WorkflowInsight[] = [];

    // Calculate velocity trend
    const velocityTrend = await this.calculateVelocityTrend(sprint.id);
    
    // Calculate blocker severity
    const allBlockers = standups.flatMap((s: any) => s.blockers);
    const blockerSeverity = allBlockers.length > 0 ? 
      allBlockers.reduce((sum: number, b: any) => sum + (b.severity === 'high' ? 1 : b.severity === 'medium' ? 0.6 : 0.3), 0) / allBlockers.length : 0;

    // Analyze team sentiment
    const teamSentiment = await this.calculateTeamSentiment(standups);
    
    // Calculate overall risk score
    const riskScore = Math.max(
      1 - velocityTrend, // Poor velocity = higher risk
      blockerSeverity,   // More blockers = higher risk
      1 - teamSentiment  // Poor sentiment = higher risk
    );

    // Calculate completion probability
    const completionProbability = Math.max(0, 1 - riskScore);

    // Generate insights
    if (velocityTrend < -0.3) {
      insights.push({
        type: 'risk',
        priority: 'high',
        title: 'Declining Velocity Detected',
        description: 'Team velocity has decreased significantly compared to previous sprints',
        actionItems: ['Review team capacity', 'Identify and address bottlenecks', 'Consider scope adjustment'],
        confidence: 0.8,
      });
    }

    if (blockerSeverity > 0.7) {
      insights.push({
        type: 'alert',
        priority: 'critical',
        title: 'Critical Blockers Present',
        description: 'Multiple high-severity blockers are impacting team productivity',
        actionItems: ['Prioritize blocker resolution', 'Escalate to management if needed', 'Consider external resources'],
        confidence: 0.9,
      });
    }

    if (teamSentiment < -0.3) {
      insights.push({
        type: 'risk',
        priority: 'medium',
        title: 'Team Sentiment Concerns',
        description: 'Team members are expressing frustration or low morale in standups',
        actionItems: ['Schedule 1:1s with team members', 'Address workload concerns', 'Review team dynamics'],
        confidence: 0.7,
      });
    }

    return {
      velocityTrend,
      blockerSeverity,
      teamSentiment,
      riskScore,
      completionProbability,
      insights,
    };
  }

  private async calculateSprintHealthMetrics(sprintId: number): Promise<SprintHealthMetrics> {
    const sprint = await prisma.sprint.findUnique({
      where: { id: sprintId },
      include: {
        standups: {
          include: {
            user: true,
            blockers: true,
          },
        },
        backlogItems: true,
      },
    });

    if (!sprint) {
      throw new Error(`Sprint ${sprintId} not found`);
    }

    return this.analyzeSprintHealth(sprint);
  }

  private async analyzeSentiment(standup: any): Promise<{ score: number; confidence: number; summary: string }> {
    const text = `${standup.whatDidYesterday} ${standup.whatWillToday} ${standup.obstacles}`;
    
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Analyze the sentiment of this standup update. Return a JSON object with score (-1 to 1, where -1 is very negative, 0 is neutral, 1 is very positive), confidence (0 to 1), and a brief summary of the sentiment analysis.',
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0.1,
      });

      const result = JSON.parse(response.choices[0]?.message?.content || '{"score": 0, "confidence": 0.5, "summary": "Unable to analyze sentiment"}');
      return result;
    } catch (error) {
      console.error('❌ Sentiment analysis failed:', error);
      return { score: 0, confidence: 0.3, summary: 'Sentiment analysis failed' };
    }
  }

  private async detectBlockerPatterns(standup: any): Promise<{
    recurringPatterns: string[];
    insights: string[];
    recommendations: string[];
  }> {
    // Get recent standups for pattern detection
    const recentStandups = await prisma.standup.findMany({
      where: {
        sprintId: standup.sprintId,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
      include: {
        blockers: true,
      },
    });

    const allBlockers = recentStandups.flatMap(s => s.blockers);
    const blockerTexts = allBlockers.map(b => b.description.toLowerCase());
    
    // Use AI to detect patterns
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Analyze these blocker descriptions for recurring patterns. Return a JSON object with recurringPatterns (array of pattern descriptions), insights (array of observations), and recommendations (array of suggested actions).',
          },
          {
            role: 'user',
            content: `Blocker descriptions: ${blockerTexts.join('; ')}`,
          },
        ],
        temperature: 0.1,
      });

      return JSON.parse(response.choices[0]?.message?.content || '{"recurringPatterns": [], "insights": [], "recommendations": []}');
    } catch (error) {
      console.error('❌ Pattern detection failed:', error);
      return {
        recurringPatterns: [],
        insights: ['Pattern detection analysis failed'],
        recommendations: ['Manual review recommended'],
      };
    }
  }

  private async analyzeTeamVelocity(sprintId: number, userId?: number): Promise<TeamVelocityAnalysis> {
    // Get historical sprint data
    const sprints = await prisma.sprint.findMany({
      where: {
        endDate: { lte: new Date() },
      },
      include: {
        standups: userId ? { where: { userId } } : true,
        backlogItems: true,
      },
      orderBy: { startDate: 'desc' },
      take: 5, // Last 5 sprints
    });

    // Calculate velocity metrics (simplified - would need more complex story point tracking)
    const velocities = sprints.map(sprint => ({
      sprintId: sprint.id,
      velocity: sprint.backlogItems.filter(item => item.completed).length,
      standupCount: sprint.standups.length,
    }));

    const currentVelocity = velocities[0]?.velocity || 0;
    const historicalAverage = velocities.length > 1 ? 
      velocities.slice(1).reduce((sum, v) => sum + v.velocity, 0) / (velocities.length - 1) : currentVelocity;

    const trend = currentVelocity > historicalAverage * 1.1 ? 'improving' :
                  currentVelocity < historicalAverage * 0.9 ? 'declining' : 'stable';

    const predictedVelocity = trend === 'improving' ? currentVelocity * 1.1 :
                             trend === 'declining' ? currentVelocity * 0.9 : currentVelocity;

    return {
      currentVelocity,
      historicalAverage,
      trend,
      predictedVelocity,
      bottlenecks: [], // Would need more analysis
      recommendations: [
        trend === 'declining' ? 'Investigate causes of velocity decline' : 'Maintain current momentum',
        'Track story points for more accurate velocity measurement',
      ],
    };
  }

  private async calculateVelocityTrend(sprintId: number): Promise<number> {
    // Simplified velocity calculation - would need proper story point tracking
    const sprints = await prisma.sprint.findMany({
      include: { backlogItems: true },
      orderBy: { startDate: 'desc' },
      take: 3,
    });

    if (sprints.length < 2) return 0;

    const velocities = sprints.map(s => s.backlogItems.filter(item => item.completed).length);
    const recent = velocities[0] ?? 0;
    const previous = velocities[1] ?? 0;
    
    return previous > 0 ? (recent - previous) / previous : 0;
  }

  private async calculateTeamSentiment(standups: any[]): Promise<number> {
    // Simplified sentiment calculation
    const obstacleCount = standups.filter(s => s.obstacles && s.obstacles.trim().length > 0).length;
    const totalStandups = standups.length;
    
    return totalStandups > 0 ? Math.max(-1, 1 - (obstacleCount / totalStandups) * 2) : 0;
  }

  private async analyzeSprintCompletion(sprint: any): Promise<any> {
    // Sprint completion analysis logic
    const totalItems = sprint.backlogItems.length;
    const completedItems = sprint.backlogItems.filter((item: any) => item.completed).length;
    const completionRate = totalItems > 0 ? completedItems / totalItems : 0;

    return {
      completionRate,
      totalItems,
      completedItems,
      insights: [
        completionRate > 0.8 ? 'Excellent sprint completion rate' : 
        completionRate > 0.6 ? 'Good sprint completion rate' : 'Sprint completion below target'
      ],
    };
  }

  private async assessSprintRisks(sprint: any): Promise<any> {
    // Risk assessment logic
    const risks = [];
    const healthMetrics = await this.analyzeSprintHealth(sprint);
    
    if (healthMetrics.riskScore > 0.7) {
      risks.push({
        type: 'completion',
        severity: 'high',
        description: 'Sprint at high risk of not meeting goals',
      });
    }

    return {
      riskScore: healthMetrics.riskScore,
      risks,
      mitigations: risks.map(() => 'Implement risk mitigation strategies'),
    };
  }

  private async performRiskAssessment(data: any): Promise<any> {
    // General risk assessment logic
    return {
      risks: [],
      mitigations: [],
      overallRisk: 'low',
    };
  }
}

export const workflowServices = new WorkflowServices();