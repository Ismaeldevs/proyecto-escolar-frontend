import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../Contextos/AuthContext';
import { useDatos } from '../../Contextos/DatosContext';
import { GRADOS } from '../../Logica/utilidades';
import './CrearSala.css';

const MaestroCrearSala = () => {
    const navigate = useNavigate();
    const { maestroActual } = useAuth();
    const { crearSala } = useDatos();

    const [nombreEscuela, setNombreEscuela] = useState('');
    const [grado, setGrado] = useState(GRADOS[0]);
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');
    
    useEffect(() => {
        if (!maestroActual) navigate('/ingreso');
    }, [maestroActual, navigate]);
    
    if (!maestroActual) return null;
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 
        setExito('');
    
        if (!nombreEscuela) {
            setError('Por favor, ingresa el nombre de la escuela.');
            return;
        }
    
        const resultado = await crearSala(maestroActual.id, nombreEscuela, grado);
    
        if (resultado.success) {
            setExito(`¡Sala creada! Código: ${resultado.room.roomCode}`);
            setNombreEscuela(''); 
            setTimeout(() => navigate('/escritorio'), 2500);
        } else {
            setError(resultado.message || 'Error al crear la sala.');
        }
    };
    
    return (
        <div className="pagina-crear-sala">
            <div className="tarjeta-crear-sala">
                <h2 className="titulo-crear-sala">🏫 Crear Nueva Sala</h2>
                <p className="descripcion-crear-sala">
                    Define la escuela y el grado para generar un código de acceso único.
                </p>
                
                {error && <div className="mensaje-error">{error}</div>}
                {exito && <div className="mensaje-exito">{exito}</div>}
            
                <form onSubmit={handleSubmit} className="formulario-crear-sala">
                    <div>
                        <label className="etiqueta-input-bold">Nombre de la Escuela</label>
                        <input
                            type="text"
                            value={nombreEscuela}
                            onChange={(e) => setNombreEscuela(e.target.value)}
                            className="input-bonito"
                            placeholder="Ej: Escuela Primaria N° 54"
                        />
                    </div>
                    
                    <div>
                        <label className="etiqueta-input-bold">Grado de Primaria</label>
                        <select
                            value={grado}
                            onChange={(e) => setGrado(e.target.value)}
                            className="input-bonito"
                        >
                            {GRADOS.map(g => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </div>
                    
                    <button
                        type="submit"
                        className="boton-generar-codigo"
                    >
                        Generar Código de Sala
                    </button>
                </form>

                <div className="enlace-volver-dashboard">
                    <Link to="/escritorio" className="enlace-volver-texto">
                        ← Volver al Escritorio
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MaestroCrearSala;