import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/Alquiler.css";

interface AlquilerElemento {
  IdAlquiler: number;
  CantidadDisponible: number;
  Nombre: string; // 👈 Este campo lo renombré a "Nombre" según tu backend
  Imagen: string;
  IdElemento: number;
}

const CatalogoDisponible = () => {
  const [catalogo, setCatalogo] = useState<AlquilerElemento[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrActivo, setQrActivo] = useState<AlquilerElemento | null>(null);

  useEffect(() => {
    const fetchCatalogo = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/elemento");
        setCatalogo(response.data);
      } catch (error) {
        console.error("Error al cargar catálogo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogo();
  }, []);

  const cerrarModal = () => {
    setQrActivo(null);
  };

  if (loading) return <p className="loading">Cargando catálogo...</p>;

  return (
    <div className="catalogo-container">
      <h2 className="catalogo-titulo">Elementos Disponibles para Alquiler</h2>

      <div className="grid-catalogo">
        {catalogo.map((el) => (
          <div key={el.IdElemento} className="card-elemento">
            <img
              src={`http://localhost:3001/uploads/${el.Imagen}`}
              alt={el.Nombre}
              className="img-elemento"
            />
            <h3>{el.Nombre}</h3>
            <p><strong>Disponibles:</strong> {el.CantidadDisponible}</p>

            <button
              onClick={() => setQrActivo(el)}
              className="btn-ver-qr"
            >
              Ver QR
            </button>
          </div>
        ))}
      </div>

      {/* Modal para mostrar el QR */}
      {qrActivo && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={cerrarModal}>&times;</span>
           <img
  src={`http://localhost:3001/qrcodes/${qrActivo.IdElemento}.png`}
  alt={`QR de ${qrActivo.Nombre}`}
  className="qr-grande"
/>

          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogoDisponible;
