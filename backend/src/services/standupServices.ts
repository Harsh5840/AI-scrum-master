import { PrismaClient } from '@prisma/client';
import { detectBlockers, saveBlockers } from './blockerServices.js';
import { vectorStore } from './vectorServices.js';
import { summarizeStandupWithContext } from './ragServices.js';

const prisma = new PrismaClient();

export const getStandups = async (sprintId?: number) => {
  const where = sprintId ? { sprintId } : {};
  return prisma.standup.findMany({
    where,
    include: { user: true, blockers: true },
    orderBy: { createdAt: 'desc' },
  });
};

export const createStandup = async (data: { userId: number; sprintId?: number; summary: string; description?: string }) => {
  const createData = {
    userId: data.userId,
    summary: data.summary,
    ...(data.sprintId && { sprintId: data.sprintId })
  };
  
  const standup = await prisma.standup.create({ data: createData });
  
  // Use RAG-enhanced summarization if description is provided
  if (data.description) {
    try {
      // Generate contextual summary using RAG
      const enhancedSummary = await summarizeStandupWithContext(data.description, data.sprintId);
      
      // Update standup with enhanced summary
      await prisma.standup.update({
        where: { id: standup.id },
        data: { summary: enhancedSummary }
      });
      
      // Store standup content in vector database for future context
      const standupMetadata: any = {
        type: 'standup',
        id: standup.id,
        userId: data.userId,
        createdAt: standup.createdAt.toISOString(),
      };
      if (data.sprintId) standupMetadata.sprintId = data.sprintId;
      
      await vectorStore.addDocument(data.description, standupMetadata);
      
      // Detect and save blockers
      const detectedBlockers = detectBlockers(data.description);
      if (detectedBlockers.length > 0) {
        await saveBlockers(standup.id, detectedBlockers);
        
        // Store blocker information in vector database too
        for (const blocker of detectedBlockers) {
          const blockerMetadata: any = {
            type: 'blocker',
            id: standup.id, // Will be updated when blocker is saved
            userId: data.userId,
            severity: blocker.severity,
            createdAt: standup.createdAt.toISOString(),
          };
          if (data.sprintId) blockerMetadata.sprintId = data.sprintId;
          
          await vectorStore.addDocument(blocker.description, blockerMetadata);
        }
      }
    } catch (error) {
      console.error('❌ Failed to enhance standup with RAG:', error);
      // Continue with basic processing if RAG fails
    }
  }
  
  // Return standup with blockers
  return prisma.standup.findUnique({
    where: { id: standup.id },
    include: { user: true, blockers: true }
  });
};

export const updateStandup = async (id: number, data: { summary?: string }) => {
  return prisma.standup.update({ where: { id }, data });
};

export const deleteStandup = async (id: number) => {
  return prisma.standup.delete({ where: { id } });
};
