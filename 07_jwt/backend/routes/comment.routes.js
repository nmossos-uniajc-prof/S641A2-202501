import { Router } from 'express';
import { getCommentByIdMovie, createComment } from '../controllers/comments.controller.js';
import { requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

// Obtener comentarios de una película
router.get('/movie/:movie_id', getCommentByIdMovie);

// Crear un comentario (solo críticos autorizados)
router.post('/movie/:movie_id', requireRole(['critic']), createComment);

export default router;