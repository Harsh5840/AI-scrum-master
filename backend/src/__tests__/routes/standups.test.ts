import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';
import request from 'supertest';
import express, { type Express } from 'express';
import standupRouter from '../../routes/standups.js';
import { mockPrismaClient } from '../mocks.js';

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
}));

// Mock AI Services
jest.mock('../../services/aiServices.js', () => ({
  summarizeStandup: jest.fn((description: string) => `Summary of: ${description}`),
}));

// Mock Vector Services
jest.mock('../../services/vectorServices.js', () => ({
  vectorStore: {
    addDocument: jest.fn(),
  },
}));

describe('Standup Routes', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/standups', standupRouter);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/standups', () => {
    it('should return all standups', async () => {
      const mockStandups = [
        { id: 1, userId: 1, summary: 'Standup 1', createdAt: new Date() },
        { id: 2, userId: 2, summary: 'Standup 2', createdAt: new Date() },
      ];
      (mockPrismaClient.standup.findMany as any).mockResolvedValue(mockStandups);

      const response = await request(app).get('/api/standups');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    it('should filter standups by sprintId', async () => {
      const mockStandups = [
        { id: 1, userId: 1, sprintId: 1, summary: 'Standup 1', createdAt: new Date() },
      ];
      (mockPrismaClient.standup.findMany as any).mockResolvedValue(mockStandups);

      const response = await request(app).get('/api/standups?sprintId=1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });

    it('should return 400 for invalid sprintId', async () => {
      const response = await request(app).get('/api/standups?sprintId=invalid');

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/standups', () => {
    it('should create a new standup with AI summary', async () => {
      const newStandup = {
        userId: 1,
        sprintId: 1,
        description: 'Completed the authentication feature and fixed bugs.',
      };
      const mockCreatedStandup = {
        id: 1,
        userId: 1,
        sprintId: 1,
        summary: 'Summary of: ' + newStandup.description,
        createdAt: new Date(),
      };
      (mockPrismaClient.standup.create as any).mockResolvedValue(mockCreatedStandup);

      const response = await request(app)
        .post('/api/standups')
        .send(newStandup);

      expect(response.status).toBe(201);
      expect(response.body.summary).toContain('Summary of:');
    });

    it('should return 400 for missing required fields', async () => {
      const invalidStandup = {
        userId: 1,
        // missing description
      };

      const response = await request(app)
        .post('/api/standups')
        .send(invalidStandup);

      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /api/standups/:id', () => {
    it('should update a standup', async () => {
      const updatedStandup = {
        id: 1,
        userId: 1,
        summary: 'Updated summary',
        createdAt: new Date(),
      };
      (mockPrismaClient.standup.update as any).mockResolvedValue(updatedStandup);

      const response = await request(app)
        .patch('/api/standups/1')
        .send({ summary: 'Updated summary' });

      expect(response.status).toBe(200);
      expect(response.body.summary).toBe('Updated summary');
    });

    it('should return 400 for invalid standup ID', async () => {
      const response = await request(app)
        .patch('/api/standups/invalid')
        .send({ summary: 'Updated' });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/standups/:id', () => {
    it('should delete a standup', async () => {
      (mockPrismaClient.standup.delete as any).mockResolvedValue({ id: 1 });

      const response = await request(app).delete('/api/standups/1');

      expect(response.status).toBe(204);
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app).delete('/api/standups/invalid');

      expect(response.status).toBe(400);
    });
  });
});
