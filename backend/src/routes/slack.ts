import { Router } from "express";
import { handleSlashCommand } from "../controllers/slackController.js";

const slackRouter = Router();

// POST /api/slack/slash → handle Slack slash commands
slackRouter.post("/slash", handleSlashCommand);

export default slackRouter;
