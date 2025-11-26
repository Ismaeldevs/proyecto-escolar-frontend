import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDatos } from '../../Contextos/DatosContext';
import { obtenerUrlEmbed } from '../../Logica/utilidades';
import './VistaTarea.css';

const EstudianteVistaTarea = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { enviarRespuestasAlumno } = useDatos();
    
    const datosTarea = location.state?.task;
    const datosSala = location.state?.room;
    const nombreAlumno = location.state?.studentName;
    const avatarAlumno = location.state?.studentAvatar;
    
    useEffect(() => {
        if (!datosTarea || !datosSala || !nombreAlumno) {
            // Si faltan datos, redirigir a la vista de ingreso a sala
            navigate('/estudiante/sala');
        }
    }, [datosTarea, datosSala, nombreAlumno, navigate]);

    const [indicePreguntaActual, setIndicePreguntaActual] = useState(0);
    const [respuestas, setRespuestas] = useState([]);
    const [tiempoRestante, setTiempoRestante] = useState(datosTarea?.timeLimit || 0); 
    const [tareaFinalizada, setTareaFinalizada] = useState(false);
    
    // Timer
    useEffect(() => {
        if (tareaFinalizada || !datosTarea) return; 
        if (tiempoRestante <= 0) {
            setTareaFinalizada(true);
            return;
        }
        const timer = setTimeout(() => setTiempoRestante(prev => prev - 1), 1000);
        return () => clearTimeout(timer);
    }, [tiempoRestante, tareaFinalizada, datosTarea]);
    
    if (!datosTarea || !datosTarea.questions || !Array.isArray(datosTarea.questions)) {
        return <div className="clase-cargando">Cargando examen...</div>;
    }

    const { theme, primaryColor } = datosTarea.style || { theme: 'default', primaryColor: '#4f46e5' };
    const preguntas = datosTarea.questions; 
    const preguntaActual = preguntas[indicePreguntaActual];

    if (!preguntaActual) return <div>Error al cargar la pregunta.</div>;

    const respuestaActual = respuestas.find(a => a.qId === preguntaActual.id)?.selectedOptionIndex;

    const manejarSeleccionRespuesta = (indiceOpcion) => {
        const nuevaRespuesta = { 
            qId: preguntaActual.id, 
            selectedOptionIndex: indiceOpcion, 
            isCorrect: indiceOpcion === preguntaActual.correctOptionIndex,
        };
        setRespuestas(prev => {
            const filtradas = prev.filter(a => a.qId !== preguntaActual.id);
            return [...filtradas, nuevaRespuesta];
        });
    };
    
    const manejarSiguiente = () => {
        if (indicePreguntaActual === preguntas.length - 1) {
            setTareaFinalizada(true);
        } else {
            setIndicePreguntaActual(prev => prev + 1);
        }
    };

   
    const manejarEnvioTarea = async () => {
        await enviarRespuestasAlumno( 
            datosSala.id,
            datosTarea.id,
            nombreAlumno,
            avatarAlumno,
            respuestas
        );

     
        navigate('/estudiante/seleccion-tarea', { 
            state: {
                room: datosSala,
                studentName: nombreAlumno,
                studentAvatar: avatarAlumno,
                
            }
        });
    };
    
    if (tareaFinalizada) {
        return (
            <div className={`contenedor-finalizado clase-fondo-${theme}`}>
                <div className={`tarjeta-finalizado clase-tarjeta-${theme}`}>
                    <h2>¡Tarea Finalizada! {avatarAlumno}</h2>
                    <p>Gracias, {nombreAlumno}. ¡Enviando resultados!</p>
                    <button 
                        onClick={manejarEnvioTarea} 
                        className="boton-enviar-final"
                        style={{ backgroundColor: primaryColor }}
                    >
                        Regresar a la Lista de Tareas
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className={`contenedor-tarea clase-fondo-${theme}`}>
            <div className={`barra-superior clase-tarjeta-${theme}`}>
                <div>{avatarAlumno} {nombreAlumno}</div>
                <div className="timer">⏰ {Math.floor(tiempoRestante/60)}:{String(tiempoRestante%60).padStart(2,'0')}</div>
            </div>

            <div className={`tarjeta-pregunta clase-tarjeta-${theme}`}>
                {preguntaActual.media?.type === 'image' && (
                    <img src={preguntaActual.media.url} className="imagen-pregunta" alt="Apoyo visual" />
                )}
                {preguntaActual.media?.type === 'video' && (
                    <div className="iframe-wrapper">
                        <iframe src={obtenerUrlEmbed(preguntaActual.media.url)} className="iframe-video" title="Video"></iframe>
                    </div>
                )}

                <h3 className={`texto-pregunta clase-texto-${theme}`}>{preguntaActual.question}</h3>
                
                <div className="grid-opciones-tarea">
                    {preguntaActual.options && preguntaActual.options.map((opcion, index) => (
                        <button
                            key={index}
                            onClick={() => manejarSeleccionRespuesta(index)}
                            className={`boton-opcion ${respuestaActual === index ? 'seleccionada' : ''}`}
                            style={{
                                borderColor: respuestaActual === index ? primaryColor : '#d1d5db',
                                backgroundColor: respuestaActual === index ? `${primaryColor}20` : 'transparent'
                            }}
                        >
                            {opcion}
                        </button>
                    ))}
                </div>
            </div>

            <div className="navegacion-tarea">
                <button 
                    onClick={manejarSiguiente} 
                    disabled={typeof respuestaActual === 'undefined'} 
                    className="boton-siguiente"
                    style={{ backgroundColor: primaryColor }}
                >
                    {indicePreguntaActual === preguntas.length - 1 ? 'Finalizar Tarea' : 'Siguiente'}
                </button>
            </div>
        </div>
    );
};

export default EstudianteVistaTarea;