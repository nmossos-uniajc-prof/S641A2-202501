import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/users.controller.js';
import { requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

// Obtener lista de usuarios (solo "admin")
router.get('/', requireRole(['admin']), getUsers);

// Obtener usuario por ID (admin y critic pueden ver la información)
router.get('/:id', requireRole(['admin', 'critic']), getUserById);

// Actualizar usuario (admin y critic)
router.put('/:id', requireRole(['admin', 'critic']), updateUser);

// Eliminar usuario (solo "admin")
router.delete('/:id', requireRole(['admin']), deleteUser);

export default router;