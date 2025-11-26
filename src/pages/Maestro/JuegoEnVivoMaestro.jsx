import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { socket } from '../../socket/socket';
import './JuegoEnVivoMaestro.css';

const JuegoEnVivoMaestro = () => { 
    const location = useLocation(); 
    const navigate = useNavigate(); 
    const tarea = location.state?.task;
    const yaConectado = useRef(false);

    const [indice, setIndice] = useState(0);
    const [fase, setFase] = useState('jugando'); // Cambiar a 'jugando' directamente
    const [estudiantesConectados, setEstudiantesConectados] = useState([]);
    const [estadisticas, setEstadisticas] = useState({ totalRespuestas: 0, correctas: 0, incorrectas: 0, totalEstudiantes: 0 });
    const [rankingFinal, setRankingFinal] = useState([]);

    useEffect(() => {
        if (!tarea) {
            navigate('/escritorio');
            return;
        }
        
        if (yaConectado.current) return;
        yaConectado.current = true;
        
        
        socket.emit('maestro:unirse', { tareaId: tarea.id });
        
        // Iniciar juego automáticamente al entrar
        setTimeout(() => {
           
            socket.emit('maestro:iniciarJuego', { tareaId: tarea.id, indice: 0 });
        }, 500);

        // Listener para estudiantes que se conectan
        socket.on('estudiante:conectado', (data) => {
            setEstudiantesConectados(prev => {
                if (!prev.find(e => e.nombre === data.nombreAlumno)) {
                    return [...prev, { nombre: data.nombreAlumno, respondio: false }];
                }
                return prev;
            });
        });

        // Listener para respuestas recibidas
        socket.on('respuesta:recibida', (data) => {
            setEstadisticas({
                totalRespuestas: data.totalRespuestas,
                correctas: data.correctas,
                incorrectas: data.incorrectas,
                totalEstudiantes: data.totalEstudiantes
            });
            
            // Marcar estudiante como respondido
            setEstudiantesConectados(prev => 
                prev.map(e => 
                    e.nombre === data.nombreAlumno 
                        ? { ...e, respondio: true, correcta: data.correcta }
                        : e
                )
            );
        });
        
        // Listener para cuando el juego finaliza
        socket.on('juego:finalizado', (data) => {
            setRankingFinal(data.ranking);
            setFase('final');
        });

        return () => {
            socket.emit('maestro:salir', { tareaId: tarea.id });
            socket.off('estudiante:conectado');
            socket.off('respuesta:recibida');
            socket.off('juego:finalizado');
            yaConectado.current = false;
        };
    }, []); // Solo se ejecuta una vez

const iniciarJuego = () => {
    setFase('jugando');
    setIndice(0);
    setEstadisticas({ totalRespuestas: 0, correctas: 0, incorrectas: 0, totalEstudiantes: estudiantesConectados.length });
    setEstudiantesConectados(prev => prev.map(e => ({ ...e, respondio: false, correcta: undefined })));
    socket.emit('maestro:iniciarJuego', { tareaId: tarea.id, indice: 0 });
};

const siguientePregunta = () => {
    const nuevoIndice = indice + 1;
    
    setIndice(nuevoIndice);
    setEstadisticas({ totalRespuestas: 0, correctas: 0, incorrectas: 0, totalEstudiantes: estudiantesConectados.length });
    setEstudiantesConectados(prev => prev.map(e => ({ ...e, respondio: false, correcta: undefined })));
    
    socket.emit('maestro:siguientePregunta', { 
        tareaId: tarea.id, 
        indice: nuevoIndice,
        totalPreguntas: tarea.questions.length 
    });
    
    // Si terminamos, cambiar a fase final
    if (nuevoIndice >= tarea.questions.length) {
        setTimeout(() => setFase('final'), 1000);
    }
};

const terminarJuego = () => {
    navigate('/escritorio');
};

const reiniciarJuego = () => {
    setFase('jugando');
    setIndice(0);
    setRankingFinal([]);
    setEstadisticas({ totalRespuestas: 0, correctas: 0, incorrectas: 0, totalEstudiantes: estudiantesConectados.length });
    setEstudiantesConectados(prev => prev.map(e => ({ ...e, respondio: false, correcta: undefined })));
    
    // Iniciar juego automáticamente
    setTimeout(() => {
        socket.emit('maestro:iniciarJuego', { tareaId: tarea.id, indice: 0 });
    }, 500);
};

if (!tarea || !tarea.questions || tarea.questions.length === 0) {
    return (
        <div className="contenedor-juego-vivo">
            <div className="pantalla-centro">
                <h1>❌ Error</h1>
                <p>No se encontraron preguntas en este juego.</p>
                <button onClick={() => navigate('/escritorio')} className="btn-gigante">Volver</button>
            </div>
        </div>
    );
}

const preguntaActual = tarea.questions[indice];

// Si no hay pregunta actual (índice fuera de rango) y estamos jugando, mostrar cargando
if (!preguntaActual && fase === 'jugando') {
    return (
        <div className="contenedor-juego-vivo">
            <div className="pantalla-centro">
                <h1>⏳ Procesando resultados...</h1>
            </div>
        </div>
    );
}

return (
    <div className="contenedor-juego-vivo">
        <div className="header-vivo">
            <span>📡 EN VIVO: {tarea.title || "Examen"}</span>
            <button onClick={terminarJuego} className="btn-salir-vivo">Salir</button>
        </div>

        {fase === 'jugando' && preguntaActual && (
            <div style={{display: 'flex', flex: 1, overflow: 'hidden'}}>
                {/* Panel principal de la pregunta */}
                <div className="pantalla-pregunta" style={{flex: 1}}>
                    <div className="info-sup">Pregunta {indice + 1} de {tarea.questions.length}</div>
                    <h1 className="texto-pregunta">{preguntaActual.question}</h1>
                    
                    {preguntaActual.media?.type === 'image' && (
                        <img src={preguntaActual.media.url} className="imagen-vivo" alt="media" />
                    )}

                    <div className="grid-opciones-vivo">
                        {preguntaActual.options.map((op, i) => (
                            <div key={i} className={`opcion-vivo color-${i}`}>{op}</div>
                        ))}
                    </div>
                    <button onClick={siguientePregunta} className="btn-siguiente">Siguiente Pregunta ➡️</button>
                </div>
                
                {/* Panel lateral de estadísticas */}
                <div className="panel-estadisticas">
                    <h3 style={{marginBottom: '20px', fontSize: '1.3rem'}}>📊 Estadísticas</h3>
                    
                    <div className="stat-card">
                        <div className="stat-number">{estadisticas.totalRespuestas}/{estadisticas.totalEstudiantes}</div>
                        <div className="stat-label">Respuestas</div>
                    </div>
                    
                    <div className="stat-card" style={{background: 'rgba(38, 137, 12, 0.3)'}}>
                        <div className="stat-number">{estadisticas.correctas}</div>
                        <div className="stat-label">✅ Correctas</div>
                    </div>
                    
                    <div className="stat-card" style={{background: 'rgba(226, 27, 60, 0.3)'}}>
                        <div className="stat-number">{estadisticas.incorrectas}</div>
                        <div className="stat-label">❌ Incorrectas</div>
                    </div>
                    
                    <div style={{marginTop: '30px'}}>
                        <h4 style={{marginBottom: '15px', fontSize: '1.1rem'}}>👥 Estudiantes</h4>
                        <div style={{maxHeight: '300px', overflowY: 'auto'}}>
                            {estudiantesConectados.map((est, i) => (
                                <div key={i} className="estudiante-item">
                                    <span>{est.nombre}</span>
                                    {est.respondio ? (
                                        est.correcta ? 
                                            <span style={{color: '#26890c', fontSize: '1.2rem'}}>✅</span> : 
                                            <span style={{color: '#e21b3c', fontSize: '1.2rem'}}>❌</span>
                                    ) : (
                                        <span style={{opacity: 0.5}}>⏳</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}

       
        {fase === 'final' && (
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px'}}>
                <h1 style={{fontSize: '3rem', marginBottom: '20px'}}>🏆 ¡Juego Terminado!</h1>
                
                <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '30px',
                    width: '100%',
                    maxWidth: '600px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{textAlign: 'center', marginBottom: '25px', color: '#333'}}>🏅 Ranking Final</h2>
                    
                    {rankingFinal.map((jugador, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '15px 20px',
                            background: index === 0 ? '#fef3c7' : index === 1 ? '#e5e7eb' : index === 2 ? '#fed7aa' : '#f9fafb',
                            borderRadius: '12px',
                            marginBottom: '12px',
                            border: index < 3 ? '2px solid #fbbf24' : '1px solid #e5e7eb',
                            transition: 'transform 0.2s'
                        }}>
                            <span style={{fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '15px'}}>
                                <span style={{fontSize: '2rem'}}>
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                                </span>
                                {jugador.nombre}
                            </span>
                            <span style={{
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                color: '#667eea',
                                background: 'rgba(102, 126, 234, 0.1)',
                                padding: '8px 20px',
                                borderRadius: '8px'
                            }}>
                                {jugador.puntaje}
                            </span>
                        </div>
                    ))}
                </div>
                
                <div style={{display: 'flex', gap: '15px', marginTop: '30px'}}>
                    <button 
                        onClick={reiniciarJuego} 
                        style={{
                            flex: 1,
                            padding: '15px 40px',
                            fontSize: '1.3rem',
                            background: '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                        }}
                    >
                        🔄 Jugar de Nuevo
                    </button>
                    
                    <button 
                        onClick={terminarJuego} 
                        style={{
                            flex: 1,
                            padding: '15px 40px',
                            fontSize: '1.3rem',
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                        }}
                    >
                        Volver al Escritorio
                    </button>
                </div>
            </div>
        )}
    </div>
);


};

export default JuegoEnVivoMaestro;