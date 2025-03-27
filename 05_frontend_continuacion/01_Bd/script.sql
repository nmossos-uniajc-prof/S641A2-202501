CREATE TABLE IF NOT EXISTS clasificacion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(10) NOT NULL UNIQUE,
    descripcion VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS genero (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS pelicula (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(100) NOT NULL,
    fecha_estreno DATE NOT NULL,
    nacionalidad VARCHAR(50) NOT NULL,
    clasificacion_id INT NOT NULL,
    director VARCHAR(100) NOT NULL,
    FOREIGN KEY (clasificacion_id) REFERENCES clasificacion(id)
);

CREATE TABLE IF NOT EXISTS pelicula_genero (
    pelicula_id INT NOT NULL,
    genero_id INT NOT NULL,
    PRIMARY KEY (pelicula_id, genero_id),
    FOREIGN KEY (pelicula_id) REFERENCES pelicula(id) ON DELETE CASCADE,
    FOREIGN KEY (genero_id) REFERENCES genero(id) ON DELETE CASCADE
);


INSERT INTO clasificacion (nombre, descripcion) VALUES
    ('A', 'Para todo público'),
    ('B', 'Mayores de 12 años'),
    ('C', 'Mayores de 15 años'),
    ('D', 'Mayores de 18 años'),
    ('E', 'Contenido explícito');

INSERT INTO genero (nombre) VALUES
    ('Acción'),
    ('Animación'),
    ('Comedia'),
    ('Ciencia ficción'),
    ('Drama'),
    ('Musical'),
    ('Terror'),
    ('Suspenso');


INSERT INTO pelicula (titulo, fecha_estreno, nacionalidad, clasificacion_id, director) VALUES
('Avengers: Endgame', '2019-04-26', 'Estados Unidos', 2, 'Anthony Russo, Joe Russo'),
('Avatar: The Way of Water', '2022-12-16', 'Estados Unidos', 2, 'James Cameron'),
('Top Gun: Maverick', '2022-05-27', 'Estados Unidos', 2, 'Joseph Kosinski'),
('Spider-Man: No Way Home', '2021-12-17', 'Estados Unidos', 2, 'Jon Watts'),
('Jurassic World Dominion', '2022-06-10', 'Estados Unidos', 2, 'Colin Trevorrow'),
('The Super Mario Bros. Movie', '2023-04-05', 'Estados Unidos', 1, 'Michael Jelenic, Aaron Horvath'),
('Doctor Strange in the Multiverse of Madness', '2022-05-06', 'Estados Unidos', 2, 'Sam Raimi'),
('Minions: The Rise of Gru', '2022-07-01', 'Estados Unidos', 1, 'Kyle Balda'),
('Black Panther: Wakanda Forever', '2022-11-11', 'Estados Unidos', 2, 'Ryan Coogler'),
('The Batman', '2022-03-04', 'Estados Unidos', 2, 'Matt Reeves');

INSERT INTO pelicula_genero (pelicula_id, genero_id) VALUES
(1, 1), (1, 4),
(2, 1), (2, 4), (2, 2),
(3, 1), (3, 5),
(4, 1), (4, 4),
(5, 1), (5, 4),
(6, 2), (6, 3),
(7, 1), (7, 4),
(8, 2), (8, 3),
(9, 1), (9, 4),
(10, 1), (10, 8);