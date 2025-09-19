import { Router } from "express";
import { getSprints, createSprint, getSprintSummary, updateSprint, deleteSprint } from "../controllers/sprintController.js";

const sprintRouter = Router();

// GET /api/sprints → fetch all sprints
sprintRouter.get("/", getSprints);

// POST /api/sprints → create a new sprint
sprintRouter.post("/", createSprint);

// GET /api/sprints/:id/summary → get sprint summary (burndown, velocity)
sprintRouter.get("/:id/summary", getSprintSummary);

// PATCH /api/sprints/:id → update a sprint
sprintRouter.patch("/:id", updateSprint);

// DELETE /api/sprints/:id → delete a sprint
sprintRouter.delete("/:id", deleteSprint);

export default sprintRouter;
