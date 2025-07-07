import React, { useState } from "react";
import api from "../../services/api";
import "./styles/Config.css";


const configuraciones = [
  "Cambiar contraseña",
  "Cambiar imagen",
  "Cambiar nombre",
  "Actualizar correo",
];

export default function ConfigViewIn() {
  const [ventana, setVentana] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    actual: "",
    nueva: "",
    imagen: null,
  });

  const cerrarVentana = () => setVentana(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setFormData({ ...formData, imagen: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      let response;

      if (ventana === "Cambiar nombre") {
        response = await api.put("/usuario/cambiar-nombre", {
          Nombre: formData.nombre,
        });
      }

      

      if (ventana === "Actualizar correo") {
        response = await api.put("/usuario/cambiar-correo", {
          Correo: formData.correo,
        });
      }

      if (ventana === "Cambiar contraseña") {
        response = await api.post("/usuario/update-password", {
          Actualizar_Contrasena: formData.actual,
          Contrasena: formData.nueva,
        });
      }

      if (ventana === "Cambiar imagen" && formData.imagen) {
        const formDataUpload = new FormData();
        formDataUpload.append("imagen", formData.imagen);

        response = await api.put("/usuario/cambiar-imagen", formDataUpload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      const data = response?.data;
      alert(data?.mensaje || data?.error || "Actualización completada.");
    } catch (error) {
      alert("Error en la solicitud.");
      console.error(error);
    }
  };

  const renderContenidoVentana = () => {
    switch (ventana) {
      case "Cambiar contraseña":
        return (
          <>
            <input
              type="password"
              name="actual"
              placeholder="Contraseña actual"
              onChange={handleChange}
            />
            <input
              type="password"
              name="nueva"
              placeholder="Nueva contraseña"
              onChange={handleChange}
            />
            <button onClick={handleSubmit}>Guardar</button>
          </>
        );
      case "Cambiar imagen":
        return (
          <>
            <input type="file" name="imagen" onChange={handleChange} />
            <button onClick={handleSubmit}>Subir Imagen</button>
          </>
        );
      case "Cambiar nombre":
        return (
          <>
            <input
              type="text"
              name="nombre"
              placeholder="Nuevo nombre"
              onChange={handleChange}
            />
            <button onClick={handleSubmit}>Actualizar Nombre</button>
          </>
        );
      case "Actualizar correo":
        return (
          <>
            <input
              type="email"
              name="correo"
              placeholder="Nuevo correo"
              onChange={handleChange}
            />
            <button onClick={handleSubmit}>Actualizar Correo</button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <section className="Configcontenedor">
      <h2 className="Confightitulo">Configuraciones</h2>
      <div className="Configopciones">
        {configuraciones.map((opcion) => (
          <button
            key={opcion}
            className="Configboton"
            onClick={() => setVentana(opcion)}
          >
            {opcion}
          </button>
        ))}
      </div>

      {ventana && (
        <div className="Configmodal">
          <div className="Configventana">
            <h3>{ventana}</h3>
            {renderContenidoVentana()}
            <button className="Configcerrar" onClick={cerrarVentana}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
