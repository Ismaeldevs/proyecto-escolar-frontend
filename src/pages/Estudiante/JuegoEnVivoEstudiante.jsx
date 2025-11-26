import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { socket } from '../../socket/socket';
import './JuegoEnVivoEstudiante.css';

const JuegoEnVivoEstudiante = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const tarea = location.state?.task; 
    const nombreAlumno = location.state?.studentName;
    const yaConectado = useRef(false);
    
    const [estadoServer, setEstadoServer] = useState('lobby');
    const [indiceServer, setIndiceServer] = useState(0);
    const [respuestaEnviada, setRespuestaEnviada] = useState(false);
    const [puntajeAlumno, setPuntajeAlumno] = useState(0);
    const [ranking, setRanking] = useState([]);
   
    useEffect(() => { 
        if (!tarea || !nombreAlumno) {
            navigate('/'); 
        }
    }, [tarea, nombreAlumno, navigate]);

    useEffect(() => {
        if (!tarea || !nombreAlumno || yaConectado.current) return;
        
        yaConectado.current = true;
        socket.emit('estudiante:unirse', { tareaId: tarea.id, nombreAlumno });

        const handleJuegoIniciar = (data) => {
            if (data.tareaId === tarea.id) {
                // Resetear todos los estados para un nuevo juego
                setEstadoServer('jugando');
                setIndiceServer(data.indice);
                setRespuestaEnviada(false);
                setPuntajeAlumno(0);
                setRanking([]);
            }
        };

        const handleSiguientePregunta = (data) => {
            if (data.tareaId === tarea.id) {
                setIndiceServer(data.indice);
                setRespuestaEnviada(false);
            }
        };

        const handleTerminar = (data) => {
            if (data.tareaId === tarea.id) {
                setEstadoServer('final');
            }
        };
        
        const handleJuegoFinalizado = (data) => {
            setRanking(data.ranking);
            setPuntajeAlumno(data.ranking.find(r => r.nombre === nombreAlumno)?.puntaje || 0);
            setEstadoServer('final');
        };

        socket.on('juego:iniciar', handleJuegoIniciar);
        socket.on('juego:siguientePregunta', handleSiguientePregunta);
        socket.on('juego:terminar', handleTerminar);
        socket.on('juego:finalizado', handleJuegoFinalizado);

        return () => {
            socket.emit('estudiante:salir', { tareaId: tarea.id, nombreAlumno });
            socket.off('juego:iniciar', handleJuegoIniciar);
            socket.off('juego:siguientePregunta', handleSiguientePregunta);
            socket.off('juego:terminar', handleTerminar);
            socket.off('juego:finalizado', handleJuegoFinalizado);
            yaConectado.current = false;
        };
    }, [tarea, nombreAlumno]);

    const responder = (indexOpcion) => {
        setRespuestaEnviada(true);
        const preguntaActual = tarea.questions[indiceServer];
        const esCorrecta = indexOpcion === preguntaActual?.correctOptionIndex;
        
        // Actualizar puntaje local
        if (esCorrecta) {
            setPuntajeAlumno(prev => prev + 1);
        }
        
        socket.emit('estudiante:responder', {
            tareaId: tarea.id,
            nombreAlumno,
            indice: indiceServer,
            respuesta: indexOpcion,
            correcta: esCorrecta
        });
    };

    if (!tarea) return null;

  
    if (estadoServer === 'lobby') {
        return (
            <div className="contenedor-estudiante-vivo espera">
                <h1>⏳ Esperando al Maestro...</h1>
                <p>Mira la pantalla principal del salón.</p>
                <p>Jugando como: <strong>{nombreAlumno}</strong></p>
            </div>
        );
    }

    if (estadoServer === 'final') {
        const posicion = ranking.findIndex(r => r.nombre === nombreAlumno) + 1;
        const medalla = posicion === 1 ? '🥇' : posicion === 2 ? '🥈' : posicion === 3 ? '🥉' : '🎖️';
        
        return (
            <div className="contenedor-estudiante-vivo" style={{padding: '20px', overflowY: 'auto'}}>
                <div style={{textAlign: 'center', marginBottom: '30px'}}>
                    <h1 style={{fontSize: '3rem', margin: '10px'}}>{medalla}</h1>
                    <h2>¡Juego Terminado!</h2>
                    <div style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        padding: '20px',
                        borderRadius: '15px',
                        margin: '20px auto',
                        maxWidth: '300px'
                    }}>
                        <h3 style={{margin: '0 0 10px 0'}}>Tu Puntaje</h3>
                        <p style={{fontSize: '3rem', fontWeight: 'bold', margin: '10px 0'}}>{puntajeAlumno}</p>
                        <p style={{fontSize: '1.2rem', opacity: 0.9}}>de {tarea.questions.length} preguntas</p>
                        {posicion > 0 && <p style={{marginTop: '10px'}}>Posición: #{posicion}</p>}
                    </div>
                </div>
                
                <div style={{background: 'white', borderRadius: '15px', padding: '20px', marginBottom: '20px'}}>
                    <h3 style={{textAlign: 'center', marginBottom: '15px'}}>🏆 Ranking</h3>
                    {ranking.map((jugador, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px 15px',
                            background: jugador.nombre === nombreAlumno ? '#fef3c7' : '#f3f4f6',
                            borderRadius: '10px',
                            marginBottom: '8px',
                            border: jugador.nombre === nombreAlumno ? '3px solid #fbbf24' : 'none'
                        }}>
                            <span style={{fontWeight: 'bold'}}>
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`} {jugador.nombre}
                            </span>
                            <span style={{fontSize: '1.3rem', fontWeight: 'bold', color: '#667eea'}}>
                                {jugador.puntaje} pts
                            </span>
                        </div>
                    ))}
                </div>
                
                <button 
                    onClick={() => navigate('/')} 
                    style={{
                        width: '100%',
                        padding: '15px',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    Salir
                </button>
            </div>
        );
    }

   
    const preguntaActual = tarea.questions[indiceServer];

    // Si no hay pregunta actual, mostrar esperando
    if (!preguntaActual) {
        return (
            <div className="contenedor-estudiante-vivo espera">
                <h1>⏳ Esperando...</h1>
                <p>El maestro está preparando la siguiente pregunta.</p>
            </div>
        );
    }

    if (respuestaEnviada) {
        return (
            <div className="contenedor-estudiante-vivo espera">
                <h1>✅ Respuesta Enviada</h1>
                <p>Espera a que el maestro cambie la pregunta...</p>
            </div>
        );
    }

    return (
        <div className="contenedor-estudiante-vivo">
            <div className="header-pregunta-movil">Pregunta {indiceServer + 1}</div>
            <h2 style={{textAlign: 'center', margin: '20px', fontSize: '1.5rem'}}>{preguntaActual.question}</h2>
            <div className="grid-botones-movil">
                {preguntaActual.options.map((op, i) => (
                    <button key={i} onClick={() => responder(i)} className={`btn-respuesta color-${i}`}>
                        {op}
                    </button>
                ))}
            </div>
        </div>
    );
};
export default JuegoEnVivoEstudiante;