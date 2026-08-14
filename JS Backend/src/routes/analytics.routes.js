import { Router } from 'express';
import { getStudentAnalytics } from '../controllers/analytics.controller.js';

const router = Router();

router.get('/student/:studentId', getStudentAnalytics);

export default router;