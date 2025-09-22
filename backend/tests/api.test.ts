import request from 'supertest';
import express from 'express';
import sprintRouter from '../src/routes/sprints.js';
import standupRouter from '../src/routes/standups.js';

const app = express();
app.use(express.json());
app.use('/api/sprints', sprintRouter);
app.use('/api/standups', standupRouter);

describe('Sprint API Tests', () => {
  describe('POST /api/sprints', () => {
    it('should create a sprint with valid data', async () => {
      const sprintData = {
        name: 'Test Sprint',
        startDate: '2025-09-22T00:00:00.000Z',
        endDate: '2025-10-06T00:00:00.000Z'
      };

      const response = await request(app)
        .post('/api/sprints')
        .send(sprintData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(sprintData.name);
    });

    it('should reject sprint with missing name', async () => {
      const sprintData = {
        startDate: '2025-09-22T00:00:00.000Z',
        endDate: '2025-10-06T00:00:00.000Z'
      };

      const response = await request(app)
        .post('/api/sprints')
        .send(sprintData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Validation failed');
    });

    it('should reject sprint with end date before start date', async () => {
      const sprintData = {
        name: 'Invalid Sprint',
        startDate: '2025-10-06T00:00:00.000Z',
        endDate: '2025-09-22T00:00:00.000Z'
      };

      const response = await request(app)
        .post('/api/sprints')
        .send(sprintData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Validation failed');
    });
  });

  describe('GET /api/sprints', () => {
    it('should get all sprints', async () => {
      const response = await request(app)
        .get('/api/sprints');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get active sprints with filter', async () => {
      const response = await request(app)
        .get('/api/sprints?filter=active');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should reject invalid filter', async () => {
      const response = await request(app)
        .get('/api/sprints?filter=invalid');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid query parameters');
    });
  });

  describe('PATCH /api/sprints/:id', () => {
    it('should reject invalid sprint ID', async () => {
      const response = await request(app)
        .patch('/api/sprints/invalid')
        .send({ endDate: '2025-10-06T00:00:00.000Z' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid parameters');
    });

    it('should reject missing endDate', async () => {
      const response = await request(app)
        .patch('/api/sprints/1')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Validation failed');
    });
  });

  describe('DELETE /api/sprints/:id', () => {
    it('should reject invalid sprint ID', async () => {
      const response = await request(app)
        .delete('/api/sprints/invalid');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid parameters');
    });
  });
});

describe('Standup API Tests', () => {
  describe('POST /api/standups', () => {
    it('should create a standup with valid data', async () => {
      const standupData = {
        userId: 1,
        sprintId: 1,
        description: 'Worked on user authentication module'
      };

      const response = await request(app)
        .post('/api/standups')
        .send(standupData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('summary');
    });

    it('should reject standup with missing userId', async () => {
      const standupData = {
        description: 'Worked on something'
      };

      const response = await request(app)
        .post('/api/standups')
        .send(standupData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Validation failed');
    });

    it('should reject standup with empty description', async () => {
      const standupData = {
        userId: 1,
        description: ''
      };

      const response = await request(app)
        .post('/api/standups')
        .send(standupData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Validation failed');
    });

    it('should reject standup with description too long', async () => {
      const standupData = {
        userId: 1,
        description: 'x'.repeat(1001) // Over 1000 character limit
      };

      const response = await request(app)
        .post('/api/standups')
        .send(standupData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Validation failed');
    });
  });

  describe('GET /api/standups', () => {
    it('should get all standups', async () => {
      const response = await request(app)
        .get('/api/standups');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get standups by sprint ID', async () => {
      const response = await request(app)
        .get('/api/standups?sprintId=1');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should reject invalid sprint ID filter', async () => {
      const response = await request(app)
        .get('/api/standups?sprintId=invalid');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid query parameters');
    });
  });

  describe('PATCH /api/standups/:id', () => {
    it('should reject invalid standup ID', async () => {
      const response = await request(app)
        .patch('/api/standups/invalid')
        .send({ summary: 'Updated summary' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid parameters');
    });

    it('should reject empty summary', async () => {
      const response = await request(app)
        .patch('/api/standups/1')
        .send({ summary: '' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Validation failed');
    });
  });

  describe('DELETE /api/standups/:id', () => {
    it('should reject invalid standup ID', async () => {
      const response = await request(app)
        .delete('/api/standups/invalid');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid parameters');
    });
  });
});