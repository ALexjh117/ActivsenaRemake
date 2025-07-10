import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/aprendicesCargados.css";

export default function AprendicesCargados() {
    type AprendizConUsuario = {
  usuario: {
    Nombre: string;
    Apellido: string;
    Correo: string;
    Telefono: string;
  };
  Ficha: string;
  ProgramaFormacion: string;
  Jornada: string;
};

const [aprendices, setAprendices] = useState<AprendizConUsuario[]>([]);

useEffect(() => {
  const fetchAprendices = async () => {
    const res = await // Esto es correcto SI tienes el backend en otro puerto (ej. 3001)
axios.get("http://localhost:3001/api/aprendices/listar")

    console.log(res.data); 
   setAprendices(res.data); // ✅ Ya que el backend responde con un array directamente

  };
  fetchAprendices();
}, []);

  return (
    <div className="contenedor-aprendices">
      <h2>📋 Aprendices Registrados</h2>
      <table className="tabla-aprendices">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Ficha</th>
            <th>Programa</th>
            <th>Jornada</th>
          </tr>
        </thead>
        <tbody>
          {aprendices.map((a, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{a.usuario.Nombre} {a.usuario.Apellido}</td>
              <td>{a.usuario.Correo}</td>
              <td>{a.usuario.Telefono}</td>
              <td>{a.Ficha}</td>
              <td>{a.ProgramaFormacion}</td>
              <td>{a.Jornada}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
