import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/Actividades.css';

const formatearFecha = (fechaStr) => {
  if (!fechaStr) return "";
  const [year, month, day] = fechaStr.split("-");
  const fechaLocal = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
  return fechaLocal.toLocaleDateString('es-ES', opciones);
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
  const [calificacion, setCalificacion] = useState(0);
  const [feedbacksActividad, setFeedbacksActividad] = useState([]);

const obtenerIdUsuario = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.IdUsuario || null;
  } catch (error) {
    console.error("Error al decodificar token:", error);
    return null;
  }
};

const idUsuarioLogueado = obtenerIdUsuario();

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

  const abrirModal = async (actividad) => {
    setActividadSeleccionada(actividad);
    setMostrarFeedback(false);
    setFeedback("");
    setCalificacion(0);

    try {
      const res = await axios.get(`http://localhost:3001/api/feedback/actividad/${actividad.IdActividad}`);
      setFeedbacksActividad(res.data);
    } catch (error) {
      console.error("Error al traer feedbacks:", error);
      setFeedbacksActividad([]);
    }
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
      alert("Por favor escribe tu feedback.");
      return;
    }
    if (calificacion === 0) {
      alert("Selecciona una calificación en estrellas.");
      return;
    }
    try {
      await axios.post("http://localhost:3001/api/feedback", {
        IdActividad: actividadSeleccionada.IdActividad,
        IdUsuario: idUsuarioLogueado,
        ComentarioFeedback: feedback,
        Calificacion: calificacion,
        FechaEnvio: new Date(),
      });
      alert("✅ ¡Gracias por tu feedback!");
      setMostrarFeedback(false);
      setFeedback("");
      setCalificacion(0);
      abrirModal(actividadSeleccionada);
    } catch (error) {
      console.error("Error al enviar feedback:", error);
      alert("❌ Hubo un error al enviar el feedback.");
    }
  };

  const actividadesConImagen = actividadesSemana.filter((a) => a.Imagen);

  const puedeComentar = actividadSeleccionada && (() => {
  const ahora = new Date();

  const [anioInicio, mesInicio, diaInicio] = actividadSeleccionada.FechaInicio.split("-");
  const [horaInicio, minutoInicio] = actividadSeleccionada.HoraInicio.split(":");

  const [anioFin, mesFin, diaFin] = actividadSeleccionada.FechaFin.split("-");
  const [horaFin, minutoFin] = actividadSeleccionada.HoraFin.split(":");

  const fechaHoraInicio = new Date(anioInicio, mesInicio - 1, diaInicio, horaInicio, minutoInicio);
  const fechaHoraFin = new Date(anioFin, mesFin - 1, diaFin, horaFin, minutoFin);

  return ahora >= fechaHoraInicio && ahora <= fechaHoraFin;
})();


  const calcularPromedioCalificacion = () => {
    if (feedbacksActividad.length === 0) return 0;
    const suma = feedbacksActividad.reduce((total, fb) => total + (fb.Calificacion || 0), 0);
    return (suma / feedbacksActividad.length).toFixed(1);
  };

  return (
    <div className="actividades-contenedor">
      <header className="actividades-cabecera">
        <h1 className="actividades-titulo">Actividades - SENA</h1>
        <p className="actividades-descripcion">
          Explora las actividades semanales pensadas para tu bienestar y formación integral.
        </p>
      </header>

      {actividadesConImagen.length > 0 ? (
        <section className="actividades-historias">
          <h2 className="historias-titulo">Historias recientes</h2>
          <div className="historias-contenedor">
            {actividadesConImagen.map((actividad) => (
              <div
                key={actividad.IdActividad}
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
      ) : (
        <p className="actividades-vacio">No hay actividades con imágenes esta semana.</p>
      )}

      <main className="actividades-galeria">
        {actividadesConImagen.map((actividad) => (
          <article
            key={actividad.IdActividad}
            className="actividades-card"
            onClick={() => abrirModal(actividad)}
          >
            <img
              src={`http://localhost:3001/uploads/${actividad.Imagen}`}
              alt={actividad.NombreActi}
              className="actividades-img"
            />
            <div className="actividades-info">
              <h4>{actividad.NombreActi}</h4>
              <p>{actividad.Descripcion}</p>
              <p>📍 {actividad.Ubicacion} - ⏰ {formatearHora(actividad.HoraInicio)} a {formatearHora(actividad.HoraFin)}</p>
              <p>🗓️ {formatearFecha(actividad.FechaInicio)}</p>
            </div>
          </article>
        ))}
      </main>

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

            {feedbacksActividad.length > 0 && (
              <div className="promedio-calificacion">
                <p><strong>⭐ Promedio:</strong> {calcularPromedioCalificacion()} / 5</p>
              </div>
            )}

            <div className="feedback-lista">
              <h3>🗣️ Comentarios recientes:</h3>
              {feedbacksActividad.length === 0 ? (
                <p className="text-muted">Aún no hay comentarios.</p>
              ) : (
                feedbacksActividad.map((fb, index) => (
                  <div key={index} className="feedback-item">
                    <p><strong>{fb.usuario?.Nombre || "Anónimo"}:</strong> {fb.ComentarioFeedback}</p>
                    <div className="feedback-stars">
                      {"⭐".repeat(fb.Calificacion || 0)}
                    </div>
                    <small className="feedback-fecha">{formatearFecha(fb.FechaEnvio)}</small>
                  </div>
                ))
              )}
            </div>

            {puedeComentar ? (
              !mostrarFeedback && (
                <button className="btn-feedback" onClick={() => setMostrarFeedback(true)}>
                  📝 Dar Feedback
                </button>
              )
            ) : (
              <p className="text-muted">🕒 Los comentarios se habilitan durante la actividad.</p>
            )}

            {mostrarFeedback && (
              <div className="feedback-form">
                <div className="estrellas-selector">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <span
                      key={num}
                      onClick={() => setCalificacion(num)}
                      className={num <= calificacion ? "estrella activa" : "estrella"}
                    >
                      ★
                    </span>
                  ))}
                </div>
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
