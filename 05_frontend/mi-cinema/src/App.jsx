import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Compra from "./components/Compra"
import Tarjeta from "./components/Tarjeta"
import ListaPeliculas from "./components/ListaPeliculas";
import Post from "./components/Post";

function App() {

  const grupo = "S641A-2"

  return (
    <>
      <BrowserRouter>
      <ul>
      <li><Link to="/">Lista de peliculas</Link></li>
      <li><Link to="/compra">Compra</Link></li>
      <li><Link to="/tarjeta">Tarjeta</Link></li>
      </ul>
      


        <h1>Bienvenido grupo {grupo} </h1>
        <p>Lorem ipsum dolor sit amet consectetur.</p>

        <Routes>
          <Route path="/" element={<ListaPeliculas />} />
          <Route path="/compra" element={<Compra />} />
          <Route path="/tarjeta" element={<Tarjeta nombre="Ana Cifuentes" edad="28">Programador Junior</Tarjeta>} />
        </Routes>

        <Post />
      </BrowserRouter>
    </>
  )
}

export default App
