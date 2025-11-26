import React, { useRef, useEffect, useImperativeHandle, forwardRef, useState } from 'react';
import { siteConfig } from './data';

const cursorGoma = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" style="font-size:24px"><text y="22">🧼</text></svg>') 16 16, auto`;

const CanvasDrawing = forwardRef(({ selectedColor, brushSize, isEraser, backgroundUrl, activeSticker }, ref) => {
  const lienzoDibujoRef = useRef(null); 
  const lienzoPlantillaRef = useRef(null);
  const estaDibujando = useRef(false);

  // Historial
  const [historialLienzo, setHistorialLienzo] = useState([]);
  const [punteroHistorial, setPunteroHistorial] = useState(-1);
  
  // Dimensiones Fijas (Alta Calidad)
  const anchoInterno = 800;
  const altoInterno = 500;

  // --- CÁLCULO DE COORDENADAS ---
  const obtenerCoordenadas = (e) => {
    const lienzo = lienzoDibujoRef.current;
    if (!lienzo) return { x: 0, y: 0 };

    const rect = lienzo.getBoundingClientRect();
    
    let clienteX, clienteY;
    if (e.touches && e.touches[0]) {
      clienteX = e.touches[0].clientX;
      clienteY = e.touches[0].clientY;
    } else {
      clienteX = e.clientX;
      clienteY = e.clientY;
    }

    const xVisual = clienteX - rect.left;
    const yVisual = clienteY - rect.top;

    const x = xVisual * (lienzo.width / rect.width);
    const y = yVisual * (lienzo.height / rect.height);

    return { x, y };
  };

  // --- CARGAR PLANTILLA ---
  const cargarPlantilla = (url) => {
    const lienzo = lienzoPlantillaRef.current;
    if (!lienzo) return;
    const ctx = lienzo.getContext('2d');
    
    ctx.clearRect(0, 0, lienzo.width, lienzo.height);

    if (!url) return;

    const img = new Image();
    img.src = url;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const escala = Math.min(lienzo.width / img.width, lienzo.height / img.height) * 0.98;
      const x = (lienzo.width / 2) - (img.width / 2) * escala;
      const y = (lienzo.height / 2) - (img.height / 2) * escala;
      ctx.drawImage(img, x, y, img.width * escala, img.height * escala);
    };
  };

  // --- HISTORIAL ---
  const guardarEstado = () => {
    const lienzo = lienzoDibujoRef.current;
    if (!lienzo) return;
    const estadoActual = lienzo.toDataURL();
    setHistorialLienzo(prev => [...prev.slice(0, punteroHistorial + 1), estadoActual]);
    setPunteroHistorial(prev => prev + 1);
  };

  // --- MÉTODOS EXPUESTOS ---
  useImperativeHandle(ref, () => ({
    clearCanvas() {
      const ctx = lienzoDibujoRef.current.getContext('2d');
      ctx.clearRect(0, 0, anchoInterno, altoInterno);
      guardarEstado();
    },
    undo() {
      if (punteroHistorial > 0) {
        setPunteroHistorial(prev => prev - 1);
        const img = new Image();
        img.src = historialLienzo[punteroHistorial - 1];
        img.onload = () => {
          const ctx = lienzoDibujoRef.current.getContext('2d');
          ctx.clearRect(0, 0, anchoInterno, altoInterno);
          ctx.drawImage(img, 0, 0);
        };
      }
    },
    downloadWithWatermark(nombreArchivo) {
       const lienzoTemp = document.createElement('canvas');
       lienzoTemp.width = anchoInterno;
       lienzoTemp.height = altoInterno;
       const ctx = lienzoTemp.getContext('2d');
       
       ctx.fillStyle = 'white';
       ctx.fillRect(0,0, lienzoTemp.width, lienzoTemp.height);
       ctx.drawImage(lienzoDibujoRef.current, 0, 0);
       ctx.drawImage(lienzoPlantillaRef.current, 0, 0);
       
       ctx.save();
       ctx.globalAlpha = 0.5;
       ctx.font = "bold 20px Arial";
       ctx.fillStyle = "#333";
       ctx.textAlign = "right";
       ctx.fillText(siteConfig.watermarkText, lienzoTemp.width - 20, lienzoTemp.height - 20);
       ctx.restore();

       const link = document.createElement('a');
       link.download = `${nombreArchivo || 'dibujo'}.png`;
       link.href = lienzoTemp.toDataURL();
       document.body.appendChild(link);
       link.click();
       document.body.removeChild(link);
    }
  }));

  // --- EFECTOS ---
  useEffect(() => {
    cargarPlantilla(backgroundUrl);
    const ctx = lienzoDibujoRef.current.getContext('2d');
    ctx.clearRect(0, 0, anchoInterno, altoInterno);
    setHistorialLienzo([]);
    setPunteroHistorial(-1);
    guardarEstado();
  }, [backgroundUrl]);

  // --- DIBUJO ---
  const empezarDibujo = (e) => {
    if(e.cancelable) e.preventDefault();
    const ctx = lienzoDibujoRef.current.getContext('2d');
    const { x, y } = obtenerCoordenadas(e);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = selectedColor;

    if (activeSticker) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.font = `${brushSize * 3}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(activeSticker, x, y);
      guardarEstado();
    } else {
      estaDibujando.current = true;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
    }
  };

  const moverDibujo = (e) => {
    if(e.cancelable) e.preventDefault();
    if (!estaDibujando.current || activeSticker) return;
    
    const ctx = lienzoDibujoRef.current.getContext('2d');
    const { x, y } = obtenerCoordenadas(e);
    
    ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const terminarDibujo = () => {
    if (estaDibujando.current) {
      lienzoDibujoRef.current.getContext('2d').closePath();
      guardarEstado();
    }
    estaDibujando.current = false;
    if(lienzoDibujoRef.current) 
        lienzoDibujoRef.current.getContext('2d').globalCompositeOperation = 'source-over';
  };

  return (
    <div className="contenedor-lienzo"> 
      {/* Capa 1: Dibujo */}
      <canvas
        ref={lienzoDibujoRef}
        className="capa-lienzo capa-dibujo"
        width={anchoInterno}
        height={altoInterno}
        onMouseDown={empezarDibujo} onMouseMove={moverDibujo} onMouseUp={terminarDibujo} onMouseLeave={terminarDibujo}
        onTouchStart={empezarDibujo} onTouchMove={moverDibujo} onTouchEnd={terminarDibujo}
        style={{ cursor: activeSticker ? 'copy' : (isEraser ? cursorGoma : 'crosshair') }}
      />
      
      {/* Capa 2: Plantilla */}
      <canvas
        ref={lienzoPlantillaRef}
        className="capa-lienzo capa-plantilla"
        width={anchoInterno}
        height={altoInterno}
      />
    </div>
  );
});

export default CanvasDrawing;