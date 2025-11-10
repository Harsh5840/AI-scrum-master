import { jest } from '@jest/globals';

// Mock Prisma Client
export const mockPrismaClient = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  sprint: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  standup: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  blocker: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  workflow: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  $disconnect: jest.fn(),
};

// Mock Redis Client
export const mockRedisClient = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  exists: jest.fn(),
  expire: jest.fn(),
  disconnect: jest.fn(),
};

// Mock Gemini AI
export const mockGeminiModel = {
  generateContent: jest.fn(),
};

export const mockGemini = {
  getGenerativeModel: jest.fn(() => mockGeminiModel),
};

// Mock Pinecone
export const mockPineconeIndex = {
  query: jest.fn(),
  upsert: jest.fn(),
  delete: jest.fn(),
};

export const mockPinecone = {
  Index: jest.fn(() => mockPineconeIndex),
};

// Mock JWT Service
export const mockJwtService = {
  generateAccessToken: jest.fn((userId: number) => `access-token-${userId}`),
  generateRefreshToken: jest.fn((userId: number) => `refresh-token-${userId}`),
  verifyAccessToken: jest.fn(),
  verifyRefreshToken: jest.fn(),
};

// Mock Express Request
export const mockRequest = (overrides = {}) => ({
  body: {},
  params: {},
  query: {},
  headers: {},
  user: undefined,
  ...overrides,
});

// Mock Express Response
export const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

// Mock Express Next Function
export const mockNext = jest.fn();

// Helper to reset all mocks
export const resetAllMocks = () => {
  jest.clearAllMocks();
  Object.values(mockPrismaClient).forEach((mock: any) => {
    if (typeof mock === 'object') {
      Object.values(mock).forEach((fn: any) => {
        if (typeof fn.mockReset === 'function') {
          fn.mockReset();
        }
      });
    }
  });
};
