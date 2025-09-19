import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


export const summarizeStandup = async (description: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an AI Scrum Master. Summarize daily standups concisely."
        },
        {
          role: "user",
          content: `Summarize this standup update: ${description}`
        },
      ],
      temperature: 0.5,
      max_tokens: 150,
    });

    return response.choices[0]?.message?.content?.trim() || "No summary generated";
  } catch (error) {
    console.error("Error in AI summarization:", error);
    return "AI summarization failed";
  }
};


export const generateBacklogSuggestions = async (text: string): Promise<string[]> => {
  // TODO: Implement RAG using Pinecone/FAISS or vector DB
  return [];
};
