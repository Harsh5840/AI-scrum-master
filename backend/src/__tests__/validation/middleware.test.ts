import { describe, it, expect, jest } from '@jest/globals';
import { validateBody, validateParams, validateQuery } from '../../validation/middleware.js';
import { createSprintSchema, sprintIdSchema } from '../../validation/schemas.js';
import { mockRequest, mockResponse, mockNext } from '../mocks.js';

describe('Validation Middleware', () => {
  describe('validateBody', () => {
    it('should pass validation for valid data', () => {
      const req = mockRequest({
        body: {
          name: 'Sprint 1',
          startDate: '2025-01-01',
          endDate: '2025-01-14',
        },
      });
      const res = mockResponse();
      const next = mockNext;

      const middleware = validateBody(createSprintSchema);
      middleware(req as any, res as any, next as any);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid data', () => {
      const req = mockRequest({
        body: {
          name: '', // Empty name
          startDate: '2025-01-01',
          endDate: '2025-01-14',
        },
      });
      const res = mockResponse();
      const next = mockNext;

      const middleware = validateBody(createSprintSchema);
      middleware(req as any, res as any, next as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Validation failed',
          details: expect.any(Array),
        })
      );
    });

    it('should return 400 when end date is before start date', () => {
      const req = mockRequest({
        body: {
          name: 'Sprint 1',
          startDate: '2025-01-14',
          endDate: '2025-01-01', // End date before start date
        },
      });
      const res = mockResponse();
      const next = mockNext;

      const middleware = validateBody(createSprintSchema);
      middleware(req as any, res as any, next as any);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('validateParams', () => {
    it('should pass validation for valid params', () => {
      const req = mockRequest({
        params: { id: '1' },
      });
      const res = mockResponse();
      const next = mockNext;

      const middleware = validateParams(sprintIdSchema);
      middleware(req as any, res as any, next as any);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid params', () => {
      const req = mockRequest({
        params: { id: 'invalid' },
      });
      const res = mockResponse();
      const next = mockNext;

      const middleware = validateParams(sprintIdSchema);
      middleware(req as any, res as any, next as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Invalid parameters',
        })
      );
    });
  });

  describe('validateQuery', () => {
    it('should pass validation for valid query params', () => {
      const req = mockRequest({
        query: { sprintId: '1' },
      });
      const res = mockResponse();
      const next = mockNext;

      const middleware = validateQuery(sprintIdSchema);
      middleware(req as any, res as any, next as any);

      expect(next).toHaveBeenCalled();
    });

    it('should return 400 for invalid query params', () => {
      const req = mockRequest({
        query: { sprintId: 'invalid' },
      });
      const res = mockResponse();
      const next = mockNext;

      const middleware = validateQuery(sprintIdSchema);
      middleware(req as any, res as any, next as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Invalid query parameters',
        })
      );
    });
  });
});
