import { Router } from 'express';
import {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
} from '../controllers/movies.controller.js';
import { requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

// Obtener todas las películas
router.get('/', getMovies);

// Obtener una película por ID
router.get('/:id', getMovieById);

// Crear una película (solo "admin")
router.post('/', requireRole(['admin']), createMovie);

// Actualizar una película (solo "admin")
router.put('/:id', requireRole(['admin']), updateMovie);

// Eliminar una película (solo "admin")
router.delete('/:id', requireRole(['admin']), deleteMovie);

export default router;