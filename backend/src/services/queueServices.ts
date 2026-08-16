import { Queue, Worker, Job, type ConnectionOptions } from 'bullmq';
import { Redis as IORedis } from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

export enum QueueNames {
  AI_WORKFLOWS = 'ai-workflows',
  NOTIFICATIONS = 'notifications',
  ANALYTICS = 'analytics',
}

export enum JobTypes {
  SPRINT_ANALYSIS = 'sprint-analysis',
  SPRINT_HEALTH_CHECK = 'sprint-health-check',
  SPRINT_COMPLETION_SUMMARY = 'sprint-completion-summary',
  STANDUP_SENTIMENT_ANALYSIS = 'standup-sentiment-analysis',
  BLOCKER_PATTERN_DETECTION = 'blocker-pattern-detection',
  TEAM_VELOCITY_ANALYSIS = 'team-velocity-analysis',
  RISK_ASSESSMENT = 'risk-assessment',
  PERFORMANCE_INSIGHTS = 'performance-insights',
  PREDICTIVE_ANALYTICS = 'predictive-analytics',
  SLACK_NOTIFICATION = 'slack-notification',
  EMAIL_DIGEST = 'email-digest',
  ALERT_NOTIFICATION = 'alert-notification',
}

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

function createConnection(): IORedis | null {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    console.warn('⚠️  REDIS_URL not set — BullMQ queues disabled (jobs will no-op)');
    return null;
  }

  return new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });
}

const connection = createConnection();
const connectionOpts = connection as unknown as ConnectionOptions | undefined;

export const aiWorkflowQueue = connectionOpts
  ? new Queue(QueueNames.AI_WORKFLOWS, { connection: connectionOpts })
  : null;

export const notificationQueue = connectionOpts
  ? new Queue(QueueNames.NOTIFICATIONS, { connection: connectionOpts })
  : null;

export const analyticsQueue = connectionOpts
  ? new Queue(QueueNames.ANALYTICS, { connection: connectionOpts })
  : null;

/** Legacy export kept for modules that imported `redis` from this file */
export const redis = null;

async function processAiWorkflowJob(job: Job): Promise<JobResult> {
  // Lazy import to avoid circular dependency with workflowServices
  const { workflowServices } = await import('./workflowServices.js');

  switch (job.name) {
    case JobTypes.SPRINT_ANALYSIS:
    case JobTypes.SPRINT_HEALTH_CHECK:
    case JobTypes.SPRINT_COMPLETION_SUMMARY: {
      const data = job.data as SprintAnalysisJobData;
      if (data.analysisType === 'health' || job.name === JobTypes.SPRINT_HEALTH_CHECK) {
        return workflowServices.processSprintHealthCheck(data);
      }
      return workflowServices.processSprintAnalysis(data);
    }
    case JobTypes.STANDUP_SENTIMENT_ANALYSIS: {
      const data = job.data as StandupAnalysisJobData;
      if (data.analysisType === 'blockers') {
        return workflowServices.processBlockerPatternDetection(data);
      }
      if (data.analysisType === 'velocity') {
        return workflowServices.processTeamVelocityAnalysis(data);
      }
      return workflowServices.processStandupSentimentAnalysis(data);
    }
    case JobTypes.BLOCKER_PATTERN_DETECTION:
      return workflowServices.processBlockerPatternDetection(job.data as StandupAnalysisJobData);
    case JobTypes.TEAM_VELOCITY_ANALYSIS:
      return workflowServices.processTeamVelocityAnalysis(job.data as StandupAnalysisJobData);
    case JobTypes.RISK_ASSESSMENT:
      return workflowServices.processRiskAssessment(job.data);
    default:
      console.log(`📋 Unhandled AI workflow job: ${job.name}`);
      return { success: true, data: { skipped: true, name: job.name } };
  }
}

async function processNotificationJob(job: Job): Promise<JobResult> {
  const data = job.data as NotificationJobData;
  console.log(`📢 Notification job (${data.type}) → ${data.recipient}: ${data.message.slice(0, 120)}`);
  return { success: true, data };
}

export class QueueManager {
  private static instance: QueueManager;
  private workers: Worker[] = [];
  private enabled = Boolean(connectionOpts);

  static getInstance(): QueueManager {
    if (!QueueManager.instance) {
      QueueManager.instance = new QueueManager();
    }
    return QueueManager.instance;
  }

  async initializeWorkers(): Promise<void> {
    if (!connectionOpts || !this.enabled) {
      console.log('⚠️  BullMQ workers skipped (REDIS_URL not configured)');
      return;
    }

    console.log('🔄 Initializing BullMQ workers...');

    const aiWorker = new Worker(
      QueueNames.AI_WORKFLOWS,
      async (job) => processAiWorkflowJob(job),
      { connection: connectionOpts, concurrency: 2 }
    );

    const notificationWorker = new Worker(
      QueueNames.NOTIFICATIONS,
      async (job) => processNotificationJob(job),
      { connection: connectionOpts, concurrency: 2 }
    );

    for (const worker of [aiWorker, notificationWorker]) {
      worker.on('completed', (job) => {
        console.log(`✅ Job ${job.id} (${job.name}) completed`);
      });
      worker.on('failed', (job, err) => {
        console.error(`❌ Job ${job?.id} (${job?.name}) failed:`, err.message);
      });
      this.workers.push(worker);
    }

    console.log('✅ BullMQ workers ready');
  }

