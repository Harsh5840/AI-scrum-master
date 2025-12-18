import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface SlackOAuthResponse {
  ok: boolean;
  access_token: string;
  token_type: string;
  scope: string;
  bot_user_id: string;
  app_id: string;
  team: { id: string; name: string };
  authed_user: { id: string };
  incoming_webhook?: {
    channel: string;
    channel_id: string;
    url: string;
  };
}

// Exchange OAuth code for access token
export const exchangeSlackCode = async (code: string): Promise<SlackOAuthResponse> => {
  const response = await fetch("https://slack.com/api/oauth.v2.access", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.SLACK_CLIENT_ID || "",
      client_secret: process.env.SLACK_CLIENT_SECRET || "",
      code,
      redirect_uri: `${process.env.BACKEND_URL}/api/slack/oauth/callback`,
    }),
  });

  const data = await response.json();
  if (!data.ok) {
    throw new Error(data.error || "Slack OAuth failed");
  }

  return data;
};

// Save Slack integration
export const saveSlackIntegration = async (
  orgId: number,
  oauthResponse: SlackOAuthResponse
) => {
  return prisma.integration.upsert({
    where: { orgId_type: { orgId, type: "slack" } },
    update: {
      accessToken: oauthResponse.access_token,
      config: {
        teamId: oauthResponse.team.id,
        teamName: oauthResponse.team.name,
        botUserId: oauthResponse.bot_user_id,
        webhookUrl: oauthResponse.incoming_webhook?.url,
        webhookChannel: oauthResponse.incoming_webhook?.channel,
      },
      status: "active",
    },
    create: {
      orgId,
      type: "slack",
      accessToken: oauthResponse.access_token,
      config: {
        teamId: oauthResponse.team.id,
        teamName: oauthResponse.team.name,
        botUserId: oauthResponse.bot_user_id,
        webhookUrl: oauthResponse.incoming_webhook?.url,
        webhookChannel: oauthResponse.incoming_webhook?.channel,
      },
      status: "active",
    },
  });
};

// Get Slack integration for org
export const getSlackIntegration = async (orgId: number) => {
  return prisma.integration.findUnique({
    where: { orgId_type: { orgId, type: "slack" } },
  });
};

// Disconnect Slack
export const disconnectSlack = async (orgId: number) => {
  return prisma.integration.update({
    where: { orgId_type: { orgId, type: "slack" } },
    data: { status: "disconnected", accessToken: null },
  });
};

// Post message to Slack channel
export const postToSlack = async (
  accessToken: string,
  channel: string,
  text: string,
  blocks?: any[]
) => {
  const response = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channel,
      text,
      blocks,
    }),
  });

  return response.json();
};

// Parse standup from Slack message
export const parseStandupMessage = (text: string) => {
  // Expected format: /standup Yesterday: ... | Today: ... | Blockers: ...
  const parts = text.split("|").map((p) => p.trim());

  let yesterday = "";
  let today = "";
  let blockers = "";

  parts.forEach((part) => {
    const lowerPart = part.toLowerCase();
    if (lowerPart.startsWith("yesterday:")) {
      yesterday = part.substring(10).trim();
    } else if (lowerPart.startsWith("today:")) {
      today = part.substring(6).trim();
    } else if (lowerPart.startsWith("blockers:") || lowerPart.startsWith("blocker:")) {
      blockers = part.substring(part.indexOf(":") + 1).trim();
    }
  });

  // If no format detected, use entire text as summary
  if (!yesterday && !today && !blockers) {
    return { summary: text, blockers: null };
  }

  const summary = [
    yesterday && `Yesterday: ${yesterday}`,
    today && `Today: ${today}`,
  ]
    .filter(Boolean)
    .join(" | ");

  return {
    summary: summary || text,
    blockers: blockers || null,
  };
};

// Create standup from Slack command
export const createStandupFromSlack = async (
  slackUserId: string,
  text: string,
  orgId?: number
) => {
  // Try to find user by slack ID (would need to store this mapping)
  // For now, create with a placeholder or match by email
  const { summary, blockers } = parseStandupMessage(text);

  // Create standup
  const standup = await prisma.standup.create({
    data: {
      userId: 1, // TODO: Map Slack user to app user
      orgId,
      summary,
    },
  });

  // Create blocker if provided
  if (blockers) {
    await prisma.blocker.create({
      data: {
        standupId: standup.id,
        orgId,
        description: blockers,
        type: "technical",
        severity: "medium",
        status: "active",
      },
    });
  }

  return standup;
};

// Send standup reminder to Slack channel
export const sendStandupReminder = async (orgId: number) => {
  const integration = await getSlackIntegration(orgId);
  if (!integration || integration.status !== "active" || !integration.accessToken) {
    return null;
  }

  const config = integration.config as any;
  if (!config?.webhookChannel) return null;

  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "🌅 *Good morning team!* Time for your daily standup.",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Use `/standup` to share your update:\n```/standup Yesterday: What I did | Today: What I'll do | Blockers: Any issues```",
      },
    },
    {
      type: "divider",
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: "💡 _Tip: Keep updates brief and focused_",
        },
      ],
    },
  ];

  return postToSlack(
    integration.accessToken,
    config.webhookChannel,
    "Time for your daily standup!",
    blocks
  );
};

// Send blocker alert to Slack
export const sendBlockerAlert = async (
  orgId: number,
  blockerDescription: string,
  userName: string
) => {
  const integration = await getSlackIntegration(orgId);
  if (!integration || integration.status !== "active" || !integration.accessToken) {
    return null;
  }

  const config = integration.config as any;
  if (!config?.webhookChannel) return null;

  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `🚨 *New Blocker Reported* by ${userName}`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `> ${blockerDescription}`,
      },
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: { type: "plain_text", text: "View in Dashboard" },
          url: `${process.env.FRONTEND_URL}/blockers`,
        },
      ],
    },
  ];

  return postToSlack(
    integration.accessToken,
    config.webhookChannel,
    `New blocker from ${userName}: ${blockerDescription}`,
    blocks
  );
};
