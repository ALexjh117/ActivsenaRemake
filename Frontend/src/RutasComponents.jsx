import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { IAProvider } from "./pages/AnalisisIA/IAcontext";
import { AuthProvider } from "./Context/AuthContext"; 

// Tus imports de componentes
import HomePage from "../public/HomePage";
import DashBoard from "../public/DashBoard";
import DashBoardAp from "../public/DashBoardAp";
import DashBoardIn from "../public/DashBoardIn";
import Registro from "../public/Registro";
import Actividades from "./pages/Actividades/Actividades";
import Agenda from "./pages/Agenda/Agenda";
import VerificarToken from "../public/VerificarToken";
import Asistencia from "./pages/Asistencia/Asistencia";
import EscanerQR from "./Components/QrGenerador.jsx/EscanerHtml5QR";
import Cuenta from "../public/Cuenta";
import QRGenerator from "./Components/QrGenerador.jsx/QRGenerator";
import HistorialAsistencia from "./pages/Asistencia/HistorialAsistencia";
import QRGeneratorSalida from "./Components/QrGenerador.jsx/QRGeneratorSalida";
import FormularioCatalogo from "./pages/AlquierAP/FormularioCatalogo";
import GestionCatalogo from "./pages/AlquierAP/GestionFormulario";
import ApoyoSostenimiento from "./pages/ApoyoSostenimiento/ApoyoSostenimiento";

export default function RutasComponents() {
  return (
    <BrowserRouter>
      <AuthProvider> {/* Se envuelve todo*/}
        <IAProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cuenta" element={<Cuenta />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/verificar-token" element={<VerificarToken />} />
            <Route path="/dash" element={<DashBoard />} />
            <Route path="/dashap" element={<DashBoardAp />} />
            <Route path="/dashin" element={<DashBoardIn />} />
            <Route path="/actividades" element={<Actividades />} />
            <Route path="/historial" element={<HistorialAsistencia />} />
            <Route path="/formulariocatalogo" element={<FormularioCatalogo />} />
            <Route path="/gestioncatalogo" element={<GestionCatalogo />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/qr-salida" element={<QRGeneratorSalida />} />
            <Route path="/qr" element={<QRGenerator IdUsuario={1} IdActividad={9} tipo="entrada" />} />
            <Route path="/asistencia" element={<Asistencia />} />
            <Route path="/escaner" element={<EscanerQR />} />
            <Route path="/historial" element={<HistorialAsistencia IdUsuario={1} />} />
            <Route path="/apoyo-sostenimiento" element={<ApoyoSostenimiento />} />
          </Routes>
        </IAProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
