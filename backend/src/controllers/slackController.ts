import { type Request, type Response } from "express";
import * as slackService from "../services/slackServices.js";

// GET /api/slack/oauth/install - Start OAuth flow
export const startOAuth = async (req: Request, res: Response) => {
  try {
    const orgId = req.query.orgId as string;
    if (!orgId) {
      return res.status(400).json({ error: "orgId is required" });
    }

    const scopes = [
      "commands",
      "chat:write",
      "chat:write.public",
      "incoming-webhook",
      "users:read",
    ].join(",");

    const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${process.env.SLACK_CLIENT_ID}&scope=${scopes}&redirect_uri=${encodeURIComponent(
      `${process.env.BACKEND_URL}/api/slack/oauth/callback`
    )}&state=${orgId}`;

    res.redirect(slackAuthUrl);
  } catch (error) {
    console.error("Error starting Slack OAuth:", error);
    res.status(500).json({ error: "Failed to start OAuth" });
  }
};

// GET /api/slack/oauth/callback - Handle OAuth callback
export const handleOAuthCallback = async (req: Request, res: Response) => {
  try {
    const { code, state: orgId, error: slackError } = req.query;

    if (slackError) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/settings?slack_error=${slackError}`
      );
    }

    if (!code || !orgId) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/settings?slack_error=missing_params`
      );
    }

    // Exchange code for token
    const oauthResponse = await slackService.exchangeSlackCode(code as string);

    // Save integration
    await slackService.saveSlackIntegration(
      parseInt(orgId as string),
      oauthResponse
    );

    // Redirect to settings with success
    res.redirect(`${process.env.FRONTEND_URL}/settings?slack_connected=true`);
  } catch (error) {
    console.error("Error handling Slack OAuth callback:", error);
    res.redirect(`${process.env.FRONTEND_URL}/settings?slack_error=oauth_failed`);
  }
};

// POST /api/slack/slash - Handle slash commands (/standup)
export const handleSlashCommand = async (req: Request, res: Response) => {
  try {
    const { command, text, user_id, team_id, response_url } = req.body;

    // Acknowledge immediately (Slack requires response within 3 seconds)
    res.json({
      response_type: "ephemeral",
      text: "⏳ Processing your standup...",
    });

    // Process standup async
    try {
      const standup = await slackService.createStandupFromSlack(user_id, text);

      // Send follow-up message
      await fetch(response_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          response_type: "in_channel",
          text: `✅ Standup recorded!`,
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*Standup Update*\n${standup.summary}`,
              },
            },
            {
              type: "context",
              elements: [
                {
                  type: "mrkdwn",
                  text: `Posted by <@${user_id}> | <${process.env.FRONTEND_URL}/standups|View in Dashboard>`,
                },
              ],
            },
          ],
        }),
      });
    } catch (error) {
      console.error("Error processing standup:", error);
      await fetch(response_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          response_type: "ephemeral",
          text: "❌ Failed to save standup. Please try again.",
        }),
      });
    }
  } catch (error) {
    console.error("Error handling Slack command:", error);
    res.status(500).json({ error: "Failed to process command" });
  }
};

// POST /api/slack/events - Handle Slack events
export const handleEvents = async (req: Request, res: Response) => {
  try {
    const { type, challenge, event } = req.body;

    // URL verification challenge
    if (type === "url_verification") {
      return res.json({ challenge });
    }

    // Handle events
    if (type === "event_callback") {
      // Process event async
      setImmediate(async () => {
        try {
          if (event.type === "app_mention") {
            // Bot was mentioned, could trigger AI response
            console.log("Bot mentioned:", event.text);
          } else if (event.type === "message" && !event.bot_id) {
            // DM to bot, could be standup
            console.log("Message received:", event.text);
          }
        } catch (error) {
          console.error("Error processing Slack event:", error);
        }
      });
    }

    res.json({ ok: true });
  } catch (error) {
    console.error("Error handling Slack events:", error);
    res.status(500).json({ error: "Failed to process event" });
  }
};

// GET /api/slack/status - Check Slack connection status
export const getStatus = async (req: Request, res: Response) => {
  try {
    const orgId = parseInt(req.query.orgId as string);
    if (!orgId) {
      return res.status(400).json({ error: "orgId is required" });
    }

    const integration = await slackService.getSlackIntegration(orgId);

    if (!integration) {
      return res.json({ connected: false });
    }

    const config = integration.config as any;
    res.json({
      connected: integration.status === "active",
      teamName: config?.teamName,
      channel: config?.webhookChannel,
    });
  } catch (error) {
    console.error("Error checking Slack status:", error);
    res.status(500).json({ error: "Failed to check status" });
  }
};

// POST /api/slack/disconnect - Disconnect Slack
export const disconnect = async (req: Request, res: Response) => {
  try {
    const orgId = parseInt(req.body.orgId);
    if (!orgId) {
      return res.status(400).json({ error: "orgId is required" });
    }

    await slackService.disconnectSlack(orgId);
    res.json({ success: true });
  } catch (error) {
    console.error("Error disconnecting Slack:", error);
    res.status(500).json({ error: "Failed to disconnect" });
  }
};

// POST /api/slack/test - Send test message
export const sendTestMessage = async (req: Request, res: Response) => {
  try {
    const orgId = parseInt(req.body.orgId);
    if (!orgId) {
      return res.status(400).json({ error: "orgId is required" });
    }

    const integration = await slackService.getSlackIntegration(orgId);
    if (!integration || !integration.accessToken) {
      return res.status(400).json({ error: "Slack not connected" });
    }

    const config = integration.config as any;
    if (!config?.webhookChannel) {
      return res.status(400).json({ error: "No channel configured" });
    }

    await slackService.postToSlack(
      integration.accessToken,
      config.webhookChannel,
      "🎉 Test message from AI Scrum Master! Your Slack integration is working."
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Error sending test message:", error);
    res.status(500).json({ error: "Failed to send test message" });
  }
};
