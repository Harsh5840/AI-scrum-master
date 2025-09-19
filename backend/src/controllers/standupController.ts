import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { summarizeStandup } from "../services/aiService";

const prisma = new PrismaClient();

// GET /api/standups
export const getStandups = async (req: Request, res: Response) => {
  try {
    const standups = await prisma.standup.findMany({
      include: { user: true }, // Include user info
      orderBy: { createdAt: "desc" },
    });
    res.json(standups);
  } catch (error) {
    console.error("Error fetching standups:", error);
    res.status(500).json({ error: "Failed to fetch standups" });
  }
};

// POST /api/standups
export const createStandup = async (req: Request, res: Response) => {
  try {
    const { userId, description } = req.body;

    if (!userId || !description) {
      return res.status(400).json({ error: "userId and description are required" });
    }

    // Generate AI summary
    const summary = await summarizeStandup(description);

    // Save standup in DB
    const standup = await prisma.standup.create({
      data: {
        userId,
        summary,
      },
    });

    res.status(201).json(standup);
  } catch (error) {
    console.error("Error creating standup:", error);
    res.status(500).json({ error: "Failed to create standup" });
  }
};
