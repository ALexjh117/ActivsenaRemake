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

<<<<<<< HEAD
  const [availableActivities, setAvailableActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);

  const [eventImage, setEventImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

=======
>>>>>>> a3fc5abcbd99b9565e9f3eb3fd5d3250924ebd63
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/actividad");
<<<<<<< HEAD
=======
        console.log("🧪 Actividades desde backend:", res.data);
>>>>>>> a3fc5abcbd99b9565e9f3eb3fd5d3250924ebd63
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
<<<<<<< HEAD
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
=======
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
>>>>>>> a3fc5abcbd99b9565e9f3eb3fd5d3250924ebd63

      // 2. Asociar actividades
      await axios.post("http://localhost:3001/api/eventoactividad/asociar", {
        IdPlanificarE,
        actividades: selectedActivities
      });

<<<<<<< HEAD
      alert("✅ Evento planificado y actividades asociadas correctamente.");

      // Limpiar campos
=======
>>>>>>> a3fc5abcbd99b9565e9f3eb3fd5d3250924ebd63
      setEventName("");
      setEventDate("");
      setEventType("");
      setEventDescription("");
      setEventLocation("");
      setEventResources("");
      setSelectedActivities([]);
<<<<<<< HEAD
      setEventImage(null);
      setImagePreview(null);
=======
      setEventResources("");
>>>>>>> a3fc5abcbd99b9565e9f3eb3fd5d3250924ebd63
    } catch (error) {
      console.error("❌ Error al crear evento:", error);
      alert("Ocurrió un error al crear el evento.");
    }
  };

  return (
<<<<<<< HEAD
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
=======
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
>>>>>>> a3fc5abcbd99b9565e9f3eb3fd5d3250924ebd63


<<<<<<< HEAD
        <button className="add-button" onClick={addEvent}>
=======
        <button className="planificar-evento-boton" onClick={addEvent}>
>>>>>>> a3fc5abcbd99b9565e9f3eb3fd5d3250924ebd63
          ➕ Agregar Evento
        </button>
      </div>
    </div>
  );
}

export default EventPlanner;
