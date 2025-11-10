import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import * as standupService from '../../services/standupServices.js';
import { mockPrismaClient, resetAllMocks } from '../mocks.js';

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
}));

// Mock dependencies
jest.mock('../../services/vectorServices.js', () => ({
  vectorStore: {
    addDocument: jest.fn(),
  },
}));

describe('Standup Services', () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe('getStandups', () => {
    it('should return all standups when no sprintId is provided', async () => {
      const mockStandups = [
        { id: 1, userId: 1, summary: 'Standup 1', createdAt: new Date() },
        { id: 2, userId: 2, summary: 'Standup 2', createdAt: new Date() },
      ];
      mockPrismaClient.standup.findMany.mockResolvedValue(mockStandups);

      const result = await standupService.getStandups();

      expect(mockPrismaClient.standup.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockStandups);
    });

    it('should return standups filtered by sprintId', async () => {
      const sprintId = 1;
      const mockStandups = [
        { id: 1, userId: 1, sprintId, summary: 'Standup 1', createdAt: new Date() },
      ];
      mockPrismaClient.standup.findMany.mockResolvedValue(mockStandups);

      const result = await standupService.getStandups(sprintId);

      expect(mockPrismaClient.standup.findMany).toHaveBeenCalledWith({
        where: { sprintId },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockStandups);
    });
  });

  describe('createStandup', () => {
    it('should create a standup successfully', async () => {
      const standupData = {
        userId: 1,
        sprintId: 1,
        summary: 'Test standup summary',
      };
      const mockStandup = { id: 1, ...standupData, createdAt: new Date() };
      mockPrismaClient.standup.create.mockResolvedValue(mockStandup);

      const result = await standupService.createStandup(standupData);

      expect(mockPrismaClient.standup.create).toHaveBeenCalledWith({
        data: standupData,
      });
      expect(result).toEqual(mockStandup);
    });
  });

  describe('updateStandup', () => {
    it('should update a standup successfully', async () => {
      const standupId = 1;
      const updateData = { summary: 'Updated summary' };
      const mockStandup = { id: standupId, userId: 1, ...updateData };
      mockPrismaClient.standup.update.mockResolvedValue(mockStandup);

      const result = await standupService.updateStandup(standupId, updateData);

      expect(mockPrismaClient.standup.update).toHaveBeenCalledWith({
        where: { id: standupId },
        data: updateData,
      });
      expect(result).toEqual(mockStandup);
    });
  });

  describe('deleteStandup', () => {
    it('should delete a standup successfully', async () => {
      const standupId = 1;
      const deletedStandup = { id: standupId, summary: 'Deleted standup' };
      mockPrismaClient.standup.delete.mockResolvedValue(deletedStandup);

      const result = await standupService.deleteStandup(standupId);

      expect(mockPrismaClient.standup.delete).toHaveBeenCalledWith({
        where: { id: standupId },
      });
      expect(result).toEqual(deletedStandup);
    });
  });
});
