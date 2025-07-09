import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style/HorasLudicas.css";

const objetivo = 80;

const HorasLudicas = () => {
  const [totalHoras, setTotalHoras] = useState(0);
  const [usuarioId, setUsuarioId] = useState(null);
  const [actividades, setActividades] = useState([]);

  const progreso = Math.min((totalHoras / objetivo) * 100, 100);
  const objetivoAlcanzado = totalHoras >= objetivo;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = JSON.parse(atob(token.split(".")[1]));
    const id = decoded.IdUsuario;
    setUsuarioId(id);

    const cargarDatos = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/api/asistencia/usuario/${id}`
        );

        const asistenciasValidas = data.filter(
          (a) => a.AsiEstado === "Completa" && a.QREntrada && a.QRSalida
        );

        const actividadesFormateadas = asistenciasValidas.map((a) => ({
          horas: a.AsiHorasAsistidas || 1,
          fecha: a.AsiFecha?.split("T")[0],
          actividad: a.actividad?.NombreActi || "Lúdica",
        }));

        const total = asistenciasValidas.reduce(
          (sum, a) => sum + (a.AsiHorasAsistidas || 0),
          0
        );

        setActividades(actividadesFormateadas);
        setTotalHoras(total);

        if (localStorage.getItem("refrescarHorasLudicas")) {
          localStorage.removeItem("refrescarHorasLudicas");
        }

      } catch (err) {
        console.error("Error cargando datos lúdicos", err);
      }
    };

    cargarDatos();
  }, []);

  return (
    <section className="horas-ludicas-container">
      <header className="horas-ludicas-header">
        <h2>Horas Lúdicas Realizadas</h2>
      </header>

      <div className="horas-ludicas-content">
        <article className="horas-ludicas-activities">
          <h3>Actividades realizadas</h3>
          <ul>
            {actividades.map(({ actividad, horas, fecha }, idx) => (
              <li key={idx} className="actividad-item">
                <span className="actividad-nombre">{actividad}</span>
                <span className="actividad-horas">{horas} hora(s)</span>
                <span className="actividad-fecha">{fecha}</span>
              </li>
            ))}
          </ul>
        </article>

        <aside className="horas-ludicas-summary">
          <h3>Resumen</h3>
          <p><strong>{totalHoras}</strong> hora(s) acumuladas</p>

          {objetivoAlcanzado ? (
            <p className="mensaje-exito">
              ¡Felicidades! Has alcanzado el objetivo de <strong>{objetivo}</strong> horas.
            </p>
          ) : (
            <p>
              Te faltan <strong>{objetivo - totalHoras}</strong> horas para llegar a <strong>{objetivo}</strong>
            </p>
          )}

          <button
            className={`btn-certificado ${objetivoAlcanzado ? "" : "btn-disabled"}`}
            disabled={!objetivoAlcanzado}
          >
            {objetivoAlcanzado
              ? "Descargar Certificado"
              : "Descarga disponible al alcanzar el objetivo"}
          </button>

          <div
            className="progress-bar"
            role="progressbar"
            aria-valuenow={totalHoras}
            aria-valuemin="0"
            aria-valuemax={objetivo}
            aria-label="Barra de progreso de horas lúdicas"
          >
            <div className="progress-fill" style={{ width: `${progreso}%` }}>
              {Math.round(progreso)}%
            </div>
          </div>
        </aside>
      </div>

      <section className="horas-ludicas-info">
        <h3>¿Qué son las horas lúdicas?</h3>
        <p>Son actividades recreativas y educativas que ayudan a tu desarrollo personal y social.</p>
        <p>Participar en talleres, clases y eventos organizados cuenta como horas lúdicas.</p>
      </section>
    </section>
  );
};

export default HorasLudicas;
