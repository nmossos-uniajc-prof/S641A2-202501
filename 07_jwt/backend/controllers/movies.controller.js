import { pool } from "../config/db.config.js";

// Obtener todas las películas con sus datos adicionales
export const getMovies = async (req, res) => {
  try {
    const [movies] = await pool.query(`
      SELECT m.*, c.name AS classification,
             (SELECT ROUND(AVG(rating), 1) FROM Rating r WHERE r.movie_id = m.movie_id) as rating,
             (SELECT COUNT(*) FROM Comment co WHERE co.movie_id = m.movie_id) as n_comments,
             GROUP_CONCAT(g.name SEPARATOR ', ') AS genres
      FROM Movie m
      JOIN Classification c ON m.classification_id = c.classification_id
      LEFT JOIN MovieGenre mg ON m.movie_id = mg.movie_id
      LEFT JOIN Genre g ON mg.genre_id = g.genre_id
      GROUP BY m.movie_id
    `);

    const formattedMovies = movies.map(movie => ({
      ...movie,
      genres: movie.genres ? movie.genres.split(', ') : []
    }));

    res.json(formattedMovies);
  } catch (error) {
    console.error('Error al obtener películas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener una película por su ID
export const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;
    const [movies] = await pool.query(`
      SELECT m.*, c.name AS classification,
             GROUP_CONCAT(g.name SEPARATOR ', ') AS genres
      FROM Movie m
      JOIN Classification c ON m.classification_id = c.classification_id
      LEFT JOIN MovieGenre mg ON m.movie_id = mg.movie_id
      LEFT JOIN Genre g ON mg.genre_id = g.genre_id
      WHERE m.movie_id = ?
      GROUP BY m.movie_id
    `, [id]);

    if (movies.length === 0) {
      return res.status(404).json({ error: 'Película no encontrada' });
    }

    const movie = {
      ...movies[0],
      genres: movies[0].genres ? movies[0].genres.split(', ') : []
    };

    res.json(movie);
  } catch (error) {
    console.error('Error al obtener película:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Crear una nueva película
export const createMovie = async (req, res) => {
  try {
    const {
      title,
      release_date,
      nationality,
      director,
      protagonists,
      cast,
      synopsis,
      classification_id,
      genres
    } = req.body;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Insertar película
      const [movieResult] = await connection.query(
        `INSERT INTO Movie (
          title,
          release_date,
          nationality,
          director,
          protagonists,
          cast,
          synopsis,
          classification_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, release_date, nationality, director, protagonists, cast, synopsis, classification_id]
      );

      // Insertar géneros asociados a la película
      if (genres && genres.length > 0) {
        const genreInserts = genres.map(genre_id => [movieResult.insertId, genre_id]);
        await connection.query(
          'INSERT INTO MovieGenre (movie_id, genre_id) VALUES ?',
          [genreInserts]
        );
      }

      await connection.commit();
      res.status(201).json({
        movieId: movieResult.insertId,
        message: 'Película creada exitosamente'
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error al crear película:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar datos de una película
export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      release_date,
      nationality,
      director,
      protagonists,
      cast,
      synopsis,
      classification_id,
      genres
    } = req.body;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Actualizar la película
      const [result] = await connection.query(
        `UPDATE Movie SET
          title = ?,
          release_date = ?,
          nationality = ?,
          director = ?,
          protagonists = ?,
          cast = ?,
          synopsis = ?,
          classification_id = ?
         WHERE movie_id = ?`,
        [title, release_date, nationality, director, protagonists, cast, synopsis, classification_id, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Película no encontrada' });
      }

      // Actualizar géneros: eliminar los existentes e insertar los nuevos
      await connection.query('DELETE FROM MovieGenre WHERE movie_id = ?', [id]);
      if (genres && genres.length > 0) {
        const genreInserts = genres.map(genre_id => [id, genre_id]);
        await connection.query(
          'INSERT INTO MovieGenre (movie_id, genre_id) VALUES ?',
          [genreInserts]
        );
      }

      await connection.commit();
      res.json({ message: 'Película actualizada exitosamente' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error al actualizar película:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Eliminar una película (verifica que no tenga comentarios asociados)
export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si existen comentarios asociados a la película
    const [comments] = await pool.query(
      'SELECT * FROM Comment WHERE movie_id = ?',
      [id]
    );

    if (comments.length > 0) {
      return res.status(400).json({
        error: 'No se puede eliminar una película con comentarios'
      });
    }

    const [result] = await pool.query(
      'DELETE FROM Movie WHERE movie_id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Película no encontrada' });
    }

    res.json({ message: 'Película eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar película:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};