import { type Request, type Response } from 'express';
import * as backlogService from '../services/backlogServices.js';

// GET /api/backlog or /api/backlog?sprintId=123
export const getBacklogItems = async (req: Request, res: Response) => {
  try {
    const sprintId = req.query.sprintId ? Number(req.query.sprintId) : undefined;
    
    if (req.query.sprintId && isNaN(Number(req.query.sprintId))) {
      return res.status(400).json({ error: 'Invalid sprintId' });
    }
    const items = await backlogService.getBacklogItems(sprintId);
    res.json(items);
  } catch (error) {
    console.error('Error fetching backlog items:', error);
    res.status(500).json({ error: 'Failed to fetch backlog items' });
  }
};

// GET /api/backlog/:id
export const getBacklogItem = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid backlog item ID' });
    }

    const item = await backlogService.getBacklogItemById(id);
    if (!item) {
      return res.status(404).json({ error: 'Backlog item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching backlog item:', error);
    res.status(500).json({ error: 'Failed to fetch backlog item' });
  }
};

// POST /api/backlog
export const createBacklogItem = async (req: Request, res: Response) => {
  try {
    const { title, description, sprintId, storyPoints, priority, status, assignee, tags } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'title is required and must be a non-empty string' });
    }

    const item = await backlogService.createBacklogItem({
      title: title.trim(),
      ...(description && { description: description.trim() }),
      ...(sprintId && { sprintId: Number(sprintId) }),
      ...(storyPoints !== undefined && { storyPoints: Number(storyPoints) }),
      ...(priority && { priority }),
      ...(status && { status }),
      ...(assignee && { assignee: assignee.trim() }),
      ...(tags && { tags }),
    });

    res.status(201).json(item);
  } catch (error: any) {
    console.error('Error creating backlog item:', error);
    
    if (error.message === 'Sprint not found') {
      return res.status(404).json({ error: 'Sprint not found' });
    }

    res.status(500).json({ error: 'Failed to create backlog item' });
  }
};

// PATCH /api/backlog/:id
export const updateBacklogItem = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid backlog item ID' });
    }

    const { title, description, completed, sprintId, storyPoints, priority, status, assignee, tags } = req.body;

    // Validate input
    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
      return res.status(400).json({ error: 'title must be a non-empty string' });
    }

    if (completed !== undefined && typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'completed must be a boolean' });
    }

    const updateData: {
      title?: string;
      description?: string;
      completed?: boolean;
      sprintId?: number | null;
      storyPoints?: number;
      priority?: string;
      status?: string;
      assignee?: string;
      tags?: string[];
    } = {};

    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (completed !== undefined) updateData.completed = completed;
    if (sprintId !== undefined) updateData.sprintId = sprintId === null ? null : Number(sprintId);
    if (storyPoints !== undefined) updateData.storyPoints = Number(storyPoints);
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined) updateData.status = status;
    if (assignee !== undefined) updateData.assignee = assignee.trim();
    if (tags !== undefined) updateData.tags = tags;

    const item = await backlogService.updateBacklogItem(id, updateData);

    res.json(item);
  } catch (error: any) {
    console.error('Error updating backlog item:', error);

    if (error.message === 'Backlog item not found') {
      return res.status(404).json({ error: 'Backlog item not found' });
    }

    if (error.message === 'Sprint not found') {
      return res.status(404).json({ error: 'Sprint not found' });
    }

    res.status(500).json({ error: 'Failed to update backlog item' });
  }
};

// DELETE /api/backlog/:id
export const deleteBacklogItem = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid backlog item ID' });
    }

    await backlogService.deleteBacklogItem(id);
    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting backlog item:', error);

    if (error.message === 'Backlog item not found') {
      return res.status(404).json({ error: 'Backlog item not found' });
    }

    res.status(500).json({ error: 'Failed to delete backlog item' });
  }
};

// PATCH /api/backlog/:id/move-to-sprint/:sprintId
export const moveToSprint = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const sprintId = Number(req.params.sprintId);

    if (isNaN(id) || isNaN(sprintId)) {
      return res.status(400).json({ error: 'Invalid backlog item ID or sprint ID' });
    }

    const item = await backlogService.moveToSprint(id, sprintId);
    res.json(item);
  } catch (error: any) {
    console.error('Error moving backlog item to sprint:', error);

    if (error.message === 'Backlog item not found') {
      return res.status(404).json({ error: 'Backlog item not found' });
    }

    if (error.message === 'Sprint not found') {
      return res.status(404).json({ error: 'Sprint not found' });
    }

    res.status(500).json({ error: 'Failed to move backlog item to sprint' });
  }
};

// GET /api/backlog/stats
export const getBacklogStats = async (req: Request, res: Response) => {
  try {
    const stats = await backlogService.getBacklogStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching backlog stats:', error);
    res.status(500).json({ error: 'Failed to fetch backlog stats' });
  }
};
