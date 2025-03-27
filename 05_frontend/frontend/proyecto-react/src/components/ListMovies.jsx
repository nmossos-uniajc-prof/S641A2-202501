
import { useState, useEffect } from "react";
import axios from "axios";

const ListMovies = () => {
  const [peliculas, setPeliculas] = useState([]);

  useEffect(() => {
    const fetchPeliculas = async () => {
      try {
        const response = await axios.get("http://localhost:3000/peliculas");
        setPeliculas(response.data);
      } catch (error) {
        console.error("Error al obtener las películas:", error);
      }
    };

    fetchPeliculas();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-primary mb-3">Listado de Películas</h2>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Fecha de Estreno</th>
            <th>Nacionalidad</th>
            <th>Clasificación</th>
            <th>Director</th>
            <th>Géneros</th>
          </tr>
        </thead>
        <tbody>
          {peliculas.map((pelicula) => (
            <tr key={pelicula.id}>
              <td>{pelicula.id}</td>
              <td>{pelicula.titulo}</td>
              <td>{pelicula.fecha_estreno}</td>
              <td>{pelicula.nacionalidad}</td>
              <td>{pelicula.clasificacion}</td>
              <td>{pelicula.director}</td>
              <td>{pelicula.generos.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListMovies;