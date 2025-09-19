import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getStandups = async (sprintId?: number) => {
  const where = sprintId ? { sprintId } : {};
  return prisma.standup.findMany({
    where,
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });
};

export const createStandup = async (data: { userId: number; sprintId?: number; summary: string }) => {
  return prisma.standup.create({ data });
};

export const updateStandup = async (id: number, data: { summary?: string }) => {
  return prisma.standup.update({ where: { id }, data });
};

export const deleteStandup = async (id: number) => {
  return prisma.standup.delete({ where: { id } });
};
