import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../Contextos/AuthContext';
import { useDatos } from '../../Contextos/DatosContext';
import { socket } from '../../socket/socket';
import TarjetaEstadistica from '../../componentes/TarjetaEstadistica';
import IndicadorConexion from '../../componentes/IndicadorConexion';
import './Progreso.css';

const MaestroProgreso = () => {
    const navigate = useNavigate();
    const { roomId: urlRoomId, taskId: urlTaskId } = useParams();
    const { maestroActual } = useAuth();
    
    const { salas, obtenerListaAsistencia, cargarDatosMaestro } = useDatos();
    
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
    const [listaOficial, setListaOficial] = useState([]); 

    const roomId = parseInt(urlRoomId);
    const taskId = parseInt(urlTaskId);

    useEffect(() => {
        if (!maestroActual) navigate('/ingreso');
        
        const cargarAsistencia = async () => {
            if (roomId) {
                const lista = await obtenerListaAsistencia(roomId);
                setListaOficial(lista || []);
            }
        };
        cargarAsistencia();

        // Listener para actualización en tiempo real de entregas
        socket.on('tarea:nuevaEntrega', (data) => {
            if (data.tareaId === taskId) {
              
                // Recargar datos del maestro para actualizar entregas
                if (maestroActual) {
                    cargarDatosMaestro(maestroActual.id);
                }
            }
        });

        return () => {
            socket.off('tarea:nuevaEntrega');
        };
    }, [maestroActual, navigate, roomId, taskId]); 
    
    const sala = salas.find(r => r.id === roomId);
    const tarea = sala?.tasks.find(t => t.id === taskId);
    
    const totalPreguntas = tarea?.questions.length || 0;
    const entregas = useMemo(() => tarea?.studentProgress || [], [tarea]);

    const buscarEnListaOficial = (nombreEstudiante) => {
        if (listaOficial.length === 0) return null;

        const esParecido = (input, real) => {
            const inArr = input.toLowerCase().trim().split(" ").filter(x=>x);
            const realArr = real.toLowerCase().trim().split(" ");
            if (inArr.length === 1) return realArr.some(p => p.startsWith(inArr[0]));
            let c = 0;
            inArr.forEach(p => { if (realArr.some(r => r.startsWith(p))) c++; });
            return c >= 2;
        };

        return listaOficial.find(alumno => esParecido(nombreEstudiante, alumno.nombre_completo));
    };
    // -----------------------------------------------------------------------

    const estadisticas = useMemo(() => {
        if (entregas.length === 0 || totalPreguntas === 0) {
            return { promedioPuntaje: 0, totalEntregas: 0, datosAlumno: [] };
        }
        
        const datosAlumno = entregas.map(entrega => {
            let conteoCorrecto = 0;
            const respuestasAnalizadas = entrega.answers.map(respuesta => {
                const pregunta = tarea.questions.find(q => q.id === respuesta.qId);
                if (!pregunta) return { ...respuesta, isCorrect: false };
                const esCorrecta = respuesta.selectedOptionIndex === pregunta.correctOptionIndex;
                if (esCorrecta) conteoCorrecto++;
                return { 
                    ...respuesta, 
                    isCorrect: esCorrecta,
                    questionText: pregunta.question,
                    optionChosen: pregunta.options[respuesta.selectedOptionIndex],
                    optionCorrect: pregunta.options[pregunta.correctOptionIndex]
                };
            });

            const porcentaje = ((conteoCorrecto / totalPreguntas) * 100).toFixed(0);

            return { 
                ...entrega, 
                answers: respuestasAnalizadas, 
                score: conteoCorrecto, 
                percentage: porcentaje 
            };
        });

        const puntajeTotal = datosAlumno.reduce((sum, data) => sum + data.score, 0);
        const promedioPuntaje = (puntajeTotal / (datosAlumno.length * totalPreguntas)) * 100;

        return { 
            promedioPuntaje: promedioPuntaje.toFixed(1), 
            totalEntregas: datosAlumno.length, 
            datosAlumno: datosAlumno.sort((a, b) => b.score - a.score) 
        };
    }, [entregas, totalPreguntas, tarea]); 
    
    if (!maestroActual || !tarea || !sala) return <div className="mensaje-error-progreso">Cargando datos...</div>;
    
    const obtenerColorProgreso = (porcentaje) => {
        if (porcentaje >= 80) return 'clase-progreso-verde';
        if (porcentaje >= 50) return 'clase-progreso-amarillo';
        return 'clase-progreso-rojo';
    };

    return (
        <div className="contenedor-progreso">
            <h1 className="titulo-progreso">📊 Progreso: {sala.schoolName}</h1>
            <p className="subtitulo-progreso">Tarea con {totalPreguntas} preguntas</p>
            <div className="encabezado-progreso">
                <Link to="/escritorio" className='enlace-volver-escritorio'>← Volver</Link>
            </div>

            <div className="grid-estadisticas">
                <TarjetaEstadistica titulo="Entregas" valor={estadisticas.totalEntregas} icono="🎓" color="bg-indigo-100" />
                <TarjetaEstadistica titulo="Promedio" valor={`${estadisticas.promedioPuntaje}%`} icono="⭐" color="bg-green-100" />
            </div>

            <h3 className="titulo-resultados">Resultados</h3>

            {entregas.length === 0 ? (
                <p>Aún no hay entregas de alumnos.</p>
            ) : (
                <div className="tabla-responsive">
                    <table className="tabla-resultados">
                        <thead>
                            <tr>
                                <th>Estudiante</th>
                                <th>Estado Lista</th> 
                                <th>Puntuación</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {estadisticas.datosAlumno.map((data) => {
                             
                                const matchOficial = buscarEnListaOficial(data.studentName);

                                return (
                                    <tr key={data.studentId}>
                                        <td>
                                            <div className="info-estudiante-celda">
                                                <span style={{fontSize:'1.5rem', marginRight:'10px'}}>{data.studentAvatar}</span>
                                                <div style={{display:'flex', flexDirection:'column'}}>
                                                    <span style={{fontWeight:'bold'}}>{data.studentName}</span>
                                                </div>
                                            </div>
                                        </td>
                                       
                                        <td>
                                            {matchOficial ? (
                                                <span className="badge-presente" title={`Detectado como: ${matchOficial.nombre_completo}`}>
                                                    ✅ Presente
                                                    <small style={{display:'block', fontSize:'0.7em', color:'#166534'}}>
                                                        ({matchOficial.nombre_completo})
                                                    </small>
                                                </span>
                                            ) : (
                                                <span className="badge-no-lista">
                                                    ⚠️ No en lista
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="barra-progreso-fondo">
                                                <div className={`barra-progreso ${obtenerColorProgreso(data.percentage)}`} style={{ width: `${data.percentage}%` }}></div>
                                            </div>
                                            <span className='texto-puntaje'>{data.score}/{totalPreguntas} ({data.percentage}%)</span>
                                        </td>
                                        <td>
                                            <button 
                                                onClick={() => setAlumnoSeleccionado(data)}
                                                className="boton-ver-detalle"
                                                style={{padding: '5px 10px', cursor: 'pointer', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px'}}
                                            >
                                                👁️ Ver Respuestas
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

         
            {alumnoSeleccionado && (
                <div className="modal-overlay" onClick={() => setAlumnoSeleccionado(null)}>
                    <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>📝 Detalles de {alumnoSeleccionado.studentName}</h3>
                            <button className="boton-cerrar-modal" onClick={() => setAlumnoSeleccionado(null)}>×</button>
                        </div>
                        <div className="lista-respuestas-detalle">
                            {alumnoSeleccionado.answers.map((resp, idx) => (
                                <div key={idx} className={`detalle-pregunta ${resp.isCorrect ? 'detalle-correcto' : 'detalle-incorrecto'}`}>
                                    <span className="texto-pregunta-detalle">{idx + 1}. {resp.questionText}</span>
                                    <p className="respuesta-alumno"><span className="etiqueta-resp">Eligió:</span> {resp.optionChosen} {resp.isCorrect ? ' ✅' : ' ❌'}</p>
                                    {!resp.isCorrect && <p className="respuesta-correcta-info" style={{color: '#16a34a'}}><span className="etiqueta-resp">Correcta:</span> {resp.optionCorrect}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            <IndicadorConexion />
        </div>
    );
};

export default MaestroProgreso;