import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/styles.css";

// Tipos de datos
interface Actividad {
  IdActividad: number;
  NombreActi: string;
}

const EventPlanner: React.FC = () => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventResources, setEventResources] = useState("");
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [availableActivities, setAvailableActivities] = useState<Actividad[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<number[]>([]);

  // Obtener actividades
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/actividad");
        console.log("🎯 Actividades cargadas:", res.data);
        setAvailableActivities(res.data);
      } catch (error) {
        console.error("❌ Error cargando actividades:", error);
      }
    };

    fetchActivities();
  }, []);

  const handleActivityToggle = (id: number) => {
    setSelectedActivities((prev) =>
      prev.includes(id)
        ? prev.filter((actId) => actId !== id)
        : [...prev, id]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file && !file.type.startsWith("image/")) {
      alert("⚠️ Solo se permiten archivos de imagen.");
      return;
    }

    setEventImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
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
      alert("⚠️ Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("❌ No se encontró token. Inicia sesión.");
        return;
      }

      const formData = new FormData();
      formData.append("NombreEvento", eventName);
      formData.append("FechaEvento", eventDate);
      formData.append("TipoEvento", eventType);
      formData.append("LugarDeEvento", eventLocation);
      formData.append("Recursos", eventResources);
      formData.append("DescripcionEvento", eventDescription);
      if (eventImage) formData.append("ImagenEvento", eventImage);

      // Crear planificación de evento
      const res = await axios.post(
        "http://localhost:3001/api/planificacionevento",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const IdPlanificarE = res.data.planificacion.IdPlanificarE;

      // Asociar actividades
      await axios.post(
        "http://localhost:3001/api/eventoactividad/asociar",
        {
          IdPlanificarE,
          actividades: selectedActivities,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✅ Evento creado y actividades asociadas con éxito.");

      // Limpiar formulario
      setEventName("");
      setEventDate("");
      setEventType("");
      setEventDescription("");
      setEventLocation("");
      setEventResources("");
      setEventImage(null);
      setPreviewImage(null);
      setSelectedActivities([]);
    } catch (error: any) {
      console.error("❌ Error al crear evento:", error);
      alert("❌ Error al crear evento. Revisa la consola.");
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
          placeholder="Descripción del evento"
          value={eventDescription}
          onChange={(e) => setEventDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Ubicación"
          value={eventLocation}
          onChange={(e) => setEventLocation(e.target.value)}
        />

        {/* Imagen */}
        <div className="planificar-evento-imagen">
          <label>📷 Imagen del evento:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {previewImage && (
            <>
              <img
                src={previewImage}
                alt="Vista previa"
                style={{
                  width: "100%",
                  maxWidth: "300px",
                  marginTop: "10px",
                  borderRadius: "10px",
                }}
              />
              <button
                type="button"
                style={{ marginTop: "8px" }}
                onClick={() => {
                  setEventImage(null);
                  setPreviewImage(null);
                }}
              >
                ❌ Quitar imagen
              </button>
            </>
          )}
        </div>

        {/* Actividades */}
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
};

export default EventPlanner;
