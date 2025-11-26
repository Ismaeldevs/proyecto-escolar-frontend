import React from 'react';
import { Link } from 'react-router-dom';
import '../Style/FormularioTareaBase.css';

const FormularioTareaBase = ({
    titulo, descripcion, salasMaestro, salaIdSeleccionada, setSalaIdSeleccionada,
    limiteTiempo, setLimiteTiempo, tema, setTema, colorPrimario, setColorPrimario,
    fechaLimiteEntrega, setFechaLimiteEntrega, 
    pregunta, setPregunta, opciones, setOpciones, correctOptionIndex, setCorrectOptionIndex, 
    urlMedia, setUrlMedia, tipoMedia, setTipoMedia,
    preguntasTarea, manejarCambioOpcion, manejarAgregarPregunta, manejarEliminarPregunta, 
    manejarEnvio, error, exito, esEdicion, manejarEditarPreguntaEspecifica
}) => {
    
    const obtenerEstiloOpcion = (index) => ({
        borderColor: correctOptionIndex === index ? colorPrimario : '#d1d5db',
        backgroundColor: correctOptionIndex === index ? '#f0fdf4' : 'white'
    });

    // Obtener fecha actual en formato correcto para el input (YYYY-MM-DDTHH:MM)
    const fechaMinima = new Date().toISOString().slice(0, 16);

    return (
        <div className="contenedor-formulario-base">
            <h2 className="titulo-formulario">{titulo}</h2>
            <p className="descripcion-formulario">{descripcion}</p>
            {error && <div className="mensaje-error clase-mb-4">{error}</div>}
            {exito && <div className="mensaje-exito clase-mb-4">{exito}</div>}
            
            <form className="formulario-base">
                <div className="seccion-configuracion">
                    <h3 className="subtitulo-configuracion">⚙️ Configuración General</h3>
                    <div className="clase-mb-4">
                           <label>Sala Asignada</label>
                           <select value={salaIdSeleccionada} onChange={(e) => setSalaIdSeleccionada(parseInt(e.target.value))} disabled={esEdicion} className="input-select">
                                {salasMaestro.map(s => <option key={s.id} value={s.id}>{s.schoolName} - {s.grade}</option>)}
                           </select>
                    </div>
                    
                    {/* FECHA LÍMITE CON VALIDACIÓN */}
                    <div className="clase-mb-4">
                        <label className="etiqueta-input-bold">📅 Fecha Límite de Entrega (Opcional)</label>
                        <input 
                            type="datetime-local" 
                            value={fechaLimiteEntrega} 
                            onChange={(e) => setFechaLimiteEntrega(e.target.value)} 
                            min={fechaMinima} // 🔒 ESTO BLOQUEA FECHAS PASADAS EN EL CALENDARIO
                            className="input-text" 
                        />
                        <p className='texto-ayuda'>Los alumnos no podrán entrar después de esta fecha.</p>
                    </div>

                    <div className='grid-configuracion'>
                        <div>
                            <label>Tiempo (seg)</label>
                            <input type="number" value={limiteTiempo} onChange={(e) => setLimiteTiempo(e.target.value)} className="input-text" min="10" />
                        </div>
                        <div>
                            <label>Tema Visual</label>
                            <select value={tema} onChange={(e) => setTema(e.target.value)} className="input-select">
                                <option value="default">Clásico</option>
                                <option value="colorful">Colorido</option>
                                <option value="dark">Oscuro</option>
                            </select>
                        </div>
                        <div>
                            <label>Color Énfasis</label>
                            {/* 🚨 MODIFICACIÓN: Envolvemos el input para corregir el borde redondo */}
                            <div className='input-color-wrapper'>
                                <input type="color" value={colorPrimario} onChange={(e) => setColorPrimario(e.target.value)} className="input-color" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="seccion-pregunta-individual">
                    <h3 className="titulo-seccion-pregunta">📝 Editor de Pregunta</h3>
                    
                    {/* TEXTO PREGUNTA */}
                    <div className="clase-mb-4">
                        <label className="etiqueta-input-bold">Texto de la Pregunta</label>
                        <textarea value={pregunta} onChange={(e) => setPregunta(e.target.value)} className="input-textarea" placeholder="Ej: ¿Qué animal hace 'Muu'?" />
                    </div>

                    {/* MULTIMEDIA (IMAGEN/VIDEO) */}
                    <div className="contenedor-media-inputs" style={{ marginBottom: '15px', padding: '10px', background: '#f0fdf4', borderRadius: '15px' }}>
                        <label className="etiqueta-input-bold">🖼️ Multimedia (Opcional)</label>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                            <select 
                                value={tipoMedia} 
                                onChange={(e) => setTipoMedia(e.target.value)} 
                                className="input-select"
                                style={{ width: '150px' }}
                            >
                                <option value="none">Sin Media</option>
                                <option value="image">Imagen (URL)</option>
                                <option value="video">Video (YouTube)</option>
                            </select>
                            
                            {tipoMedia !== 'none' && (
                                <input 
                                    type="text" 
                                    value={urlMedia} 
                                    onChange={(e) => setUrlMedia(e.target.value)} 
                                    className="input-text" 
                                    placeholder={tipoMedia === 'image' ? "https://ejemplo.com/imagen.jpg" : "https://youtube.com/watch?v=..."}
                                    style={{ flex: 1 }}
                                />
                            )}
                        </div>
                        {/* PREVISUALIZACIÓN PEQUEÑA */}
                        {tipoMedia === 'image' && urlMedia && (
                            <img src={urlMedia} alt="Previsualización" style={{ marginTop: '10px', maxHeight: '100px', borderRadius: '5px' }} onError={(e) => e.target.style.display='none'} />
                        )}
                    </div>

                    {/* OPCIONES */}
                    <label className="etiqueta-input-bold">Opciones (Marca la correcta)</label>
                    <div className="grid-opciones">
                        {opciones.map((opcion, index) => (
                            <div key={index} className="contenedor-opcion" style={obtenerEstiloOpcion(index)}>
                                <input type="radio" name="correcta" checked={correctOptionIndex === index} onChange={() => setCorrectOptionIndex(index)} className="input-radio" />
                                <input type="text" value={opcion} onChange={(e) => manejarCambioOpcion(index, e.target.value)} className="input-opcion-texto" placeholder={`Opción ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                    <button onClick={manejarAgregarPregunta} type="button" className="boton-agregar-pregunta">⬇️ Agregar/Actualizar Pregunta</button>
                </div>
                
                <div className="seccion-lista-preguntas">
                    <h3 className="titulo-lista-preguntas">Preguntas ({preguntasTarea.length})</h3>
                    {preguntasTarea.length === 0 ? <p className="lista-vacia">Añade preguntas arriba.</p> : (
                        <ul className="lista-preguntas">
                            {preguntasTarea.map((q, index) => (
                                <li key={index} className="item-pregunta">
                                    <div className="texto-pregunta-lista">
                                        <span className='numero-pregunta'>{index + 1}.</span> 
                                        {q.question} {q.media && <span style={{fontSize:'0.8em', color: '#666'}}>({q.media.type === 'image' ? '📷 Imagen' : '🎥 Video'})</span>}
                                    </div>
                                    <div className="acciones-pregunta">
                                        <button type="button" onClick={() => manejarEditarPreguntaEspecifica && manejarEditarPreguntaEspecifica(index)} className="boton-editar-item">✏️</button>
                                        <button type="button" onClick={() => manejarEliminarPregunta(index)} className="boton-eliminar-pregunta">🗑️</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <button onClick={manejarEnvio} type="button" className="boton-guardar-tarea activo">
                    {esEdicion ? '💾 Guardar Cambios' : '💾 Crear Tarea'}
                </button>
            </form>
            <div className="enlace-volver-dashboard">
                <Link to="/escritorio" className="enlace-volver-texto">Volver al Escritorio</Link>
            </div>
        </div>
    );
};

export default FormularioTareaBase;