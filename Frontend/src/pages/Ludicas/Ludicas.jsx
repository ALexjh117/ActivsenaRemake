import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style/Ludicas.css';

const ListaLudicas = () => {
  const [ludicas, setLudicas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [tipoSeleccionado, setTipoSeleccionado] = useState('Todos');
  const [ludicaSeleccionada, setLudicaSeleccionada] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/api/ludica')
      .then(res => setLudicas(res.data))
      .catch(err => console.error("❌ Error cargando lúdicas:", err));
  }, []);

  const tipos = ['Todos', ...new Set(ludicas.map(l => l.TipoLudica))];

  const ludicasFiltradas = ludicas.filter((ludica) => {
    const coincideNombre = ludica.NombreActi.toLowerCase().includes(busqueda.toLowerCase());
    const coincideTipo = tipoSeleccionado === 'Todos' || ludica.TipoLudica === tipoSeleccionado;
    return coincideNombre && coincideTipo;
  });

  return (
    <div className="ludicas-container">
      <header className="ludicas-header">
        <h1 className="ludicas-title">Actividades Lúdicas</h1>
        <p className="ludicas-subtitle">¡Encuentra tu actividad favorita y únete a la diversión!</p>

        <div className="search-barr">
          <input
            type="text"
            placeholder="Buscar actividad..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button className="search-btn">
            <i className="fas fa-search"></i>
          </button>
        </div>

        <div className="categorias-filter">
          {tipos.map((tipo) => (
            <button
              key={tipo}
              className={`categoria-btn ${tipoSeleccionado === tipo ? 'active' : ''}`}
              onClick={() => setTipoSeleccionado(tipo)}
            >
              {tipo}
            </button>
          ))}
        </div>
      </header>

      <section className="ludicas-grid">
        {ludicasFiltradas.map((ludica) => (
          <div className="ludicas-card" key={ludica.IdActividad}>
            <div className="card-image-container">
              <img
                className="ludicas-card-image"
                src={`http://localhost:3001/uploads/${ludica.Imagen}`}
                alt={ludica.NombreActi}
              />
              <div className="image-overlay"></div>
            </div>
            <div className="ludicas-card-content">
              <span className="categoria-badge">{ludica.TipoLudica}</span>
              <h3 className="card-title">{ludica.NombreActi}</h3>
              <div className="card-info">
                <p className="info-item">
                  <i className="fas fa-map-marker-alt"></i> {ludica.Ubicacion}
                </p>
                <div className="schedule-section">
                  <p className="schedule-title">
                    <i className="far fa-clock"></i> Horario:
                  </p>
                  <ul className="schedule-list">
                    <li>{ludica.HoraInicio} - {ludica.HoraFin}</li>
                  </ul>
                </div>
              </div>
              <button className="ludicas-btn" onClick={() => setLudicaSeleccionada(ludica)}>
                <i className="fas fa-info-circle"></i> Más Detalles
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* MODAL */}
      {ludicaSeleccionada && (
        <div className="modal-overlay" onClick={() => setLudicaSeleccionada(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setLudicaSeleccionada(null)}>×</button>
            <h2>{ludicaSeleccionada.NombreActi}</h2>
            <p><strong>Tipo:</strong> {ludicaSeleccionada.TipoLudica}</p>
            <p><strong>Ubicación:</strong> {ludicaSeleccionada.Ubicacion}</p>
            <p><strong>Horario:</strong> {ludicaSeleccionada.HoraInicio} - {ludicaSeleccionada.HoraFin}</p>
            <p><strong>Descripción:</strong> {ludicaSeleccionada.Descripcion}</p>
            <img
              className="modal-img"
              src={`http://localhost:3001/uploads/${ludicaSeleccionada.Imagen}`}
              alt={`Ubicación de ${ludicaSeleccionada.NombreActi}`}
            />
          </div>
        </div>
      )}

      <footer className="ludicas-footer">
        <p>¿No encuentras lo que buscas? <a href="#">Contáctanos</a></p>
      </footer>
    </div>
  );
};

export default ListaLudicas;
