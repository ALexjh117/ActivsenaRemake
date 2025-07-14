import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/style.css";

// Imágenes por defecto
import img2 from "./img/img2.jpeg";
import img3 from "./img/img3.jpg";
import img4 from "./img/img4.jpg";
import img5 from "./img/img5.jpg";
import img6 from "./img/img6.jpg";
import img7 from "./img/img2.jpg";

// Tipos
interface Usuario {
  Nombre: string;
  Apellido: string;
  perfilInstructor?: {
    imagen: string;
  };
}

interface PlanificacionEvento {
  IdPlanificarE: number;
  usuario?: Usuario;
  ImagenEvento?: string;
}

interface EventoConDatos {
  IdEvento: number;
  NombreEvento: string;
  FechaInicio: string;
  FechaFin: string;
  HoraInicio: string;
  HoraFin: string;
  UbicacionEvento: string;
  DescripcionEvento: string;
  PlanificacionEvento?: PlanificacionEvento;
}

// Imágenes por defecto en caso de que no haya imagen subida
const imagenes = [img2, img3, img4, img5, img6, img7];

// Ruta de imagen de evento
const obtenerRutaImagenEvento = (nombre: string | undefined, idx: number) =>
  nombre
    ? `http://localhost:3001/uploads/usuarios/${nombre}`
    : imagenes[idx % imagenes.length];

const obtenerRutaImagenPerfil = (ruta: string | undefined) => {
  return ruta ? `http://localhost:3001${ruta}` : img6;
};



const Aplicacion = () => {
  const [eventosPublicos, setEventosPublicos] = useState<EventoConDatos[]>([]);
  const [modalEvento, setModalEvento] = useState<EventoConDatos | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/evento/publicos")
      .then((res) => {
        console.log("📦 Eventos públicos con planificadores:", res.data);
        setEventosPublicos(res.data);
      })
      .catch((err) =>
        console.error("❌ Error al cargar eventos públicos:", err)
      );
  }, []);

  return (
    <div className="evento-app-body">
      <div className="evento-app-contenedor-principal">
        <main className="evento-app-contenido-principal">
          {/* CABECERA */}
          <header className="evento-app-cabecera">
            <h2 className="evento-app-titulo-seccion">Novedades</h2>
          </header>

          {/* CARRUSEL DE HISTORIAS */}
          <section className="evento-app-seccion-historias">
            <div className="evento-app-carrusel-historias">
              {eventosPublicos.map((evento, idx) => (
                <div
                  className="evento-app-historia"
                  key={evento.IdEvento}
                  onClick={() => setModalEvento(evento)}
                >
                  <img
                    src={obtenerRutaImagenEvento(evento.PlanificacionEvento?.ImagenEvento, idx)}
                    alt={`Evento ${evento.NombreEvento}`}
                    style={{ width: "100%", height: "120px", objectFit: "cover" }}
                  />
                  <p>{evento.NombreEvento}</p>
                </div>
              ))}
            </div>
          </section>

          {/* INTRODUCCIÓN Y BOTONES */}
          <h1 className="titulo-intro">¿Qué piensas hacer hoy?</h1>
          <section className="evento-app-seccion-botones-accion">
            <button className="evento-app-boton-accion">Apoyos</button>
            <button className="evento-app-boton-accion">Lúdicas</button>
            <button className="evento-app-boton-accion">Alquiler</button>
            <button className="evento-app-boton-accion">ChatIA</button>
          </section>

          {/* FEED DE EVENTOS */}
          <h2 className="evento-app-titulo-seccion">Eventos Semanales</h2>
          <section className="evento-app-seccion-feed">
            <div className="evento-app-lista-eventos">
              {eventosPublicos.map((evento, idx) => (
                <div
                  className="evento-app-tarjeta-evento"
                  key={evento.IdEvento}
                  onClick={() => setModalEvento(evento)}
                >
                  <div className="evento-app-cabecera-evento">
                    <img
                      src={obtenerRutaImagenEvento(evento.PlanificacionEvento?.ImagenEvento, idx)}
                      alt={`Imagen de ${evento.NombreEvento}`}
                      className="evento-app-foto-usuario"
                      style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }}
                    />
                    <div className="evento-app-info-usuario">
                      <p className="evento-app-nombre-usuario">{evento.NombreEvento}</p>
                      <p className="evento-app-fecha-evento">
                        {new Date(evento.FechaInicio).toLocaleDateString("es-CO")} -{" "}
                        {evento.HoraInicio} a {evento.HoraFin}
                      </p>
                    </div>
                  </div>
                  <div className="evento-app-contenido-evento">
                    <p className="evento-app-descripcion-evento">{evento.DescripcionEvento}</p>
                    <p className="evento-app-ubicacion-evento">📍 {evento.UbicacionEvento}</p>
                  </div>
                  <div className="evento-app-acciones-evento">
                    <button className="evento-app-boton-me-gusta">👍 Me gusta</button>
                    <button className="evento-app-boton-comentar">Feedback</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* MODAL DETALLE DE EVENTO */}
      {modalEvento && (
        <div className="evento-app-modal">
          <div className="evento-app-modal-contenido">
            <button
              className="evento-app-modal-cerrar"
              onClick={() => setModalEvento(null)}
            >
              ❌
            </button>

            {/* Imagen destacada */}
            <div className="evento-app-modal-banner">
              <img
                src={obtenerRutaImagenEvento(
                  modalEvento.PlanificacionEvento?.ImagenEvento,
                  eventosPublicos.findIndex((e) => e.IdEvento === modalEvento.IdEvento)
                )}
                alt={modalEvento.NombreEvento}
                style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }}
              />
            </div>

            {/* Título y detalles */}
            <h2 className="evento-app-modal-titulo">{modalEvento.NombreEvento}</h2>
            <div className="evento-app-modal-detalles">
              <p><strong>📅 Fecha:</strong> {new Date(modalEvento.FechaInicio).toLocaleDateString()}</p>
              <p><strong>🕒 Hora:</strong> {modalEvento.HoraInicio} a {modalEvento.HoraFin}</p>
              <p><strong>📍 Lugar:</strong> {modalEvento.UbicacionEvento}</p>
            </div>

            {/* Descripción */}
            <div className="evento-app-modal-descripcion">
              <p>{modalEvento.DescripcionEvento}</p>
            </div>

            {/* Planificador */}
            <div className="evento-app-modal-organizador">
              <h4>👤 Planificado por:</h4>
              {modalEvento.PlanificacionEvento?.usuario ? (
                <div className="evento-app-modal-perfil">
                  <img
                    src={obtenerRutaImagenPerfil(modalEvento.PlanificacionEvento.usuario.perfilInstructor?.imagen)}
                    alt="Imagen del planificador"
                    style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover" }}
                  />
                  <p>
                    {modalEvento.PlanificacionEvento.usuario.Nombre}{" "}
                    {modalEvento.PlanificacionEvento.usuario.Apellido}
                  </p>
                </div>
              ) : (
                <p>No disponible</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Aplicacion;
