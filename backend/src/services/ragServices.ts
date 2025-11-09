import { GoogleGenerativeAI } from '@google/generative-ai';
import { vectorStore } from './vectorServices.js';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface RAGResponse {
  answer: string;
  context: string;
  sources: Array<{
    type: string;
    id: number;
    relevanceScore: number;
  }>;
}

export const generateRAGResponse = async (
  query: string,
  options: {
    sprintId?: number;
    userId?: number;
    includeTypes?: Array<'standup' | 'sprint' | 'blocker' | 'backlog'>;
    systemPrompt?: string;
  } = {}
): Promise<RAGResponse> => {
  // Check if Gemini API key is configured
  if (!process.env.GEMINI_API_KEY) {
    console.warn("⚠️  Gemini API key is not configured. Set GEMINI_API_KEY environment variable.");
    return {
      answer: "AI integration is not configured. Please set the GEMINI_API_KEY environment variable.",
      context: "",
      sources: []
    };
  }

  try {
    // Try to get relevant context from vector store, but continue without it if not available
    let context = "";
    let sources: Array<{type: string; id: number; relevanceScore: number}> = [];
    
    try {
      // Get relevant context from vector store
      const contextOptions: any = { maxResults: 5 };
      if (options.sprintId) contextOptions.sprintId = options.sprintId;
      if (options.userId) contextOptions.userId = options.userId;
      if (options.includeTypes) contextOptions.includeTypes = options.includeTypes;
      
      context = await vectorStore.getContextForQuery(query, contextOptions);

      // Get sources for transparency
      const searchOptions: any = { topK: 5 };
      if (options.sprintId) searchOptions.filter = { sprintId: options.sprintId };
      
      const similarDocs = await vectorStore.searchSimilar(query, searchOptions);

      sources = similarDocs.map(doc => ({
        type: doc.metadata.type,
        id: doc.metadata.id,
        relevanceScore: doc.score,
      }));
    } catch (vectorError) {
      console.warn("⚠️  Vector store not available, proceeding without context:", vectorError);
      context = "No historical context available (vector store not configured).";
    }

    // Default system prompt for scrum master
    const defaultSystemPrompt = `You are an AI Scrum Master assistant. You help teams with sprint planning, standup analysis, and blocker resolution.

Use the provided context to answer questions accurately. If the context doesn't contain enough information, say so clearly.

Be concise, actionable, and focus on helping the team improve their workflow.

Context from team history:
${context}`;

    const systemPrompt = options.systemPrompt || defaultSystemPrompt;

    // Generate response using Google Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const fullPrompt = `${systemPrompt}

User Question: ${query}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const answer = response.text() || 'No response generated';

    return {
      answer,
      context,
      sources,
    };
  } catch (error) {
    console.error('❌ Failed to generate RAG response:', error);
    return {
      answer: `Error generating AI response: ${error instanceof Error ? error.message : 'Unknown error'}`,
      context: "",
      sources: []
    };
  }
};

export const summarizeStandupWithContext = async (
  description: string,
  sprintId?: number
): Promise<string> => {
  try {
    let context = "";
    try {
      // Get relevant context for better summarization
      const contextOptions: any = {
        includeTypes: ['standup', 'blocker'],
        maxResults: 3,
      };
      if (sprintId) contextOptions.sprintId = sprintId;
      
      context = await vectorStore.getContextForQuery(description, contextOptions);
    } catch (vectorError) {
      console.warn("⚠️  Vector store not available, using simple summarization:", vectorError);
      return generateSimpleSummary(description);
    }

    const systemPrompt = `You are an AI Scrum Master. Summarize this standup update concisely, highlighting:
1. Key accomplishments
2. Current work
3. Any blockers or issues
4. Next steps

Consider the team's recent history for context:
${context}

Keep the summary under 100 words and actionable.

Standup to summarize: ${description}`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;

    return response.text() || 'Summary generation failed';
  } catch (error) {
    console.error('❌ Failed to generate contextual summary:', error);
    // Fallback to simple summarization
    return generateSimpleSummary(description);
  }
};

const generateSimpleSummary = async (description: string): Promise<string> => {
  const prompt = `Summarize this standup update in 2-3 sentences, focusing on accomplishments, current work, and blockers:

${description}`;

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text() || 'Summary generation failed';
};

export const generateSprintInsights = async (sprintId: number): Promise<string> => {
  // Check if Gemini API key is configured
  if (!process.env.GEMINI_API_KEY) {
    console.warn("⚠️  Gemini API key is not configured. Set GEMINI_API_KEY environment variable.");
    return "AI integration is not configured. Please set the GEMINI_API_KEY environment variable to enable sprint insights.";
  }

  try {
    let context = "";
    try {
      context = await vectorStore.getContextForQuery('sprint progress blockers velocity', {
        sprintId,
        includeTypes: ['standup', 'blocker', 'sprint'],
        maxResults: 10,
      });
    } catch (vectorError) {
      console.warn("⚠️  Vector store not available, proceeding without context:", vectorError);
      context = "No historical context available (vector store not configured).";
    }

    const systemPrompt = `You are an AI Scrum Master analyzing sprint performance. Based on the team's standups and blockers, provide insights on:

1. Sprint progress and velocity
2. Common blockers and patterns
3. Team collaboration and communication
4. Recommendations for improvement

Team data:
${context}

Provide actionable insights in bullet points.

Please analyze this sprint and provide insights.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;

    return response.text() || 'Analysis failed';
  } catch (error) {
    console.error('❌ Failed to generate sprint insights:', error);
    return `Error generating sprint insights: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
};
