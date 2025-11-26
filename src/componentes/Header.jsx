import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Style/Header.css";

export default function Header() {
  const navegar = useNavigate();

  return (
    <header className="header-container">
      

<div className="header-top">
          <div className="logo">
            <Link to="/" className="logo-link">
              <img 
                src="/LogoSaltamontes.png" 
                alt="Logo Saltamontes" 
                className="logo-img" 
              />
              
              <span className="logo-prin">SALTAMONTES</span>.com
            </Link>
          </div>


        <div className="header-acciones">
       
          <button
            className="btn btn-login"
            onClick={() => navegar("/inicio")}
          >
            SALA DE MAESTROS / ALUMNOS
          </button>
        </div>
      </div>

      <nav className="navegacion">
        <ul className="lista-nav">
          <li><Link to="/canciones">Canciones</Link></li>

          <li><Link to="/adivinanzas">Adivinanzas</Link></li>
          <li><Link to="/dibujos">Dibujos</Link></li>
          <li><Link to="/colorear">Colorear</Link></li>
          <li><Link to="/recursos">Recursos</Link></li>
          <li><Link to="/juegos">Juegos</Link></li>
        </ul>
      </nav>

    </header>
  );
}
