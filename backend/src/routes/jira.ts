import { Router } from "express";
import { createJiraTicket, getBacklogItems } from "../controllers/jiraController.js";

const jiraRouter = Router();

// GET /api/jira/backlog → fetch backlog items from Jira
jiraRouter.get("/backlog", getBacklogItems);

// POST /api/jira/ticket → create a new Jira ticket
jiraRouter.post("/ticket", createJiraTicket);

export default jiraRouter;
