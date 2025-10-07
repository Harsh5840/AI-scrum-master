import express, { type NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { type Request, type Response } from "express";

import authRoutes from "./src/routes/auth.js";
import standupRoutes from "./src/routes/standups.js";
import backlogRoutes from "./src/routes/backlog.js";
import sprintRoutes from "./src/routes/sprints.js";
import slackRoutes from "./src/routes/slack.js";
import jiraRoutes from "./src/routes/jira.js";
import blockerRoutes from "./src/routes/blockers.js";
import aiRoutes from "./src/routes/ai.js";
import workflowRoutes from "./src/routes/workflows.js";
import { vectorStore } from "./src/services/vectorServices.js";
import { queueManager } from "./src/services/queueServices.js";

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/standups", standupRoutes);
app.use("/api/backlog", backlogRoutes);
app.use("/api/sprints", sprintRoutes);
app.use("/api/slack", slackRoutes);
app.use("/api/jira", jiraRoutes);
app.use("/api/blockers", blockerRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/workflows", workflowRoutes);

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

// Initialize vector store and queue workers (optional)
async function initializeServices() {
  try {
    console.log('🚀 Initializing optional services...');
    // Comment out for now to allow server to start
    // await vectorStore.initialize();
    // await queueManager.initializeWorkers();
    console.log('✅ Services skipped for basic startup');
  } catch (error) {
    console.error('❌ Failed to initialize services:', error);
    // Continue without services if they fail
  }
}

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 AI Scrum Master backend running on port ${PORT}`);
  // Initialize services after server starts
  initializeServices().catch(console.error);
});
