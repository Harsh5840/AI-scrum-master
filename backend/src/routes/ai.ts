import { Router } from 'express';
import { askAI, getSprintInsights } from '../controllers/aiController.js';

const aiRouter = Router();

// POST /api/ai/ask → Ask AI questions with context
aiRouter.post('/ask', askAI);

// GET /api/ai/sprint/:id/insights → Get AI insights for a sprint
aiRouter.get('/sprint/:id/insights', getSprintInsights);

export default aiRouter;