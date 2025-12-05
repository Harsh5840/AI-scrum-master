import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const summarizeStandup = async (description: string): Promise<string> => {
  try {
    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.warn("⚠️  Gemini API key is not configured. Returning original description.");
      return description.substring(0, 200) + (description.length > 200 ? "..." : "");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are an AI Scrum Master. Summarize this daily standup update concisely:

${description}  

Provide a brief summary focusing on key points, accomplishments, and any blockers.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text?.trim() || "No summary generated";
  } catch (error) {
    console.error("Error in AI summarization:", error);
    return "AI summarization failed";
  }
};

export const detectBlockers = async (description: string): Promise<Array<{
  type: 'dependency' | 'technical' | 'resource' | 'external';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}>> => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("⚠️  Gemini API key is not configured. Skipping blocker detection.");
      return [];
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are an AI Scrum Master. Analyze this standup update and identify any blockers:

${description}

For each blocker found, respond with a JSON array in this exact format (no markdown, just JSON):
[
  {
    "type": "dependency" | "technical" | "resource" | "external",
    "severity": "low" | "medium" | "high" | "critical",
    "description": "Clear description of the blocker"
  }
]

If no blockers found, return an empty array: []`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      // Extract JSON from response (handle potential markdown code blocks)
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) return [];
      
      const blockers = JSON.parse(jsonMatch[0]);
      
      // Validate blocker structure
      return blockers.filter((b: any) => 
        ['dependency', 'technical', 'resource', 'external'].includes(b.type) &&
        ['low', 'medium', 'high', 'critical'].includes(b.severity) &&
        typeof b.description === 'string'
      );
    } catch (parseError) {
      console.error("Error parsing blocker JSON:", parseError);
      return [];
    }
  } catch (error) {
    console.error("Error in blocker detection:", error);
    return [];
  }
};

export const analyzeSentiment = async (text: string): Promise<{
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
  reasoning: string;
}> => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("⚠️  Gemini API key is not configured. Returning neutral sentiment.");
      return {
        sentiment: 'neutral',
        confidence: 0.5,
        reasoning: 'API not configured',
      };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are an AI Scrum Master analyzing team sentiment. Analyze this standup update:

${text}

Respond with a JSON object in this exact format (no markdown, just JSON):
{
  "sentiment": "positive" | "neutral" | "negative",
  "confidence": <0.0 to 1.0>,
  "reasoning": "Brief explanation of the sentiment analysis"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return {
          sentiment: 'neutral',
          confidence: 0.5,
          reasoning: 'Could not parse response',
        };
      }

      const analysis = JSON.parse(jsonMatch[0]);
      
      if (
        ['positive', 'neutral', 'negative'].includes(analysis.sentiment) &&
        typeof analysis.confidence === 'number' &&
        analysis.confidence >= 0 &&
        analysis.confidence <= 1
      ) {
        return analysis;
      }

      return {
        sentiment: 'neutral',
        confidence: 0.5,
        reasoning: 'Invalid response format',
      };
    } catch (parseError) {
      console.error("Error parsing sentiment JSON:", parseError);
      return {
        sentiment: 'neutral',
        confidence: 0.5,
        reasoning: 'Parse error',
      };
    }
  } catch (error) {
    console.error("Error in sentiment analysis:", error);
    return {
      sentiment: 'neutral',
      confidence: 0,
      reasoning: 'Analysis failed',
    };
  }
};

export const generateSprintInsights = async (
  standupSummaries: string[],
  sprintName: string,
  completedTasks: number,
  totalTasks: number
): Promise<string> => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("⚠️  Gemini API key is not configured. Skipping insights generation.");
      return "AI insights not available";
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const standupText = standupSummaries.join("\n\n");
    const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

    const prompt = `You are an AI Scrum Master. Generate actionable sprint insights based on:

Sprint Name: ${sprintName}
Completion Rate: ${completionRate}% (${completedTasks}/${totalTasks} tasks)

Daily Standup Summaries:
${standupText}

Provide concise, actionable insights on:
1. Team progress and velocity
2. Key achievements
3. Risks and challenges
4. Recommendations for next sprint`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text?.trim() || "No insights generated";
  } catch (error) {
    console.error("Error generating sprint insights:", error);
    return "Insights generation failed";
  }
};

export const generateBacklogSuggestions = async (text: string): Promise<string[]> => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("⚠️  Gemini API key is not configured. Skipping suggestions.");
      return [];
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are an AI Scrum Master. Based on this team feedback and standup:

${text}

Suggest potential backlog items that should be created. Respond with a JSON array of strings (no markdown, just JSON):
["Suggestion 1", "Suggestion 2", "Suggestion 3"]

Only include actionable and relevant suggestions.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    try {
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) return [];

      const suggestions = JSON.parse(jsonMatch[0]);
      return Array.isArray(suggestions) && suggestions.every(s => typeof s === 'string')
        ? suggestions
        : [];
    } catch (parseError) {
      console.error("Error parsing suggestions JSON:", parseError);
      return [];
    }
  } catch (error) {
    console.error("Error generating backlog suggestions:", error);
    return [];
  }
};

export const answerQuestion = async (question: string, context: string): Promise<string> => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("⚠️  Gemini API key is not configured. Cannot answer question.");
      return "AI service not available";
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are an AI Scrum Master assistant. Answer this question based on the team context provided:

Context (team standups, sprints, and activities):
${context}

Question: ${question}

Provide a helpful, specific answer based on the provided context. If the answer cannot be determined from the context, say so clearly.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text?.trim() || "Could not generate answer";
  } catch (error) {
    console.error("Error answering question:", error);
    return "Error processing question";
  }
};
