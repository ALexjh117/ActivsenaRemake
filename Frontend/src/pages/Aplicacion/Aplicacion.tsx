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
  IdUsuario: number;
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

const imagenes = [img2, img3, img4, img5, img6, img7];

const obtenerRutaImagenEvento = (nombre: string | undefined, idx: number) =>
  nombre ? `http://localhost:3001/uploads/usuarios/${nombre}` : imagenes[idx % imagenes.length];

const obtenerRutaImagenPerfil = (ruta: string | undefined) =>
  ruta ? `http://localhost:3001${ruta}` : img6;

const Aplicacion = () => {
  const [eventosPublicos, setEventosPublicos] = useState<EventoConDatos[]>([]);
  const [modalEvento, setModalEvento] = useState<EventoConDatos | null>(null);
  const [reacciones, setReacciones] = useState<Record<number, { like: number; dislike: number }>>({});
  const [miReaccion, setMiReaccion] = useState<Record<number, "like" | "dislike" | null>>({});
  const [detallesReacciones, setDetallesReacciones] = useState<
    { IdUsuario: number; Nombre: string; Apellido: string; Tipo: "like" | "dislike" }[]
  >([]);

  // Obtener ID del usuario desde localStorage (simulación de sesión)
  const token = localStorage.getItem("token");
const decoded: any = token ? JSON.parse(atob(token.split(".")[1])) : {};
const idUsuario = decoded?.IdUsuario;


  const cargarEventosYReacciones = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/evento/publicos");
      setEventosPublicos(res.data);

      const reaccionesPorEvento = await Promise.all(
        res.data.map((evento: EventoConDatos) =>
          axios.get(`http://localhost:3001/api/reacciones/evento/${evento.IdEvento}`)
        )
      );

      const reaccionesMap: Record<number, { like: number; dislike: number }> = {};
      const misReacciones: Record<number, "like" | "dislike" | null> = {};

      res.data.forEach((evento: EventoConDatos, idx: number) => {
        const { likes, dislikes, detalles } = reaccionesPorEvento[idx].data;
        reaccionesMap[evento.IdEvento] = { like: likes, dislike: dislikes };
        const yo = detalles.find((r: any) => r.usuario?.IdUsuario === idUsuario);
        misReacciones[evento.IdEvento] = yo?.Tipo || null;
      });

      setReacciones(reaccionesMap);
      setMiReaccion(misReacciones);
    } catch (err) {
      console.error("❌ Error al cargar eventos o reacciones:", err);
    }
  };

  const cargarDetallesReacciones = async (idEvento: number) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/reacciones/evento/${idEvento}/detalles`);
      const data = res.data.map((r: any) => ({
        IdUsuario: r.usuario.IdUsuario,
        Nombre: r.usuario.Nombre,
        Apellido: r.usuario.Apellido,
        Tipo: r.Tipo,
      }));
      setDetallesReacciones(data);
    } catch (error) {
      console.error("❌ Error al cargar detalles de reacciones:", error);
    }
  };
const manejarReaccion = async (idEvento: number, tipo: "like" | "dislike") => {
  try {
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:3001/api/reacciones",
      {
        IdEvento: idEvento,
        Tipo: tipo,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // resto igual
    setMiReaccion((prev) => ({ ...prev, [idEvento]: tipo }));

    setReacciones((prev) => {
      const actual = prev[idEvento] || { like: 0, dislike: 0 };
      const nuevo = { ...actual };

      if (tipo === "like") {
        if (miReaccion[idEvento] === "dislike") nuevo.dislike--;
        if (miReaccion[idEvento] !== "like") nuevo.like++;
      } else {
        if (miReaccion[idEvento] === "like") nuevo.like--;
        if (miReaccion[idEvento] !== "dislike") nuevo.dislike++;
      }

      return { ...prev, [idEvento]: nuevo };
    });
  } catch (err) {
    console.error("❌ Error al reaccionar:", err);
  }
};

 

  useEffect(() => {
    cargarEventosYReacciones();
  }, []);

  return (
    <div className="evento-app-body">
      <div className="evento-app-contenedor-principal">
        <main className="evento-app-contenido-principal">
          <header className="evento-app-cabecera">
            <h2 className="evento-app-titulo-seccion">Novedades</h2>
          </header>

          <section className="evento-app-seccion-historias">
            <div className="evento-app-carrusel-historias">
              {eventosPublicos.map((evento, idx) => (
                <div
                  key={evento.IdEvento}
                  className="evento-app-historia"
                  onClick={() => {
                    setModalEvento(evento);
                    cargarDetallesReacciones(evento.IdEvento);
                  }}
                >
                  <img
                    src={obtenerRutaImagenEvento(evento.PlanificacionEvento?.ImagenEvento, idx)}
                    alt={evento.NombreEvento}
                    style={{ width: "100%", height: "120px", objectFit: "cover" }}
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
            <button className="evento-app-boton-accion">Alquiler</button>
            <button className="evento-app-boton-accion">ChatIA</button>
          </section>

          <h2 className="evento-app-titulo-seccion">Eventos Semanales</h2>
          <section className="evento-app-seccion-feed">
            <div className="evento-app-lista-eventos">
              {eventosPublicos.map((evento, idx) => (
                <div
                  key={evento.IdEvento}
                  className="evento-app-tarjeta-evento"
                  onClick={() => {
                    setModalEvento(evento);
                    cargarDetallesReacciones(evento.IdEvento);
                  }}
                >
                  <div className="evento-app-cabecera-evento">
                    <img
                      src={obtenerRutaImagenEvento(evento.PlanificacionEvento?.ImagenEvento, idx)}
                      alt={evento.NombreEvento}
                      className="evento-app-foto-usuario"
                      style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }}
                    />
                    <div className="evento-app-info-usuario">
                      <p className="evento-app-nombre-usuario">{evento.NombreEvento}</p>
                      <p className="evento-app-fecha-evento">
                        {new Date(evento.FechaInicio).toLocaleDateString("es-CO")} - {evento.HoraInicio} a {evento.HoraFin}
                      </p>
                    </div>
                  </div>
                  <div className="evento-app-contenido-evento">
                    <p>{evento.DescripcionEvento}</p>
                    <p>📍 {evento.UbicacionEvento}</p>
                  </div>
                  <div className="evento-app-acciones-evento">
                    <button
                      className={`evento-app-boton-me-gusta ${miReaccion[evento.IdEvento] === "like" ? "activo" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        manejarReaccion(evento.IdEvento, "like");
                      }}
                    >
                      👍 Me gusta ({reacciones[evento.IdEvento]?.like || 0})
                    </button>
                    <button
                      className={`evento-app-boton-disgusto ${miReaccion[evento.IdEvento] === "dislike" ? "activo" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        manejarReaccion(evento.IdEvento, "dislike");
                      }}
                    >
                      👎 No me gusta ({reacciones[evento.IdEvento]?.dislike || 0})
                    </button>
                    <button className="evento-app-boton-comentar">Feedback</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* MODAL DETALLE */}
      {modalEvento && (
        <div className="evento-app-modal">
          <div className="evento-app-modal-contenido">
            <button className="evento-app-modal-cerrar" onClick={() => setModalEvento(null)}>❌</button>

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

            <h2 className="evento-app-modal-titulo">{modalEvento.NombreEvento}</h2>
            <div className="evento-app-modal-detalles">
              <p><strong>📅 Fecha:</strong> {new Date(modalEvento.FechaInicio).toLocaleDateString()}</p>
              <p><strong>🕒 Hora:</strong> {modalEvento.HoraInicio} a {modalEvento.HoraFin}</p>
              <p><strong>📍 Lugar:</strong> {modalEvento.UbicacionEvento}</p>
            </div>

            <div className="evento-app-modal-descripcion">
              <p>{modalEvento.DescripcionEvento}</p>
            </div>

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

            <div className="evento-app-modal-reacciones">
              <h4>👍 Usuarios que dieron Me gusta:</h4>
              <ul>
                {detallesReacciones.filter((r) => r.Tipo === "like").map((u) => (
                  <li key={u.IdUsuario}>{u.Nombre} {u.Apellido}</li>
                ))}
              </ul>
              <h4>👎 Usuarios que dieron No me gusta:</h4>
              <ul>
                {detallesReacciones.filter((r) => r.Tipo === "dislike").map((u) => (
                  <li key={u.IdUsuario}>{u.Nombre} {u.Apellido}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Aplicacion;
