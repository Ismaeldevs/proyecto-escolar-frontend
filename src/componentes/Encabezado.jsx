// src/componentes/Encabezado.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Contextos/AuthContext';
import '../Style/Encabezado.css';

const Encabezado = () => {
    // Si no usas maestroActual aquí, puedes borrar esta línea o dejarla si planeas usarla luego
    const { maestroActual } = useAuth(); 

    return (
        <header className="encabezado-principal">
            <div className="encabezado-contenedor">
                
                {/* Enlace del Título Central */}
                <Link to="/inicio" className="encabezado-titulo">
                    {/* Emoji Izquierdo (Sin efecto, mantiene color original) */}
                    <span role="img" aria-label="lápiz">✏️</span>
                    
                    {/* Texto Central (Con efecto degradado) */}
                    <span className="texto-gradiente">
                        Plataforma de Maestros y Alumnos
                    </span>

                    {/* Emoji Derecho */}
                    <span role="img" aria-label="lápiz">✏️</span>
                </Link>

                {/* Navegación Derecha */}
                <nav className="encabezado-nav">
                    <Link to="/inicio" className="encabezado-btn-inicio">
                        Inicio
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Encabezado;