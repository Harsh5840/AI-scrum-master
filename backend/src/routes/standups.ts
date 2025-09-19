import { Router } from "express";
import { getStandups, createStandup, updateStandup, deleteStandup } from "../controllers/standupController.js";

const standupRouter = Router();


// GET /api/standups → fetch all standups, or by sprintId
standupRouter.get("/", getStandups);

// POST /api/standups → create a new standup
standupRouter.post("/", createStandup);

// PATCH /api/standups/:id → update a standup
standupRouter.patch("/:id", updateStandup);

// DELETE /api/standups/:id → delete a standup
standupRouter.delete("/:id", deleteStandup);

export default standupRouter;
