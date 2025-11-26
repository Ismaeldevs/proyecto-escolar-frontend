import React, { useState, useRef } from 'react';
import '../Style/Colorear.css'; 
import CanvasDrawing from '../componentes/Colorear/CanvasDrawing';
import PaletaDeColor from '../componentes/Colorear/PaletadeColor';
import { templates, stickers } from '../componentes/Colorear/data';
import Header from '../componentes/Header'; 
import Footer from '../componentes/Footer';

const PaginaColorear = () => {

  const [colorActual, setColorActual] = useState('#FF0000');
  const [grosorPincel, setGrosorPincel] = useState(10);
  const [fondoActual, setFondoActual] = useState(null);
  const [stickerActivo, setStickerActivo] = useState(null);
  const [nombreArchivo, setNombreArchivo] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  
 
  const [haIniciado, setHaIniciado] = useState(false);

  const lienzoRef = useRef(null);
  const esGoma = colorActual === '#FFFFFF';

  const guardarDibujo = () => {
    lienzoRef.current?.downloadWithWatermark(nombreArchivo);
  };

  const clickBasura = () => {
    setMostrarModal(true);
  };

  const confirmarBorrado = () => {
    lienzoRef.current?.clearCanvas();
    setMostrarModal(false);
  };

  const seleccionarColor = (color) => {
    setColorActual(color);
    setStickerActivo(null);
  };

 
  const iniciarLienzoBlanco = () => {
    setFondoActual(null);
    setHaIniciado(true); 
  };

  const irAGaleria = () => {
    const galeria = document.getElementById('galeria-dibujos');
    if (galeria) galeria.scrollIntoView({ behavior: 'smooth' });
  };

  const seleccionarDibujoDeGaleria = (url) => {
    setFondoActual(url);
    setHaIniciado(true); 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const capitalizar = (s) => s.charAt(0).toUpperCase() + s.slice(1);


  return (
    <>
 
      <Header />

      <div className="pagina-colorear">
        
        {!haIniciado ? (
          
          <div className="pantalla-bienvenida">
            <h1 className="titulo-bienvenida">¡Hola Pequeño Artista! 👋</h1>
            <p className="texto-bienvenida">
              ¿Qué te gustaría crear hoy? Puedes usar una hoja en blanco o elegir un dibujo mágico de abajo.
            </p>
            
            <div className="opciones-bienvenida">
              <div className="boton-inicio" onClick={iniciarLienzoBlanco}>
                <span className="icono-grande">📝</span>
                <span className="texto-boton">Hoja en Blanco</span>
              </div>

              <div className="boton-inicio" onClick={irAGaleria}>
                <span className="icono-grande">🖼️</span>
                <span className="texto-boton">Ver Dibujos</span>
              </div>
            </div>
          </div>

        ) : (
          
          <>
            <h1 className="titulo-pagina">🎨 ¡Zona Creativa! 🎨</h1>

            <PaletaDeColor 
              onColorSelect={seleccionarColor} 
              activeColor={stickerActivo ? null : colorActual}
              onBrushSizeSelect={setGrosorPincel}
              activeBrushSize={grosorPincel}
            />

            <div className="contenedor-espacio-trabajo">
              

              <div className="area-lienzo">
                {stickerActivo && <div className="alerta-sticker">Modo Sticker: {stickerActivo}</div>}
                
                <div className="barra-flotante">
                  <button 
                    onClick={() => lienzoRef.current?.undo()} 
                    className="boton-flotante boton-deshacer" 
                    title="Deshacer"
                  >
                    ↩️
                  </button>
                </div>

                <CanvasDrawing 
                  ref={lienzoRef}
                  selectedColor={colorActual} 
                  brushSize={grosorPincel}
                  isEraser={esGoma}
                  backgroundUrl={fondoActual}
                  activeSticker={stickerActivo}
                />

                <div className="controles-lienzo-inferior">
                  <div className="controles-guardar">
                    <input 
                      type="text" 
                      placeholder="Nombre de tu obra..." 
                      value={nombreArchivo} 
                      onChange={(e) => setNombreArchivo(e.target.value)}
                      className="input-nombre-archivo"
                    />
                    <button onClick={guardarDibujo} className="boton-accion boton-guardar">💾 Guardar</button>
                    <button onClick={clickBasura} className="boton-accion boton-borrar">🗑️</button>
                  </div>
                </div>
              </div>

              <div className="barra-lateral-stickers">
                <h3>Stickers</h3>
                <div className="lista-stickers">
                  {stickers.map((sticker, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setStickerActivo(sticker)}
                      className={`boton-sticker ${stickerActivo === sticker ? 'activo' : ''}`}
                    >
                      {sticker}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}


        <div className="contenedor-biblioteca" id="galeria-dibujos">
          
          <div className="opcion-lienzo-blanco" onClick={iniciarLienzoBlanco}>
            <div className="icono-blanco">⬜</div>
            <h3>Hoja en Blanco</h3>
          </div>

          {Object.keys(templates).map((cat) => (
            <div key={cat} className="seccion-categoria">
              <h2 className="titulo-categoria">✨ {capitalizar(cat)}</h2>
              <div className="fila-dibujos">
                {templates[cat].map((item) => (
                  <div 
                    key={item.id} 
                    className="tarjeta-dibujo" 
                    onClick={() => seleccionarDibujoDeGaleria(item.url)}
                  >
                    <img src={item.url} alt={item.name} />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>


        {mostrarModal && (
          <div className="modal-fondo">
            <div className="modal-contenido">
              <h3>¿Borrar todo?</h3>
              <div className="modal-botones">
                <button onClick={() => setMostrarModal(false)} className="boton-modal boton-cancelar">
                  Cancelar
                </button>
                <button onClick={confirmarBorrado} className="boton-modal boton-confirmar">
                  ¡Sí, borrar!
                </button>
              </div>
            </div>
          </div>
          
        )}

      </div> 
      

      <Footer />
    </>
  );
};

export default PaginaColorear;