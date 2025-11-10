import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import * as blockerService from '../../services/blockerServices.js';
import { mockPrismaClient, resetAllMocks } from '../mocks.js';

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
}));

describe('Blocker Services', () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe('detectBlockers', () => {
    it('should detect dependency blockers', () => {
      const text = 'I am blocked by the API team. Waiting for their endpoint to be ready.';
      const result = blockerService.detectBlockers(text);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].type).toBe('dependency');
      expect(result[0].confidence).toBeGreaterThan(0.3);
    });

    it('should detect technical blockers', () => {
      const text = 'There is a critical bug in the authentication system that is blocking progress.';
      const result = blockerService.detectBlockers(text);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].type).toBe('technical');
      expect(result[0].severity).toBe('critical');
    });

    it('should detect resource blockers', () => {
      const text = 'I need help from the senior developer. Missing access to the production database.';
      const result = blockerService.detectBlockers(text);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].type).toBe('resource');
    });

    it('should return empty array for text without blockers', () => {
      const text = 'I completed the task and it works perfectly.';
      const result = blockerService.detectBlockers(text);

      expect(result).toEqual([]);
    });

    it('should deduplicate similar blockers', () => {
      const text = 'Blocked by API. Blocked by API team. Waiting for API.';
      const result = blockerService.detectBlockers(text);

      expect(result.length).toBeLessThanOrEqual(2);
    });
  });

  describe('getActiveBlockers', () => {
    it('should return all active blockers', async () => {
      const mockBlockers = [
        { 
          id: 1, 
          description: 'Blocker 1', 
          status: 'active',
          severity: 'high',
          detectedAt: new Date(),
          standup: { user: {}, sprint: {} }
        },
      ];
      (mockPrismaClient.blocker.findMany as any).mockResolvedValue(mockBlockers);

      const result = await blockerService.getActiveBlockers();

      expect(mockPrismaClient.blocker.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockBlockers);
    });

    it('should return active blockers for a specific sprint', async () => {
      const sprintId = 1;
      const mockBlockers = [
        { 
          id: 1, 
          description: 'Sprint blocker',
          status: 'active',
          standup: { sprintId, user: {}, sprint: {} }
        },
      ];
      (mockPrismaClient.blocker.findMany as any).mockResolvedValue(mockBlockers);

      const result = await blockerService.getActiveBlockers(sprintId);

      expect(result).toEqual(mockBlockers);
    });
  });

  describe('resolveBlocker', () => {
    it('should mark a blocker as resolved', async () => {
      const blockerId = 1;
      const mockBlocker = { 
        id: blockerId, 
        description: 'Blocker', 
        status: 'resolved',
        resolvedAt: expect.any(Date)
      };
      (mockPrismaClient.blocker.update as any).mockResolvedValue(mockBlocker);

      const result = await blockerService.resolveBlocker(blockerId);

      expect(mockPrismaClient.blocker.update).toHaveBeenCalledWith({
        where: { id: blockerId },
        data: {
          status: 'resolved',
          resolvedAt: expect.any(Date)
        },
      });
      expect(result).toEqual(mockBlocker);
    });
  });

  describe('saveBlockers', () => {
    it('should save multiple blockers for a standup', async () => {
      const standupId = 1;
      const blockers = [
        { type: 'dependency', severity: 'high', description: 'Blocked by API', confidence: 0.8 },
        { type: 'technical', severity: 'medium', description: 'Bug in code', confidence: 0.6 },
      ];
      const mockSavedBlockers = blockers.map((b, i) => ({ id: i + 1, standupId, ...b, status: 'active' }));
      
      (mockPrismaClient.blocker.create as any)
        .mockResolvedValueOnce(mockSavedBlockers[0])
        .mockResolvedValueOnce(mockSavedBlockers[1]);

      const result = await blockerService.saveBlockers(standupId, blockers);

      expect(mockPrismaClient.blocker.create).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(2);
    });
  });
});
