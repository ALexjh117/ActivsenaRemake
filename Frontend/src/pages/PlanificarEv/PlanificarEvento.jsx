import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/styles.css";

function EventPlanner() {
  const [events, setEvents] = useState([]);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [availableActivities, setAvailableActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [eventResources, setEventResources] = useState("");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/actividad");
        console.log("🧪 Actividades desde backend:", res.data);
        setAvailableActivities(res.data);
      } catch (error) {
        console.error("Error cargando actividades:", error);
      }
    };

    fetchActivities();
  }, []);

  const handleActivityToggle = (id) => {
    setSelectedActivities((prev) =>
      prev.includes(id)
        ? prev.filter((actId) => actId !== id)
        : [...prev, id]
    );
  };

  const addEvent = async () => {
    if (
      !eventName.trim() ||
      !eventDate.trim() ||
      !eventType.trim() ||
      !eventDescription.trim() ||
      !eventLocation.trim() ||
      selectedActivities.length === 0
    )
      return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:3001/api/planificacionevento",
        {
          NombreEvento: eventName,
          FechaEvento: eventDate,
          TipoEvento: eventType,
          LugarDeEvento: eventLocation,
          Recursos: eventResources,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const IdPlanificarE = res.data.planificacion.IdPlanificarE;

      await axios.post("http://localhost:3001/api/eventoactividad/asociar", {
        IdPlanificarE,
        actividades: selectedActivities,
      });

      alert("✅ Evento creado y actividades asociadas con éxito");

      setEventName("");
      setEventDate("");
      setEventType("");
      setEventDescription("");
      setEventLocation("");
      setSelectedActivities([]);
      setEventResources("");
    } catch (error) {
      console.error("❌ Error al crear evento:", error);
    }
  };

  return (
    <div className="planificar-evento-container">
      <h1 className="planificar-evento-title">📅 Planificador de eventos</h1>
      <div className="planificar-evento-form">
        <input
          type="text"
          placeholder="Nombre del evento"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tipo de evento"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
        />
        <textarea
          placeholder="Recursos necesarios"
          value={eventResources}
          onChange={(e) => setEventResources(e.target.value)}
        />
        <textarea
          placeholder="Descripción"
          value={eventDescription}
          onChange={(e) => setEventDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Ubicación"
          value={eventLocation}
          onChange={(e) => setEventLocation(e.target.value)}
        />

      <div className="planificar-evento-actividades">
  <h3>🎯 Actividades disponibles:</h3>
  <div className="planificar-evento-grid">
    {availableActivities.map((act) => (
      <label key={act.IdActividad} className="planificar-evento-card">
        <input
          type="checkbox"
          checked={selectedActivities.includes(act.IdActividad)}
          onChange={() => handleActivityToggle(act.IdActividad)}
        />
        <span>{act.NombreActi}</span>
      </label>
    ))}
  </div>
</div>


        <button className="planificar-evento-boton" onClick={addEvent}>
          ➕ Agregar Evento
        </button>
      </div>
    </div>
  );
}

export default EventPlanner;
