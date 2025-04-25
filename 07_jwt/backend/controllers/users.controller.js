import { pool } from "../config/db.config.js";

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT user_id, email, name, country, city, birthdate, role
      FROM User
    `);

    if (users.length === 0) {
      return res.status(404).json({ error: 'No se encontraron usuarios' });
    }

    res.json(users);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [users] = await pool.query(`
      SELECT user_id, email, name, country, city, birthdate, role
      FROM User
      WHERE user_id = ?
    `, [id]);

    if (users.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar datos de un usuario
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, country, city, birthdate, role } = req.body;

    const [result] = await pool.query(
      `UPDATE User SET
        email = ?,
        name = ?,
        country = ?,
        city = ?,
        birthdate = ?,
        role = ?
       WHERE user_id = ?`,
      [email, name, country, city, birthdate, role, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Eliminar un usuario
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'DELETE FROM User WHERE user_id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};