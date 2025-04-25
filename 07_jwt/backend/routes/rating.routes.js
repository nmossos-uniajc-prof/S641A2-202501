import { Router } from 'express';
import { createRating } from '../controllers/ratings.controller.js';
import { requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

// Crear una calificación para una película (solo críticos autorizados)
router.post('/movie/:movie_id', requireRole(['critic']), createRating);

export default router;