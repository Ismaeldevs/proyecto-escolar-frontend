import React from 'react';

const Footer = () => (
  <footer className="main-footer">
    <style>{`
      .main-footer {
        background: #2d3436;
        color: white;
        padding: 50px 20px 20px;
        margin-top: auto;
        font-family: 'Quicksand', 'Varela Round', sans-serif;
      }
      .footer-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 30px;
        margin-bottom: 30px;
      }
      .footer-col {
        flex: 1;
        min-width: 200px;
      }
      .footer-col h4 {
        margin-bottom: 15px;
        color: #FFD93D; /* Amarillo Saltamontes */
        font-size: 1.2rem;
        font-weight: 700;
      }
      .footer-col p {
        font-size: 0.95rem;
        line-height: 1.5;
        color: #b2bec3;
      }
      .footer-col ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .footer-col li {
        margin-bottom: 8px;
        cursor: pointer;
        opacity: 0.8;
        transition: all 0.3s ease;
      }
      .footer-col li:hover {
        opacity: 1;
        color: #6BCB77; /* Verde Saltamontes */
        transform: translateX(5px);
      }
      .footer-bottom {
        text-align: center;
        padding-top: 20px;
        border-top: 1px solid rgba(255,255,255,0.1);
        font-size: 0.9rem;
        opacity: 0.6;
      }
      /* Responsive para móviles */
      @media (max-width: 768px) {
        .footer-content {
          flex-direction: column;
          text-align: center;
        }
      }
    `}</style>

    <div className="footer-content">
      <div className="footer-col">
        <h4>Saltamontes 🦗</h4>
        <p>Aprendizaje divertido para mentes curiosas.</p>
      </div>
      <div className="footer-col">
        <h4>Contacto</h4>
        <p>hola@saltamontes.com</p>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© 2025 Saltamontes Educativo. Todos los derechos reservados.</p>
    </div>
  </footer>
);

export default Footer;