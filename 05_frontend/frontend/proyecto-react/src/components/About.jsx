import { useState } from "react";

const About = () => {
  const [contador, setContador] = useState(0);
  const [usuario, setUsuario] = useState("");

  const incrementar = () => setContador(contador + 1);
  const decrementar = () => setContador(contador - 1);

  return (
    <div className="container mt-4 p-4 border rounded shadow">
      <h1 className="text-primary mb-3">Componente About</h1>
      <input
        type="text"
        placeholder="Ingrese su nombre"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        className="form-control mb-3"
      />
      <div className="d-flex align-items-center justify-content-between mb-3">
        <button onClick={decrementar} className="btn btn-danger">
          <i className="bi bi-dash"></i>
        </button>
        <span className="fs-4 fw-bold">{contador}</span>
        <button onClick={incrementar} className="btn btn-primary">
          <i className="bi bi-plus"></i>
        </button>
      </div>
      <p className={`fs-5 fw-bold ${contador >= 0 && contador <= 10 ? 'text-success' : 'text-danger'}`}>
        {contador >= 0 && contador <= 10 ? "Dentro del rango" : `Detente ${usuario}`}
      </p>
    </div>
  );
};

export default About;