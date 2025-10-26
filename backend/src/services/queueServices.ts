import { upstashRedis } from './upstashRedis.js';
import dotenv from 'dotenv';

dotenv.config();

// Use Upstash Redis for data storage
export const redis = upstashRedis;

// Simple in-memory queue system for Upstash REST API
class SimpleQueue {
  private jobs: any[] = [];

  async add(jobType: string, data: any, options?: any) {
    console.log(`📋 Queue job added: ${jobType}`, data);
    const job = {
      id: Date.now().toString(),
      type: jobType,
      data,
      options,
      timestamp: new Date(),
      status: 'queued'
    };
    this.jobs.push(job);

    // Process job asynchronously
    setTimeout(() => this.processJob(job), 100);
    return job;
  }

  private async processJob(job: any) {
    try {
      job.status = 'processing';
      console.log(`⚙️ Processing job: ${job.type}`);

      // Basic job processing - expand this based on job type
      switch (job.type) {
        case 'sprint-analysis':
          console.log('📊 Sprint analysis job processed');
          break;
        case 'notification':
          console.log('📢 Notification job processed');
          break;
        case 'standup-sentiment-analysis':
          console.log('😊 Standup sentiment analysis processed');
          break;
        default:
          console.log(`📋 Job ${job.type} processed`);
      }

      job.status = 'completed';
    } catch (error) {
      console.error(`❌ Job ${job.id} failed:`, error);
      job.status = 'failed';
      job.error = error;
    }
  }

  async getJobs() {
    return this.jobs;
  }

  async getJobCounts() {
    const completed = this.jobs.filter(j => j.status === 'completed').length;
    const failed = this.jobs.filter(j => j.status === 'failed').length;
    const active = this.jobs.filter(j => j.status === 'processing').length;
    const waiting = this.jobs.filter(j => j.status === 'queued').length;

    return {
      completed,
      failed,
      active,
      waiting,
      total: this.jobs.length
    };
  }

  async close() {
    console.log('🔄 Simple queue closed');
  }
}

// Create simple queue instances
export const aiWorkflowQueue = new SimpleQueue();
export const notificationQueue = new SimpleQueue();
export const analyticsQueue = new SimpleQueue();

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

// Simple Queue Manager
export class QueueManager {
  private static instance: QueueManager;

  static getInstance(): QueueManager {
    if (!QueueManager.instance) {
      QueueManager.instance = new QueueManager();
    }
    return QueueManager.instance;
  }

  async initializeWorkers(): Promise<void> {
    console.log('🔄 Initializing simple queue workers...');
    console.log('✅ Simple queue system ready (no background workers needed)');
  }

  // Job scheduling methods
  async scheduleSprintAnalysis(sprintId: number, analysisType: 'health' | 'completion' | 'risk', delay?: number): Promise<any> {
    const jobData: SprintAnalysisJobData = {
      sprintId,
      triggeredBy: 'schedule',
      analysisType,
    };

    return await aiWorkflowQueue.add(JobTypes.SPRINT_ANALYSIS, jobData);
  }

  async scheduleStandupAnalysis(standupData: StandupAnalysisJobData, delay?: number): Promise<any> {
    return await aiWorkflowQueue.add(JobTypes.STANDUP_SENTIMENT_ANALYSIS, standupData);
  }

  async scheduleNotification(notificationData: NotificationJobData, delay?: number): Promise<any> {
    return await notificationQueue.add(JobTypes.SLACK_NOTIFICATION, notificationData);
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
    console.log('🔄 Closing simple queue system...');

    await Promise.all([
      aiWorkflowQueue.close(),
      notificationQueue.close(),
      analyticsQueue.close(),
    ]);

    console.log('✅ Simple queue system closed successfully');
  }
}

// Singleton instance
export const queueManager = QueueManager.getInstance();