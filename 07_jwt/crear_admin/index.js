const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'userdb',
    password: process.env.DB_PASSWORD || 'clavedb',
    database: process.env.DB_NAME || 'bdmovies_S641A2',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const crear = async () => {
    try {
        const password = "pass1234"
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            `INSERT INTO User (email, name, country, city, birthdate, password, role) VALUES ('admin@servidor.com', 'Admin', 'Adminlandia', 'Admin City', 
        '2000-01-01', ?, 'admin')`,
            [hashedPassword]
        );

        console.log("Se creo exitosamente el usuario administrador");

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            console.error("Error: El correo electrónico ya está registrado");
        } else {
            console.error("Error al crear usuario:", error.message);
        }
        //throw error;
    } finally {
        await pool.end(); // Cierra el pool al finalizar
    }
}

crear();