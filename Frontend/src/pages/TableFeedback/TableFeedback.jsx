import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './styles/TableStyle.css';
import imagen10 from './images/imagen1.jpg';

export default function TableFeedback() {

 const { IdEvento, IdUsuario } = useParams(); //TENER EN CUENTA QUE USE PARAMS SE ETSA USANDO PRA PRUEBAS NADA MAS

  const [feedbacks, setFeedbacks] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    

    const TraerFeedback = async () => {
    try {
    
     //const res = await axios.get(`http://localhost:3001/api/feedback`, {params:{IdEvento}});//ESTA LINEA DE CODIGO ME TRAE TODOS LOS DATOS DE UN EVENTO
     //const res = await axios.get('http://localhost:3001/api/feedback/evento/1'); //Con esta se busca un evento Manualmente
     const res = await axios.get('http://localhost:3001/api/feedback/evento/5')
     //const rest = await axios.get(`http://localhost:3001/api/feedback/evento/${IdEvento}`); //Con esta se busca un evento o se trae uno especifico
      console.log("Datos recibidos:", res.data);
      setFeedbacks(res.data);

    } catch (error) {
      console.error("Error al obtener comentarios del evento:", error);
    }
  };

    TraerFeedback();
  }, []);




  const subirComentario = async () => {
    if (!newComment.trim()) {
      alert('Escribe un comentario antes de enviar.');
      return;
    }

    try {
      const respuesta = await axios.post('http://localhost:3001/api/feedback/evento/5', {
        ComentarioFeedback: newComment,
        FechaEnvio: new Date().toISOString().split('T')[0],
        IdEvento,
        IdUsuario
      });

      if (respuesta.data && respuesta.data.IdFeedback) {
        setFeedbacks([...feedbacks, respuesta.data]);
        alert("Comentario enviado correctamente");
        setNewComment('');
      }
    } catch (error) {
      alert("Error al enviar el comentario. Por favor, inténtalo de nuevo más tarde.");
      console.error("Error al subir comentario:", error);
    }
  };

 

  return (
    <>
      <h1 className="tabla-title">Comentarios</h1>

      <div className='scroll-table'>
        <table className="contenedor-tabla">
          <thead className='thead'>
            <tr className='tr'>
              <th className='th'>Usuarios</th>
              <th className='th'>Comentarios</th>
              <th className='th'>Reseñas</th>
            </tr>
          </thead>
          <tbody className='tbody'>
            {feedbacks.map((item, index) => (
              <tr key={item.IdFeedback || index} className='tr'>
                <td className='user-cell td'>
                  <img src={imagen10} alt="perfil" className='perfil-img' />
                <span>{item.usuario ? `${item.usuario.Nombre}${item.usuario.Apellido}` : "Usuario Desconocido"}</span>

                </td>
                <td className='td texto-comentario'>{item.ComentarioFeedback}</td>
                <td className='td'>★★★★★</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
        <div className='center-input'>
          <input
            type="text"
            placeholder='Escriba un Comentario de la Actividad'
            className='input-texto'
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button className='button-submit' onClick={subirComentario}>
            Subir Comentario
          </button>
        </div>
    </>
  );
}
