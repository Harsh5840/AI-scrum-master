import { PrismaClient } from '@prisma/client';
import { detectBlockers, saveBlockers } from './blockerServices.js';
import { vectorStore } from './vectorServices.js';
import { summarizeStandupWithContext } from './ragServices.js';
import { queueManager } from './queueServices.js';

const prisma = new PrismaClient();

export const getStandups = async (sprintId?: number, orgId?: number | null) => {
  const where: Record<string, unknown> = {};
  if (sprintId) where.sprintId = sprintId;
  if (orgId) where.orgId = orgId;

  return prisma.standup.findMany({
    where,
    include: { user: true, blockers: true },
    orderBy: { createdAt: 'desc' },
  });
};

export const createStandup = async (data: {
  userId: number;
  sprintId?: number;
  summary: string;
  description?: string;
  orgId?: number | null;
}) => {
  const createData = {
    userId: data.userId,
    summary: data.summary,
    ...(data.sprintId && { sprintId: data.sprintId }),
    ...(data.orgId && { orgId: data.orgId }),
  };

  const standup = await prisma.standup.create({ data: createData });
  const sourceText = data.description || data.summary;

  if (sourceText) {
    try {
      if (data.description) {
        const enhancedSummary = await summarizeStandupWithContext(
          data.description,
          data.sprintId
        );
        await prisma.standup.update({
          where: { id: standup.id },
          data: { summary: enhancedSummary },
        });
      }

      const standupMetadata: Record<string, unknown> = {
        type: 'standup',
        id: standup.id,
        userId: data.userId,
        createdAt: standup.createdAt.toISOString(),
      };
      if (data.sprintId) standupMetadata.sprintId = data.sprintId;

      try {
        await vectorStore.addDocument(sourceText, standupMetadata as any);
      } catch {
        // Vector store optional
      }

      let detectedBlockers = detectBlockers(sourceText);
      try {
        const { detectBlockers: detectBlockersAI } = await import('./aiServices.js');
        const aiBlockers = await detectBlockersAI(sourceText);
        if (aiBlockers.length > 0) {
          detectedBlockers = aiBlockers.map((b) => ({
            type: b.type,
            severity: b.severity,
            description: b.description,
            confidence: 0.85,
          }));
        }
      } catch {
        // Keep regex detections
      }

      if (detectedBlockers.length > 0) {
        await saveBlockers(standup.id, detectedBlockers, data.orgId ?? undefined);

        for (const blocker of detectedBlockers) {
          try {
            await vectorStore.addDocument(blocker.description, {
              type: 'blocker',
              id: standup.id,
              userId: data.userId,
              severity: blocker.severity,
              createdAt: standup.createdAt.toISOString(),
              ...(data.sprintId ? { sprintId: data.sprintId } : {}),
            } as any);
          } catch {
            // optional
          }
        }
      }
    } catch (error) {
      console.error('❌ Failed to enhance standup with RAG/blockers:', error);
    }
  }

  try {
    if (data.sprintId) {
      await queueManager.scheduleStandupAnalysis({
        standupId: standup.id,
        userId: data.userId,
        sprintId: data.sprintId,
        analysisType: 'sentiment',
      });

      await queueManager.scheduleStandupAnalysis(
        {
          standupId: standup.id,
          userId: data.userId,
          sprintId: data.sprintId,
          analysisType: 'blockers',
        },
        30000
      );

      const standupCount = await prisma.standup.count({
        where: { sprintId: data.sprintId },
      });

      if (standupCount % 5 === 0) {
        await queueManager.scheduleSprintAnalysis(data.sprintId, 'health', 60000);
      }
    }
  } catch (error) {
    console.error('❌ Failed to schedule AI workflows:', error);
  }

  return prisma.standup.findUnique({
    where: { id: standup.id },
    include: { user: true, blockers: true },
  });
};

export const updateStandup = async (id: number, data: { summary?: string }) => {
  return prisma.standup.update({ where: { id }, data });
};

export const deleteStandup = async (id: number) => {
  return prisma.standup.delete({ where: { id } });
};
