// ✅ Actividades.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/Actividades.css';
import CodigosQRActividad from "../Actividades/CodigoActividad";

const formatearFecha = (fechaStr) => {
  if (!fechaStr) return "";
  const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(fechaStr).toLocaleDateString('es-ES', opciones);
};

const formatearHora = (horaStr) => {
  if (!horaStr) return "";
  const [hora, min] = horaStr.split(':');
  let h = parseInt(hora, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${min} ${ampm}`;
};

function obtenerLimitesSemanaActual() {
  const hoy = new Date();
  const dia = hoy.getDay();
  const diferenciaLunes = dia === 0 ? 6 : dia - 1;

  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() - diferenciaLunes);
  lunes.setHours(0, 0, 0, 0);

  const domingo = new Date(lunes);
  domingo.setDate(lunes.getDate() + 6);
  domingo.setHours(23, 59, 59, 999);

  return { lunes, domingo };
}

export default function Actividades() {
  const [actividades, setActividades] = useState([]);
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  const [mostrarFeedback, setMostrarFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/actividad");
        setActividades(res.data);
      } catch (error) {
        console.error("Error al obtener actividades:", error);
      }
    };
    fetchActividades();
  }, []);

  const { lunes, domingo } = obtenerLimitesSemanaActual();
  const actividadesSemana = actividades.filter((actividad) => {
    const fechaInicio = new Date(actividad.FechaInicio);
    return fechaInicio >= lunes && fechaInicio <= domingo;
  });

  const abrirModal = (actividad) => {
    setActividadSeleccionada(actividad);
    setMostrarFeedback(false);
    setFeedback("");
  };

  const cerrarModal = () => {
    setActividadSeleccionada(null);
    setMostrarFeedback(false);
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const enviarFeedback = async () => {
    if (!feedback.trim()) {
      alert("Por favor escribe tu feedback antes de enviar.");
      return;
    }
    try {
      await axios.post("http://localhost:3001/api/feedback", {
        IdActividad: actividadSeleccionada.IdActividad,
        comentario: feedback,
      });
      alert("✅ ¡Gracias por tu feedback!");
      setMostrarFeedback(false);
      setFeedback("");
    } catch (error) {
      console.error("Error enviando feedback:", error);
      alert("❌ Hubo un error al enviar el feedback.");
    }
  };

  const actividadesConImagen = actividadesSemana.filter((a) => a.Imagen);

  return (
    <div className="actividades-contenedor">
      <header className="actividades-cabecera">
        <h1 className="actividades-titulo">Actividades - SENA</h1>
        <p className="actividades-descripcion">
          Explora las actividades semanales pensadas para tu bienestar y formación integral.
        </p>
      </header>

      {actividadesConImagen.length > 0 && (
        <section className="actividades-historias">
          <h2 className="historias-titulo">Historias recientes</h2>
          <div className="historias-contenedor">
            {actividadesConImagen.map((actividad, index) => (
              <div
                key={actividad.IdActividad || index}
                className="historia"
                onClick={() => abrirModal(actividad)}
              >
                <img
                  src={`http://localhost:3001/uploads/${actividad.Imagen}`}
                  alt={actividad.NombreActi}
                  className="historia-img"
                />
                <p className="historia-nombre">{actividad.NombreActi}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {actividadesConImagen.length === 0 ? (
        <p className="actividades-vacio">No hay actividades con imágenes registradas para esta semana.</p>
      ) : (
        <main className="actividades-galeria">
          {actividadesConImagen.map((actividad, index) => (
            <article
              key={actividad.IdActividad || index}
              className="actividades-card"
              onClick={() => abrirModal(actividad)}
            >
              <img
                src={`http://localhost:3001/uploads/${actividad.Imagen}`}
                alt={actividad.NombreActi || 'Actividad'}
                className="actividades-img"
              />
              <div className="actividades-info">
                <h4>{actividad.NombreActi}</h4>
                <p>{actividad.Descripcion}</p>
                <p>
                  📍 {actividad.Ubicacion || "Ubicación no definida"} - ⏰{' '}
                  {formatearHora(actividad.HoraInicio)} a {formatearHora(actividad.HoraFin)}
                </p>
                <p>🗓️ {formatearFecha(actividad.FechaInicio)}</p>
              </div>
            </article>
          ))}
        </main>
      )}

      {actividadSeleccionada && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={cerrarModal}>×</button>
            <img
              src={`http://localhost:3001/uploads/${actividadSeleccionada.Imagen}`}
              alt={actividadSeleccionada.NombreActi}
              className="modal-img"
            />
            <h2>{actividadSeleccionada.NombreActi}</h2>
            <p><strong>Descripción:</strong> {actividadSeleccionada.Descripcion}</p>
            <p><strong>Ubicación:</strong> {actividadSeleccionada.Ubicacion}</p>
            <p><strong>Horario:</strong> {formatearHora(actividadSeleccionada.HoraInicio)} a {formatearHora(actividadSeleccionada.HoraFin)}</p>
            <p><strong>Fecha:</strong> {formatearFecha(actividadSeleccionada.FechaInicio)}</p>
   

            {!mostrarFeedback && (
              <button className="btn-feedback" onClick={() => setMostrarFeedback(true)}>
                📝 Dar Feedback
              </button>
            )}

            {mostrarFeedback && (
              <div className="feedback-form">
                <textarea
                  rows="4"
                  value={feedback}
                  onChange={handleFeedbackChange}
                  placeholder="Escribe tu feedback aquí..."
                />
                <div className="feedback-buttons">
                  <button onClick={enviarFeedback}>Enviar</button>
                  <button onClick={() => setMostrarFeedback(false)}>Cancelar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}