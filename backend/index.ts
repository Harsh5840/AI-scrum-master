import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import standupRoutes from './routes/standups';
import slackRoutes from './routes/slack';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/standups', standupRoutes);
app.use('/api/slack', slackRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`AI Scrum Master backend running on port ${PORT}`);
});
