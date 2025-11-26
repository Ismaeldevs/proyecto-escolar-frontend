import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../Contextos/AuthContext';
import { useDatos } from '../../Contextos/DatosContext';
import FormularioTareaBase from '../../componentes/FormularioTareaBase';
import './EditarTarea.css';

const MaestroEditarTarea = () => {
    const navigate = useNavigate();
    const { roomId: urlRoomId, taskId: urlTaskId } = useParams();
    const { maestroActual } = useAuth();
    const { salas, editarTareaEnSala } = useDatos();
    
    const roomId = parseInt(urlRoomId);
    const taskId = parseInt(urlTaskId);
    const room = salas.find(r => r.id === roomId);
    const tareaAEditar = room?.tasks.find(t => t.id === taskId);
    
    const [salaIdSeleccionada, setSalaIdSeleccionada] = useState(roomId); 
    const [limiteTiempo, setLimiteTiempo] = useState(tareaAEditar?.timeLimit || 300);
    const [tema, setTema] = useState(tareaAEditar?.style?.theme || 'default');
    const [colorPrimario, setColorPrimario] = useState(tareaAEditar?.style?.primaryColor || '#4f46e5'); 
    
    // Formatear fecha para input datetime-local (YYYY-MM-DDTHH:MM)
    const formatFecha = (fecha) => fecha ? new Date(fecha).toISOString().slice(0, 16) : '';
    const [fechaLimiteEntrega, setFechaLimiteEntrega] = useState(formatFecha(tareaAEditar?.submissionDeadline)); 
    
    const [preguntasTarea, setPreguntasTarea] = useState(() => {
        const q = tareaAEditar?.questions;
        if (!q) return [];
        if (Array.isArray(q)) return q;
        try { return JSON.parse(q); } catch (e) { return []; }
    }); 

    const [pregunta, setPregunta] = useState('');
    const [opciones, setOpciones] = useState(['', '', '', '']);
    const [correctOptionIndex, setCorrectOptionIndex] = useState(0); 
    const [urlMedia, setUrlMedia] = useState('');
    const [tipoMedia, setTipoMedia] = useState('none');
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');
    
    useEffect(() => { if (!maestroActual || !tareaAEditar) navigate('/escritorio'); }, [maestroActual, tareaAEditar, navigate]);

    if (!maestroActual || !tareaAEditar) return null;
    
    const manejarCambioOpcion = (i, v) => { const n = [...opciones]; n[i] = v; setOpciones(n); };
    
    const manejarAgregarPregunta = (e) => {
        e.preventDefault(); setError('');
        if (!pregunta || opciones.some(opt => opt.trim() === '')) { setError('Completa todo.'); return; }
        const nueva = {
            id: Date.now(), question: pregunta, options: opciones, correctOptionIndex,
            media: tipoMedia !== 'none' && urlMedia ? { type: tipoMedia, url: urlMedia } : null,
        };
        setPreguntasTarea(prev => [...prev, nueva]);
        setPregunta(''); setOpciones(['', '', '', '']); setUrlMedia(''); setTipoMedia('none');
    };

    const manejarEliminarPregunta = (index) => setPreguntasTarea(prev => prev.filter((_, i) => i !== index));

    const manejarEditarPreguntaEspecifica = (index) => {
        const p = preguntasTarea[index];
        if (!p) return;
        setPregunta(p.question); setOpciones(p.options); setCorrectOptionIndex(p.correctOptionIndex);
        if (p.media) { setTipoMedia(p.media.type); setUrlMedia(p.media.url); }
        else { setTipoMedia('none'); setUrlMedia(''); }
        manejarEliminarPregunta(index);
    };

    const manejarEnvio = async (e) => {
        e.preventDefault(); setError(''); setExito('');
        if (preguntasTarea.length === 0) { setError('Faltan preguntas.'); return; }
        
        // 🔒 VALIDACIÓN FECHA PASADA
        if (fechaLimiteEntrega) {
            if (new Date(fechaLimiteEntrega) < new Date()) {
                setError('⛔ La fecha límite no puede ser en el pasado.');
                return;
            }
        }

        const datosActualizados = {
            questions: preguntasTarea,
            timeLimit: parseInt(limiteTiempo, 10), 
            style: { theme: tema, primaryColor: colorPrimario },
            submissionDeadline: fechaLimiteEntrega || null,
        };
        
        const resultado = await editarTareaEnSala(roomId, taskId, datosActualizados);
        
        if (resultado.success) {
            setExito(`¡Tarea actualizada!`);
            setTimeout(() => navigate('/escritorio'), 2000);
        } else {
            setError('Error guardando.');
        }
    };
    
    return (
        <FormularioTareaBase
            titulo={`✏️ Editar Tarea`} descripcion="Modifica las preguntas."
            salasMaestro={salas.filter(s => s.teacherId === maestroActual.id)}
            salaIdSeleccionada={salaIdSeleccionada} setSalaIdSeleccionada={setSalaIdSeleccionada} 
            limiteTiempo={limiteTiempo} setLimiteTiempo={setLimiteTiempo}
            tema={tema} setTema={setTema} colorPrimario={colorPrimario} setColorPrimario={setColorPrimario}
            fechaLimiteEntrega={fechaLimiteEntrega} setFechaLimiteEntrega={setFechaLimiteEntrega}
            pregunta={pregunta} setPregunta={setPregunta}
            opciones={opciones} setOpciones={setOpciones} correctOptionIndex={correctOptionIndex} setCorrectOptionIndex={setCorrectOptionIndex}
            urlMedia={urlMedia} setUrlMedia={setUrlMedia} tipoMedia={tipoMedia} setTipoMedia={setTipoMedia}
            preguntasTarea={preguntasTarea}
            manejarCambioOpcion={manejarCambioOpcion} manejarAgregarPregunta={manejarAgregarPregunta}
            manejarEliminarPregunta={manejarEliminarPregunta} manejarEnvio={manejarEnvio}
            manejarEditarPreguntaEspecifica={manejarEditarPreguntaEspecifica}
            error={error} exito={exito} esEdicion={true}
        />
    );
}

export default MaestroEditarTarea;