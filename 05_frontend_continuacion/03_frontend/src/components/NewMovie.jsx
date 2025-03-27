import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NewMovie = () => {
  const [titulo, setTitulo] = useState("");
  const [fechaEstreno, setFechaEstreno] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");
  const [clasificacionId, setClasificacionId] = useState("");
  const [director, setDirector] = useState("");
  const [generosSeleccionados, setGenerosSeleccionados] = useState([]);
  const [clasificaciones, setClasificaciones] = useState([]);
  const [generos, setGeneros] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clasifRes, genRes] = await Promise.all([
          axios.get("http://localhost:3000/clasificaciones"),
          axios.get("http://localhost:3000/generos"),
        ]);
        setClasificaciones(clasifRes.data);
        setGeneros(genRes.data);
      } catch (error) {
        console.error("Error al obtener clasificaciones o géneros:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevaPelicula = {
      titulo,
      fecha_estreno: fechaEstreno,
      nacionalidad,
      clasificacion_id: clasificacionId,
      director,
      generos: generosSeleccionados,
    };

    try {
      await axios.post(`http://localhost:3000/peliculas`, nuevaPelicula);
      alert("Película creada exitosamente");
      limpiarFormulario();
    } catch (error) {
      alert("Error al crear la película");
      console.error("Error al crear la película:", error);
    }
  };

  const limpiarFormulario = () => {
    setTitulo("");
    setFechaEstreno("");
    setNacionalidad("");
    setClasificacionId("");
    setDirector("");
    setGenerosSeleccionados([]);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-primary mb-3">Nueva Película</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Título</label>
          <input type="text" className="form-control" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Fecha de Estreno</label>
          <input type="date" className="form-control" value={fechaEstreno} onChange={(e) => setFechaEstreno(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Nacionalidad</label>
          <input type="text" className="form-control" value={nacionalidad} onChange={(e) => setNacionalidad(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Clasificación</label>
          <select className="form-select" value={clasificacionId} onChange={(e) => setClasificacionId(e.target.value)} name="clasificacion_id" required>
            <option value="">Seleccione una clasificación</option>
            {clasificaciones.map((clasif) => (
              <option key={clasif.id} value={clasif.id}>
                {clasif.descripcion}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Director</label>
          <input type="text" className="form-control" value={director} onChange={(e) => setDirector(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Géneros</label>
          <select multiple className="form-select" value={generosSeleccionados} onChange={(e) => setGenerosSeleccionados([...e.target.selectedOptions].map(opt => opt.value))} name="generos" required>
            {generos.map((gen) => (
              <option key={gen.id} value={gen.id}>
                {gen.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-success">
            <i className="bi bi-check-circle"></i> Crear
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/lista-peliculas")}>
            <i className="bi bi-arrow-left-circle"></i> Regresar
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewMovie;