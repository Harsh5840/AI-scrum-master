import { Router } from 'express';
import { getBlockers, resolveBlocker, detectBlockersInText } from '../controllers/blockerController.js';

const blockerRouter = Router();

// GET /api/blockers → get all active blockers (optionally filter by sprint)
blockerRouter.get('/', getBlockers);

// PATCH /api/blockers/:id/resolve → resolve a blocker
blockerRouter.patch('/:id/resolve', resolveBlocker);

// POST /api/blockers/detect → detect blockers in text (testing endpoint)
blockerRouter.post('/detect', detectBlockersInText);

export default blockerRouter;