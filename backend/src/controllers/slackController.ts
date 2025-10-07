import { type Request,type Response } from "express";
import { postStandupToDB } from "../services/slackServices.js";

// POST /api/slack/slash → handle Slack slash commands
export const handleSlashCommand = async (req: Request, res: Response) => {
  try {
    const { user_id, text } = req.body;

    if (!user_id || !text) {
      return res.status(400).json({ error: "user_id and text are required" });
    }

    // Save standup via Slack service (includes AI summarization)
    const standup = await postStandupToDB(user_id, text);

    // Respond to Slack immediately
    res.json({ text: `Standup saved: ${standup.summary}` });
  } catch (error) {
    console.error("Error handling Slack command:", error);
    res.status(500).json({ error: "Failed to process Slack command" });
  }
};
