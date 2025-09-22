import { Queue, Worker, Job } from 'bullmq';
import { Redis } from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// Redis connection configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  ...(process.env.REDIS_PASSWORD && { password: process.env.REDIS_PASSWORD }),
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  // Use DB 1 for queues to separate from cache
  db: 1,
};

// Create Redis connection
export const redis = new Redis(redisConfig);

// Queue names
export enum QueueNames {
  AI_WORKFLOWS = 'ai-workflows',
  NOTIFICATIONS = 'notifications',
  ANALYTICS = 'analytics',
}

// Job types for AI workflows
export enum JobTypes {
  // Sprint-related workflows
  SPRINT_ANALYSIS = 'sprint-analysis',
  SPRINT_HEALTH_CHECK = 'sprint-health-check',
  SPRINT_COMPLETION_SUMMARY = 'sprint-completion-summary',
  
  // Standup-related workflows
  STANDUP_SENTIMENT_ANALYSIS = 'standup-sentiment-analysis',
  BLOCKER_PATTERN_DETECTION = 'blocker-pattern-detection',
  TEAM_VELOCITY_ANALYSIS = 'team-velocity-analysis',
  
  // Proactive insights
  RISK_ASSESSMENT = 'risk-assessment',
  PERFORMANCE_INSIGHTS = 'performance-insights',
  PREDICTIVE_ANALYTICS = 'predictive-analytics',
  
  // Notifications
  SLACK_NOTIFICATION = 'slack-notification',
  EMAIL_DIGEST = 'email-digest',
  ALERT_NOTIFICATION = 'alert-notification',
}

// Job data interfaces
export interface SprintAnalysisJobData {
  sprintId: number;
  triggeredBy: 'schedule' | 'completion' | 'manual';
  analysisType: 'health' | 'completion' | 'risk';
}

export interface StandupAnalysisJobData {
  standupId: number;
  userId: number;
  sprintId: number;
  analysisType: 'sentiment' | 'blockers' | 'velocity';
}

export interface NotificationJobData {
  type: 'slack' | 'email' | 'alert';
  recipient: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  metadata?: Record<string, any>;
}

export interface JobResult {
  success: boolean;
  data?: any;
  error?: string;
  insights?: string[];
  recommendations?: string[];
  metrics?: Record<string, number>;
}

// Queue configurations
const queueConfig = {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 100, // Keep 100 completed jobs
    removeOnFail: 50,      // Keep 50 failed jobs
    attempts: 3,
    backoff: {
      type: 'exponential' as const,
      delay: 2000,
    },
  },
};

// Initialize queues
export const aiWorkflowQueue = new Queue(QueueNames.AI_WORKFLOWS, queueConfig);
export const notificationQueue = new Queue(QueueNames.NOTIFICATIONS, queueConfig);
export const analyticsQueue = new Queue(QueueNames.ANALYTICS, queueConfig);

// Queue management class
export class QueueManager {
  private static instance: QueueManager;
  private workers: Worker[] = [];

  static getInstance(): QueueManager {
    if (!QueueManager.instance) {
      QueueManager.instance = new QueueManager();
    }
    return QueueManager.instance;
  }

  async initializeWorkers(): Promise<void> {
    console.log('🔄 Initializing queue workers...');

    try {
      // AI Workflow Worker
      const aiWorker = new Worker(
        QueueNames.AI_WORKFLOWS,
        this.processAIWorkflowJob.bind(this),
        {
          connection: redis,
          concurrency: 3, // Process up to 3 AI jobs concurrently
        }
      );

      // Notification Worker
      const notificationWorker = new Worker(
        QueueNames.NOTIFICATIONS,
        this.processNotificationJob.bind(this),
        {
          connection: redis,
          concurrency: 10, // Notifications can be processed quickly
        }
      );

      // Analytics Worker
      const analyticsWorker = new Worker(
        QueueNames.ANALYTICS,
        this.processAnalyticsJob.bind(this),
        {
          connection: redis,
          concurrency: 2, // Analytics jobs might be CPU intensive
        }
      );

      this.workers = [aiWorker, notificationWorker, analyticsWorker];

      // Add error handlers
      this.workers.forEach(worker => {
        worker.on('completed', (job) => {
          console.log(`✅ Job ${job.id} completed successfully`);
        });

        worker.on('failed', (job, err) => {
          console.error(`❌ Job ${job?.id} failed:`, err.message);
        });

        worker.on('error', (err) => {
          console.error('❌ Worker error:', err);
        });
      });

      console.log('✅ All queue workers initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize workers:', error);
      throw error;
    }
  }

