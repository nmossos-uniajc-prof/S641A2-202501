import { Router } from 'express';
import { register, login, changePassword, forceChangePassword } from '../controllers/auth.controller.js';
import { requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.put('/passwordChange/:id', requireRole(['admin', 'critic']), changePassword);
router.put('/fpc/:id', requireRole(['admin']), forceChangePassword);

export default router;