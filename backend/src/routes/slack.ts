import { Router } from "express";
import {
  startOAuth,
  handleOAuthCallback,
  handleSlashCommand,
  handleEvents,
  getStatus,
  disconnect,
  sendTestMessage,
} from "../controllers/slackController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const slackRouter = Router();

// OAuth routes (partially public)
slackRouter.get("/oauth/install", authMiddleware, startOAuth);
slackRouter.get("/oauth/callback", handleOAuthCallback); // Public - Slack redirects here

// Slack webhook routes (public - called by Slack)
slackRouter.post("/slash", handleSlashCommand);
slackRouter.post("/events", handleEvents);

// Protected routes
slackRouter.get("/status", authMiddleware, getStatus);
slackRouter.post("/disconnect", authMiddleware, disconnect);
slackRouter.post("/test", authMiddleware, sendTestMessage);

export default slackRouter;
