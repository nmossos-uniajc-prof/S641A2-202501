import { pool } from "../config/db.config.js";

// Obtener comentarios para una película específica
export const getCommentByIdMovie = async (req, res) => {
  try {
    const { movie_id } = req.params;
    const [comments] = await pool.query(`
      SELECT c.comment_id, c.user_id, u.email, u.name, c.comment_text, c.created_at
      FROM Comment c
      JOIN User u ON c.user_id = u.user_id
      WHERE c.movie_id = ?
      ORDER BY c.created_at DESC
    `, [movie_id]);

    if (comments.length === 0) {
      return res.status(404).json({ error: 'Comentarios no encontrados para la película' });
    }

    res.json(comments);
  } catch (error) {
    console.error('Error al obtener los comentarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Crear un comentario para una película
export const createComment = async (req, res) => {
  const { movie_id } = req.params;
  const { comment } = req.body;
  const user_id = req.userId;

  try {
    if (!comment) {
      return res.status(400).json({ error: 'El comentario es requerido' });
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

    const [result] = await pool.query(
      'INSERT INTO Comment (user_id, movie_id, comment_text) VALUES (?, ?, ?)',
      [user_id, movie_id, comment]
    );
    res.status(201).json({
      comment_id: result.insertId,
      message: 'Comentario creado exitosamente'
    });
  } catch (error) {
    console.error('Error al crear el comentario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
