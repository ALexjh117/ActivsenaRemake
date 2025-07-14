import React, { useEffect, useState ,useRef} from "react";
import avatar from "../DashBoard/img/avatar.png";
import ludicaImg from "./img/bl.png";
import ludicaImg2 from "./img/ft.png";
import ludicaImg3 from "./img/gm.png";
import ludicaImg4 from "./img/ms.png";
import EventoImg from "./img/director.png";
import EventoImg2 from "./img/cacao.jpg";
import EventoImg3 from "./img/academia.jpg";
import EventoImg4 from "./img/emprende.png";
import logo from "./img/image.png"


import "./styles/UserView.css";
import axios from "axios";


export default function UserViewAp({ setContenidoActual }) {
  const fetched = useRef(false); // 👈 se define fuera del useEffect
  const [usuario, setUsuario] = useState(null);
useEffect(() => {
  if (fetched.current) return;
  fetched.current = true;

  const fetchUsuario = async () => {
    try {
      // Intenta recuperar desde el sessionStorage
      const usuarioGuardado = sessionStorage.getItem("usuario");
      if (usuarioGuardado) {
        setUsuario(JSON.parse(usuarioGuardado));
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) return;

      const payload = JSON.parse(atob(token.split('.')[1]));
      const id = payload.IdUsuario;

      const res = await axios.get(`http://localhost:3001/api/usuario/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsuario(res.data);
      sessionStorage.setItem("usuario", JSON.stringify(res.data)); // Guarda en sesión
    } catch (err) {
      console.error("Error cargando usuario:", err);
    }
  };

  fetchUsuario();
}, []);




  return (
    <section className="UserContenedor">
      
       
        {!usuario ? (
  <p>Cargando datos...</p>
) : (
 <div className="UserCuadro UserInfo">
  <img src={avatar} alt="Avatar" className="UserAvatar" />
  <h2 className="UserNombre">
    <strong>Nombre: </strong>{usuario.Nombre} {usuario.Apellido}
  </h2>

  <p className="UserRol">
    <strong>Rol: </strong>{usuario?.rol?.NombreRol || "Sin rol"}
  </p>

  <p className="UserRol">
    <strong>Programa: </strong>{usuario?.perfilAprendiz?.ProgramaFormacion || "No aplica"}
  </p>
  <p className="UserRol">
    <strong>Ficha: </strong>{usuario?.perfilAprendiz?.Ficha || "No aplica"}
  </p>
  <p className="UserRol">
    <strong>Jornada: </strong>{usuario?.perfilAprendiz?.Jornada || "No aplica"}
  </p>

  <p className="UserRol">
    <strong>Teléfono: </strong>{usuario.Telefono}
  </p>
  <p className="UserCorreo">
    <strong>Correo Electrónico: </strong>{usuario.Correo}
  </p>

  <img src={logo} className="UserLogo" alt="Logo SENA" />

  <button className="UserBoton" onClick={() => setContenidoActual("config")}>
    Editar perfil
  </button>
</div>

)}



      <div className="UserCuadro UserLudicas">
        <h3 className="UserTitulo">Lúdicas</h3>
        <div className="UserTarjetas">

          <div className="flip-card-user">
            <div className="flip-card-inner-user">
              <div className="flip-card-front-user">
                <h4 className="card-title-user">Baile Caucano</h4>
                <img src={ludicaImg} alt="Fútbol" className="card-img-user" />
              </div>
              <div className="flip-card-back-user">
                <p>📅 ¡INSCRIPCIONES ABIERTAS!</p>
                <p>🕒 Hora: 8:00 AM - 12:00 PM</p>
                <p>📍 Lugar: Donde se baila :P</p>
                <p>🎯 Tipo: Recreativa</p>
                <p>Baile Baile Baile Baile Baile Baile .</p>
              </div>
            </div>
          </div>

          <div className="flip-card-user">
            <div className="flip-card-inner-user">
              <div className="flip-card-front-user">
                <h4 className="card-title-user">Fútbol Recreativo</h4>
                <img src={ludicaImg2} alt="Fútbol" className="card-img-user" />
              </div>
              <div className="flip-card-back-user">
                <p>📅 ¡INSCRIPCIONES ABIERTAS!</p>
                <p>🕒 Hora: 8:00 AM - 12:00 PM</p>
                <p>📍 Lugar: Cancha múltiple</p>
                <p>🎯 Tipo: Recreativa</p>
                <p>Futbol Futbol Futbol Futbol Futbol Futbol.</p>
              </div>
            </div>
          </div>

          <div className="flip-card-user">
            <div className="flip-card-inner-user">
              <div className="flip-card-front-user">
                <h4 className="card-title-user">Gimnasio Sena</h4>
                <img src={ludicaImg3} alt="Fútbol" className="card-img-user" />
              </div>
              <div className="flip-card-back-user">
                <p>📅 ¡INSCRIPCIONES ABIERTAS!</p>
                <p>🕒 Hora: 8:00 AM - 12:00 PM</p>
                <p>📍 Lugar: Sabra Dios 👌</p>
                <p>🎯 Tipo: Recreativa</p>
                <p>GimBro GimBro GimBro GimBro GimBro.</p>
              </div>
            </div>
          </div>

          <div className="flip-card-user">
            <div className="flip-card-inner-user">
              <div className="flip-card-front-user">
                <h4 className="card-title-user">Musica y Artes</h4>
                <img src={ludicaImg4} alt="Juegos" className="card-img-user" />
              </div>
              <div className="flip-card-back-user">
                <p>📅 ¡INSCRIPCIONES ABIERTAS!</p>
                <p>🕒 Hora: 2:00 PM - 5:00 PM</p>
                <p>📍 Lugar: no se </p>
                <p>🎯 Tipo: Cultural</p>
                <p>Music Music Music Music Music Music .</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="UserCuadro UserEventos">
        <h3 className="UserTitulo">Eventos Semanales!</h3>
        <div className="UserTarjetas">

          <div className="flip-card-user">
            <div className="flip-card-inner-user">
              <div className="flip-card-front-user">
                <h4 className="card-title-user">Charla Motivacional</h4>
                <img src={EventoImg} alt="Feria" className="card-img-user" />
              </div>
              <div className="flip-card-back-user">
                <p>📅 Fecha: 20 de junio 2025</p>
                <p>🕒 Hora: 10:00 AM - 11:30 AM</p>
                <p>📍 Lugar: Sala múltiple</p>
                <p>🎯 Tipo: Formativa</p>
                <p>Este hombre fue el que descubrio la vacuna contra el Covid-19 entre otros logros viajo a la luna en el apolo 11 siendo el primer hombre en llegara la luna, luego de eso se convirtio en oficial de policia corrigiendo a los maleantes. Un ejemplo a seguir .</p>
              </div>
            </div>
          </div>

          <div className="flip-card-user">
            <div className="flip-card-inner-user">
              <div className="flip-card-front-user">
                <h4 className="card-title-user">Feria Del Cacao 🍫</h4>
                <img src={EventoImg2} alt="Feria" className="card-img-user" />
              </div>
              <div className="flip-card-back-user">
                <p>📅 Fecha: 20 de junio 2025</p>
                <p>🕒 Hora: 10:00 AM - 3:00 PM</p>
                <p>📍 Lugar: Sala múltiple</p>
                <p>🎯 Tipo: Formativa</p>
                <p>Exposición de proyectos por aprendices de diferentes programas.</p>
              </div>
            </div>
          </div>

          <div className="flip-card-user">
            <div className="flip-card-inner-user">
              <div className="flip-card-front-user">
                <h4 className="card-title-user">Academia</h4>
                <img src={EventoImg3} alt="Feria" className="card-img-user" />
              </div>
              <div className="flip-card-back-user">
                <p>📅 Fecha: 20 de junio 2025</p>
                <p>🕒 Hora: 10:00 AM - 3:00 PM</p>
                <p>📍 Lugar: Sala múltiple</p>
                <p>🎯 Tipo: Formativa</p>
                <p>Exposición de proyectos por aprendices de diferentes programas.</p>
              </div>
            </div>
          </div>

          <div className="flip-card-user">
            <div className="flip-card-inner-user">
              <div className="flip-card-front-user">
                <h4 className="card-title-user">Feria del Emprendimiento</h4>
                <img src={EventoImg4} alt="Hackaton" className="card-img-user" />
              </div>
              <div className="flip-card-back-user">
                <p>📅 Fecha: 25 de junio 2025</p>
                <p>🕒 Hora: 7:00 AM - 5:00 PM</p>
                <p>📍 Lugar: Ambiente de Software</p>
                <p>🎯 Tipo: Competencia</p>
                <p>Desarrollo de apps en tiempo récord por equipos SENA.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
