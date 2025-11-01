import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const summarizeStandup = async (description: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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


export const generateBacklogSuggestions = async (text: string): Promise<string[]> => {
  // TODO: Implement RAG using Pinecone/FAISS or vector DB
  return [];
};
