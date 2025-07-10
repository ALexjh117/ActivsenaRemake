import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style/MisLudicas.css"
export default function MisActividadesYLudicas() {
  const [actividades, setActividades] = useState([]);
  const [ludicas, setLudicas] = useState([]);
  const [vista, setVista] = useState("actividades");
  const [asistencias, setAsistencias] = useState({});
  const [usuarioId, setUsuarioId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = JSON.parse(atob(token.split(".")[1]));
    setUsuarioId(decoded.IdUsuario);

    axios.get("http://localhost:3001/api/actividad").then((res) => {
      const todas = res.data;

      const actividadesFiltradas = todas.filter(
        (a) =>
          a.IdUsuario === decoded.IdUsuario &&
          (!a.TipoLudica || a.TipoLudica.trim() === "" || a.TipoLudica === null)
      );

      const ludicasFiltradas = todas.filter(
        (a) =>
          a.IdUsuario === decoded.IdUsuario &&
          a.TipoLudica &&
          a.TipoLudica.trim() !== "" &&
          a.TipoLudica !== null
      );

      setActividades(actividadesFiltradas);
      setLudicas(ludicasFiltradas);
    });
  }, []);

  const obtenerAsistencias = async (idActividad) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get(
        `http://localhost:3001/api/asistencia/actividad/${idActividad}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAsistencias((prev) => ({ ...prev, [idActividad]: res.data }));
    } catch (err) {
      console.error("❌ Error obteniendo asistencia:", err);
    }
  };

  return (
    <div className="mis-actividades-contenedor">
      <h2>📌 Mis Registros</h2>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={vista === "actividades" ? "active-tab" : ""}
          onClick={() => setVista("actividades")}
        >
          ✅ Actividades
        </button>
        <button
          className={vista === "ludicas" ? "active-tab" : ""}
          onClick={() => setVista("ludicas")}
        >
          🎯 Lúdicas
        </button>
      </div>

      {/* Vista Actividades */}
      {vista === "actividades" &&
        actividades.map((act) => (
          <div key={act.IdActividad} className="actividad-card">
            <h3>{act.NombreActi}</h3>
            <p>🗓️ {act.FechaInicio} | ⏰ {act.HoraInicio} - {act.HoraFin}</p>
            <p>📍 {act.Ubicacion}</p>
            <img src={`http://localhost:3001/uploads/${act.Imagen}`} alt="" width={200} />

            <div className="qr-contenedor">
              {act.CodigoQR && <img src={act.CodigoQR} alt="QR Entrada" />}
              {act.CodigoQRSalida && <img src={act.CodigoQRSalida} alt="QR Salida" />}
            </div>

            <button onClick={() => obtenerAsistencias(act.IdActividad)}>📥 Ver asistencia</button>

            {asistencias[act.IdActividad] && (
              <div className="tabla-asistencia">
                <table>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Ficha</th>
                      <th>Programa</th>
                      <th>Jornada</th>
                      <th>Entrada</th>
                      <th>Salida</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {asistencias[act.IdActividad].map((a, i) => (
                      <tr key={i}>
                        <td>{a.usuario?.Nombre} {a.usuario?.Apellido}</td>
                        <td>{a.usuario?.Correo}</td>
                        <td>{a.usuario?.aprendiz?.Ficha || "—"}</td>
                        <td>{a.usuario?.aprendiz?.ProgramaFormacion || "—"}</td>
                        <td>{a.usuario?.aprendiz?.Jornada || "—"}</td>
                        <td>{a.QREntrada ? new Date(a.QREntrada).toLocaleTimeString() : "—"}</td>
                        <td>{a.QRSalida ? new Date(a.QRSalida).toLocaleTimeString() : "—"}</td>
                        <td>
                          {a.QREntrada && a.QRSalida
                            ? "✅ Completa"
                            : a.QREntrada
                            ? "🕓 Solo entrada"
                            : "❌ Sin registro"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}

      {/* Vista Lúdicas */}
      {vista === "ludicas" &&
        ludicas.map((ludica) => (
          <div key={ludica.IdActividad} className="actividad-card ludica-card">
            <h3>{ludica.NombreActi}</h3>
            <p>📅 {ludica.FechaInicio} | 🕒 {ludica.HoraInicio} - {ludica.HoraFin}</p>
            <p>📍 {ludica.Ubicacion}</p>
            <img src={`http://localhost:3001/uploads/${ludica.Imagen}`} alt="" width={200} />

            <div className="qr-contenedor">
              <img src={ludica.CodigoQR} alt="QR Entrada" />
              <img src={ludica.CodigoQRSalida} alt="QR Salida" />
            </div>

            <button onClick={() => obtenerAsistencias(ludica.IdActividad)}>📥 Ver asistentes</button>

            {asistencias[ludica.IdActividad] && (
              <div className="tabla-asistencia">
                <table>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Ficha</th>
                      <th>Programa</th>
                      <th>Jornada</th>
                      <th>Entrada</th>
                      <th>Salida</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {asistencias[ludica.IdActividad].map((a, i) => (
                      <tr key={i}>
                        <td>{a.usuario?.Nombre} {a.usuario?.Apellido}</td>
                        <td>{a.usuario?.Correo}</td>
                        <td>{a.usuario?.aprendiz?.Ficha || "—"}</td>
                        <td>{a.usuario?.aprendiz?.ProgramaFormacion || "—"}</td>
                        <td>{a.usuario?.aprendiz?.Jornada || "—"}</td>
                        <td>{a.QREntrada ? new Date(a.QREntrada).toLocaleTimeString() : "—"}</td>
                        <td>{a.QRSalida ? new Date(a.QRSalida).toLocaleTimeString() : "—"}</td>
                        <td>
                          {a.QREntrada && a.QRSalida
                            ? "✅ Completa"
                            : a.QREntrada
                            ? "🕓 Solo entrada"
                            : "❌ Sin registro"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
