import { useEffect, useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ListMovies() {
  const [peliculas, setPeliculas]= useState([]);
  const navigate = useNavigate();

  useEffect(()=>{
    const cargar=async ()=>{
        const result = await axios.get(`http://localhost:3000/peliculas`);
        setPeliculas(result.data);
    };
    cargar();
  },[]);

  const handleDelete = (id)=>{
    if (confirm("Esta seguro que desea eliminar la pelicula")) {
        axios.delete(`http://localhost:3000/peliculas/${id}`);
        alert("Se elimino la pelicula exitosamente.")
        setPeliculas(peliculas.filter((p)=>{p.id!==id}))
    }
  };

  return (
<div className="container mt-4">
      <h2 className="text-primary mb-3">Listado de Películas</h2>
      <button className="btn btn-success mb-3" onClick={() => navigate("/new-movies")}>
        <i className="bi bi-plus-circle me-1"></i> Crear nueva película
      </button>
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
            <th>Operaciones</th>
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
              <td>
                  <button className="btn btn-warning me-2" onClick={()=>{navigate(`/edit-movies/${pelicula.id}`)}}>
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(pelicula.id)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ListMovies