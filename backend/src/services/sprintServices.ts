// Get sprint with standups and backlog summary
export const getSprintWithSummary = async (id: number) => {
  const sprint = await prisma.sprint.findUnique({
    where: { id },
    include: { standups: true, backlogItems: true },
  });
  if (!sprint) return null;
  const completed = sprint.backlogItems.filter(item => item.completed).length;
  const total = sprint.backlogItems.length;
  const velocity = completed / (total || 1);
  return {
    sprint,
    burndown: { completed, total },
    velocity,
  };
};
import { PrismaClient } from '@prisma/client';
import { queueManager } from './queueServices.js';
import { vectorStore } from './vectorServices.js';

const prisma = new PrismaClient();

export const getSprints = async (filter?: 'active' | 'completed') => {
  const now = new Date();
  let where = {};
  if (filter === 'active') {
    where = { startDate: { lte: now }, endDate: { gte: now } };
  } else if (filter === 'completed') {
    where = { endDate: { lt: now } };
  }
  return prisma.sprint.findMany({
    where,
    orderBy: { startDate: 'desc' },
  });
};

export const createSprint = async (data: { name: string; startDate: Date; endDate: Date }) => {
  const sprint = await prisma.sprint.create({ data });
  
  // Trigger initial sprint analysis workflows
  try {
    // Schedule initial health check after 24 hours
    await queueManager.scheduleSprintAnalysis(sprint.id, 'health', 24 * 60 * 60 * 1000);
    
    // Store sprint information in vector database
    await vectorStore.addDocument(
      `Sprint: ${sprint.name}. Duration: ${sprint.startDate.toISOString()} to ${sprint.endDate.toISOString()}`,
      {
        type: 'sprint',
        id: sprint.id,
        createdAt: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error('❌ Failed to schedule sprint workflows:', error);
  }
  
  return sprint;
};

export const updateSprint = async (id: number, data: { endDate?: Date }) => {
  const existingSprint = await prisma.sprint.findUnique({ where: { id } });
  const updatedSprint = await prisma.sprint.update({ where: { id }, data });
  
  // Check if sprint is being completed (end date moved to past)
  if (data.endDate && data.endDate <= new Date() && existingSprint && existingSprint.endDate > new Date()) {
    try {
      // Schedule sprint completion analysis
      await queueManager.scheduleSprintAnalysis(id, 'completion', 0);
      
      // Schedule final sprint summary and metrics
      await queueManager.scheduleNotification({
        type: 'slack',
        recipient: '#sprint-updates',
        message: `🏁 Sprint "${updatedSprint.name}" has been completed. Final analysis will be available shortly.`,
        priority: 'medium',
        metadata: { sprintId: id, type: 'completion' },
      }, 60000); // 1 minute delay to allow analysis to complete
    } catch (error) {
      console.error('❌ Failed to schedule sprint completion workflows:', error);
    }
  }
  
  return updatedSprint;
};

export const deleteSprint = async (id: number) => {
  return prisma.sprint.delete({ where: { id } });
};
