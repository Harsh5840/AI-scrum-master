import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';
import request from 'supertest';
import express, { type Express } from 'express';
import sprintRouter from '../../routes/sprints.js';
import { mockPrismaClient } from '../mocks.js';

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

describe('Sprint Routes', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/sprints', sprintRouter);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/sprints', () => {
    it('should return all sprints', async () => {
      const mockSprints = [
        { id: 1, name: 'Sprint 1', startDate: new Date(), endDate: new Date() },
        { id: 2, name: 'Sprint 2', startDate: new Date(), endDate: new Date() },
      ];
      (mockPrismaClient.sprint.findMany as any).mockResolvedValue(mockSprints);

      const response = await request(app).get('/api/sprints');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    it('should filter active sprints', async () => {
      const mockSprints = [
        { id: 1, name: 'Active Sprint', startDate: new Date('2025-01-01'), endDate: new Date('2025-12-31') },
      ];
      (mockPrismaClient.sprint.findMany as any).mockResolvedValue(mockSprints);

      const response = await request(app).get('/api/sprints?filter=active');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('POST /api/sprints', () => {
    it('should create a new sprint', async () => {
      const newSprint = {
        name: 'New Sprint',
        startDate: '2025-01-01',
        endDate: '2025-01-14',
      };
      const mockCreatedSprint = { 
        id: 1, 
        name: newSprint.name, 
        startDate: new Date(newSprint.startDate), 
        endDate: new Date(newSprint.endDate) 
      };
      (mockPrismaClient.sprint.create as any).mockResolvedValue(mockCreatedSprint);

      const response = await request(app)
        .post('/api/sprints')
        .send(newSprint);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(newSprint.name);
    });

    it('should return 400 for invalid sprint data', async () => {
      const invalidSprint = {
        name: 'Sprint',
        startDate: '2025-01-14',
        endDate: '2025-01-01', // End date before start date
      };

      const response = await request(app)
        .post('/api/sprints')
        .send(invalidSprint);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/sprints/:id', () => {
    it('should return a sprint by ID', async () => {
      const mockSprint = {
        id: 1,
        name: 'Sprint 1',
        startDate: new Date(),
        endDate: new Date(),
        standups: [],
        backlogItems: [],
      };
      (mockPrismaClient.sprint.findUnique as any).mockResolvedValue(mockSprint);

      const response = await request(app).get('/api/sprints/1');

      expect(response.status).toBe(200);
      expect(response.body.sprint.id).toBe(1);
    });

    it('should return 404 for non-existent sprint', async () => {
      (mockPrismaClient.sprint.findUnique as any).mockResolvedValue(null);

      const response = await request(app).get('/api/sprints/999');

      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app).get('/api/sprints/invalid');

      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /api/sprints/:id', () => {
    it('should update a sprint', async () => {
      const existingSprint = {
        id: 1,
        name: 'Sprint 1',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
      };
      const updatedSprint = { ...existingSprint, endDate: new Date('2025-01-21') };
      
      (mockPrismaClient.sprint.findUnique as any).mockResolvedValue(existingSprint);
      (mockPrismaClient.sprint.update as any).mockResolvedValue(updatedSprint);

      const response = await request(app)
        .patch('/api/sprints/1')
        .send({ endDate: '2025-01-21' });

      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /api/sprints/:id', () => {
    it('should delete a sprint', async () => {
      (mockPrismaClient.sprint.delete as any).mockResolvedValue({ id: 1 });

      const response = await request(app).delete('/api/sprints/1');

      expect(response.status).toBe(204);
    });
  });
});
