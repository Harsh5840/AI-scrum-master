import { type Request, type Response } from "express";
import { summarizeStandup } from "../services/aiServices.js";
import * as standupService from "../services/standupServices.js";

// GET /api/standups?sprintId=123
export const getStandups = async (req: Request, res: Response) => {
  try {
    const sprintId = req.query.sprintId ? Number(req.query.sprintId) : undefined;
    if (req.query.sprintId && isNaN(Number(req.query.sprintId))) {
      return res.status(400).json({ error: "Invalid sprintId" });
    }
    const standups = await standupService.getStandups(sprintId);
    res.json(standups);
  } catch (error) {
    console.error("Error fetching standups:", error);
    res.status(500).json({ error: "Failed to fetch standups" });
  }
};

// POST /api/standups
export const createStandup = async (req: Request, res: Response) => {
  try {
    const { userId, sprintId, description } = req.body;
    if (!userId || !description) {
      return res.status(400).json({ error: "userId and description are required" });
    }
    // Generate AI summary
    const summary = await summarizeStandup(description);
    // Save standup in DB
    const standup = await standupService.createStandup({
      userId,
      sprintId,
      summary,
    });
    res.status(201).json(standup);
  } catch (error) {
    console.error("Error creating standup:", error);
    res.status(500).json({ error: "Failed to create standup" });
  }
};

// PATCH /api/standups/:id
export const updateStandup = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid standup ID" });
    const { summary } = req.body;
    if (!summary) return res.status(400).json({ error: "summary is required" });
    const standup = await standupService.updateStandup(id, { summary });
    res.json(standup);
  } catch (error) {
    console.error("Error updating standup:", error);
    res.status(500).json({ error: "Failed to update standup" });
  }
};

// DELETE /api/standups/:id
export const deleteStandup = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid standup ID" });
    await standupService.deleteStandup(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting standup:", error);
    res.status(500).json({ error: "Failed to delete standup" });
  }
};
