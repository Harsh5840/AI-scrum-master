import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Pinecone client
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || '',
});

// Initialize OpenAI embeddings
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY || '',
  modelName: 'text-embedding-ada-002',
});

// Text splitter for chunking documents
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

export interface EmbeddingMetadata {
  type: 'standup' | 'sprint' | 'blocker' | 'backlog';
  id: number;
  userId?: number;
  sprintId?: number;
  severity?: string;
  createdAt: string;
  [key: string]: any;
}

export class VectorStore {
  private vectorStore: PineconeStore | null = null;
  private index: any = null;

  async initialize() {
    try {
      this.index = pinecone.Index(process.env.PINECONE_INDEX_NAME || 'ai-scrum-master');
      
      this.vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex: this.index,
        textKey: 'text',
      });
      
      console.log('✅ Vector store initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize vector store:', error);
      throw error;
    }
  }

  async addDocument(text: string, metadata: EmbeddingMetadata): Promise<string> {
    if (!this.vectorStore) {
      throw new Error('Vector store not initialized');
    }

    try {
      // Split text into chunks if it's large
      const chunks = await textSplitter.splitText(text);
      const documents = chunks.map((chunk, index) => new Document({
        pageContent: chunk,
        metadata: {
          ...metadata,
          chunkIndex: index,
          totalChunks: chunks.length,
        },
      }));

      const ids = await this.vectorStore.addDocuments(documents);
      console.log(`✅ Added ${documents.length} document chunks for ${metadata.type} ID ${metadata.id}`);
      if (!ids[0]) {
        throw new Error('No document ID returned from vector store');
      }
      return ids[0];
    } catch (error) {
      console.error('❌ Failed to add document:', error);
      throw error;
    }
  }

  async searchSimilar(query: string, options: {
    filter?: Record<string, any>;
    topK?: number;
  } = {}): Promise<Array<{ content: string; metadata: EmbeddingMetadata; score: number }>> {
    if (!this.vectorStore) {
      throw new Error('Vector store not initialized');
    }

    try {
      const { topK = 5, filter } = options;
      
      const queryEmbedding = await embeddings.embedQuery(query);
      const results = await this.vectorStore.similaritySearchVectorWithScore(queryEmbedding, topK, filter);
      
      return results.map(([doc, score]) => ({
        content: doc.pageContent,
        metadata: doc.metadata as EmbeddingMetadata,
        score,
      }));
    } catch (error) {
      console.error('❌ Failed to search similar documents:', error);
      throw error;
    }
  }

  async getContextForQuery(query: string, options: {
    sprintId?: number;
    userId?: number;
    includeTypes?: Array<'standup' | 'sprint' | 'blocker' | 'backlog'>;
    maxResults?: number;
  } = {}): Promise<string> {
    const { sprintId, userId, includeTypes, maxResults = 5 } = options;
    
    // Build filter
    const filter: Record<string, any> = {};
    if (sprintId) filter.sprintId = sprintId;
    if (userId) filter.userId = userId;
    if (includeTypes && includeTypes.length > 0) {
      filter.type = { $in: includeTypes };
    }

    const searchOptions: { filter?: Record<string, any>; topK: number } = { topK: maxResults };
    if (Object.keys(filter).length > 0) {
      searchOptions.filter = filter;
    }
    const results = await this.searchSimilar(query, searchOptions);

    // Format context for AI
    const context = results
      .map((result, index) => {
        const { type, id, createdAt } = result.metadata;
        return `[${index + 1}] ${type.toUpperCase()} (ID: ${id}, ${new Date(createdAt).toLocaleDateString()}):\n${result.content}`;
      })
      .join('\n\n');

    return context;
  }

  async deleteDocument(filter: Record<string, any>): Promise<void> {
    if (!this.index) {
      throw new Error('Pinecone index not initialized');
    }

    try {
      await this.index.deleteMany(filter);
      console.log('✅ Documents deleted successfully');
    } catch (error) {
      console.error('❌ Failed to delete documents:', error);
      throw error;
    }
  }
}

// Singleton instance
export const vectorStore = new VectorStore();