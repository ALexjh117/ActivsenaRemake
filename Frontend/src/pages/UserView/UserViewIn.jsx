import React, { useEffect, useState } from "react";
import api from "../../services/api"; 

import logo from "./img/image.png";
import ludicaImg from "./img/bl.png";
import ludicaImg2 from "./img/ft.png";
import ludicaImg3 from "./img/gm.png";
import ludicaImg4 from "./img/ms.png";
import EventoImg from "./img/director.png";
import EventoImg2 from "./img/cacao.jpg";
import EventoImg3 from "./img/academia.jpg";
import EventoImg4 from "./img/emprende.png";
import avatarDefault from "../DashBoard/img/avatar.png";

export default function UserViewIn({ setContenidoActual }) {
  const [usuario, setUsuario] = useState(() => {
    const localData = localStorage.getItem("usuario");
    return localData ? JSON.parse(localData) : null;
  });

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const { data } = await api.get("/usuario/user"); //  Token se envía automáticamente
        setUsuario(data);
        localStorage.setItem("usuario", JSON.stringify(data)); 
      } catch (error) {
        console.error("Error al obtener usuario:", error);
      }
    };

    fetchUsuario();
  }, []);

  if (!usuario) {
    return <p className="UserLoading">Cargando datos del usuario...</p>;
  }

  return (
    <section className="UserContenedor">
      <div className="UserCuadro UserInfo">
        <img
          src={usuario.Imagen ? `/uploads/${usuario.Imagen}` : avatarDefault}
          alt="Avatar"
          className="UserAvatar"
        />
        <h2 className="UserNombre">
          <strong>Nombreee: </strong>
          {usuario.Nombre} {usuario.Apellido}
        </h2>
        <p className="UserRol">
          <strong>Aprendizaje: </strong>
          {usuario.aprendiz?.ProgramaFormacion ?? "No asignado"}
        </p>
        <p className="UserRol">
          <strong>Rol: </strong>
          {usuario.rol?.NombreRol ?? "Sin rol"}
        </p>
        <p className="UserRol">
          <strong>Ficha: </strong>
          {usuario.aprendiz?.Ficha ?? "No asignada"}
        </p>
        <p className="UserRol">
          <strong>Jornada: </strong>
          {usuario.aprendiz?.Jornada ?? "No definida"}
        </p>
        <p className="UserRol">
          <strong>Teléfono: </strong>
          {usuario.Telefono}
        </p>
        <p className="UserCorreo">
          <strong>Correo Electrónico: </strong>
          {usuario.Correo}
        </p>
        <img src={logo} className="UserLogo" alt="Logo" />
        <button className="UserBoton" onClick={() => setContenidoActual("config")}>
          Editar perfil
        </button>
      </div>

      {/* LÚDICAS */}
      <div className="UserCuadro UserLudicas">
        <h3 className="UserTitulo">Lúdicas</h3>
        <div className="UserTarjetas">
          {[ludicaImg, ludicaImg2, ludicaImg3, ludicaImg4].map((img, i) => (
            <div className="flip-card-user" key={i}>
              <div className="flip-card-inner-user">
                <div className="flip-card-front-user">
                  <h4 className="card-title-user">
                    {["Baile Caucano", "Fútbol Recreativo", "Gimnasio Sena", "Música y Artes"][i]}
                  </h4>
                  <img src={img} alt="Lúdica" className="card-img-user" />
                </div>
                <div className="flip-card-back-user">
                  <p>📅 ¡INSCRIPCIONES ABIERTAS!</p>
                  <p>🕒 Hora: 8:00 AM - 12:00 PM</p>
                  <p>📍 Lugar: Por definir</p>
                  <p>🎯 Tipo: Recreativa</p>
                  <p>Descripción breve de la actividad.</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EVENTOS */}
      <div className="UserCuadro UserEventos">
        <h3 className="UserTitulo">Eventos Semanales!</h3>
        <div className="UserTarjetas">
          {[EventoImg, EventoImg2, EventoImg3, EventoImg4].map((img, i) => (
            <div className="flip-card-user" key={i}>
              <div className="flip-card-inner-user">
                <div className="flip-card-front-user">
                  <h4 className="card-title-user">
                    {["Charla Motivacional", "Feria del Cacao", "Academia", "Feria del Emprendimiento"][i]}
                  </h4>
                  <img src={img} alt="Evento" className="card-img-user" />
                </div>
                <div className="flip-card-back-user">
                  <p>📅 Fecha: 20 de junio 2025</p>
                  <p>🕒 Hora: 10:00 AM - 3:00 PM</p>
                  <p>📍 Lugar: Por definir</p>
                  <p>🎯 Tipo: Formativa</p>
                  <p>Descripción del evento semanal.</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
