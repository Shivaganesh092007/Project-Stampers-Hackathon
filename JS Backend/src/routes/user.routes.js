import { Router } from 'express';
import { 
    registerUser, 
    loginUser, 
    getUserProfile, 
    refreshAccessToken, 
    logoutUser 
} from '../controllers/user.controller.js';
import verifyJWT from '../middlewares/auth.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshAccessToken);
router.post('/logout', verifyJWT, logoutUser);
router.get('/:studentId', getUserProfile);

export default router;