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
  return prisma.sprint.create({ data });
};

export const updateSprint = async (id: number, data: { endDate?: Date }) => {
  return prisma.sprint.update({ where: { id }, data });
};

export const deleteSprint = async (id: number) => {
  return prisma.sprint.delete({ where: { id } });
};
