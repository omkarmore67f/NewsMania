import { Router } from 'express';
import {
  getAdminStats,
  getUsersList,
  deleteUser,
  createNewsArticle,
  updateArticleFlags,
  deleteArticle,
  batchGenerateArticles
} from '../controllers/AdminController';
import { adminMiddleware } from '../middleware/auth';

const router = Router();

// Apply adminMiddleware to all administration endpoints
router.use(adminMiddleware as any);

router.get('/stats', getAdminStats as any);
router.get('/users', getUsersList as any);
router.delete('/users/:id', deleteUser as any);
router.post('/articles', createNewsArticle as any);
router.post('/articles/batch', batchGenerateArticles as any);
router.put('/articles/:id', updateArticleFlags as any);
router.delete('/articles/:id', deleteArticle as any);

export default router;
