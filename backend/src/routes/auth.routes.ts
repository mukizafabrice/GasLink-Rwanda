import { Router } from 'express';
import { register, login, getProfile, logout } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', authenticate, getProfile);
router.post('/logout', authenticate, logout);

export default router;