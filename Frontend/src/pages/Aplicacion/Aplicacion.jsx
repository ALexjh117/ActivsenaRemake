import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/style.css';

const Aplicacion = () => {
  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3001/api/evento')
      .then((res) => {
        setEventos(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.error('Error al obtener eventos:', err));
  }, []);

  const abrirModal = (evento) => {
    setEventoSeleccionado(evento);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setEventoSeleccionado(null);
    setModalAbierto(false);
  };

  return (
    <div className="evento-app-body">
      <div className="evento-app-contenedor-principal">
        <main className="evento-app-contenido-principal">
          <header className="evento-app-cabecera">
            <h2 className="evento-app-titulo-seccion">Novedades</h2>
          </header>
          <br />

          <section className="evento-app-seccion-historias">
            <div className="evento-app-carrusel-historias">
              {eventos.slice(0, 10).map((evento) => (
                <div
                  className="evento-app-historia"
                  key={evento.IdEvento}
                  onClick={() => abrirModal(evento)}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={`http://localhost:3001/uploads/${evento.ImagenEvento || 'default-event.jpg'}`}
                    alt="Imagen Evento"
                    className="evento-app-foto-evento"
                  />
                  <p>{evento.NombreEvento}</p>
                </div>
              ))}
            </div>
          </section>

          <h1 className="titulo-intro">¿Qué piensas hacer hoy?</h1>

          <section className="evento-app-seccion-botones-accion">
            <button className="evento-app-boton-accion">Apoyos</button>
            <button className="evento-app-boton-accion">Lúdicas</button>
            <button className="evento-app-boton-accion">Alquiler de elementos</button>
            <button className="evento-app-boton-accion">Lúdicas</button>
            <button className="evento-app-boton-accion">ChatIA</button>
          </section>

          <h2 className="evento-app-titulo-seccion">Eventos Semanales</h2>
          <section className="evento-app-seccion-feed">
            <div className="evento-app-lista-eventos">
              {eventos.map((evento) => (
                <div className="evento-app-tarjeta-evento" key={evento.IdEvento}>
                  <div className="evento-app-cabecera-evento">
                    <img
                      src={evento.creador?.imagenPerfil || '/default-user.jpg'}
                      alt="Usuario"
                      className="evento-app-foto-usuario"
                    />
                    <div className="evento-app-info-usuario">
                      <p className="evento-app-nombre-usuario">{evento.creador?.Nombre || 'Anónimo'}</p>
                      <p className="evento-app-fecha-evento">{evento.FechaInicio}</p>
                    </div>
                  </div>
                  <div className="evento-app-contenido-evento">
                    <img
                      src={`http://localhost:3001/uploads/${evento.ImagenEvento || 'default-event.jpg'}`}
                      alt="Evento"
                      className="evento-app-foto-evento"
                    />
                    <p className="evento-app-descripcion-evento">{evento.DescripcionEvento}</p>
                  </div>
                  <div className="evento-app-acciones-evento">
                    <button className="evento-app-boton-me-gusta">👍 Me gusta</button>
                    <button className="evento-app-boton-comentar">Feedback</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          
          {modalAbierto && eventoSeleccionado && (
            <div className="evento-app-modal-overlay" onClick={cerrarModal}>
              <div className="evento-app-modal-contenido" onClick={(e) => e.stopPropagation()}>
                <button className="evento-app-cerrar-modal" onClick={cerrarModal}>✖</button>
                <img
                  src={`http://localhost:3001/uploads/${eventoSeleccionado.ImagenEvento || 'default-event.jpg'}`}
                  alt="Evento"
                  className="evento-app-foto-evento"
                />
                <h3>{eventoSeleccionado.NombreEvento}</h3>
                <p><strong>Fecha:</strong> {eventoSeleccionado.FechaInicio}</p>
                <p><strong>Descripción:</strong> {eventoSeleccionado.DescripcionEvento}</p>
                <p><strong>Publicado por:</strong> {eventoSeleccionado.creador?.Nombre || 'Anónimo'}</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Aplicacion;
