import { Router } from 'express';
import { getFullCurriculumTree, getStudentProgressTree } from '../controllers/pathway.controller.js';

const router = Router();

router.get('/tree', getFullCurriculumTree);
router.get('/student/:studentId', getStudentProgressTree);

export default router;