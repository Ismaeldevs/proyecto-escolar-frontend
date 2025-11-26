import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Contextos/AuthContext';
import { useDatos } from '../../Contextos/DatosContext';
import './GestionAsistencia.css'; 

const GestionAsistencia = () => {
    const { salaId } = useParams();
    const navigate = useNavigate();
    const { maestroActual } = useAuth();
    const { salas, agregarAlumnoLista, obtenerListaAsistencia, eliminarAlumnoLista } = useDatos();
    
    const [nombreNuevo, setNombreNuevo] = useState('');
    const [listaAlumnos, setListaAlumnos] = useState([]);
    const [salaInfo, setSalaInfo] = useState(null);

    useEffect(() => {
        if (!maestroActual) navigate('/ingreso');
        const s = salas.find(s => s.id === parseInt(salaId));
        if (s) setSalaInfo(s);
        cargarLista();
    }, [salaId, salas, maestroActual, navigate]);

    const cargarLista = async () => {
        const data = await obtenerListaAsistencia(salaId);
        setListaAlumnos(data);
    };

    const manejarAgregar = async (e) => {
        e.preventDefault();
        if (!nombreNuevo.trim()) return;
        await agregarAlumnoLista(salaId, nombreNuevo);
        setNombreNuevo('');
        cargarLista();
    };

    const manejarEliminar = async (id) => {
        await eliminarAlumnoLista(id);
        cargarLista();
    };

    return (
        <div className="contenedor-asistencia">
            <div className="encabezado-asistencia">
                <Link to="/escritorio" className="boton-volver">← Volver</Link>
                <h2>📋 Lista de Asistencia</h2>
                {salaInfo && <p className="subtitulo-sala">{salaInfo.schoolName} - {salaInfo.grade}</p>}
            </div>
            <div className="panel-gestion">
                <div className="columna-agregar">
                    <h3>Agregar Alumno</h3>
                    <form onSubmit={manejarAgregar} className="form-agregar-alumno">
                        <input type="text" value={nombreNuevo} onChange={(e) => setNombreNuevo(e.target.value)} placeholder="Nombre y Apellido (Ej: Juan Perez)" className="input-nombre-alumno" />
                        <button type="submit" className="boton-agregar-alumno">Agregar</button>
                    </form>
                    <p className="nota-ayuda">ℹ️ El sistema marcará "Presente" automáticamente cuando el niño envíe una tarea con un nombre similar.</p>
                </div>
                <div className="columna-lista">
                    <h3>Alumnos Registrados ({listaAlumnos.length})</h3>
                    {listaAlumnos.length === 0 ? <p className="vacio">Lista vacía.</p> : (
                        <ul className="lista-visual">
                            {listaAlumnos.map(alumno => (
                                <li key={alumno.id} className={`item-alumno ${alumno.presente ? 'presente' : 'ausente'}`}>
                                    <div className="info-alumno">
                                        <span className="icono-estado">{alumno.presente ? '🟢' : '🔴'}</span>
                                        <span className="nombre-alumno">{alumno.nombre_completo}</span>
                                        <span className="texto-estado">{alumno.presente ? 'PRESENTE' : 'AUSENTE'}</span>
                                    </div>
                                    <button onClick={() => manejarEliminar(alumno.id)} className="boton-borrar-alumno">🗑️</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};
export default GestionAsistencia;