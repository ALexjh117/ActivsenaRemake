
import React from 'react';

import './styles/RectificarStyle.css';

import futbol from './img/futbol.jpg';
import basket from './img/basket.jpeg';
import tenis from './img/tenis.jpg';
import cuentas from './img/cuentas.jpg';
import cacao from './img/cacao.jpg';
import academia from './img/academia.jpg';
import gym from './img/gym.jpg';

const eventos = [
  { titulo: 'Fútbol', imagen: futbol, estado: 'El evento se aprobó correctamente. Fue un éxito.' },
  { titulo: 'Baloncesto', imagen: basket, estado: 'El evento se aprobó correctamente. Fue un éxito.' },
  { titulo: 'Tenis', imagen: tenis, estado: 'El evento se aprobó correctamente. Fue un éxito.' },
  { titulo: 'Diálogos', imagen: cuentas, estado: 'Evento aplazado, día y fecha por confirmar.' },
  { titulo: 'Cacao Fest', imagen: cacao, estado: 'El evento se aplazó, no se inscribieron suficientes aprendices.' },
  { titulo: 'Indo Academia', imagen: academia, estado: 'Se encuentra pendiente, a la espera de confirmar.' },
  { titulo: 'Actividad Física', imagen: gym, estado: 'No hay instructores a cargo de este evento.' },
];

export default function RevisionEventos() {
  return (
    <>
     <header className='center-textos'>
        <h1>Revisar Eventos</h1>
      </header>

      {eventos.map((evento, i) => (
        <article key={i} className="card-dark-Event card-Events text">
          <header>
            <h3 className="h3">{evento.titulo}</h3>
          </header>
          <figure>
            <img className="card-image-Event" src={evento.imagen} alt={evento.titulo} />
          </figure>
          <div className="p2 bordado">
            <p>{evento.estado}</p>
          </div>
          <div className="acciones-botones">
            <button className="botonar-Aprobados">APROBAR</button>
            <button className="btn-rechazarE">RECHAZAR</button>
          </div>
        </article>
      ))}

  </>
  );
}
