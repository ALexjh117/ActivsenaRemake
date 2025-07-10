import React, { useRef, useState, useEffect } from 'react'
import './Styles/StyleCarrusel.css'
import {data} from '../../pages/CarouselFeedback/js/data'


export default function CarruselFeedback() {
 const listRef = useRef();
 const [currentindex, setCurrentIndex] = useState(0);

useEffect(() => {
  const listNode = listRef.current;
  const imgNode = listNode.querySelectorAll("li > img")[currentindex];

  if(imgNode){
    imgNode.scrollIntoView({
        behavior:"smooth"
    });
  }
}, [currentindex])

const scrollToImage = (direction) => {
    if(direction === 'prev'){
     setCurrentIndex(curr =>{
        const PrimerImagen = currentindex === 0;
        return PrimerImagen ? 0: curr -1;
     })
    }else{
        const UltimaImagen = currentindex === data.length -1;
        if(!UltimaImagen){
            setCurrentIndex(curr => curr +1);
        }
    }
}

/*useEffect(() => {
    const interval = setInterval(() => {
        scrollToImage('next');
    }, 4000);

    return () => clearInterval(interval);
}, [currentindex]); PERIMITIR QUE EL CARRUSEL CAMBIE DE IMAGEN CADA 4 SEGUNDOS*/


const goToSlide = (sliderIndexx) =>{
    setCurrentIndex(sliderIndexx)
}

  return (
    <>
    <h1 className="texto-center-slider">Feedback De Eventos</h1>
    <div className='main-container-slider'>
        
      <div className='slider-container'>
        <div className='leftArrow' onClick={() => scrollToImage('prev')}>&#10092;</div> {/*USAR BOTONES AQUI */}
        <div className='rightArrow' onClick={() => scrollToImage('next')}>&#10093;</div>
        <div className='container-imagenes'>
            <ul ref={listRef} className='ul-slider'>
                {
                    data.map((item) =>{
                        return <li key={item.id} className='li-slider'>
                            <img src={item.imgUrl} width={500} height={300} className='imagen-slider' /> 

                        </li>
                    })
                }
            </ul>
        </div>
        <div className='dots-container'>
            {
                data.map((_, idx)=>(
                    
                    <div key={idx} className={`dot-container-item ${idx === currentindex ? "activeses" : ""}`} onClick={() => goToSlide(idx)}> 
                        &#9832;
                    </div>
                )
                    
                 )
            }
        </div>
      </div>
    </div>
</>
  )
}
