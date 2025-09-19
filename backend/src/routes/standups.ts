import { Router } from "express";
import { getStandups, createStandup } from "../controllers/standupController";

const standupRouter = Router();

// GET /api/standups → fetch all standups
standupRouter.get("/", getStandups);

// POST /api/standups → create a new standup
standupRouter.post("/", createStandup);

export default standupRouter;
