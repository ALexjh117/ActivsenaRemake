import React, { useEffect, useState } from "react";
import "./style/CartaContacto.css";
import aleximg from './img/alex.png';
import logoSena from './img/logo-sena.png';
import defaultImg from './img/defecto.png';
import axios from "axios";

interface PerfilInstructor {
  imagen: string;
  profesion: string;
  ubicacion: string;
  UsuarioId: number;
  nombre: string;
  correo: string;
  telefono: string;
}

const FlipCard = ({ perfil }: { perfil: PerfilInstructor }) => {
  const datos = [
    `Nombre: ${perfil.nombre}`,
    `Correo: ${perfil.correo}`,
    `Teléfono: ${perfil.telefono}`,
    `Profesión: ${perfil.profesion}`,
    `Ubicación: ${perfil.ubicacion}`
  ];

  return (
    <div className="flip-card-contacto">
      <div className="flip-card-inner-contacto">
        <div className="flip-card-front-contacto">
          <img
            src={perfil.imagen || logoSena}
            alt="Imagen"
            className="card-image-contacto"
          />
        </div>
        <div className="flip-card-back-contacto">
          <img src={aleximg} alt="logo sena" className="logo-portada-contacto" />
          <h3>Información de Contacto</h3>
          <ul>
            {datos.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const VerContactosInstructores = () => {
  const [perfiles, setPerfiles] = useState<PerfilInstructor[]>([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroUbicacion, setFiltroUbicacion] = useState("");
  const [filtroProfesion, setFiltroProfesion] = useState("");

  useEffect(() => {
    const fetchPerfiles = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/perfil-instructor");
        console.log("🔍 Datos recibidos del backend:", res.data);
        setPerfiles(res.data);
      } catch (error) {
        console.error("❌ Error al cargar perfiles:", error);
      }
    };

    fetchPerfiles();
  }, []);

const filtrados = perfiles.filter((perfil) =>
  (perfil.nombre ?? "").toLowerCase().includes(filtroNombre.toLowerCase()) &&
  (perfil.ubicacion ?? "").toLowerCase().includes(filtroUbicacion.toLowerCase()) &&
  (perfil.profesion ?? "").toLowerCase().includes(filtroProfesion.toLowerCase())
);


  return (
    <div className="pagina-contacto-unica">
      <header className="header-contacto-unico">
        <img src={defaultImg} alt="logo nosotros" className="logo-nosotros-contacto" />
        <h1 className="texto-instructor-contacto">
          Contactos Instructores y Funcionarios SENA
        </h1>
      </header>

      <div className="filtros-multicampo-contacto">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
          className="input-busqueda-contacto"
        />
        <input
          type="text"
          placeholder="Buscar por ubicación..."
          value={filtroUbicacion}
          onChange={(e) => setFiltroUbicacion(e.target.value)}
          className="input-busqueda-contacto"
        />
        <input
          type="text"
          placeholder="Buscar por profesión..."
          value={filtroProfesion}
          onChange={(e) => setFiltroProfesion(e.target.value)}
          className="input-busqueda-contacto"
        />
      </div>

      <div className="card-container-contacto">
        {filtrados.map((perfil, idx) => (
          <FlipCard key={idx} perfil={perfil} />
        ))}
      </div>
    </div>
  );
};

export default VerContactosInstructores;
