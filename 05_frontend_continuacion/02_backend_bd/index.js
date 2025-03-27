const express = require('express');
const cors = require('cors')
const mysql = require('mysql2/promise');
const app = express();
app.use(express.json());
app.use(cors())

// Configuración de la conexión a MySQL
const pool = mysql.createPool({
    host: 'localhost',
    user: 'userdb',
    password: 'clavedb',
    database: 'cinema',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// CRUD para Películas

// Obtener todas las películas
app.get('/peliculas', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.id, p.titulo, p.fecha_estreno, p.nacionalidad, p.clasificacion_id, c.descripcion as clasificacion, p.director, GROUP_CONCAT(g.id) AS generos_id, GROUP_CONCAT(g.nombre) AS generos
            FROM pelicula p JOIN clasificacion c ON p.clasificacion_id = c.id
            LEFT JOIN pelicula_genero pg ON p.id = pg.pelicula_id
            LEFT JOIN genero g ON pg.genero_id = g.id
            GROUP BY p.id
        `);
        const result = rows.map(e=> {return {
            ...e,
            fecha_estreno: e.fecha_estreno.toISOString().split("T")[0],
            generos_id: e.generos_id ? e.generos_id.split(',').map(x => parseInt(x)) : [],
            generos: e.generos ? e.generos.split(',') : []
        }});
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener una película por ID
app.get('/peliculas/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const [rows] = await pool.query(`
            SELECT p.id, p.titulo, p.fecha_estreno, p.nacionalidad, p.clasificacion_id, c.descripcion as clasificacion, p.director, GROUP_CONCAT(g.id) AS generos_id, GROUP_CONCAT(g.nombre) AS generos
            FROM pelicula p JOIN clasificacion c ON p.clasificacion_id = c.id
            LEFT JOIN pelicula_genero pg ON p.id = pg.pelicula_id
            LEFT JOIN genero g ON pg.genero_id = g.id
            WHERE p.id = ?
            GROUP BY p.id
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Película no encontrada' });
        }
        
        // Convertir los géneros de string a array
        const pelicula = {
            ...rows[0],
            fecha_estreno: rows[0].fecha_estreno.toISOString().split("T")[0],
            generos_id: rows[0].generos_id ? rows[0].generos_id.split(',').map(x => parseInt(x)) : [],
            generos: rows[0].generos ? rows[0].generos.split(',') : []
        };
        
        res.json(pelicula);
        //res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear nueva película
app.post('/peliculas', async (req, res) => {
    const { titulo, fecha_estreno, nacionalidad, clasificacion_id, director, generos } = req.body;
    
    try {
        const [result] = await pool.query(
            'INSERT INTO pelicula SET ?',
            { titulo, fecha_estreno, nacionalidad, clasificacion_id, director }
        );
        
        if (generos && generos.length > 0) {
            const peliculaId = result.insertId;
            const values = generos.map(generoId => [peliculaId, generoId]);
            await pool.query(
                'INSERT INTO pelicula_genero (pelicula_id, genero_id) VALUES ?',
                [values]
            );
        }
        
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Actualizar película
app.put('/peliculas/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo, fecha_estreno, nacionalidad, clasificacion_id, director, generos } = req.body;
    
    try {
        await pool.query(
            'UPDATE pelicula SET ? WHERE id = ?',
            [{ titulo, fecha_estreno, nacionalidad, clasificacion_id, director }, id]
        );
        
        // Actualizar géneros
        await pool.query('DELETE FROM pelicula_genero WHERE pelicula_id = ?', [id]);
        if (generos && generos.length > 0) {
            const values = generos.map(generoId => [id, generoId]);
            await pool.query(
                'INSERT INTO pelicula_genero (pelicula_id, genero_id) VALUES ?',
                [values]
            );
        }
        
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Eliminar película
app.delete('/peliculas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM pelicula WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Obtener clasificaciones
app.get('/clasificaciones', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM clasificacion');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener géneros
app.get('/generos', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM genero');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));