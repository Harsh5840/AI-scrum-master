import { type Request, type Response } from "express";
import * as sprintService from "../services/sprintServices.js";
import { resolveOrgId } from "../utils/orgContext.js";

// GET /api/sprints?filter=active|completed
export const getSprints = async (req: Request, res: Response) => {
  try {
    const filter = req.query.filter as 'active' | 'completed' | undefined;
    const orgId = await resolveOrgId((req as any).user);
    const sprints = await sprintService.getSprints(filter, orgId);
    res.json(sprints);
  } catch (error) {
    console.error("Error fetching sprints:", error);
    res.status(500).json({ error: "Failed to fetch sprints" });
  }
};

// GET /api/sprints/:id
export const getSprintById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid sprint ID" });
    }
    const orgId = await resolveOrgId((req as any).user);
    const sprint = await sprintService.getSprintWithSummary(id, orgId);
    if (!sprint) {
      return res.status(404).json({ error: "Sprint not found" });
    }
    res.json(sprint);
  } catch (error) {
    console.error("Error fetching sprint:", error);
    res.status(500).json({ error: "Failed to fetch sprint" });
  }
};

// POST /api/sprints
export const createSprint = async (req: Request, res: Response) => {
  try {
    const { name, startDate, endDate } = req.body;
    if (!name || !startDate || !endDate) {
      return res.status(400).json({ error: "name, startDate, and endDate are required" });
    }
    const orgId = await resolveOrgId((req as any).user);
    const sprint = await sprintService.createSprint({
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      orgId,
    });
    res.status(201).json(sprint);
  } catch (error) {
    console.error("Error creating sprint:", error);
    res.status(500).json({ error: "Failed to create sprint" });
  }
};

// PATCH /api/sprints/:id
export const updateSprint = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid sprint ID" });
    const { endDate } = req.body;
    if (!endDate) return res.status(400).json({ error: "endDate is required" });
    const orgId = await resolveOrgId((req as any).user);
    const sprint = await sprintService.updateSprint(id, { endDate: new Date(endDate) }, orgId);
    res.json(sprint);
  } catch (error: any) {
    if (error?.message === 'Sprint not found') {
      return res.status(404).json({ error: "Sprint not found" });
    }
    console.error("Error updating sprint:", error);
    res.status(500).json({ error: "Failed to update sprint" });
  }
};

// DELETE /api/sprints/:id
export const deleteSprint = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid sprint ID" });
    const orgId = await resolveOrgId((req as any).user);
    await sprintService.deleteSprint(id, orgId);
    res.status(204).send();
  } catch (error: any) {
    if (error?.message === 'Sprint not found') {
      return res.status(404).json({ error: "Sprint not found" });
    }
    console.error("Error deleting sprint:", error);
    res.status(500).json({ error: "Failed to delete sprint" });
  }
};

// GET /api/sprints/:id/summary
export const getSprintSummary = async (req: Request, res: Response) => {
  try {
    const sprintId = Number(req.params.id);
    if (isNaN(sprintId)) {
      return res.status(400).json({ error: "Invalid sprint ID" });
    }
    const orgId = await resolveOrgId((req as any).user);
    const sprint = await sprintService.getSprintWithSummary(sprintId, orgId);
    if (!sprint) {
      return res.status(404).json({ error: "Sprint not found" });
    }
    res.json(sprint);
  } catch (error) {
    console.error("Error fetching sprint summary:", error);
    res.status(500).json({ error: "Failed to fetch sprint summary" });
  }
};
