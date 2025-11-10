import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import * as sprintService from '../../services/sprintServices.js';
import { mockPrismaClient, resetAllMocks } from '../mocks.js';

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
}));

// Mock dependencies
jest.mock('../../services/queueServices.js', () => ({
  queueManager: {
    scheduleSprintAnalysis: jest.fn(),
    scheduleNotification: jest.fn(),
  },
}));

jest.mock('../../services/vectorServices.js', () => ({
  vectorStore: {
    addDocument: jest.fn(),
  },
}));

describe('Sprint Services', () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe('getSprints', () => {
    it('should return all sprints when no filter is provided', async () => {
      const mockSprints = [
        { id: 1, name: 'Sprint 1', startDate: new Date(), endDate: new Date() },
        { id: 2, name: 'Sprint 2', startDate: new Date(), endDate: new Date() },
      ];
      mockPrismaClient.sprint.findMany.mockResolvedValue(mockSprints);

      const result = await sprintService.getSprints();

      expect(mockPrismaClient.sprint.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { startDate: 'desc' },
      });
      expect(result).toEqual(mockSprints);
    });

    it('should return active sprints when filter is "active"', async () => {
      const mockSprints = [
        { id: 1, name: 'Active Sprint', startDate: new Date('2025-01-01'), endDate: new Date('2025-12-31') },
      ];
      mockPrismaClient.sprint.findMany.mockResolvedValue(mockSprints);

      const result = await sprintService.getSprints('active');

      expect(mockPrismaClient.sprint.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockSprints);
    });

    it('should return completed sprints when filter is "completed"', async () => {
      const mockSprints = [
        { id: 1, name: 'Completed Sprint', startDate: new Date('2024-01-01'), endDate: new Date('2024-01-14') },
      ];
      mockPrismaClient.sprint.findMany.mockResolvedValue(mockSprints);

      const result = await sprintService.getSprints('completed');

      expect(mockPrismaClient.sprint.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockSprints);
    });
  });

  describe('createSprint', () => {
    it('should create a sprint and trigger workflows', async () => {
      const sprintData = {
        name: 'New Sprint',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-14'),
      };
      const mockSprint = { id: 1, ...sprintData };
      mockPrismaClient.sprint.create.mockResolvedValue(mockSprint);

      const result = await sprintService.createSprint(sprintData);

      expect(mockPrismaClient.sprint.create).toHaveBeenCalledWith({ data: sprintData });
      expect(result).toEqual(mockSprint);
    });
  });

  describe('updateSprint', () => {
    it('should update a sprint successfully', async () => {
      const sprintId = 1;
      const updateData = { endDate: new Date('2025-01-21') };
      const existingSprint = {
        id: sprintId,
        name: 'Test Sprint',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
      };
      const updatedSprint = { ...existingSprint, ...updateData };

      mockPrismaClient.sprint.findUnique.mockResolvedValue(existingSprint);
      mockPrismaClient.sprint.update.mockResolvedValue(updatedSprint);

      const result = await sprintService.updateSprint(sprintId, updateData);

      expect(mockPrismaClient.sprint.update).toHaveBeenCalledWith({
        where: { id: sprintId },
        data: updateData,
      });
      expect(result).toEqual(updatedSprint);
    });
  });

  describe('deleteSprint', () => {
    it('should delete a sprint successfully', async () => {
      const sprintId = 1;
      const deletedSprint = { id: sprintId, name: 'Deleted Sprint' };
      mockPrismaClient.sprint.delete.mockResolvedValue(deletedSprint);

      const result = await sprintService.deleteSprint(sprintId);

      expect(mockPrismaClient.sprint.delete).toHaveBeenCalledWith({ where: { id: sprintId } });
      expect(result).toEqual(deletedSprint);
    });
  });

  describe('getSprintWithSummary', () => {
    it('should return sprint with burndown and velocity metrics', async () => {
      const sprintId = 1;
      const mockSprint = {
        id: sprintId,
        name: 'Test Sprint',
        startDate: new Date(),
        endDate: new Date(),
        standups: [],
        backlogItems: [
          { id: 1, completed: true },
          { id: 2, completed: true },
          { id: 3, completed: false },
        ],
      };
      mockPrismaClient.sprint.findUnique.mockResolvedValue(mockSprint);

      const result = await sprintService.getSprintWithSummary(sprintId);

      expect(result).toEqual({
        sprint: mockSprint,
        burndown: { completed: 2, total: 3 },
        velocity: 2 / 3,
      });
    });

    it('should return null if sprint not found', async () => {
      mockPrismaClient.sprint.findUnique.mockResolvedValue(null);

      const result = await sprintService.getSprintWithSummary(999);

      expect(result).toBeNull();
    });
  });
});
