import { Router } from 'express';
import { getAllUsers, toggleUserStatus, getPlatformStats } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/users', getAllUsers);
router.get('/stats', getPlatformStats);
router.patch('/users/:userId/status', toggleUserStatus);

export default router;