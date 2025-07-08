import React, { useEffect, useState, useRef } from "react";
import { FaBell, FaBars } from "react-icons/fa";
import avatar from "../img/avatar.png";
import "./GlassIcons/style/Notificaciones.css";
import { io } from "socket.io-client";
import Rotar from "../RotatingText/Rotar";
import { getNotificacionesPorUsuario, confirmarNotificacion } from "../../../../services/notificacionService";

export default function Navbar({ toggleMenu, setContenidoActual, cerrarSesion }) {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
  const [animarCampana, setAnimarCampana] = useState(false);
  const [cantidadNoLeidas, setCantidadNoLeidas] = useState(0);
  const sonidoAlerta = useRef(new Audio("/audio/notificacion.mp3"));

  const idUsuario = JSON.parse(localStorage.getItem("usuario"))?.IdUsuario;
console.log("🆔 Usuario actual:", idUsuario);

  const toggleDropdown = () => setMostrarMenu((prev) => !prev);
  const irAPerfil = () => {
    setContenidoActual("perfil");
    setMostrarMenu(false);
  };

  const irConfig = () => {
    setContenidoActual("config");
    setMostrarMenu(false);
  };

  const confirmar = async (id) => {
    await confirmarNotificacion(id);
    cargarNotificaciones();
  };

  const cargarNotificaciones = async () => {
    if (!idUsuario) return;
    try {
      const data = await getNotificacionesPorUsuario(idUsuario);
      setNotificaciones(data);

      const nuevasNoLeidas = data.filter((n) => !n.Confirmado).length;
console.log("🔢 Cantidad de no leídas:", nuevasNoLeidas);
  
      if (nuevasNoLeidas > cantidadNoLeidas) {
        sonidoAlerta.current.play().catch((e) =>
          console.warn("No se pudo reproducir el sonido:", e)
        );

        setAnimarCampana(true);
        setTimeout(() => setAnimarCampana(false), 500);
      }

      setCantidadNoLeidas(nuevasNoLeidas);

    } catch (err) {
      console.error("Error al obtener notificaciones:", err);
    }
  };

  useEffect(() => {
    const socket = io("http://localhost:3001");
      console.log("🧪 Intentando conectar a socket...");

  socket.on("connect", () => {
    console.log("🟢 Conectado al socket:", socket.id);
  });

    socket.on("nuevaNotificacion", (data) => {
      console.log("🔔 Nueva notificación recibida:", data);
      sonidoAlerta.current.play().catch((e) =>
        console.warn("No se pudo reproducir el sonido:", e)
      );

      setAnimarCampana(true);
      setTimeout(() => setAnimarCampana(false), 500);

      cargarNotificaciones();
    });

    return () => {
      socket.off("nuevaNotificacion");
    };
  }, []);

  useEffect(() => {
    cargarNotificaciones();
    const intervalo = setInterval(cargarNotificaciones, 15000);
    return () => clearInterval(intervalo);
  }, [idUsuario]);

  return (
    <header className="encabezadodash">
      <button className="iconodashm" onClick={toggleMenu}>
        <FaBars />
      </button>
      <Rotar />

      <nav className="accionesdash">
        <div className="relative">
          <button
            className={`iconodash relative ${animarCampana ? "animar-campana" : ""}`}
            onClick={() => setMostrarNotificaciones(!mostrarNotificaciones)}
          >
            <FaBell />
            {cantidadNoLeidas > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                {cantidadNoLeidas}
              </span>
            )}
          </button>

          {mostrarNotificaciones && (
            <div className="dropdown-notificaciones">
              <div className="noti-header">
                <h3>🔔 Notificaciones</h3>
                <button
                  className="btn-cerrar-noti"
                  onClick={() => setMostrarNotificaciones(false)}
                >
                  ✖
                </button>
              </div>

              {notificaciones.length === 0 ? (
                <p>No hay notificaciones.</p>
              ) : (
                <ul>
                  {notificaciones.map((n) => {
                    console.log("🧪 Notificación recibida en frontend:", n);
                    return (
                      <li
                        key={n.IdNotificacion}
                        className={`notificacion-item ${n.Confirmado ? "notificacion-confirmada" : ""}`}
                        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                       onClick={() => {
  if (n.RutaDestino) {
    localStorage.setItem("rutaDesdeNotificacion", n.RutaDestino);
    window.location.href = "/alquilerap"; // o la ruta principal del dashboard
  } else {
    console.log("🔔 Notificación sin ruta. No se redirige.");
  }
}}

                      >
                        {n.imagenUrl && (
                          <img
                            src={n.imagenUrl}
                            alt="Elemento"
                            style={{
                              width: 50,
                              height: 50,
                              objectFit: "cover",
                              marginRight: 10,
                              borderRadius: 6,
                            }}
                          />
                        )}
                        <div>
                          <strong>{n.Titulo}</strong>
                          <p>{n.Mensaje}</p>
                          <p className="fecha">
                            {new Date(n.FechaDeEnvio).toLocaleDateString()}
                          </p>
                          {!n.Confirmado && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                confirmar(n.IdNotificacion);
                              }}
                            >
                              Confirmar ✅
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>

        <section className="usuariodash" style={{ position: "relative" }}>
          <img src={avatar} alt="Usuariodash" className="avatardash" />
          <span
            className="nombredash"
            onClick={toggleDropdown}
            style={{ cursor: "pointer" }}
          >
            Aprendiz
          </span>

          {mostrarMenu && (
            <div className="menudesplegabledash">
              <ul>
                <li onClick={irAPerfil}>Perfil</li>
                <li onClick={irConfig}>Configuración</li>
                <li onClick={cerrarSesion}>Cerrar sesión</li>
              </ul>
            </div>
          )}
        </section>
      </nav>
    </header>
  );
}
