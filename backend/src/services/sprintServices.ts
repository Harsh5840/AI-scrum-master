import { PrismaClient } from '@prisma/client';
import { queueManager } from './queueServices.js';
import { vectorStore } from './vectorServices.js';

const prisma = new PrismaClient();

export const getSprintWithSummary = async (id: number, orgId?: number | null) => {
  const sprint = await prisma.sprint.findFirst({
    where: {
      id,
      ...(orgId ? { orgId } : {}),
    },
    include: { standups: true, backlogItems: true },
  });
  if (!sprint) return null;
  const completed = sprint.backlogItems.filter((item: { completed: boolean }) => item.completed).length;
  const total = sprint.backlogItems.length;
  const velocity = completed / (total || 1);
  return {
    sprint,
    burndown: { completed, total },
    velocity,
  };
};

export const getSprints = async (
  filter?: 'active' | 'completed',
  orgId?: number | null
) => {
  const now = new Date();
  const where: Record<string, unknown> = {};
  if (orgId) where.orgId = orgId;
  if (filter === 'active') {
    where.startDate = { lte: now };
    where.endDate = { gte: now };
  } else if (filter === 'completed') {
    where.endDate = { lt: now };
  }
  return prisma.sprint.findMany({
    where,
    orderBy: { startDate: 'desc' },
  });
};

export const createSprint = async (data: {
  name: string;
  startDate: Date;
  endDate: Date;
  orgId?: number | null;
}) => {
  const sprint = await prisma.sprint.create({
    data: {
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      ...(data.orgId ? { orgId: data.orgId } : {}),
    },
  });

  try {
    await queueManager.scheduleSprintAnalysis(sprint.id, 'health', 24 * 60 * 60 * 1000);

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

export const updateSprint = async (id: number, data: { endDate?: Date }, orgId?: number | null) => {
  const existingSprint = await prisma.sprint.findFirst({
    where: { id, ...(orgId ? { orgId } : {}) },
  });
  if (!existingSprint) {
    throw new Error('Sprint not found');
  }

  const updatedSprint = await prisma.sprint.update({ where: { id }, data });

  if (
    data.endDate &&
    data.endDate <= new Date() &&
    existingSprint.endDate > new Date()
  ) {
    try {
      await queueManager.scheduleSprintAnalysis(id, 'completion', 0);
      await queueManager.scheduleNotification(
        {
          type: 'slack',
          recipient: '#sprint-updates',
          message: `Sprint "${updatedSprint.name}" has been completed. Final analysis will be available shortly.`,
          priority: 'medium',
          metadata: { sprintId: id, type: 'completion' },
        },
        60000
      );
    } catch (error) {
      console.error('❌ Failed to schedule sprint completion workflows:', error);
    }
  }

  return updatedSprint;
};

export const deleteSprint = async (id: number, orgId?: number | null) => {
  const existing = await prisma.sprint.findFirst({
    where: { id, ...(orgId ? { orgId } : {}) },
  });
  if (!existing) {
    throw new Error('Sprint not found');
  }
  return prisma.sprint.delete({ where: { id } });
};
