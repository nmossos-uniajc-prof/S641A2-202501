import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.config.js';

const key_jwt = process.env.JWT_SECRET || '93!SFSCDDSodsfk923*ada';

export const register = async (req, res) => {
  try {
    const { email, name, country, city, birthdate, password } = req.body;
    if (!email || !name || !country || !city || !birthdate || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const [users] = await pool.query('SELECT * FROM User WHERE email = ?', [email]);
    if (users.length > 0) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO User (email, name, country, city, birthdate, password, role) VALUES (?, ?, ?, ?, ?, ?, "critic")',
      [email, name, country, city, birthdate, hashedPassword]
    );

    const token = jwt.sign(
      { userId: result.insertId, email, name, role: 'critic' },
      key_jwt,
      { expiresIn: '1h' }
    );

    res.status(201).json({ token });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ error: 'Credenciales requeridas' });
      }
  
      const [users] = await pool.query('SELECT * FROM User WHERE email = ?', [email]);
      if (users.length === 0) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
  
      const user = users[0];
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
  
      const token = jwt.sign(
        { userId: user.user_id, email: user.email, name: user.name, role: user.role },
        process.env.JWT_SECRET || key_jwt,
        { expiresIn: '1h' }
      );
  
      res.json({ token });
  
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
  
  export const changePassword = async (req, res) => {
    try {
      const { id } = req.params;
      const { oldPassword, newPassword } = req.body;
  
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
      }
  
      const [users] = await pool.query('SELECT * FROM User WHERE user_id = ?', [id]);
      if (users.length === 0) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
  
      const user = users[0];
      const isValidPassword = await bcrypt.compare(oldPassword, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const [result] = await pool.query(
        `UPDATE User SET
            password = ?
          WHERE user_id = ?`,
        [hashedPassword, id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      res.json({ message: 'Usuario actualizado exitosamente' });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
  
  export const forceChangePassword = async (req, res) => {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;
  
      if (!newPassword) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const [result] = await pool.query(
        `UPDATE User SET
            password = ?
          WHERE user_id = ?`,
        [hashedPassword, id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      res.json({ message: 'Usuario actualizado exitosamente' });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };