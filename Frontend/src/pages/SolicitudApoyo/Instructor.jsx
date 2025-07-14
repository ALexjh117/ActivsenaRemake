import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./style/Instructor.css";
import { jwtDecode } from 'jwt-decode';

const obtenerIdInstructor = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const decoded = jwtDecode(token);
  return decoded.IdUsuario;
};

const Instructor = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [telefono, setTelefono] = useState('');
  const [instructor, setInstructor] = useState(null);

  useEffect(() => {
    const id = obtenerIdInstructor();
    const token = localStorage.getItem('token');

    if (id && token) {
      axios.get(`http://localhost:3001/api/usuario/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => {
          setInstructor(res.data);
          setTelefono(res.data.Telefono || '');
        })
        .catch(err => console.error("Error al obtener el instructor:", err));

      axios.get('http://localhost:3001/api/solicitudapoyo', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => setSolicitudes(res.data))
        .catch((err) => console.error(err));
    }
  }, []);

  const actualizarTelefono = () => {
    console.log("📣 Click en botón de actualizar");
    const token = localStorage.getItem('token');

    if (!instructor || !token) return;

    if (!/^\d{10}$/.test(telefono)) {
      alert("Número inválido. Debe tener exactamente 10 dígitos.");
      return;
    }

    axios.put(
      `http://localhost:3001/api/usuario/${instructor.IdUsuario}`,
      { Telefono: telefono },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then(() => {
        alert("Número actualizado correctamente");
      })
      .catch(err => {
        console.error("Error al actualizar teléfono:", err);
        alert("Error al actualizar número");
      });
  };

  const manejarCambio = async (solicitud) => {
    try {
      const IdInstructor = obtenerIdInstructor();
      const token = localStorage.getItem('token');
      if (!IdInstructor || !token) {
        alert("Error: no se pudo obtener el ID del instructor o token");
        return;
      }

      await axios.put(`http://localhost:3001/api/solicitudapoyo/${solicitud.IdSolicitud}`, {
        Estado: solicitud.estado
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      await axios.post(`http://localhost:3001/api/historial`, {
        IdSolicitud: solicitud.IdSolicitud,
        EstadoNuevo: solicitud.estado || solicitud.Estado,
        Comentario: solicitud.comentario || '',
        IdUsuario: IdInstructor
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert('Solicitud actualizada y registrada en historial');

      const res = await axios.get('http://localhost:3001/api/solicitudapoyo', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSolicitudes(res.data);

    } catch (error) {
      console.error('Error al actualizar y registrar historial', error);
    }
  };

  return (
    <div className="instructor-container">
      <div className="form-contacto">
        <h3>📞 Mi número de contacto</h3>
        <input
          type="text"
          placeholder="Ingresa tu número"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
        <button onClick={actualizarTelefono}>Actualizar número</button>
      </div>

      {solicitudes.map((s, index) => (
        <div key={index} className="solicitud">
          <h3>
            {s.usuario?.Nombre} - {s.TipoAyuda}
            <span className={`badge ${((s.estado || s.Estado) || '').replace(/\s/g, '')}`}>
              {s.estado || s.Estado}
            </span>
          </h3>

          <p>{s.Descripcion}</p>

          <label>Comentario al aprendiz:</label>
          <textarea
            value={s.comentario || ''}
            onChange={(e) =>
              setSolicitudes((prev) =>
                prev.map((sol) =>
                  sol.IdSolicitud === s.IdSolicitud
                    ? { ...sol, comentario: e.target.value }
                    : sol
                )
              )
            }
          />

          <label>Estado:</label>
          <select
            value={s.estado || s.Estado}
            onChange={(e) =>
              setSolicitudes((prev) =>
                prev.map((sol) =>
                  sol.IdSolicitud === s.IdSolicitud
                    ? { ...sol, estado: e.target.value }
                    : sol
                )
              )
            }
          >
            <option value="Pendiente">Pendiente</option>
            <option value="En Proceso">En Proceso</option>
            <option value="Atendido">Atendido</option>
            <option value="Finalizado">Finalizado</option>
          </select>

          <button onClick={() => manejarCambio(s)}>Guardar cambios</button>
        </div>
      ))}
    </div>
  );
};

export default Instructor;
