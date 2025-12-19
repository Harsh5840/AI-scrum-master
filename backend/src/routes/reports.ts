import { Router } from "express";
import {
  generateReport,
  getReport,
  getReports,
} from "../controllers/reportController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const reportRouter = Router();

// Protected routes
reportRouter.post("/generate", authMiddleware, generateReport);
reportRouter.get("/", authMiddleware, getReports);

// Public route - for shareable links
reportRouter.get("/:id", getReport);

export default reportRouter;