  private async processAIWorkflowJob(job: Job): Promise<JobResult> {
    console.log(`🤖 Processing AI workflow job: ${job.name} (ID: ${job.id})`);
    
    try {
      const { workflowServices } = await import('./workflowServices.js');
      
      switch (job.name) {
        case JobTypes.SPRINT_ANALYSIS:
          return await workflowServices.processSprintAnalysis(job.data as SprintAnalysisJobData);
          
        case JobTypes.SPRINT_HEALTH_CHECK:
          return await workflowServices.processSprintHealthCheck(job.data as SprintAnalysisJobData);
          
        case JobTypes.STANDUP_SENTIMENT_ANALYSIS:
          return await workflowServices.processStandupSentimentAnalysis(job.data as StandupAnalysisJobData);
          
        case JobTypes.BLOCKER_PATTERN_DETECTION:
          return await workflowServices.processBlockerPatternDetection(job.data as StandupAnalysisJobData);
          
        case JobTypes.TEAM_VELOCITY_ANALYSIS:
          return await workflowServices.processTeamVelocityAnalysis(job.data as StandupAnalysisJobData);
          
        case JobTypes.RISK_ASSESSMENT:
          return await workflowServices.processRiskAssessment(job.data);
          
        default:
          throw new Error(`Unknown AI workflow job type: ${job.name}`);
      }
    } catch (error) {
      console.error(`❌ AI workflow job ${job.id} failed:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async processNotificationJob(job: Job): Promise<JobResult> {
    console.log(`📢 Processing notification job: ${job.name} (ID: ${job.id})`);
    
    try {
      const data = job.data as NotificationJobData;
      
      switch (data.type) {
        case 'slack':
          const { sendSlackMessage } = await import('./slackServices.js');
          await sendSlackMessage(data.recipient, data.message);
          break;
          
        case 'alert':
          // Process high-priority alerts
          console.log(`🚨 ALERT: ${data.message}`);
          break;
          
        default:
          throw new Error(`Unknown notification type: ${data.type}`);
      }
      
      return { success: true };
    } catch (error) {
      console.error(`❌ Notification job ${job.id} failed:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async processAnalyticsJob(job: Job): Promise<JobResult> {
    console.log(`📊 Processing analytics job: ${job.name} (ID: ${job.id})`);
    
    try {
      // Placeholder for analytics processing
      // This would integrate with analytics services
      return { success: true };
    } catch (error) {
      console.error(`❌ Analytics job ${job.id} failed:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Job scheduling methods
  async scheduleSprintAnalysis(sprintId: number, analysisType: 'health' | 'completion' | 'risk', delay?: number): Promise<Job> {
    const jobData: SprintAnalysisJobData = {
      sprintId,
      triggeredBy: 'schedule',
      analysisType,
    };

    return await aiWorkflowQueue.add(JobTypes.SPRINT_ANALYSIS, jobData, {
      delay: delay || 0,
      jobId: `sprint-${analysisType}-${sprintId}-${Date.now()}`,
    });
  }

  async scheduleStandupAnalysis(standupData: StandupAnalysisJobData, delay?: number): Promise<Job> {
    return await aiWorkflowQueue.add(JobTypes.STANDUP_SENTIMENT_ANALYSIS, standupData, {
      delay: delay || 0,
      jobId: `standup-analysis-${standupData.standupId}-${Date.now()}`,
    });
  }

  async scheduleNotification(notificationData: NotificationJobData, delay?: number): Promise<Job> {
    const priority = notificationData.priority === 'urgent' ? 1 : 
                    notificationData.priority === 'high' ? 2 :
                    notificationData.priority === 'medium' ? 3 : 4;

    return await notificationQueue.add(JobTypes.SLACK_NOTIFICATION, notificationData, {
      delay: delay || 0,
      priority,
      jobId: `notification-${Date.now()}`,
    });
  }

  // Queue monitoring
  async getQueueStats() {
    const [aiStats, notificationStats, analyticsStats] = await Promise.all([
      aiWorkflowQueue.getJobCounts(),
      notificationQueue.getJobCounts(),
      analyticsQueue.getJobCounts(),
    ]);

    return {
      aiWorkflows: aiStats,
      notifications: notificationStats,
      analytics: analyticsStats,
    };
  }

  async closeAll(): Promise<void> {
    console.log('🔄 Closing all queue workers...');
    
    await Promise.all([
      ...this.workers.map(worker => worker.close()),
      aiWorkflowQueue.close(),
      notificationQueue.close(),
      analyticsQueue.close(),
      redis.disconnect(),
    ]);
    
    console.log('✅ All queues and workers closed successfully');
  }
}

// Singleton instance
export const queueManager = QueueManager.getInstance();