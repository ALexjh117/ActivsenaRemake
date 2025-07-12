import React from 'react'
import CarruselFeedback from '../CarouselFeedback/CarruselFeedback'
import ComentariosFeedback from '../Comentariosss/ComentariosFeedback'
import './styles/combinarStyles.css'

export default function Combinar() {
  return (
    <>
    <div><h1>FEEDBACKS OF EVENTS</h1></div>
    <div className='combinar-container'>
      <CarruselFeedback />
      <ComentariosFeedback />
    </div>
    </>
  )
}
