// src/pages/SubirAprendices.tsx
import React, { useState } from 'react';
import axios from 'axios';
import './styles/subirAprendices.css'; // Puedes personalizar el estilo

export default function SubirAprendices() {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState<'exito' | 'error' | ''>('');

  const handleArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setArchivo(e.target.files[0]);
    }
  };

  const subirArchivo = async () => {
    if (!archivo) {
      setTipoMensaje('error');
      setMensaje('❌ Debes seleccionar un archivo primero.');
      return;
    }

    const formData = new FormData();
    formData.append("archivo", archivo);

    try {
      const res =await axios.post('http://localhost:3001/api/aprendices/subir-excel', formData, {
  headers: { "Content-Type": "multipart/form-data" },
});



      setTipoMensaje('exito');
      setMensaje(res.data.mensaje || "✅ Archivo subido con éxito.");
    } catch (error) {
      console.error("Error al subir archivo:", error);
      setTipoMensaje('error');
      setMensaje("❌ Error al subir el archivo. Verifica que el formato sea correcto.");
    }
  };

  return (
    <div className="contenedor-subida">
      <h2>📤 Subir aprendices desde Excel</h2>

      <input type="file" accept=".xlsx,.xls,.csv" onChange={handleArchivo} />
      <button onClick={subirArchivo}>Subir archivo</button>

      {mensaje && (
        <p className={tipoMensaje === 'exito' ? 'mensaje-exito' : 'mensaje-error'}>
          {mensaje}
        </p>
      )}
    </div>
  );
}
