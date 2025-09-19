import { Router } from "express";
import { getStandups, createStandup } from "../controllers/standupController";

const standUpRouter = Router();

standUpRouter.get("/", getStandups);
standUpRouter.post("/", createStandup);

export default standUpRouter;
