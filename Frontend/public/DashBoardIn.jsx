import React, { useState } from "react";
import MenuLateralIn from "../src/pages/DashBoard/DashBoardComponents/DashIn/MenuLateralIn";
import HomeDash from "../src/pages/DashBoard/HomeDash";
import ActivBot from "../src/pages/DashBoard/DashBoardComponents/DashA/ActivBot";
import NavbarIn from "../src/pages/DashBoard/DashBoardComponents/DashIn/NavbarIn";
import CalendarioActividades from "../src/pages/CalendarioAdmin/CalendarioActividades";
import Feedbacks from "../src/pages/Feedback/Feedbacks";
import Planificar from "../src/pages/Planificar/Planificar";
import RegistroActividades from "../src/pages/RegistroActividades/RegistroActividades";
import Combinar from "../src/pages/CombinarFA/Combinar";
import Actividades from "../src/pages/Actividades/Actividades";
import Aplicacion from "../src/pages/Aplicacion/Aplicacion";
import AprendizRun from "../src/pages/AprendizC/AprendizRun";
import PlanificarEvento from "../src/pages/PlanificarEv/PlanificarEvento";
import RegistroA from "../src/pages/RegistroAsistencia/RegistroA";
import CartaContacto from "../src/pages/CartasContacto/CartaInstructor";
import ChromaGrid from "../src/Components/ChromaGrid/ChromaGrid";
import ChatAI from "../src/pages/ChatAI/ChatAI";
import UserViewIn from "../src/pages/UserView/UserViewIn";
import ConfigViewIn from "../src/pages/ConfigView/ConfigViewIn";

import MisActividades from "../src/pages/Actividades/Instructor/MisActividades";
import AsistenciasActividad from "../src/pages/Asistencia/Instructor/AsistenciasActividad";
// import UserView from "../src/pages/UserView/UserView"; // Descomenta si lo necesitas

import "../src/styles/BotHp.css";
import "../src/styles/ColaViento.css";
import "../src/styles/Resposive.css";
import "../src/styles/global.css";
import Instructor from "../src/pages/SolicitudApoyo/Instructor";


export default function DashBoard() {
  const [menuAbierto, setMenuAbierto] = useState(true);
  const [contenidoActual, setContenidoActual] = useState("userviewin");
  const [idSeleccionada, setIdSeleccionada] = useState(null);

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  return (
    <section className="contenedordash">
      <MenuLateralIn
        menuAbierto={menuAbierto}
        toggleMenu={toggleMenu}
        setContenidoActual={setContenidoActual}
      />

      <main className="contenidodash">
        <NavbarIn
          toggleMenu={toggleMenu}
          setContenidoActual={setContenidoActual}
        />

        {contenidoActual === "userviewin" && (
          <UserViewIn setContenidoActual={setContenidoActual} />
        )}
        {contenidoActual === "actividades" && (
          <Actividades
            setContenidoActual={setContenidoActual}
            setIdSeleccionada={setIdSeleccionada}
          />
        )}
        {contenidoActual === "aplicacion" && <Aplicacion />}
        {contenidoActual === "plan" && <Planificar />}
        {contenidoActual === "registrarl" && <Registroludicas/>}
        {contenidoActual === "feedback" && <Feedbacks />}
        {contenidoActual === "comprobar" && <Combinar />}
        {contenidoActual === "calendarioactividades" && <CalendarioActividades />}
        {contenidoActual === "aprendiz" && <AprendizRun />}
        {contenidoActual === "planevento" && <PlanificarEvento />}
        {contenidoActual === "registro" && <RegistroA />}
        {contenidoActual === "cartacontacto" && <CartaContacto />}
        {contenidoActual === "chromagrid" && <ChromaGrid />}
        {contenidoActual === "solicitudapoyoinstructor" && <Instructor/>}
        {contenidoActual === "chatai" && <ChatAI />}
        {contenidoActual === "perfil" && <HomeDash />}
        {contenidoActual === "registroactividades" && <RegistroActividades/>}
  {contenidoActual === "misactividades" && <MisActividades/>}
        {contenidoActual === "config" && <ConfigViewIn />}
        {contenidoActual === "alquiler" && <Alquiler />}
        {contenidoActual === "asistenciasactividad" && (
          <AsistenciasActividad IdActividad={idSeleccionada} />
        )}
        {/* Si llegas a usar este componente, descomenta la línea de importación también */}
        {/* {contenidoActual === "userview" && (
          <UserView setContenidoActual={setContenidoActual} />
        )} */}
      </main>

      <ActivBot irAChatai={() => setContenidoActual("chatai")} />
    </section>
  );
}
