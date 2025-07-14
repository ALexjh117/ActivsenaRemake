import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faPinterest, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons'

import "./styles/FooterHome.css"

export default function FooterHome() {
  return (
    <footer className="site-footer-home " >
      <div className="container-home">
        <div className="footer-content-home">
          <div className="footer-about-home">
            <div className="footer-logo-home">
              <span className="footer-logo-waso-home">Activ</span>
              <span className="footer-logo-strategy-home">Sena</span>
            </div>
            <p>Somos una firma de consultoría de negocios profesional dedicada a ayudar a las empresas a crecer y tener éxito en el mercado competitivo actual.</p>
            <div className="footer-social-home">
          <a href="https://www.facebook.com" className="footer-social-icon-home">
           <FontAwesomeIcon icon={faFacebook} />
        </a>
         <a href="https://www.pinterest.com" className="footer-social-icon-home">
        <FontAwesomeIcon icon={faPinterest} />
        </a>
        <a href="https://www.x.com" className="footer-social-icon-home">
       <FontAwesomeIcon icon={faTwitter} />
      </a>
      <a href="https://www.youtube.com" className="footer-social-icon-home">
      <FontAwesomeIcon icon={faYoutube} />
   </a>
      </div>

          </div>
          <div className="footer-links-home">
            <h3 className="footer-title-home h3-home">Enlaces Rápidos</h3>
            <ul className='ul-home'>
              <li className='li-home'><a href="/" className='a-home'>Inicio</a></li>
              <li className='li-home'><a href="/#about" className='a-home'>Nosotros</a></li>
              <li className='li-home'><a href="/#anuncios" className='a-home'>Anuncios</a></li>
              <li className='li-home'><a href="/#projects" className='a-home'>Proyectos</a></li>
              <li className='li-home'><a href="/apoyo-sostenimiento" className='a-home'>Apoyos de Sostenimiento</a></li>
              <li className='li-home'><a href="/#contact" className='a-home'>Contacto</a></li>
            </ul>
          </div>
          <div className="footer-contact-home">
            <h3 className="footer-title-home h3-home">Información de Contacto</h3>
            <div className="footer-contact-item-home">
              <div className="footer-contact-icon-home">
                <i className="icon-location-home i-home"></i>
              </div>
              <div className="footer-contact-text-home">
                Popayan, Cauca, Colombia 
              </div>
            </div>
            <div className="footer-contact-item-home">
              <div className="footer-contact-icon-home">
                <i className="icon-phone-home i-home" ></i>
              </div>
              <div className="footer-contact-text-home" href="tel:+573226637578">
                +57 3226637578
              </div>
            </div>
            <div className="footer-contact-item-home">
              <div className="footer-contact-icon-home">
                <i className="icon-email-home i-home"></i>
              </div>
              <div className="footer-contact-text-home" href="mailto:activsena.gmail.com">
                activsena@gmail.com
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom-home">
          <p className='p-home'>&copy; 2023 ActivSena. Todos los Derechos Reservados.</p>
        </div>
      </div>
    </footer>
  )
}