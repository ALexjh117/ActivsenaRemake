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
  const [eventResources, setEventResources] = useState("");

  const [availableActivities, setAvailableActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);

  const [eventImage, setEventImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/actividad");
        setAvailableActivities(res.data);
      } catch (error) {
        console.error("❌ Error cargando actividades:", error);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addEvent = async () => {
    if (
      !eventName.trim() ||
      !eventDate.trim() ||
      !eventType.trim() ||
      !eventDescription.trim() ||
      !eventLocation.trim() ||
      selectedActivities.length === 0
    ) {
      alert("⚠️ Completa todos los campos obligatorios.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("⚠️ Debes iniciar sesión.");
        return;
      }

      const formData = new FormData();
      formData.append("NombreEvento", eventName);
      formData.append("FechaEvento", eventDate);
      formData.append("TipoEvento", eventType);
      formData.append("LugarDeEvento", eventLocation);
      formData.append("Recursos", eventResources);
      if (eventImage) {
        formData.append("ImagenEvento", eventImage);
      }

      // 1. Crear planificación de evento
      const res = await axios.post("http://localhost:3001/api/planificacionevento", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });

      const IdPlanificarE = res.data.planificacion.IdPlanificarE;

      // 2. Asociar actividades
      await axios.post("http://localhost:3001/api/eventoactividad/asociar", {
        IdPlanificarE,
        actividades: selectedActivities
      });

      alert("✅ Evento planificado y actividades asociadas correctamente.");

      // Limpiar campos
      setEventName("");
      setEventDate("");
      setEventType("");
      setEventDescription("");
      setEventLocation("");
      setEventResources("");
      setSelectedActivities([]);
      setEventImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("❌ Error al crear evento:", error);
      alert("Ocurrió un error al crear el evento.");
    }
  };

  return (
    <div className="container">
      <h1 className="title">📅 Planificador de eventos</h1>
      <div className="form-container">

        {imagePreview && (
          <img src={imagePreview} alt="imagen eventos" className="planificar-imgs"/>
        )}

        <input type="file" accept="image/*" onChange={handleImageChange} />

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
        <textarea
          placeholder="Recursos necesarios para el evento"
          value={eventResources}
          onChange={(e) => setEventResources(e.target.value)}
        />

        <div className="activity-select">
          <h3>🎯 Selecciona actividades para este evento:</h3>
          {availableActivities.map((act) => (
            <label key={act.IdActividad} className="activity-checkbox">
              <input
                type="checkbox"
                checked={selectedActivities.includes(act.IdActividad)}
                onChange={() => handleActivityToggle(act.IdActividad)}
              />
              {act.NombreActi}
            </label>
          ))}
        </div>

        <button className="add-button" onClick={addEvent}>
          ➕ Agregar Evento
        </button>
      </div>
    </div>
  );
}

export default EventPlanner;
