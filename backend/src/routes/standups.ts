import { Router } from "express";
import { getStandups, createStandup, updateStandup, deleteStandup } from "../controllers/standupController.js";
import { validateBody, validateParams, validateQuery } from "../validation/middleware.js";
import { createStandupSchema, updateStandupSchema, standupIdSchema, standupFilterSchema } from "../validation/schemas.js";

const standupRouter = Router();

// GET /api/standups → fetch all standups, or by sprintId
standupRouter.get("/", validateQuery(standupFilterSchema), getStandups);

// POST /api/standups → create a new standup
standupRouter.post("/", validateBody(createStandupSchema), createStandup);

// PATCH /api/standups/:id → update a standup
standupRouter.patch("/:id", validateParams(standupIdSchema), validateBody(updateStandupSchema), updateStandup);

// DELETE /api/standups/:id → delete a standup
standupRouter.delete("/:id", validateParams(standupIdSchema), deleteStandup);

export default standupRouter;
