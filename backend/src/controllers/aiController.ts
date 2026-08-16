import { type Request, type Response } from 'express';
import { generateRAGResponse, generateSprintInsights } from '../services/ragServices.js';

// POST /api/ai/ask
export const askAI = async (req: Request, res: Response) => {
  try {
    const { question, query, sprintId, userId, includeTypes } = req.body;
    const prompt = question || query;

    if (!prompt) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const response = await generateRAGResponse(prompt, {
      sprintId,
      userId: userId || (req as any).user?.id,
      includeTypes,
    });

    res.json({
      success: true,
      response: response.answer,
      answer: response.answer,
      context: response.context,
      sources: response.sources,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error generating AI response:', error);
    res.status(500).json({ 
      error: 'Failed to generate AI response',
      message: error.message || 'Unknown error'
    });
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
  } catch (error: any) {
    console.error('Error generating sprint insights:', error);
    res.status(500).json({ 
      error: 'Failed to generate sprint insights',
      message: error.message || 'Unknown error'
    });
  }
};