import { Router } from 'express';
import { getTrendingDashboard } from '../controllers/AnalyticsController';

const router = Router();

router.get('/dashboard', getTrendingDashboard);

export default router;
