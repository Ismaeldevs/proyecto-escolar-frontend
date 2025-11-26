// src/Paginas/Inicio.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../componentes/Header';
import Footer from '../componentes/Footer';
import './Inicio.css'; 

const Inicio = () => (
    
    <div className="inicio-layout-wrapper">
        
        <Header />

        <div className="pagina-inicio">
            <div className="contenedor-inicio">
                
                <h1 className="titulo-principal">
                    ¡Bienvenidos <span className="texto-degradado">Maestros y Estudiantes!</span> 👋
                </h1>
                
                <p className="subtitulo">
                    Esta es tu plataforma para crear tareas interactivas de forma divertida.
                </p>
                
                <div className="acciones-inicio">
                    <Link to="/ingreso" className="boton boton-maestro">
                        Ingresar Maestro
                    </Link>
                    <Link to="/estudiante/sala" className="boton boton-alumno">
                        Ingresar Alumno
                    </Link>

                    <div className="contenedor-mascota">
                        <img src="/imagenmascota/saludando.png" alt="Mascota saludando" className="mascota-img" />
                    </div>
                </div>

            </div>
        </div>

        <Footer />
    </div>
);

export default Inicio;