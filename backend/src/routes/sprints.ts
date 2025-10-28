import { Router } from "express";
import { getSprints, createSprint, getSprintById, getSprintSummary, updateSprint, deleteSprint } from "../controllers/sprintController.js";
import { validateBody, validateParams, validateQuery } from "../validation/middleware.js";
import { createSprintSchema, updateSprintSchema, sprintIdSchema, sprintFilterSchema } from "../validation/schemas.js";

const sprintRouter = Router();

// GET /api/sprints → fetch all sprints
sprintRouter.get("/", validateQuery(sprintFilterSchema), getSprints);

// POST /api/sprints → create a new sprint
sprintRouter.post("/", validateBody(createSprintSchema), createSprint);

// GET /api/sprints/:id → get single sprint
sprintRouter.get("/:id", validateParams(sprintIdSchema), getSprintById);

// GET /api/sprints/:id/summary → get sprint summary (burndown, velocity)
sprintRouter.get("/:id/summary", validateParams(sprintIdSchema), getSprintSummary);

// PATCH /api/sprints/:id → update a sprint
sprintRouter.patch("/:id", validateParams(sprintIdSchema), validateBody(updateSprintSchema), updateSprint);

// DELETE /api/sprints/:id → delete a sprint
sprintRouter.delete("/:id", validateParams(sprintIdSchema), deleteSprint);

export default sprintRouter;
