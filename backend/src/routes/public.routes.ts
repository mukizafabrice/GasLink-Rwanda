import { Router } from 'express';
import { getPublicPlatformStats } from '../controllers/public.controller';

const router = Router();

router.get('/platform-stats', getPublicPlatformStats);

export default router;
