import React, { createContext, useState, useContext, useCallback } from 'react';
import { generarCodigoSala } from '../Logica/utilidades';
import { socket } from '../socket/socket'; 

const DatosContext = createContext();

export const useDatos = () => useContext(DatosContext);

export const DatosProvider = ({ children }) => {
    const [salas, setSalas] = useState([]);

    const cargarDatosMaestro = useCallback(async (maestroId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/datos-maestro/${maestroId}`);
            if (response.ok) {
                const data = await response.json();
                setSalas(data);
            }
        } catch (error) { console.error("Error cargando datos:", error); }
    }, []);

    const crearSala = async (teacherId, schoolName, grade) => {
        const codigo = generarCodigoSala();
        try {
            const response = await fetch('http://localhost:3000/api/crear-sala', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ maestroId: teacherId, schoolName, grade, roomCode: codigo })
            });
            const data = await response.json();
            if (data.success) {
                try { await cargarDatosMaestro(teacherId); } catch (e) {}
                socket.emit('maestro:salaCreada', { maestroId: teacherId, salaId: data.salaId });
                return { success: true, room: { roomCode: codigo } };
            }
            return { success: false, message: data.message };
        } catch (error) { return { success: false, message: "Error conexión" }; }
    };

    const agregarTareaASala = async (salaId, datosTarea, tipo = 'tarea') => {
        try {
            const response = await fetch('http://localhost:3000/api/crear-tarea', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    salaId, 
                    questions: datosTarea.questions,
                    timeLimit: datosTarea.timeLimit,
                    style: datosTarea.style,
                    submissionDeadline: datosTarea.submissionDeadline,
                    tipo: tipo
                })
            });
            const data = await response.json();
            if (data.success) {
                socket.emit('maestro:tareaCreada', { salaId, tareaId: data.tareaId, tasks: data.tasks });
                return { success: true };
            }
        } catch {} 
        return { success: false };
    };

    const editarTareaEnSala = async (salaId, tareaId, datosActualizados) => {
        try {
            const response = await fetch('http://localhost:3000/api/actualizar-tarea', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tareaId, questions: datosActualizados.questions, timeLimit: datosActualizados.timeLimit, style: datosActualizados.style, submissionDeadline: datosActualizados.submissionDeadline })
            });
            const data = await response.json();
            if (data.success) return { success: true };
            return { success: false };
        } catch (error) { return { success: false }; }
    };

    const eliminarTarea = async (tareaId, maestroId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/eliminar-tarea/${tareaId}`, { method: 'DELETE' });
            const data = await response.json();
            if (data.success) { await cargarDatosMaestro(maestroId); return { success: true }; }
            return { success: false };
        } catch (error) { return { success: false }; }
    };

    const eliminarSala = async (salaId, maestroId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/eliminar-sala/${salaId}`, { method: 'DELETE' });
            const data = await response.json();
            if (data.success) { await cargarDatosMaestro(maestroId); return { success: true }; }
            return { success: false };
        } catch (error) { return { success: false }; }
    };

    const agregarAlumnoLista = async (salaId, nombreCompleto) => {
        try {
            const response = await fetch('http://localhost:3000/api/agregar-alumno-lista', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ salaId, nombreCompleto })
            });
            const data = await response.json();
            if (data.success) {
                socket.emit('maestro:alumnoAgregado', { salaId, nombreCompleto });
            }
            return { success: true };
        } catch (e) { return { success: false }; }
    };

    const obtenerListaAsistencia = async (salaId) => {
        try {
            const res = await fetch(`http://localhost:3000/api/lista-asistencia/${salaId}`);
            return await res.json();
        } catch (e) { return []; }
    };

    const eliminarAlumnoDeLista = async (id) => {
        try {
            await fetch(`http://localhost:3000/api/eliminar-alumno-lista/${id}`, { method: 'DELETE' });
            return { success: true };
        } catch (e) { return { success: false }; }
    };

    const buscarSalaEstudiante = async (codigoSala) => {
        try {
            const response = await fetch('http://localhost:3000/api/estudiante/ingresar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ codigoSala })
            });
            return await response.json(); 
        } catch (error) { return { success: false, message: "Error conexión" }; }
    };

    const enviarRespuestasAlumno = async (salaId, tareaId, nombre, avatar, respuestas) => {
        const aciertos = respuestas.filter(r => r.isCorrect).length;
        try {
            const response = await fetch('http://localhost:3000/api/estudiante/enviar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tareaId, nombre, avatar, puntaje: aciertos, respuestas })
            });
            const data = await response.json();
            if (data.success) {
                socket.emit('estudiante:entregaTarea', { tareaId, nombreAlumno: nombre, puntaje: aciertos });
            }
            return data;
        } catch (error) { return { success: false }; }
    };

    return (
        <DatosContext.Provider value={{ 
            salas, cargarDatosMaestro, crearSala, agregarTareaASala, editarTareaEnSala, eliminarTarea, eliminarSala,
            buscarSalaEstudiante, enviarRespuestasAlumno,
            agregarAlumnoLista, obtenerListaAsistencia, eliminarAlumnoLista 
        }}>
            {children}
        </DatosContext.Provider>
    );
};