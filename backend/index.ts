import express, { type NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import { type Request, type Response } from "express";
import path from "path";
import { fileURLToPath } from "url";

// Get current file path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env with explicit path
dotenv.config({ path: path.join(__dirname, '.env') });

// Debug: Check if environment variables are loaded
console.log('🔍 Environment Check:');
console.log('  - JWT_SECRET:', process.env.JWT_SECRET ? 'SET ✅' : 'NOT SET ❌');
console.log('  - DATABASE_URL:', process.env.DATABASE_URL ? 'SET ✅' : 'NOT SET ❌');
console.log('  - SESSION_SECRET:', process.env.SESSION_SECRET ? 'SET ✅' : 'NOT SET ❌');

import passport from "./src/config/passport.js";
import { authMiddleware } from "./src/middleware/authMiddleware.js";
import authRoutes from "./src/routes/auth.js";
import standupRoutes from "./src/routes/standups.js";
import backlogRoutes from "./src/routes/backlog.js";
import sprintRoutes from "./src/routes/sprints.js";
import slackRoutes from "./src/routes/slack.js";
import jiraRoutes from "./src/routes/jira.js";
import blockerRoutes from "./src/routes/blockers.js";
import aiRoutes from "./src/routes/ai.js";
import workflowRoutes from "./src/routes/workflows.js";
import { vectorStore } from "./src/services/vectorServices.js";
import { queueManager } from "./src/services/queueServices.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'https://ai-scrum-master-pi.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());
app.use(cookieParser());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Request logging middleware
app.use((req, _res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use("/api/auth", authRoutes);

// Protected routes - require authentication
app.use("/api/standups", authMiddleware, standupRoutes);
app.use("/api/backlog", authMiddleware, backlogRoutes);
app.use("/api/sprints", authMiddleware, sprintRoutes);
app.use("/api/slack", authMiddleware, slackRoutes);
app.use("/api/jira", authMiddleware, jiraRoutes);
app.use("/api/blockers", authMiddleware, blockerRoutes);
app.use("/api/ai", authMiddleware, aiRoutes);
app.use("/api/workflows", authMiddleware, workflowRoutes);

// Root route
app.get("/", (_req, res) => {
  res.send("AI Scrum Master Backend is running!");
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack || err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Initialize vector store and queue workers (optional)
async function initializeServices() {
  try {
    console.log('🚀 Initializing optional services...');
    // Comment out for now to allow server to start
    // await vectorStore.initialize();
    // await queueManager.initializeWorkers();
    console.log('✅ Services skipped for basic startup');
  } catch (error) {
    console.error('❌ Failed to initialize services:', error);
    // Continue without services if they fail
  }
}

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 AI Scrum Master backend running on port ${PORT}`);
  // Initialize services after server starts
  initializeServices().catch(console.error);
});
