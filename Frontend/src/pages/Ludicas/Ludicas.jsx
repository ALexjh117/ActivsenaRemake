import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style/Ludicas.css';

const ListaLudicas = () => {
  const [ludicas, setLudicas] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/ludica')
      .then(res => setLudicas(res.data))
      .catch(err => console.error("❌ Error cargando lúdicas:", err));
  }, []);

  return (
    <div className="ludicas-container">
      <header className="ludicas-header">
        <h1 className="ludicas-title">Actividades Lúdicas</h1>
        <p className="ludicas-subtitle">¡Encuentra tu actividad favorita y únete a la diversión!</p>
        <div className="search-barr">
          <input type="text" placeholder="Buscar actividad..." />
          <button className="search-btn">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </header>

      <section className="ludicas-grid">
        {ludicas.map((ludica) => (
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
              <button className="ludicas-btn">
                <i className="fas fa-user-plus"></i> Más Detalles
              </button>
            </div>
          </div>
        ))}
      </section>

      <footer className="ludicas-footer">
        <p>¿No encuentras lo que buscas? <a href="#">Contáctanos</a></p>
      </footer>
    </div>
  );
};

export default ListaLudicas;
