import { z } from 'zod';

// Sprint validation schemas
export const createSprintSchema = z.object({
  name: z.string().min(1, 'Sprint name is required').max(100, 'Sprint name must be less than 100 characters'),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid start date format'),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid end date format'),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end > start;
}, 'End date must be after start date');

export const updateSprintSchema = z.object({
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid end date format'),
});

export const sprintIdSchema = z.object({
  id: z.string().refine((id) => !isNaN(Number(id)) && Number(id) > 0, 'Invalid sprint ID'),
});

export const sprintFilterSchema = z.object({
  filter: z.enum(['active', 'completed']).optional(),
});

// Standup validation schemas
export const createStandupSchema = z.object({
  userId: z.number().int().positive('User ID must be a positive integer'),
  sprintId: z.number().int().positive('Sprint ID must be a positive integer').optional(),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
});

export const updateStandupSchema = z.object({
  summary: z.string().min(1, 'Summary is required').max(500, 'Summary must be less than 500 characters'),
});

export const standupIdSchema = z.object({
  id: z.string().refine((id) => !isNaN(Number(id)) && Number(id) > 0, 'Invalid standup ID'),
});

export const standupFilterSchema = z.object({
  sprintId: z.string().refine((id) => !isNaN(Number(id)) && Number(id) > 0, 'Invalid sprint ID').optional(),
});