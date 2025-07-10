import React, { useEffect, useState } from "react";
import axios from "axios";

interface EventoConDatos {
  IdEvento: number;
  NombreEvento: string;
  FechaInicio: string;
  FechaFin: string;
  HoraInicio: string;
  HoraFin: string;
  UbicacionEvento: string;
  DescripcionEvento: string;
  QREntrada?: string;
  QRSalida?: string;
}

interface AsistenciaItem {
  QREntrada?: string;
  QRSalida?: string;
  usuario?: {
    Nombre?: string;
    Apellido?: string;
    Correo?: string;
    aprendiz?: {
      Ficha?: string;
      ProgramaFormacion?: string;
      Jornada?: string;
    };
  };
}

export default function MisEventos() {
  const [asistencias, setAsistencias] = useState<Record<number, AsistenciaItem[]>>({});
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const [eventos, setEventos] = useState<EventoConDatos[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUsuarioId(decoded.IdUsuario);

      axios
        .get("http://localhost:3001/api/evento/evento/mis-eventos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setEventos(res.data);
        })
        .catch((err) => console.error("❌ Error cargando eventos:", err));
    }
  }, []);

  const obtenerAsistencias = async (IdEvento: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:3001/api/asistencia/evento/${IdEvento}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAsistencias((prev) => ({ ...prev, [IdEvento]: res.data }));
    } catch (err) {
      console.error("❌ Error obteniendo asistencia:", err);
    }
  };

  return (
    <div className="mis-actividades-contenedor">
      <h2>📅 Mis Eventos Creados</h2>

      {eventos.length === 0 && <p>No has creado eventos aún.</p>}

      {eventos.map((evento) => (
        <div key={evento.IdEvento} className="actividad-card">
          <h3>{evento.NombreEvento}</h3>
          <p>
            🗓️ {evento.FechaInicio} | ⏰ {evento.HoraInicio} - {evento.HoraFin}
          </p>
          <p>📍 {evento.UbicacionEvento}</p>
          <p>📝 {evento.DescripcionEvento}</p>

          {evento.QREntrada && (
            <div className="qr-contenedor">
              <h4>📥 QR Entrada</h4>
              <img src={evento.QREntrada} alt="QR Entrada" className="qr-imagen" />
            </div>
          )}

          {evento.QRSalida && (
            <div className="qr-contenedor">
              <h4>📤 QR Salida</h4>
              <img src={evento.QRSalida} alt="QR Salida" className="qr-imagen" />
            </div>
          )}

          <button
            className="btn-ver-asistencia"
            onClick={() => obtenerAsistencias(evento.IdEvento)}
          >
            📥 Ver asistencia
          </button>

          {asistencias[evento.IdEvento] && (
            <div className="tabla-asistencia">
              <h4>📊 Asistencia registrada</h4>
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Ficha</th>
                    <th>Programa</th>
                    <th>Jornada</th>
                    <th>Hora Entrada</th>
                    <th>Hora Salida</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {asistencias[evento.IdEvento].map((asistente, index) => (
                    <tr key={index}>
                      <td>
                        {asistente.usuario?.Nombre} {asistente.usuario?.Apellido}
                      </td>
                      <td>{asistente.usuario?.Correo}</td>
                      <td>{asistente.usuario?.aprendiz?.Ficha || "—"}</td>
                      <td>{asistente.usuario?.aprendiz?.ProgramaFormacion || "—"}</td>
                      <td>{asistente.usuario?.aprendiz?.Jornada || "—"}</td>
                      <td>
                        {asistente.QREntrada
                          ? new Date(asistente.QREntrada).toLocaleTimeString("es-CO")
                          : "—"}
                      </td>
                      <td>
                        {asistente.QRSalida
                          ? new Date(asistente.QRSalida).toLocaleTimeString("es-CO")
                          : "—"}
                      </td>
                      <td>
                        {asistente.QREntrada && asistente.QRSalida
                          ? "✅ Completa"
                          : asistente.QREntrada
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
