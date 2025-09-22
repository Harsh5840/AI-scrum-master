import express, { type NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { type Request, type Response } from "express";

import standupRoutes from "./src/routes/standups.js";
import backlogRoutes from "./src/routes/backlog.js";
import sprintRoutes from "./src/routes/sprints.js";
import slackRoutes from "./src/routes/slack.js";
import jiraRoutes from "./src/routes/jira.js";
import blockerRoutes from "./src/routes/blockers.js";
import aiRoutes from "./src/routes/ai.js";
import { vectorStore } from "./src/services/vectorServices.js";

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/standups", standupRoutes);
app.use("/api/backlog", backlogRoutes);
app.use("/api/sprints", sprintRoutes);
app.use("/api/slack", slackRoutes);
app.use("/api/jira", jiraRoutes);
app.use("/api/blockers", blockerRoutes);
app.use("/api/ai", aiRoutes);

// Root route
app.get("/", (_req, res) => {
  res.send("AI Scrum Master Backend is running!");
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack || err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Initialize vector store
async function initializeServices() {
  try {
    await vectorStore.initialize();
    console.log('🚀 All services initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize services:', error);
    // Continue without vector store if it fails
  }
}

// Start the server
initializeServices().then(() => {
  app.listen(PORT, () => {
    console.log(`AI Scrum Master backend running on port ${PORT}`);
  });
});
