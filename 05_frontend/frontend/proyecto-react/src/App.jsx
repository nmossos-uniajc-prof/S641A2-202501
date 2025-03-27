import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import ListMovies from './components/ListMovies';

function App() {

  return (
    <Router>
      <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body" data-bs-theme="dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Grupo 641A2</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <Link className="nav-link active" to="/">Casa</Link>
              <Link className="nav-link" to="/about">Acerca de </Link>
              <Link className="nav-link" to="/list-movies">Lista de Peliculas</Link>
            </div>
          </div>
        </div>
      </nav>


      <Routes>
        <Route path="/" element={<Home />} exact />
        <Route path="/about" element={<About />} />
        <Route path="/list-movies" element={<ListMovies />} />
      </Routes>
    </Router>


  );
}

export default App
