import { pool } from "../config/db.config.js";

// Crear una calificación para una película
export const createRating = async (req, res) => {
  const { movie_id } = req.params;
  const { rating } = req.body;
  const user_id = req.userId;

  try {
    if (!rating) {
      return res.status(400).json({ error: 'La calificación es requerida' });
    }

    // Verificar que el usuario tenga rol de "critic"
    const [users] = await pool.query(
      'SELECT user_id FROM User WHERE user_id = ? AND role = "critic"',
      [user_id]
    );
    if (users.length === 0) {
      return res.status(400).json({ error: 'El usuario no es un crítico autorizado' });
    }

    // Verificar que la película exista
    const [movies] = await pool.query(
      'SELECT movie_id FROM Movie WHERE movie_id = ?',
      [movie_id]
    );
    if (movies.length === 0) {
      return res.status(400).json({ error: 'La película no está registrada' });
    }

    // Verificar que no se haya realizado una calificacion previa
    const [rating_prev] = await pool.query(
        'SELECT rating FROM Rating WHERE movie_id = ? AND user_id = ?',
        [movie_id, user_id]
      );
      if (rating_prev.length !== 0) {
        return res.status(400).json({ error: 'La película ya fue calificada previamente por el usuario' });
      }

    const [result] = await pool.query(
      'INSERT INTO Rating (user_id, movie_id, rating) VALUES (?, ?, ?)',
      [user_id, movie_id, rating]
    );
    res.status(201).json({
      rating_id: result.insertId,
      message: 'Calificación creada exitosamente'
    });
  } catch (error) {
    console.error('Error al crear la calificación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};