import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import standupRoutes from "./src/routes/standups.js";
import backlogRoutes from "./src/routes/backlog";
import sprintRoutes from "./src/routes/sprints.js";
import slackRoutes from "./src/routes/slack.js";
import jiraRoutes from "./src/routes/jira.js";

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

// Root route
app.get("/", (_req, res) => {
  res.send("AI Scrum Master Backend is running!");
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handling middleware
app.use((err, req, res, _next) => {
  console.error(err.stack || err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`AI Scrum Master backend running on port ${PORT}`);
});
