import { PrismaClient } from "@prisma/client";
import { summarizeStandup } from "./aiServices.js";

const prisma = new PrismaClient();

export const postStandupToDB = async (slackUserId: string, text: string) => {
  try {
    // Map Slack userId to a DB user (for now, using email pattern)
    let user = await prisma.user.findFirst({
      where: { email: `${slackUserId}@example.com` },
    });

    // If user does not exist, create a placeholder user
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: `SlackUser-${slackUserId}`,
          email: `${slackUserId}@example.com`,
        },
      });
    }

    // Generate AI summary
    const summary = await summarizeStandup(text);

    // Save standup in DB
    const standup = await prisma.standup.create({
      data: {
        userId: user.id,
        summary,
      },
    });

    return standup;
  } catch (error) {
    console.error("Error posting standup from Slack:", error);
    throw new Error("Failed to save standup from Slack");
  }
};
