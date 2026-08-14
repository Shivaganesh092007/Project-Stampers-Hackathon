import { Router } from 'express';
import {
    handleMainAgentChat,
    getMainAgentHistory,
    evaluateCodeSubmission,
    getEvaluationHistory,
    handleDoubtAgentChat,
    getDoubtAgentHistory
} from '../controllers/agent.controller.js';

const router = Router();

// Main Agent
router.post('/main/chat', handleMainAgentChat);
router.get('/main/history/:studentId/:subtopicId', getMainAgentHistory);

// Evaluation Agent
router.post('/evaluate', evaluateCodeSubmission);
router.get('/evaluate/history/:studentId/:subtopicId', getEvaluationHistory);

// Doubt Agent
router.post('/doubt/chat', handleDoubtAgentChat);
router.get('/doubt/history/:studentId/:subtopicId', getDoubtAgentHistory);

export default router;