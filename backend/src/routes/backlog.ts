import { Router } from 'express';
import {
  getBacklogItems,
  getBacklogItem,
  createBacklogItem,
  updateBacklogItem,
  deleteBacklogItem,
  moveToSprint,
  getBacklogStats,
} from '../controllers/backlogController.js';

const backlogRouter = Router();

// GET /api/backlog - Get all backlog items or items for a sprint
backlogRouter.get('/', getBacklogItems);

// GET /api/backlog/stats - Get backlog statistics
backlogRouter.get('/stats', getBacklogStats);

// GET /api/backlog/:id - Get a specific backlog item
backlogRouter.get('/:id', getBacklogItem);

// POST /api/backlog - Create a new backlog item
backlogRouter.post('/', createBacklogItem);

// PATCH /api/backlog/:id - Update a backlog item
backlogRouter.patch('/:id', updateBacklogItem);

// PATCH /api/backlog/:id/move-to-sprint/:sprintId - Move item to a sprint
backlogRouter.patch('/:id/move-to-sprint/:sprintId', moveToSprint);

// DELETE /api/backlog/:id - Delete a backlog item
backlogRouter.delete('/:id', deleteBacklogItem);

export default backlogRouter;
