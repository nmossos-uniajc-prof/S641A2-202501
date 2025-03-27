import { useState } from "react";

function Tarjeta({ nombre, edad, children }) {
    const [newEdad, setNewEdad] = useState(parseInt(edad));
    const [carrera, setCarrera] = useState("");
    const esActivo = true;
    const estilos = {
        color: "blue",
        fontSize: "20px"
    };

    return (
        <div>
            <h2 style={estilos}>Perfil de Usuario</h2>
            <p>Nombre: {nombre}</p>
            <p>Edad: {newEdad} años
                &nbsp; <button onClick={() => setNewEdad(newEdad + 1)}> + </button>
            </p>
            <p>Carrera: {carrera}</p>
            <p>Estado: {esActivo ? "Activo" : "Inactivo"}</p>
            <input
                type="text"
                placeholder="Carrera"
                value={carrera}
                onChange={(e) => setCarrera(e.target.value)}
            /><br />
            {children}
        </div>
    );
}

export default Tarjeta;