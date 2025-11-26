import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../Contextos/AuthContext'; 
import './Ingreso.css';

const MaestroIngreso = () => {
    const navigate = useNavigate();
    const { ingresarMaestro, maestroActual } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    useEffect(() => {
      if (maestroActual) navigate('/escritorio');
    }, [maestroActual, navigate]);
    
    const handleSubmit = (e) => {
      e.preventDefault();
      setError('');
      if (!email || !password) { 
        setError('Por favor, ingresa tu correo y contraseña.'); 
        return; 
      }
      
      const resultado = ingresarMaestro(email, password);
      
      if (!resultado.success) {
        setError(resultado.message);
      }
    };
    
    return (
    
      <div className="pagina-ingreso-wrapper">
          
          
          <img src="./imagenmascota/saltamonteprofesor.png" alt="" className="decoracion-alumno-esquina" />

          
          <div className="contenido-ingreso-flex">
              
            
              <div className="personaje-container">
                  
                  <img 
                      src="./imagenmascota/bienvenidaM.png" 
                      alt="Profesor Saltamontes dándote la bienvenida" 
                      className="personaje-imagen"
                  />
              </div>

            
              <div className="contenedor-ingreso">
                <h2 className="titulo-ingreso">Inicio de Sesión</h2>
                
                {error && <div className="mensaje-error clase-mb-4">{error}</div>}
                
                <form onSubmit={handleSubmit} className="formulario-ingreso">
                  <div>
                    <label className="etiqueta-input-bold">Correo Electrónico</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-text-ingreso"
                      placeholder="ejemplo@gmail.com"
                    />
                  </div>
                  <div>
                    <label className="etiqueta-input-bold">Contraseña</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-text-ingreso"
                      placeholder="Tu contraseña"
                    />
                  </div>
                  <button type="submit" className="boton-ingresar-maestro">
                    Entrar a mi Cuenta
                  </button>
                </form>

                <p className="enlace-a-registro">
                  ¿Aún no tienes cuenta? <Link to="/registro" className="enlace-registro-texto">Regístrate</Link>
                </p>
              </div>

          </div>
      </div>
    );
};

export default MaestroIngreso;