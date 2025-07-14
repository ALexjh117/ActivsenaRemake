import React, { useState } from "react";
import {
  FaHome,
  FaListAlt,
  FaRegCalendarCheck,
  FaRunning,
  FaCalendarAlt,
  FaStopwatch,
  FaGamepad,
  FaQrcode,
  FaUserGraduate,
  FaDiscourse,
  FaAddressBook,
  FaChevronDown,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";

import logo from "../../../../../public/img/logodef.png";
import avatar from "../img/avatar.png";
import "../DashA/style/MenuLateral.css";


import { useAuth } from "../../../../Context/AuthContext";

export default function MenuLateral({ menuAbierto, toggleMenu, setContenidoActual }) {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [openSection, setOpenSection] = useState({
    participacion: true,
    gestion: true,
    otros: true,
  });

  const { logout } = useAuth(); // ✅ usamos logout

  const toggleDropdown = () => setMostrarMenu((prev) => !prev);
  const toggleSection = (section) =>
    setOpenSection((prev) => ({ ...prev, [section]: !prev[section] }));

  const irAPerfil = () => {
    setContenidoActual("perfil");
    setMostrarMenu(false);
  };

  const irConfig = () => {
    setContenidoActual("config");
    setMostrarMenu(false);
  };

  return (
    <aside className={`barradash ${menuAbierto ? "mostrar" : "ocultar"}`}>
      {/* Header usuario */}
      <section className="Clogodash">
        <div className="UserHeaderInfo" onClick={toggleDropdown}>
          <img src={avatar} alt="Usuario" className="avatardash" />
          <span className="nombredash">Aprendiz</span>
        </div>
        <button className="subirdash" onClick={toggleMenu}>
          <FaTimes />
        </button>

        {mostrarMenu && (
          <div className="menudesplegabledash">
            <ul>
              <li className="opcionesm" onClick={irAPerfil}>Perfil</li>
              <li className="opcionesm" onClick={irConfig}>Configuración</li>
              <li className="opcionesm" onClick={logout}>Cerrar sesión</li> {/* ✅ funcional */}
            </ul>
          </div>
        )}
      </section>

      {/* Menú principal */}
      <nav className="menudash">

        <button onClick={() => setContenidoActual("userviewap")} className="opciondash">
          <FaHome className="iconodash" /> Inicio
        </button>

        <div className="grupo-menu">
          <button className="tituloseccion" onClick={() => toggleSection("participacion")}>
            {openSection.participacion ? <FaChevronDown /> : <FaChevronRight />} Participación
          </button>
          {openSection.participacion && (
            <>
              <button onClick={() => setContenidoActual("actividades")} className="opciondash">
                <FaListAlt className="iconodash" /> Actividades
              </button>
              <button onClick={() => setContenidoActual("aplicacion")} className="opciondash">
                <FaRegCalendarCheck className="iconodash" /> Eventos
              </button>
              <button onClick={() => setContenidoActual("ludicas")} className="opciondash">
                <FaRunning className="iconodash" /> Lúdicas
              </button>
              <button onClick={() => setContenidoActual("calendarioactividades")} className="opciondash">
                <FaCalendarAlt className="iconodash" /> Calendario
              </button>
              <button onClick={() => setContenidoActual("horasl")} className="opciondash">
                <FaStopwatch className="iconodash" /> Horas Lúdicas
              </button>
            </>
          )}
        </div>

        <div className="grupo-menu">
          <button className="tituloseccion" onClick={() => toggleSection("gestion")}>
            {openSection.gestion ? <FaChevronDown /> : <FaChevronRight />} Gestión
          </button>
          {openSection.gestion && (
            <>
              <button onClick={() => setContenidoActual("alquilerap")} className="opciondash">
                <FaGamepad className="iconodash" /> Préstamos
              </button>
              <button onClick={() => setContenidoActual("escanerqr")} className="opciondash">
                <FaQrcode className="iconodash" /> Escanear QR
              </button>
              <button onClick={() => setContenidoActual("constanciacr")} className="opciondash">
                <FaUserGraduate className="iconodash" /> Constancia
              </button>
              <button onClick={() => setContenidoActual("solicitudapoyoaprendiz")} className="opciondash">
                <FaUserGraduate className="iconodash" /> Apoyos
              </button>
            </>
          )}
        </div>

        <div className="grupo-menu">
          <button className="tituloseccion" onClick={() => toggleSection("otros")}>
            {openSection.otros ? <FaChevronDown /> : <FaChevronRight />} Otros
          </button>
          {openSection.otros && (
            <>
              <button onClick={() => setContenidoActual("combinar")} className="opciondash">
                <FaDiscourse className="iconodash" /> Feedback
              </button>
              <button onClick={() => setContenidoActual("cartacontacto")} className="opciondash">
                <FaAddressBook className="iconodash" /> Contactos
              </button>
            </>
          )}
        </div>
      </nav>
      <img src={logo} alt="Logo" className="logo-dashboard-general" />
    </aside>
  );
}
