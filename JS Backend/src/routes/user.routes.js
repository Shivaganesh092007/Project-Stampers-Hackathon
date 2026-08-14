import { Router } from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/user.controller.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:studentId', getUserProfile);

export default router;