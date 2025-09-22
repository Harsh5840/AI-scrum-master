import express from 'express';
import {
  triggerSprintAnalysis,
  triggerStandupAnalysis,
  triggerRiskAssessment,
  getQueueStatus,
  getJobStatus,
  getSprintInsights,
  getTeamInsights,
  enableAutomation,
  disableAutomation,
} from '../controllers/workflowController.js';

const router = express.Router();

// Manual workflow triggers
router.post('/sprint/:sprintId/analysis', triggerSprintAnalysis);
router.post('/standup/:standupId/analysis', triggerStandupAnalysis);
router.post('/risk-assessment', triggerRiskAssessment);

// Queue monitoring
router.get('/queue/status', getQueueStatus);
router.get('/job/:jobId/status', getJobStatus);

// Insights and analytics
router.get('/sprint/:sprintId/insights', getSprintInsights);
router.get('/team/insights', getTeamInsights);

// Automation controls
router.post('/automation/enable', enableAutomation);
router.post('/automation/disable', disableAutomation);

export default router;