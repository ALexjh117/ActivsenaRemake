import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/styles.css";

function EventPlanner() {
  // Estados para la información del evento
  const [events, setEvents] = useState([]);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventResources, setEventResources] = useState("");

  // Estados para actividades
  const [availableActivities, setAvailableActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);

  // Estados para la imagen del evento
  const [eventImage, setEventImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch actividades disponibles al cargar el componente
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/actividad");
        console.log("🧪 Actividades desde backend:", res.data);
        setAvailableActivities(res.data);
      } catch (error) {
        console.error("❌ Error cargando actividades:", error);
      }
    };

    fetchActivities();
  }, []);

  // Función para manejar la selección/deselección de actividades
  const handleActivityToggle = (id) => {
    setSelectedActivities((prev) =>
      prev.includes(id)
        ? prev.filter((actId) => actId !== id)
        : [...prev, id]
    );
  };

  // Función para manejar el cambio de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Función para agregar el evento
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
          Authorization: `Bearer ${token}`,
        },
      });

      const IdPlanificarE = res.data.planificacion.IdPlanificarE;

      // 2. Asociar actividades
      await axios.post("http://localhost:3001/api/eventoactividad/asociar", {
        IdPlanificarE,
        actividades: selectedActivities,
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
    <div className="planificar-evento-container">
      <h1 className="planificar-evento-title">📅 Planificador de eventos</h1>
      <div className="planificar-evento-form">
        {/* Formulario del evento */}
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

        {/* Vista previa de imagen */}
        {imagePreview && (
          <img src={imagePreview} alt="imagen evento" className="planificar-imgs" />
        )}
        <input type="file" accept="image/*" onChange={handleImageChange} />

        {/* Actividades disponibles */}
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

        {/* Botón para agregar el evento */}
        <button className="planificar-evento-boton" onClick={addEvent}>
          ➕ Agregar Evento
        </button>
      </div>
    </div>
  );
}

export default EventPlanner;