  async scheduleSprintAnalysis(
    sprintId: number,
    analysisType: 'health' | 'completion' | 'risk',
    delayMs = 0
  ): Promise<{ id: string }> {
    const jobData: SprintAnalysisJobData = {
      sprintId,
      triggeredBy: 'schedule',
      analysisType,
    };

    if (!aiWorkflowQueue) {
      console.warn('Queue unavailable — running sprint analysis inline');
      const { workflowServices } = await import('./workflowServices.js');
      await workflowServices.processSprintAnalysis(jobData);
      return { id: `inline-sprint-${sprintId}-${Date.now()}` };
    }

    const job = await aiWorkflowQueue.add(JobTypes.SPRINT_ANALYSIS, jobData, {
      delay: delayMs,
      removeOnComplete: 100,
      removeOnFail: 50,
    });
    return { id: String(job.id) };
  }

  async scheduleStandupAnalysis(
    standupData: StandupAnalysisJobData,
    delayMs = 0
  ): Promise<{ id: string }> {
    const jobName =
      standupData.analysisType === 'blockers'
        ? JobTypes.BLOCKER_PATTERN_DETECTION
        : standupData.analysisType === 'velocity'
          ? JobTypes.TEAM_VELOCITY_ANALYSIS
          : JobTypes.STANDUP_SENTIMENT_ANALYSIS;

    if (!aiWorkflowQueue) {
      console.warn('Queue unavailable — running standup analysis inline');
      const { workflowServices } = await import('./workflowServices.js');
      if (standupData.analysisType === 'blockers') {
        await workflowServices.processBlockerPatternDetection(standupData);
      } else if (standupData.analysisType === 'velocity') {
        await workflowServices.processTeamVelocityAnalysis(standupData);
      } else {
        await workflowServices.processStandupSentimentAnalysis(standupData);
      }
      return { id: `inline-standup-${standupData.standupId}-${Date.now()}` };
    }

    const job = await aiWorkflowQueue.add(jobName, standupData, {
      delay: delayMs,
      removeOnComplete: 100,
      removeOnFail: 50,
    });
    return { id: String(job.id) };
  }

  async scheduleNotification(
    notificationData: NotificationJobData,
    delayMs = 0
  ): Promise<{ id: string }> {
    if (!notificationQueue) {
      console.log('📢 Notification (no queue):', notificationData.message.slice(0, 80));
      return { id: `inline-notify-${Date.now()}` };
    }

    const job = await notificationQueue.add(JobTypes.SLACK_NOTIFICATION, notificationData, {
      delay: delayMs,
      removeOnComplete: 100,
      removeOnFail: 50,
    });
    return { id: String(job.id) };
  }

  async getQueueStats() {
    const empty = { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0, paused: 0 };

    const [aiStats, notificationStats, analyticsStats] = await Promise.all([
      aiWorkflowQueue?.getJobCounts('waiting', 'active', 'completed', 'failed', 'delayed', 'paused') ?? empty,
      notificationQueue?.getJobCounts('waiting', 'active', 'completed', 'failed', 'delayed', 'paused') ?? empty,
      analyticsQueue?.getJobCounts('waiting', 'active', 'completed', 'failed', 'delayed', 'paused') ?? empty,
    ]);

    return {
      aiWorkflows: aiStats,
      notifications: notificationStats,
      analytics: analyticsStats,
      enabled: this.enabled,
    };
  }

  async getJobStatus(jobId: string, queueName: string = QueueNames.AI_WORKFLOWS) {
    const queue =
      queueName === QueueNames.NOTIFICATIONS
        ? notificationQueue
        : queueName === QueueNames.ANALYTICS
          ? analyticsQueue
          : aiWorkflowQueue;

    if (!queue) {
      return { id: jobId, state: 'unavailable', queue: queueName };
    }

    const job = await queue.getJob(jobId);
    if (!job) {
      return { id: jobId, state: 'not_found', queue: queueName };
    }

    const state = await job.getState();
    return {
      id: job.id,
      name: job.name,
      state,
      queue: queueName,
      progress: job.progress,
      failedReason: job.failedReason,
      finishedOn: job.finishedOn,
      processedOn: job.processedOn,
      data: job.data,
      returnvalue: job.returnvalue,
    };
  }

  async closeAll(): Promise<void> {
    console.log('🔄 Closing BullMQ workers and queues...');
    await Promise.all(this.workers.map((w) => w.close()));
    await Promise.all(
      [aiWorkflowQueue, notificationQueue, analyticsQueue]
        .filter(Boolean)
        .map((q) => q!.close())
    );
    if (connection) {
      await connection.quit();
    }
    console.log('✅ BullMQ closed');
  }
}

export const queueManager = QueueManager.getInstance();
