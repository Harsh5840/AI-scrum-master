import { type Request, type Response } from 'express';
import { generateRAGResponse, generateSprintInsights } from '../services/ragServices.js';

// POST /api/ai/ask
export const askAI = async (req: Request, res: Response) => {
  try {
    const { question, sprintId, userId, includeTypes } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const response = await generateRAGResponse(question, {
      sprintId,
      userId,
      includeTypes,
    });

    res.json(response);
  } catch (error) {
    console.error('Error generating AI response:', error);
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
};

// GET /api/ai/sprint/:id/insights
export const getSprintInsights = async (req: Request, res: Response) => {
  try {
    const sprintId = Number(req.params.id);
    if (isNaN(sprintId)) {
      return res.status(400).json({ error: 'Invalid sprint ID' });
    }

    const insights = await generateSprintInsights(sprintId);
    res.json({ insights });
  } catch (error) {
    console.error('Error generating sprint insights:', error);
    res.status(500).json({ error: 'Failed to generate sprint insights' });
  }
};