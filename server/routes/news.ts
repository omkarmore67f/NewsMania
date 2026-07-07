import { Router } from 'express';
import {
  getArticles,
  getArticleDetails,
  toggleBookmark,
  getBookmarks,
  getPersonalizedFeed,
  getAISummary,
  getExplainSimply,
  getDailyBriefing
} from '../controllers/NewsController';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuthMiddleware as any, getArticles as any);
router.get('/personalized', authMiddleware as any, getPersonalizedFeed as any);
router.get('/bookmarks', authMiddleware as any, getBookmarks as any);
router.post('/bookmarks/toggle', authMiddleware as any, toggleBookmark as any);
router.get('/briefing', getDailyBriefing as any);
router.get('/:id', optionalAuthMiddleware as any, getArticleDetails as any);
router.get('/:id/summary', getAISummary as any);
router.get('/:id/simplify', getExplainSimply as any);

export default router;
