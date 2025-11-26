import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../Contextos/AuthContext';
import { useDatos } from '../../Contextos/DatosContext';
import FormularioTareaBase from '../../componentes/FormularioTareaBase';


const MaestroCrearJuego = () => {
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
    const [limiteTiempo, setLimiteTiempo] = useState(30); 
    const [tema, setTema] = useState('colorful'); 
    const [colorPrimario, setColorPrimario] = useState('#ec4899'); // Rosa Kahoot
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

    const manejarCambioOpcion = (i, v) => { const n = [...opciones]; n[i] = v; setOpciones(n); };
    
    const manejarAgregarPregunta = (e) => {
        e.preventDefault(); setError('');
        if (!pregunta || opciones.some(opt => opt.trim() === '')) { setError('Completa todo.'); return; }
        const nueva = {
            id: Date.now(), question: pregunta, options: opciones, correctOptionIndex,
            media: tipoMedia !== 'none' ? { type: tipoMedia, url: urlMedia } : null,
        };
        setPreguntasTarea(prev => [...prev, nueva]);
        setPregunta(''); setOpciones(['', '', '', '']); setUrlMedia(''); setTipoMedia('none');
    };

    const manejarEliminarPregunta = (i) => setPreguntasTarea(prev => prev.filter((_, idx) => idx !== i));
    
    
    const manejarEditarPreguntaEspecifica = (index) => {
        const p = preguntasTarea[index];
        if (!p) return;
        setPregunta(p.question); 
        setOpciones(p.options); 
        setCorrectOptionIndex(p.correctOptionIndex);
        if (p.media) { 
            setTipoMedia(p.media.type); 
            setUrlMedia(p.media.url); 
        } else { 
            setTipoMedia('none'); 
            setUrlMedia(''); 
        }
   
        manejarEliminarPregunta(index);
    };

    const manejarEnvio = async (e) => {
        e.preventDefault(); setError(''); setExito('');
        if (preguntasTarea.length === 0) { setError('Faltan preguntas.'); return; }
        
        const datosJuego = {
            questions: preguntasTarea,
            timeLimit: parseInt(limiteTiempo, 10), 
            style: { theme: tema, primaryColor: colorPrimario },
            submissionDeadline: null,
        };
        
        
        const resultado = await agregarTareaASala(salaIdSeleccionada, datosJuego, 'juego');
        
        if (resultado.success) {
            setExito(`¡Juego creado!`);
            setTimeout(() => navigate('/escritorio'), 2000);
        } else {
            setError('Error al crear.');
        }
    };

    return (
        <FormularioTareaBase
            titulo="🎮 Crear Juego en Vivo (Estilo Kahoot)"
            descripcion="Preguntas rápidas y coloridas para proyectar en clase."
            salasMaestro={salasMaestro} salaIdSeleccionada={salaIdSeleccionada} setSalaIdSeleccionada={setSalaIdSeleccionada}
            limiteTiempo={limiteTiempo} setLimiteTiempo={setLimiteTiempo}
            tema={tema} setTema={setTema} colorPrimario={colorPrimario} setColorPrimario={setColorPrimario}
            fechaLimiteEntrega="" setFechaLimiteEntrega={() => {}} 
            pregunta={pregunta} setPregunta={setPregunta}
            opciones={opciones} setOpciones={setOpciones} correctOptionIndex={correctOptionIndex} setCorrectOptionIndex={setCorrectOptionIndex}
            urlMedia={urlMedia} setUrlMedia={setUrlMedia} tipoMedia={tipoMedia} setTipoMedia={setTipoMedia}
            preguntasTarea={preguntasTarea}
            manejarCambioOpcion={manejarCambioOpcion} manejarAgregarPregunta={manejarAgregarPregunta}
            manejarEliminarPregunta={manejarEliminarPregunta}
            manejarEditarPreguntaEspecifica={manejarEditarPreguntaEspecifica} 
            manejarEnvio={manejarEnvio} error={error} exito={exito} esEdicion={false}
        />
    );
};

export default MaestroCrearJuego;