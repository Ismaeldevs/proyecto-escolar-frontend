import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { socket } from '../../socket/socket';
import IndicadorConexion from '../../componentes/IndicadorConexion';
import './ListaTareas.css';

const EstudianteListaTareas = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const datosSala = location.state?.room;
    const nombreAlumno = location.state?.studentName;
    const avatarAlumno = location.state?.studentAvatar;
    
    const [salaActualizada, setSalaActualizada] = useState(datosSala);

    useEffect(() => {
        if (!datosSala || !nombreAlumno) {
            navigate('/estudiante/sala');
            return;
        }
        
        setSalaActualizada(datosSala);
        
        // Unirse al canal de la sala
        socket.emit('estudiante:unirseASala', { salaId: datosSala.id, nombreAlumno });
        
        // Listener para nuevas tareas/juegos
        socket.on('sala:tareaAgregada', async (data) => {
            if (data.salaId === datosSala.id) {
                // Actualizar la sala con las nuevas tareas recibidas del servidor
                if (data.tasks) {
                    setSalaActualizada(prev => ({
                        ...prev,
                        tasks: data.tasks
                    }));
                }
            }
        });
        
        // Listener para cuando se agrega el estudiante a una sala
        socket.on('sala:estudianteAgregado', (data) => {
        });
        
        return () => {
            socket.emit('estudiante:salirDeSala', { salaId: datosSala.id, nombreAlumno });
            socket.off('sala:tareaAgregada');
            socket.off('sala:estudianteAgregado');
        };
    }, [datosSala, nombreAlumno, navigate]);

    if (!salaActualizada) return null;

    const manejarElegirTarea = (tarea) => {
        if (tarea.submissionDeadline) {
            if (new Date() > new Date(tarea.submissionDeadline)) {
                   Swal.fire({
                     icon: "error",
                     title: "⛔ Tiempo finalizado",
                      text: "El tiempo para realizar este examen ha terminado.",
                      confirmButtonText: "Aceptar"
                          });               
            return;
            }
        }

        navigate('/estudiante/tarea', {
            state: {
                room: salaActualizada,
                task: tarea,
                studentName: nombreAlumno,
                studentAvatar: avatarAlumno
            }
        });
    };

    return (
        <div className="contenedor-lista-tareas">
            <div className="encabezado-alumno">
                <span className="avatar-grande">{avatarAlumno}</span>
                <h1>Hola, {nombreAlumno}</h1>
                <p>Sala: <strong>{salaActualizada.schoolName} - {salaActualizada.grade}</strong></p>
            </div>

            <h3 className="titulo-seccion">Selecciona una actividad:</h3>

            <div className="grid-tareas-alumno">
               
                {/* Mostrar todas las tareas */}
                {salaActualizada?.tasks?.map((tarea, index) => (
                    <div 
                        key={tarea.id} 
                        className="tarjeta-tarea-alumno"
                        style={{
                            borderLeft: `6px solid ${tarea.style.primaryColor}`,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            cursor: 'default'
                        }}
                    >
                        <div className="info-tarea-alumno">
                            <span className="numero-tarea">Actividad #{index + 1}</span>
                            <span className="titulo-tarea">Examen de {tarea.questions.length} Preguntas</span>
                            <span className="tiempo-tarea">⏱️ Tiempo: {Math.floor(tarea.timeLimit / 60)} minutos</span>
                        </div>
                        <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                            <button 
                                onClick={() => manejarElegirTarea(tarea)}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    backgroundColor: tarea.style.primaryColor,
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                📝 Hacer Tarea
                            </button>
                            {tarea.tipo === 'juego' && (
                                <button 
                                    onClick={() => {
                                        navigate('/juego-vivo/estudiante', { 
                                            state: { 
                                                task: tarea, 
                                                studentName: nombreAlumno, 
                                                salaId: salaActualizada.id 
                                            } 
                                        });
                                    }}
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        backgroundColor: '#46178f',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    📡 Modo en Vivo
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            
            <button onClick={() => navigate('/')} className="boton-salir">Salir</button>
            <IndicadorConexion />
        </div>
    );
};

export default EstudianteListaTareas;