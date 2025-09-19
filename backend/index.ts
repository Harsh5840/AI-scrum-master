import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import standupRoutes from "./routes/standups";
import backlogRoutes from "./routes/backlog";
import sprintRoutes from "./routes/sprints";
import slackRoutes from "./routes/slack";
import jiraRoutes from "./routes/jira";

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/standups", standupRoutes);
app.use("/api/backlog", backlogRoutes);
app.use("/api/sprints", sprintRoutes);
app.use("/api/slack", slackRoutes);
app.use("/api/jira", jiraRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("AI Scrum Master Backend is running!");
});

// Error handling middleware (basic)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
app.listen(PORT, () => {
  console.log(` AI Scrum Master backend running on port ${PORT}`);
});
