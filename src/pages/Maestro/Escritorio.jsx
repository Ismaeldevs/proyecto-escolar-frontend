import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../Contextos/AuthContext';
import { useDatos } from '../../Contextos/DatosContext';
import { socket } from '../../socket/socket';
import IndicadorConexion from '../../componentes/IndicadorConexion';
import './Escritorio.css';


const VistaSinSalas = () => (
    <div className="contenedor-vacio">
     
        <img 
            src="./imagenmascota/bienvenidaSala.png" 
            alt="Bienvenida Maestro" 
            className="imagen-mascota-bienvenida" 
        />
    </div>
);


const TarjetaSala = ({ sala, alBorrarSala, alBorrarTarea, navigate }) => {
    const tareasCasa = sala.tasks ? sala.tasks.filter(t => t.tipo === 'tarea' || !t.tipo) : [];
    const juegosVivo = sala.tasks ? sala.tasks.filter(t => t.tipo === 'juego') : [];

    return (
        <div className="tarjeta-sala">
            <div className='encabezado-tarjeta-sala'>
                <div>
                    <p className="nombre-escuela">{sala.schoolName}</p>
                    <p className="grado-sala">{sala.grade} <span className="codigo-badge">{sala.roomCode}</span></p>
                </div>
                <div className="acciones-encabezado-sala">
                    <Link to={`/asistencia/${sala.id}`} className="boton-ver-lista">📋 Lista</Link>
                    <button onClick={() => alBorrarSala(sala.id, sala.schoolName)} className="boton-eliminar-sala">🗑️</button>
                </div>
            </div>
            
         
            {juegosVivo.length > 0 && (
                <div className='seccion-subtipo juego'>
                    <p className='titulo-subtipo'>🎮 Juegos en Vivo</p>
                    <ul className='lista-tareas'>
                        {juegosVivo.map(juego => (
                            <li key={juego.id} className='item-tarea item-juego'>
                                <span>{juego.questions.length} Pregs</span>
                                <div className='acciones-tarea'>
                                    <button onClick={() => navigate('/juego-vivo/maestro', { state: { task: juego } })} className="btn-lanzar">🚀</button>
                                    <Link to={`/editar-tarea/${sala.id}/${juego.id}`} className='btn-mini'>✏️</Link>
                                    <button onClick={() => alBorrarTarea(juego.id)} className='btn-mini-borrar'>🗑️</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

          
            <div className='seccion-subtipo tarea'>
                <p className='titulo-subtipo'>📝 Tareas Casa</p>
                {tareasCasa.length === 0 ? <p className='mensaje-vacio'>Sin tareas.</p> : (
                    <ul className='lista-tareas'>
                        {tareasCasa.map(tarea => (
                            <li key={tarea.id} className='item-tarea'>
                                <span>Examen ({tarea.questions.length}p)</span>
                                <div className='acciones-tarea'>
                                    <Link to={`/progreso/${sala.id}/${tarea.id}`} className='btn-mini'>📊</Link>
                                    <Link to={`/editar-tarea/${sala.id}/${tarea.id}`} className='btn-mini'>✏️</Link>
                                    <button onClick={() => alBorrarTarea(tarea.id)} className='btn-mini-borrar'>🗑️</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};


const MaestroEscritorio = () => {
    const navigate = useNavigate();
    const { maestroActual, cerrarSesionMaestro } = useAuth(); 
    const { salas, cargarDatosMaestro, eliminarTarea, eliminarSala } = useDatos(); 
    
    useEffect(() => {
        if (!maestroActual) navigate('/ingreso'); 
        else {
            cargarDatosMaestro(maestroActual.id);
            
            // Unirse al canal del maestro
            socket.emit('maestro:conectar', { maestroId: maestroActual.id });
            
            // Listeners para actualizaciones en tiempo real
            socket.on('sala:nueva', (data) => {
                cargarDatosMaestro(maestroActual.id);
            });
            
            socket.on('tarea:nueva', (data) => {
                cargarDatosMaestro(maestroActual.id);
            });
        }
        
        return () => {
            socket.off('sala:nueva');
            socket.off('tarea:nueva');
        };
    }, [maestroActual, navigate, cargarDatosMaestro]);

    if (!maestroActual) return <div className="clase-cargando">Cargando...</div>;

    const manejarCerrarSesion = () => {
        cerrarSesionMaestro(); 
        navigate('/ingreso');  
    };

    const manejarBorrarTarea = async (id) => {
        if (window.confirm("¿Eliminar permanentemente?")) await eliminarTarea(id, maestroActual.id);
    };

    const manejarBorrarSala = async (id, nombre) => {
        if (window.confirm(`¿Eliminar sala "${nombre}"?`)) await eliminarSala(id, maestroActual.id);
    };


    return (
        <div className="contenedor-escritorio">
            
            <div className="barra-superior">
                <span style={{fontSize: '3.5rem'}}>👩‍🏫</span>
                <h1 className="titulo-escritorio">Bienvenido/a, {maestroActual.name}</h1> 
                <button onClick={manejarCerrarSesion} className="boton-cerrar-sesion">Cerrar Sesión</button>
            </div>
            
       
            {salas.length === 0 && <VistaSinSalas />}

            <div className="acciones-principales">
                <Link to="/crear-sala" className="boton-crear-sala">🏫 Nueva Sala</Link>
                <Link to="/crear-tarea" className="boton-crear-tarea">📝 Nueva Tarea</Link>
                <Link to="/crear-juego" className="boton-crear-juego">🎮 Nuevo Juego</Link>
            </div>

            {salas.length > 0 && (
                <div className="seccion-salas">
                    <div className="lista-salas">
                        {salas.map(sala => (
                            <TarjetaSala 
                                key={sala.id} 
                                sala={sala} 
                                alBorrarSala={manejarBorrarSala}
                                alBorrarTarea={manejarBorrarTarea}
                                navigate={navigate}
                            />
                        ))}
                    </div>
                </div>
            )}
            <IndicadorConexion />
        </div>
    );
};

export default MaestroEscritorio;