import React, { useEffect, useState } from 'react';
import './styles/comentarisFeedback.css';
import axios from 'axios';
import imagen1 from './images/imagen1.jpg'


export default function ComentariosFeedback() {

  const [comentarios, setComentarios] = useState([])
  const [newComent, setNewComment] = useState('');

  useEffect(() =>{
    const TraerComentariosFeedback = async() =>{
        try{
            const respuesta = await axios.get(`http://localhost:3001/api/feedback/evento/${IdEvento}`)
            console.log("Datos recibidos:", respuesta.data)
            setComentarios(respuesta.data)
        }catch(error){
            console.error("Error al obtner los comentarios del evento:", error)
        }
    };
    TraerComentariosFeedback()
  }, [])

  const subirComentario = async () =>{
    if(!newComent.trim()){
        alert('El campo no puede estar vacio');
        return;
    }

    try{
        const response = await axios.post(`http://localhost:3001/api/feedback/evento/5`,{
        ComentarioFeedback: newComent,
        FechaEnvio: new Date().toISOString().split('T')[0],
        IdEvento,
        IdUsuario
    })

    if(response.data && response.data.IdFeedback){
        setComentarios([...comentarios, response.data]);
        alert('Se subio el comentario correctamente')
        setNewComment('');
    }

    }catch(error){
        alert('Error al enviar el comentario');
        console.error("Error al subir comentario", error);
    }
  }
  

  return (
    <div className="coments-container">
      <div className="title-coments">COMENTARIOS</div>

      <div className="area-coments">
        {comentarios.map((item, index) => (
          <div key={item.IdFeedback || index} className="comentario-card">
            <img src={imagen1} alt="perfil" className="imagen-perfil" />
            <div>
              <p >{item.usuario ? `${item.usuario.Nombre} ${item.usuario.Apellido}` : "Usuario Desconocido"}</p>
              <p >{item.ComentarioFeedback}</p>
              <div>
                <p>★★★★★</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="input-coments">
        <input
          type="text"
          placeholder="Escriba su Comentario"
          className="input-text-coments"
          value={newComent}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button className="btn-enviar-comment" onClick={subirComentario}>
          ➤
        </button>
      </div>
    </div>
  );
}
