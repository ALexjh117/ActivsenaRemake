import React, { useState, useEffect } from 'react';
import './styles/revisionEventsStyles.css';
import axios from 'axios';

export default function RevisionEvents() {
  const [gestionEventos, setgestionEventos] = useState([]);

  useEffect(() => {
    const TraerEventos = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/gestionevento");
        setgestionEventos(res.data);
      } catch (error) {
        console.error("Error al obtener eventos:", error);
      }
    };

    TraerEventos();
  }, []);

  const aprobarEvento = async (IdGestionE) => {
    try {
      await axios.put(`http://localhost:3001/api/gestionevento/aprobar/${IdGestionE}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      alert('✅ Evento aprobado correctamente');
      setgestionEventos(prev => prev.filter(gestion => gestion.IdGestionE !== IdGestionE));
    } catch (error) {
      console.error('❌ Error al aprobar el evento', error);
      alert('⚠️ No se pudo aprobar el evento');
    }
  };

  return (
    <>
      <h2>📋 GESTIÓN DE EVENTOS</h2>
      <div className='revisionE-container'>
        {gestionEventos
          .filter((gestion) => gestion.Aprobar === 'Pendiente')
          .map((gestion) => {
            const planificacion = gestion.planificaciones[0];
            const usuario = planificacion?.usuario;

            return (
              <div key={gestion.IdGestionE} className='revision-carta'>
                <img
                  src={usuario?.ImagenPerfil || "/img/default.jpg"}
                  alt="Perfil del instructor"
                  className='revision-img-perfil'
                />

                <div className='revision-info'>
                  <p><strong>Instructor:</strong> {usuario?.Nombre}</p>
                  <p><strong>Correo:</strong> {usuario?.Correo}</p>
                  <p><strong>Evento:</strong> {planificacion?.NombreEvento}</p>
                  <p><strong>Fecha:</strong> {planificacion?.FechaEvento?.slice(0, 10)}</p>
                </div>
                
                <img
                  src={`http://localhost:3001/uploads/${planificacion?.ImagenEvento}`}
                  alt="Imagen del evento"
                  className='revision-img-evento'
                />
                <button
                  className="revision-btn-aprobar"
                  onClick={() => aprobarEvento(gestion.IdGestionE)}
                >
                  Aprobar
                </button>
              </div>
            );
          })}
      </div>
    </>
  );
}
