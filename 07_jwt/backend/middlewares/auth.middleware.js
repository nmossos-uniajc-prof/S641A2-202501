import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const key_jwt = process.env.JWT_SECRET;

export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];  // Formato: Bearer <token>
    if (!token) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    try {
      const { userId, email, name, role } = jwt.verify(token, key_jwt);
      if (!allowedRoles.includes(role)) {
        return res.status(403).json({ error: 'Acceso no autorizado' });
      }
      req.userId = userId;
      req.email = email;
      req.name = name;
      req.role = role;
      next();
    } catch (error) {
      return res.status(403).json({ error: 'Token inválido' });
    }
  };
};