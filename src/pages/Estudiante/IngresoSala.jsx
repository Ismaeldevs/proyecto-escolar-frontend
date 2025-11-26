import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDatos } from '../../Contextos/DatosContext';
import { AVATARES } from '../../Logica/utilidades';
import './IngresoSala.css';

const EstudianteIngresoSala = () => {
    const { buscarSalaEstudiante } = useDatos();
    
    const [codigoSala, setCodigoSala] = useState('');
    const [nombreAlumno, setNombreAlumno] = useState('');
    const [avatarSeleccionado, setAvatarSeleccionado] = useState(AVATARES[0]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const manejarIngreso = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!codigoSala || !nombreAlumno) {
            setError("Por favor completa todos los datos.");
            return;
        }

        const resultado = await buscarSalaEstudiante(codigoSala);

        if (!resultado.success) {
            setError(resultado.message);
            return;
        }

        const salaBackend = resultado.room;
        
        // ⚠️ CAMBIO CLAVE: REDIRIGIMOS A LA LISTA DE TAREAS
        navigate('/estudiante/seleccion-tarea', { 
            state: { 
                room: salaBackend, 
                studentName: nombreAlumno,
                studentAvatar: avatarSeleccionado
            } 
        });
    };

    return (
        <div className="contenedor-ingreso-sala">
            <h2 className="titulo-ingreso-sala">🎒 ¡Listo para Empezar!</h2>
            <p className="descripcion-ingreso-sala">Ingresa el código de sala y tu nombre.</p>

            {error && <div className="mensaje-error-sala clase-mb-4">{error}</div>}

            <form onSubmit={manejarIngreso} className="formulario-ingreso-sala">
                <div>
                    <label className="etiqueta-avatar">Elige tu Avatar</label>
                    <div className="selector-avatar">
                        {AVATARES.map((avatar, index) => (
                            <button key={index} type="button" onClick={() => setAvatarSeleccionado(avatar)} className={`boton-avatar ${avatarSeleccionado === avatar ? 'avatar-seleccionado' : ''}`}>
                                {avatar}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="etiqueta-input-bold">Tu Nombre Completo</label>
                    <input type="text" value={nombreAlumno} onChange={(e) => setNombreAlumno(e.target.value)} className="input-text-sala" placeholder="Ej: Sofia Perez" />
                </div>
                <div>
                    <label className="etiqueta-input-bold">Código de Sala</label>
                    <input type="text" value={codigoSala} onChange={(e) => setCodigoSala(e.target.value.toUpperCase())} className="input-codigo-sala" placeholder="CÓDIGO" maxLength={6} />
                </div>
                <button type="submit" className="boton-entrar-sala">Entrar a la Sala</button>
            </form>
            <p className="enlace-a-maestro"><Link to="/ingreso">Soy Maestro</Link></p>
        </div>
    );
};

export default EstudianteIngresoSala;