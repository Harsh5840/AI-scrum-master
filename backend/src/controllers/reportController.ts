import { type Request, type Response } from "express";
import * as reportService from "../services/reportServices.js";

// POST /api/reports/generate - Generate sprint report
export const generateReport = async (req: Request, res: Response) => {
  try {
    const { sprintId } = req.body;
    const userId = (req as any).user?.id;

    if (!sprintId) {
      return res.status(400).json({ error: "sprintId is required" });
    }

    // Get org from localStorage (passed from frontend)
    const orgId = req.body.orgId || 1; // Default to 1 for now

    const report = await reportService.generateSprintReport(
      parseInt(sprintId),
      orgId
    );

    // Save report for sharing
    reportService.saveReport(report);

    res.json(report);
  } catch (error: any) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: error.message || "Failed to generate report" });
  }
};

// GET /api/reports/:id - Get report (public for sharing)
export const getReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Report ID is required" });
    }

    const report = reportService.getReport(id);
    
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.json(report);
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(500).json({ error: "Failed to fetch report" });
  }
};

// GET /api/reports - Get all reports for org
export const getReports = async (req: Request, res: Response) => {
  try {
    const orgId = parseInt(req.query.orgId as string) || 1;

    const reports = reportService.getReportsByOrg(orgId);
    res.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};
