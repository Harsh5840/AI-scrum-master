import { PrismaClient } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import crypto from "crypto";

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

interface SprintReport {
  id: string;
  sprintId: number;
  orgId: number;
  title: string;
  summary: string;
  metrics: {
    totalStoryPoints: number;
    completedStoryPoints: number;
    completionRate: number;
    velocity: number;
    totalTasks: number;
    completedTasks: number;
    blockerCount: number;
    standupCount: number;
  };
  highlights: string[];
  risks: string[];
  recommendations: string[];
  generatedAt: Date;
}

// Generate unique report ID
const generateReportId = (): string => {
  return crypto.randomBytes(16).toString("hex");
};

// Generate AI-powered sprint report
export const generateSprintReport = async (
  sprintId: number,
  orgId: number
): Promise<SprintReport> => {
  // Fetch sprint with all related data
  const sprint = await prisma.sprint.findUnique({
    where: { id: sprintId },
    include: {
      backlogItems: true,
      standups: {
        include: {
          blockers: true,
        },
      },
    },
  });

  if (!sprint) {
    throw new Error("Sprint not found");
  }

  // Calculate metrics
  const backlogItems = sprint.backlogItems || [];
  const standups = sprint.standups || [];
  
  const totalStoryPoints = backlogItems.reduce(
    (sum, item) => sum + (item.storyPoints || 0),
    0
  );
  const completedStoryPoints = backlogItems
    .filter((item) => item.completed || item.status === "done")
    .reduce((sum, item) => sum + (item.storyPoints || 0), 0);
  
  const totalTasks = backlogItems.length;
  const completedTasks = backlogItems.filter(
    (item) => item.completed || item.status === "done"
  ).length;
  
  const completionRate =
    totalStoryPoints > 0
      ? Math.round((completedStoryPoints / totalStoryPoints) * 100)
      : 0;
  
  const startDate = new Date(sprint.startDate);
  const endDate = new Date(sprint.endDate);
  const weeks = Math.max(
    1,
    Math.ceil((endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000))
  );
  const velocity = Math.round(completedStoryPoints / weeks);
  
  const allBlockers = standups.flatMap((s) => s.blockers || []);
  const blockerCount = allBlockers.filter((b) => b.status === "active").length;

  const metrics = {
    totalStoryPoints,
    completedStoryPoints,
    completionRate,
    velocity,
    totalTasks,
    completedTasks,
    blockerCount,
    standupCount: standups.length,
  };

  // Generate AI summary
  let summary = "";
  let highlights: string[] = [];
  let risks: string[] = [];
  let recommendations: string[] = [];

  if (process.env.GEMINI_API_KEY) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const standupSummaries = standups.map((s) => s.summary).join("\n");
      const blockerDescriptions = allBlockers.map((b) => b.description).join("\n");

      const prompt = `You are an AI Scrum Master generating an executive sprint report.

Sprint: ${sprint.name}
Duration: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}

Metrics:
- Story Points: ${completedStoryPoints}/${totalStoryPoints} (${completionRate}% complete)
- Tasks: ${completedTasks}/${totalTasks} completed
- Velocity: ${velocity} points/week
- Active Blockers: ${blockerCount}
- Standups: ${metrics.standupCount} recorded

Standup Summaries:
${standupSummaries || "No standups recorded"}

Blockers:
${blockerDescriptions || "No blockers recorded"}

Generate a JSON response with this exact format (no markdown):
{
  "summary": "2-3 sentence executive summary of the sprint",
  "highlights": ["Achievement 1", "Achievement 2", "Achievement 3"],
  "risks": ["Risk or issue 1", "Risk or issue 2"],
  "recommendations": ["Action item 1", "Action item 2", "Action item 3"]
}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          summary = parsed.summary || "";
          highlights = parsed.highlights || [];
          risks = parsed.risks || [];
          recommendations = parsed.recommendations || [];
        }
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
      }
    } catch (aiError) {
      console.error("AI generation error:", aiError);
    }
  }

  // Fallback if AI fails
  if (!summary) {
    summary = `Sprint "${sprint.name}" achieved ${completionRate}% completion with ${completedStoryPoints} story points delivered. ${blockerCount > 0 ? `${blockerCount} active blockers need attention.` : "No blockers."}`;
    highlights = completedTasks > 0 ? [`Completed ${completedTasks} tasks`] : [];
    risks = blockerCount > 0 ? [`${blockerCount} unresolved blockers`] : [];
    recommendations = completionRate < 80 ? ["Review scope for next sprint"] : ["Continue current pace"];
  }

  const report: SprintReport = {
    id: generateReportId(),
    sprintId,
    orgId,
    title: `${sprint.name} - Sprint Report`,
    summary,
    metrics,
    highlights,
    risks,
    recommendations,
    generatedAt: new Date(),
  };

  return report;
};

// Store reports in memory (in production, use Redis or DB)
const reportCache = new Map<string, SprintReport>();

export const saveReport = (report: SprintReport): void => {
  reportCache.set(report.id, report);
};

export const getReport = (reportId: string): SprintReport | undefined => {
  return reportCache.get(reportId);
};

export const getReportsByOrg = (orgId: number): SprintReport[] => {
  return Array.from(reportCache.values()).filter((r) => r.orgId === orgId);
};
