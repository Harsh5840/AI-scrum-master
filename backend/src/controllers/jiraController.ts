import { type Request,type Response } from "express";
import { fetchJiraBacklog, createJiraIssue } from "../services/jiraServices.js";

/**
 * GET /api/jira/backlog
 * Fetch backlog items from Jira
 */
export const getBacklogItems = async (req: Request, res: Response) => {
  try {
    const backlogItems = await fetchJiraBacklog();
    res.json(backlogItems);
  } catch (error) {
    console.error("Error fetching Jira backlog:", error);
    res.status(500).json({ error: "Failed to fetch Jira backlog" });
  }
};

/**
 * POST /api/jira/ticket
 * Create a new Jira ticket
 * Expects: { summary: string, description?: string, issueType?: string }
 */
export const createJiraTicket = async (req: Request, res: Response) => {
  try {
    const { summary, description, issueType } = req.body;

    if (!summary) {
      return res.status(400).json({ error: "summary is required" });
    }

    const ticket = await createJiraIssue({ summary, description, issueType });
    res.status(201).json(ticket);
  } catch (error) {
    console.error("Error creating Jira ticket:", error);
    res.status(500).json({ error: "Failed to create Jira ticket" });
  }
};
