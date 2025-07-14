import React, { useState } from "react";
import {
  FaHome,
  FaCalendarAlt,
  FaRegCheckCircle,
  FaAlignJustify,
  FaCommentDots,
  FaClipboardList,
  FaQrcode,
  FaUserGraduate,
  FaAddressBook,
  	FaInfoCircle,
  FaChartBar,
  FaUpload,
  FaBoxOpen,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";

import logo from "../img/logo.png";
import avatar from "../img/avatar.png";
import "../DashA/style/MenuLateral.css"

export default function MenuLateral({ menuAbierto, toggleMenu, setContenidoActual }) {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [openSection, setOpenSection] = useState({
    eventos: true,
    alquiler: false,
    analisis: false,
    documentos: false,
    temas:false,
  });

  const toggleDropdown = () => setMostrarMenu(prev => !prev);
  const toggleSection = (section) => {
    setOpenSection(prev => ({ ...prev, [section]: !prev[section] }));
  };

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
      {document.body.classList.contains("theme-halloween") && (
  <div className="animaciones-sidebar-halloween">
    <div className="murcielago uno"></div>
    <div className="murcielago dos"></div>
    <div className="murcielago tres"></div>
    <div className="nube-humo-sidebar"></div>
  </div>
)}

      {/* Header usuario */}
      <section className="Clogodash">
        <div className="UserHeaderInfo" onClick={toggleDropdown}>
          <img src={avatar} alt="Usuario" className="avatardash" />
          <span className="nombredash">Administrador</span>
        </div>
       

        {mostrarMenu && (
          <div className="menudesplegabledash">
            <ul>
              <li className="opcionesm" onClick={irAPerfil}>Perfil</li>
              <li className="opcionesm" onClick={irConfig}>Configuración</li>
              <li className="opcionesm">Cerrar sesión</li>
            </ul>
          </div>
        )}
      </section>

      {/* Menú colapsable */}
      <nav className="menudash">

        {/* Inicio */}
        <button onClick={() => setContenidoActual("userview")} className="opciondash">
          <FaHome className="iconodash" /> Inicio
        </button>

        {/* Sección: Eventos */}
        <div className="grupo-menu">
          <button className="tituloseccion" onClick={() => toggleSection("eventos")}>
            {openSection.eventos ? <FaChevronDown /> : <FaChevronRight />} Eventos
          </button>
          {openSection.eventos && (
            <>
              <button onClick={() => setContenidoActual("actividad")} className="opciondash">
                <FaRegCheckCircle className="iconodash" /> Actividades
              </button>
              <button onClick={() => setContenidoActual("aplicacion")} className="opciondash">
                <FaCalendarAlt className="iconodash" /> Eventos
              </button>
              <button onClick={() => setContenidoActual("calendario")} className="opciondash">
                <FaCalendarAlt className="iconodash" /> Calendario
              </button>
            </>
          )}
        </div>

        {/* Sección: Alquiler */}
        <div className="grupo-menu">
          <button className="tituloseccion" onClick={() => toggleSection("alquiler")}>
            {openSection.alquiler ? <FaChevronDown /> : <FaChevronRight />} Gestión de Alquiler
          </button>
          {openSection.alquiler && (
            <>
              <button onClick={() => setContenidoActual("registroa")} className="opciondash">
                <FaQrcode className="iconodash" /> Registro Prestamo
              </button>
              <button onClick={() => setContenidoActual("detallea")} className="opciondash">
                <	FaInfoCircle className="iconodash" /> Detalles Prestamos
              </button>
              <button onClick={() => setContenidoActual("gestioncatalogo")} className="opciondash">
                <FaBoxOpen className="iconodash" /> Elementos Subidos
              </button>
              <button onClick={() => setContenidoActual("formulariocatalogo")} className="opciondash">
                <FaUpload className="iconodash" /> SubirCarrusel
              </button>

               <button onClick={() => setContenidoActual("registrarelemento")} className="opciondash">
                <FaUpload className="iconodash" /> SubirElemento
              </button>



            </>
          )}
        </div>

        {/* Sección: Análisis */}
        <div className="grupo-menu">
          <button className="tituloseccion" onClick={() => toggleSection("analisis")}>
            {openSection.analisis ? <FaChevronDown /> : <FaChevronRight />} Análisis y Feedback
          </button>
          {openSection.analisis && (
            <>
              <button onClick={() => setContenidoActual("combinar")} className="opciondash">
                <FaCommentDots className="iconodash" /> Feedback
              </button>
              <button onClick={() => setContenidoActual("solicitudes")} className="opciondash">
                <FaClipboardList className="iconodash" /> Solicitudes
              </button>
              <button onClick={() => setContenidoActual("analisisia")} className="opciondash">
                <FaChartBar className="iconodash" /> Análisis IA
              </button>
              <button onClick={() => setContenidoActual("solicitudapoyo")} className="opciondash">
                <FaChartBar className="iconodash" /> Apoyos
              </button>
                <button onClick={() => setContenidoActual("resumenia")} className="opciondash">
                <FaChartBar className="iconodash" /> resumen
              </button>
             
            </>
          )}
        </div>

        {/* Sección: Documentos */}
        <div className="grupo-menu">
          <button className="tituloseccion" onClick={() => toggleSection("documentos")}>
            {openSection.documentos ? <FaChevronDown /> : <FaChevronRight />} Documentos
          </button>
          {openSection.documentos && (
            <>
              <button onClick={() => setContenidoActual("adminconstancias")} className="opciondash">
                <FaUserGraduate className="iconodash" /> ConstanciaAD
              </button>
              <button onClick={() => setContenidoActual("cartacontacto")} className="opciondash">
                <FaAddressBook className="iconodash" /> Contactos
              </button>
               <button onClick={() => setContenidoActual("planificareventosadmin")} className="opciondash">
                <FaAddressBook className="iconodash" /> AprobarEventos
              </button>
            </>
          )}
        </div>

        {/* Sección: Documentos */}
        <div className="grupo-menu">
          <button className="tituloseccion" onClick={() => toggleSection("gestionusuarios")}>
            {openSection.gestionusuarios ? <FaChevronDown /> : <FaChevronRight />} GestionUsuarios
          </button>
          {openSection.gestionusuarios && (
            <>
            
              <button onClick={() => setContenidoActual("cambiarrol")} className="opciondash">
                <FaAddressBook className="iconodash" /> Roles
              </button>
            </>
          )}
        </div>
{/* Sección: Apariencia o Temas */}
<div className="grupo-menu">
  <button className="tituloseccion" onClick={() => toggleSection("temas")}>
    {openSection.temas ? <FaChevronDown /> : <FaChevronRight />} Apariencia
  </button>
  {openSection.temas && (
    <>
      <button onClick={() => setContenidoActual("temas")} className="opciondash">
        <FaAlignJustify className="iconodash" /> Temas
      </button>
    </>
  )}
</div>

       
        <img src={logo} alt="Logo"  className="logo-dashboard-general"/>
      </nav>
    </aside>
  );
}
