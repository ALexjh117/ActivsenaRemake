import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminEventos.css";

interface Usuario {
  Nombre: string;
  Apellido: string;
  Correo: string;
  rol?: {
    NombreRol: string;
  };
  perfilInstructor?: {
    Cargo: string;
    Profesion: string;
  };
}

interface GestionEvento {
  IdGestionE: number;
  Aprobar: string;
}

interface Planificacion {
  IdPlanificarE: number;
  NombreEvento: string;
  FechaEvento: string;
  LugarDeEvento: string;
  ImagenEvento?: string;
  usuario: Usuario;
  gestionEvento: GestionEvento;
}

const PlanificacionesEventos: React.FC = () => {
  const [eventos, setEventos] = useState<Planificacion[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [modalImagen, setModalImagen] = useState<string | null>(null);

  const fetchEventos = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/planificacionevento");
      console.log("📦 Eventos recibidos:", res.data);
      res.data.forEach((evento: any) => {
        console.log("🎯 Evento individual:", evento);
      });
      setEventos(res.data);
    } catch (error) {
      console.error("Error al cargar eventos", error);
    }
  };

  const aprobarEvento = async (idGestionE: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3001/api/gestionevento/aprobar/${idGestionE}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMensaje("✅ Evento aprobado correctamente.");
      fetchEventos();
    } catch (error: any) {
      console.error("Error al aprobar evento", error);
      setMensaje(error.response?.data?.error || "❌ Error al aprobar");
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  return (
    <div className="pe-contenedor">
      <h2 className="pe-titulo">🗓️ Planificaciones de Eventos</h2>
      {mensaje && <p className="pe-mensaje">{mensaje}</p>}

      <table className="pe-tabla">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Evento</th>
            <th>Fecha</th>
            <th>Lugar</th>
            <th>Responsable</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {eventos.map((e) => (
            <tr key={e.IdPlanificarE}>
              <td>
                {e.ImagenEvento ? (
                  <img
                    src={`http://localhost:3001/uploads/usuarios/${e.ImagenEvento}`}
                    alt="Imagen del evento"
                    className="pe-miniatura"
                    onClick={() =>
                      setModalImagen(`http://localhost:3001/uploads/usuarios/${e.ImagenEvento}`)
                    }
                    style={{ cursor: "pointer" }}
                    title="Ver imagen en grande"
                  />
                ) : (
                  <span>No hay imagen</span>
                )}
              </td>
              <td>{e.NombreEvento}</td>
              <td>{new Date(e.FechaEvento).toLocaleDateString()}</td>
              <td>{e.LugarDeEvento}</td>
              <td>{`${e.usuario.Nombre} ${e.usuario.Apellido}`}</td>
              <td>{e.usuario.rol?.NombreRol || "N/A"}</td>
              <td>
                {e.gestionEvento?.Aprobar === "Pendiente"
                  ? "⏳ Pendiente"
                  : "✅ Aprobado"}
              </td>
              <td>
                {e.gestionEvento?.Aprobar === "Pendiente" ? (
                  <button
                    className="pe-boton"
                    onClick={() => {
                      if (e.gestionEvento?.IdGestionE) {
                        aprobarEvento(e.gestionEvento.IdGestionE);
                      } else {
                        alert("❌ No se encontró el ID de gestión del evento.");
                      }
                    }}
                  >
                    ✅ Aprobar
                  </button>
                ) : (
                  <span style={{ color: "green", fontWeight: "bold" }}>✔️</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalImagen && (
        <div className="modal-imagen-fondo" onClick={() => setModalImagen(null)}>
          <div className="modal-imagen-contenido" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={() => setModalImagen(null)}>
              ✖
            </button>
            <img src={modalImagen} alt="Imagen ampliada" className="modal-imagen" />
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanificacionesEventos;
