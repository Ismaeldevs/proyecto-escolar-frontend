import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../Contextos/AuthContext';
import { useDatos } from '../../Contextos/DatosContext';
import FormularioTareaBase from '../../componentes/FormularioTareaBase';
import './CrearTarea.css';

const MaestroCrearTarea = () => {
    const navigate = useNavigate();
    const { maestroActual } = useAuth();
    const { salas, agregarTareaASala } = useDatos();

    const [pregunta, setPregunta] = useState('');
    const [opciones, setOpciones] = useState(['', '', '', '']);
    const [correctOptionIndex, setCorrectOptionIndex] = useState(0); 
    const [urlMedia, setUrlMedia] = useState('');
    const [tipoMedia, setTipoMedia] = useState('none');
    const [preguntasTarea, setPreguntasTarea] = useState([]); 

    const [salaIdSeleccionada, setSalaIdSeleccionada] = useState('');
    const [limiteTiempo, setLimiteTiempo] = useState(300);
    const [tema, setTema] = useState('default');
    const [colorPrimario, setColorPrimario] = useState('#4f46e5'); 
    const [fechaLimiteEntrega, setFechaLimiteEntrega] = useState('');
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');

    useEffect(() => { if (!maestroActual) navigate('/ingreso'); }, [maestroActual, navigate]);
    
    const salasMaestro = useMemo(() => {
        if (!maestroActual) return [];
        return salas.filter(sala => sala.teacherId === maestroActual.id);
    }, [salas, maestroActual]);
    
    useEffect(() => {
        if (salasMaestro.length > 0 && !salaIdSeleccionada) setSalaIdSeleccionada(salasMaestro[0].id);
    }, [salasMaestro, salaIdSeleccionada]);

    if (!maestroActual) return null;
    if (salasMaestro.length === 0) {
        return (
            <div className="pagina-crear-tarea">
                <div className="contenedor-alerta">
                    <Link to="/crear-sala" className="alerta-link-mascota">
                        <img 
                            src="./imagenmascota/nohaysalas.png" 
                            alt="Mascota invitando a crear sala" 
                            className="alerta-imagen-mascota"
                        />
                        <div className="alerta-texto-instruccion">
                            Haz clic sobre mi, y crea tu primera sala!
                        </div>
                    </Link>
                </div>
            </div>
        );
    }
    
    const manejarCambioOpcion = (i, v) => { const n = [...opciones]; n[i] = v; setOpciones(n); };
    
    const manejarAgregarPregunta = (e) => {
        e.preventDefault(); setError('');
        if (!pregunta || opciones.some(opt => opt.trim() === '')) { setError('Completa pregunta y opciones.'); return; }
        
      
        const nueva = {
            id: Date.now(), question: pregunta, options: opciones, correctOptionIndex,
            media: tipoMedia !== 'none' && urlMedia ? { type: tipoMedia, url: urlMedia } : null,
        };
        setPreguntasTarea(prev => [...prev, nueva]);
        setPregunta(''); setOpciones(['', '', '', '']); setUrlMedia(''); setTipoMedia('none');
    };

    const manejarEliminarPregunta = (index) => {
        setPreguntasTarea(prev => prev.filter((_, i) => i !== index));
    };

    const manejarEditarPreguntaEspecifica = (index) => {
        const p = preguntasTarea[index];
        setPregunta(p.question); setOpciones(p.options); setCorrectOptionIndex(p.correctOptionIndex);
        if (p.media) { setTipoMedia(p.media.type); setUrlMedia(p.media.url); } 
        else { setTipoMedia('none'); setUrlMedia(''); }
        manejarEliminarPregunta(index);
    };

    const manejarEnvio = async (e) => {
        e.preventDefault(); setError(''); setExito('');
        if (preguntasTarea.length === 0) { setError('Añade al menos una pregunta.'); return; }
        
    
        if (fechaLimiteEntrega) {
            const fechaSeleccionada = new Date(fechaLimiteEntrega);
            const ahora = new Date();
            if (fechaSeleccionada < ahora) {
                setError('⛔ La fecha límite no puede ser en el pasado.');
                return;
            }
        }

        const datosTarea = {
            id: Date.now(), 
            questions: preguntasTarea, 
            timeLimit: parseInt(limiteTiempo, 10), 
            style: { theme: tema, primaryColor: colorPrimario },
            submissionDeadline: fechaLimiteEntrega || null, 
            studentProgress: [],
            tipo: 'juego'
        };
        
        const resultado = await agregarTareaASala(salaIdSeleccionada, datosTarea);
        if (resultado.success) {
            setExito(`¡Tarea creada!`);
            setPreguntasTarea([]); setPregunta(''); setLimiteTiempo(300); setFechaLimiteEntrega('');
            setTimeout(() => setExito(''), 3000);
        } else {
            setError('Error al crear.');
        }
    };

    return (
        <FormularioTareaBase
            titulo="➕ Crear Examen" descripcion="Configura preguntas y multimedia."
            salasMaestro={salasMaestro} salaIdSeleccionada={salaIdSeleccionada} setSalaIdSeleccionada={setSalaIdSeleccionada}
            limiteTiempo={limiteTiempo} setLimiteTiempo={setLimiteTiempo}
            tema={tema} setTema={setTema} colorPrimario={colorPrimario} setColorPrimario={setColorPrimario}
            fechaLimiteEntrega={fechaLimiteEntrega} setFechaLimiteEntrega={setFechaLimiteEntrega}
            pregunta={pregunta} setPregunta={setPregunta}
            opciones={opciones} setOpciones={setOpciones} correctOptionIndex={correctOptionIndex} setCorrectOptionIndex={setCorrectOptionIndex}
            urlMedia={urlMedia} setUrlMedia={setUrlMedia} tipoMedia={tipoMedia} setTipoMedia={setTipoMedia}
            preguntasTarea={preguntasTarea}
            manejarCambioOpcion={manejarCambioOpcion} manejarAgregarPregunta={manejarAgregarPregunta}
            manejarEliminarPregunta={manejarEliminarPregunta} manejarEditarPreguntaEspecifica={manejarEditarPreguntaEspecifica}
            manejarEnvio={manejarEnvio} error={error} exito={exito} esEdicion={false}
        />
    );
};

export default MaestroCrearTarea;