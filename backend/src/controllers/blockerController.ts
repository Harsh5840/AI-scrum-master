import { type Request, type Response } from 'express';
import * as blockerService from '../services/blockerServices.js';

// GET /api/blockers?sprintId=123
export const getBlockers = async (req: Request, res: Response) => {
  try {
    const sprintId = req.query.sprintId ? Number(req.query.sprintId) : undefined;
    if (req.query.sprintId && isNaN(Number(req.query.sprintId))) {
      return res.status(400).json({ error: 'Invalid sprintId' });
    }
    
    const blockers = await blockerService.getActiveBlockers(sprintId);
    res.json(blockers);
  } catch (error) {
    console.error('Error fetching blockers:', error);
    res.status(500).json({ error: 'Failed to fetch blockers' });
  }
};

// PATCH /api/blockers/:id/resolve
export const resolveBlocker = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid blocker ID' });
    }
    
    const blocker = await blockerService.resolveBlocker(id);
    res.json(blocker);
  } catch (error) {
    console.error('Error resolving blocker:', error);
    res.status(500).json({ error: 'Failed to resolve blocker' });
  }
};

// POST /api/blockers
export const createBlocker = async (req: Request, res: Response) => {
  try {
    const { description, severity, type, standupId } = req.body;
    
    if (!description || !severity) {
      return res.status(400).json({ error: 'Description and severity are required' });
    }
    
    const blocker = await blockerService.createBlocker({
      description,
      severity,
      type,
      standupId
    });
    
    res.status(201).json(blocker);
  } catch (error) {
    console.error('Error creating blocker:', error);
    res.status(500).json({ error: 'Failed to create blocker' });
  }
};

// POST /api/blockers/detect
export const detectBlockersInText = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    const detectedBlockers = blockerService.detectBlockers(text);
    res.json(detectedBlockers);
  } catch (error) {
    console.error('Error detecting blockers:', error);
    res.status(500).json({ error: 'Failed to detect blockers' });
  }
};