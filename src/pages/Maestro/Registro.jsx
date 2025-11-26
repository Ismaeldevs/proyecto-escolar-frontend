import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../Contextos/AuthContext'; 
import './Registro.css';

const MaestroRegistro = () => {
    const navigate = useNavigate();
    const { registrarMaestro, maestroActual } = useAuth();
    
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');
    
    useEffect(() => {
        if (maestroActual) navigate('/escritorio');
    }, [maestroActual, navigate]);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); setExito('');
        
        if (!nombre || !email || !password) { 
            setError('Por favor, completa todos los campos.'); 
            return; 
        }
        
        const resultado = registrarMaestro(nombre, email, password);
        
        if (resultado.success) {
            setExito(resultado.message);
            setTimeout(() => navigate('/escritorio'), 1500);
        } else {
            setError(resultado.message);
        }
    };
    
    return (
        <div className="pagina-registro-wrapper">
            
           

            <div className="contenido-registro-flex">
                
                
                <div className="registro-visual-container">
                    <img 
                        src="./imagenmascota/unete.png" 
                        alt="Únete a nuestra plataforma" 
                        className="registro-imagen-principal"
                    />
                </div>

               
                <div className="contenedor-form-registro">
                    <h2 className="titulo-registro">Crear Cuenta Docente</h2>
                    
                  
                    <div className="beneficios-registro">
                        <div className="item-beneficio">
                            <span className="icono-beneficio">🚀</span>
                            <span>Crea salas virtuales</span>
                        </div>
                        <div className="item-beneficio">
                            <span className="icono-beneficio">📊</span>
                            <span>Gestiona alumnos</span>
                        </div>
                        <div className="item-beneficio">
                            <span className="icono-beneficio">🏆</span>
                            <span>Crea juegos en vivo</span>
                        </div>
                    </div>

                    {error && <div className="mensaje-error">{error}</div>}
                    {exito && <div className="mensaje-exito">{exito}</div>}

                    <form onSubmit={handleSubmit} className="formulario-registro">
                        <div className="grupo-formulario">
                            <label htmlFor="nombre" className="etiqueta-registro">Nombre Completo</label>
                            <input 
                                id="nombre" 
                                type="text" 
                                value={nombre} 
                                onChange={(e) => setNombre(e.target.value)} 
                                required 
                                className="input-registro" 
                                placeholder="Ej. Prof. Juan Pérez" 
                            />
                        </div>
                        <div className="grupo-formulario">
                            <label htmlFor="email" className="etiqueta-registro">Correo Electrónico</label>
                            <input 
                                id="email" 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                className="input-registro" 
                                placeholder="tu@escuela.edu" 
                            />
                        </div>
                        <div className="grupo-formulario">
                            <label htmlFor="password" className="etiqueta-registro">Contraseña</label>
                            <input 
                                id="password" 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                className="input-registro" 
                                placeholder="Mínimo 6 caracteres" 
                            />
                        </div>
                        <button type="submit" className="boton-registro-maestro">
                            ¡Comenzar ahora!
                        </button>
                    </form>
                    
                    <div className="pie-registro">
                        <p className="enlace-a-ingreso">
                            ¿Ya tienes cuenta? <Link to="/ingreso" className="enlace-ingreso-texto">Inicia Sesión aquí</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaestroRegistro;