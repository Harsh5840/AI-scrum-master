import { PrismaClient } from "@prisma/client";
import { summarizeStandup } from "./aiServices.js";
import dotenv from 'dotenv';

dotenv.config();

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

// Enhanced Slack messaging for workflow notifications
export const sendSlackMessage = async (channel: string, message: string, attachments?: any[]) => {
  try {
    // In a real implementation, this would use the Slack Web API
    // For now, we'll log the message and simulate success
    console.log(`📩 Slack Message to ${channel}:`);
    console.log(`📝 ${message}`);
    
    if (attachments && attachments.length > 0) {
      console.log(`📎 Attachments:`, attachments);
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      success: true,
      channel,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('❌ Failed to send Slack message:', error);
    throw new Error('Failed to send Slack notification');
  }
};

export const sendSprintAlert = async (sprintName: string, alertType: 'risk' | 'completion' | 'health', details: any) => {
  const emojis = {
    risk: '⚠️',
    completion: '🏁',
    health: '🏥',
  };
  
  const emoji = emojis[alertType];
  const channel = '#sprint-alerts';
  
  let message = `${emoji} **Sprint ${alertType.toUpperCase()} Alert: ${sprintName}**\n\n`;
  
  switch (alertType) {
    case 'risk':
      message += `🚨 Risk Level: ${details.riskScore > 0.8 ? 'CRITICAL' : details.riskScore > 0.6 ? 'HIGH' : 'MEDIUM'}\n`;
      message += `📊 Velocity Trend: ${details.velocityTrend > 0 ? '📈 Improving' : details.velocityTrend < 0 ? '📉 Declining' : '➡️ Stable'}\n`;
      if (details.blockers > 0) {
        message += `🚧 Active Blockers: ${details.blockers}\n`;
      }
      break;
      
    case 'completion':
      message += `✅ Completion Rate: ${(details.completionRate * 100).toFixed(1)}%\n`;
      message += `📋 Items Completed: ${details.completed}/${details.total}\n`;
      break;
      
    case 'health':
      message += `💚 Overall Health Score: ${(details.healthScore * 100).toFixed(1)}%\n`;
      message += `😊 Team Sentiment: ${details.sentiment > 0 ? 'Positive' : details.sentiment < 0 ? 'Needs Attention' : 'Neutral'}\n`;
      break;
  }
  
  if (details.insights && details.insights.length > 0) {
    message += `\n💡 **Key Insights:**\n`;
    details.insights.slice(0, 3).forEach((insight: string, index: number) => {
      message += `${index + 1}. ${insight}\n`;
    });
  }
  
  if (details.recommendations && details.recommendations.length > 0) {
    message += `\n🎯 **Recommendations:**\n`;
    details.recommendations.slice(0, 3).forEach((rec: string, index: number) => {
      message += `• ${rec}\n`;
    });
  }
  
  return await sendSlackMessage(channel, message);
};

export const sendBlockerAlert = async (blockerDetails: any) => {
  const channel = '#dev-team';
  const severity = blockerDetails.severity || 'medium';
  const emoji = severity === 'high' ? '🔴' : severity === 'medium' ? '🟡' : '🟢';
  
  let message = `${emoji} **Blocker Detected**\n\n`;
  message += `🧱 **Description:** ${blockerDetails.description}\n`;
  message += `📊 **Severity:** ${severity.toUpperCase()}\n`;
  message += `👤 **Reported by:** ${blockerDetails.reportedBy}\n`;
  
  if (blockerDetails.isRecurring) {
    message += `🔄 **Status:** Recurring pattern detected\n`;
  }
  
  if (blockerDetails.suggestedActions && blockerDetails.suggestedActions.length > 0) {
    message += `\n🛠️ **Suggested Actions:**\n`;
    blockerDetails.suggestedActions.forEach((action: string, index: number) => {
      message += `${index + 1}. ${action}\n`;
    });
  }
  
  return await sendSlackMessage(channel, message);
};

export const sendTeamInsightDigest = async (insights: any) => {
  const channel = '#team-insights';
  
  let message = `📊 **Weekly Team Insights Digest**\n\n`;
  message += `📅 **Period:** ${insights.period}\n`;
  message += `👥 **Active Members:** ${insights.activeMembers}\n`;
  message += `📝 **Total Standups:** ${insights.totalStandups}\n`;
  message += `🚧 **Blockers Resolved:** ${insights.blockersResolved}\n`;
  message += `⚡ **Average Velocity:** ${insights.averageVelocity}\n\n`;
  
  if (insights.topPerformers && insights.topPerformers.length > 0) {
    message += `🌟 **Top Contributors:**\n`;
    insights.topPerformers.forEach((performer: any, index: number) => {
      message += `${index + 1}. ${performer.name} (${performer.contributions} contributions)\n`;
    });
    message += `\n`;
  }
  
  if (insights.recommendations && insights.recommendations.length > 0) {
    message += `💡 **Key Recommendations:**\n`;
    insights.recommendations.forEach((rec: string, index: number) => {
      message += `• ${rec}\n`;
    });
  }
  
  return await sendSlackMessage(channel, message);
};

export const sendAIInsight = async (insightType: string, insight: any) => {
  const channel = '#ai-insights';
  
  let message = `🤖 **AI-Generated Insight: ${insightType}**\n\n`;
  message += `${insight.description}\n\n`;
  
  if (insight.confidence) {
    message += `🎯 **Confidence Level:** ${(insight.confidence * 100).toFixed(1)}%\n`;
  }
  
  if (insight.actionItems && insight.actionItems.length > 0) {
    message += `\n✅ **Suggested Actions:**\n`;
    insight.actionItems.forEach((action: string, index: number) => {
      message += `${index + 1}. ${action}\n`;
    });
  }
  
  return await sendSlackMessage(channel, message);
};
