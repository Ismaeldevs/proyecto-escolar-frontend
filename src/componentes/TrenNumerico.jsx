import React, { useState, useRef } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';

import './TrenNumerico.css';

const NIVELES = [
  { titulo: 'Ordena los numeros de mayor a menor', id: 1, vagones: [5, 2, 8, 3], solucion: [8, 5, 3, 2] },
  { titulo: 'Ordena los numeros del 1 al 5', id: 2, vagones: [3, 1, 5, 2, 4], solucion: [1, 2, 3, 4, 5] },
  { titulo: 'Ordena los numeros de 5 en 5', id: 3, vagones: [20, 5, 15, 10, 25], solucion: [5, 10, 15, 20, 25] },
  { titulo: 'Ordena los numeros de 10 en 10', id: 4, vagones: [20, 10, 30, 50, 40], solucion: [10, 20, 30, 40, 50] },
  { titulo: 'Ordena los numeros de menor a mayor', id: 5, vagones: [12, 9, 15, 7, 11], solucion: [7, 9, 11, 12, 15] },
];

function Vagon({ numero, estaEnTren, isDragging }) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: numero });
  const style = { opacity: isDragging ? 0.5 : 1 };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`vagon ${estaEnTren ? 'vagon-en-tren' : 'vagon-disponible'}`}
    >
      <span className="vagon-numero">{numero}</span>
    </div>
  );
}

function ZonaTren({ children, isError, haGanado }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'zona-tren' });
  const clases = `zona-tren ${isOver ? 'zona-over' : ''} ${isError ? 'shake' : ''} ${
    haGanado ? 'juego-ganado' : ''
  }`;
  return (
    <div ref={setNodeRef} className={clases}>
      <div className="locomotora"></div>
      {children}
    </div>
  );
}

export default function TrenNumerico() {
  const [gameStatus, setGameStatus] = useState('menu');
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [vagonesDisponibles, setVagonesDisponibles] = useState(NIVELES[0].vagones);
  const [vagonesEnTren, setVagonesEnTren] = useState([]);
  const [siguienteIndice, setSiguienteIndice] = useState(0);
  const [isError, setIsError] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [haGanadoNivel, setHaGanadoNivel] = useState(false);

  const sonidoCorrectoRef = useRef(null);
  const sonidoChuchuRef = useRef(null);

  function cargarNivel(index) {
    if (index >= NIVELES.length) return setGameStatus('allComplete');
    setCurrentLevelIndex(index);
    setVagonesDisponibles(NIVELES[index].vagones);
    setVagonesEnTren([]);
    setSiguienteIndice(0);
    setIsError(false);
    setHaGanadoNivel(false);
    setGameStatus('playing');
  }

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  function handleDragEnd({ active, over }) {
    setActiveId(null);
    setIsError(false);
    if (!over || over.id !== 'zona-tren') return;

    const numeroArrastrado = active.id;
    const solucion = NIVELES[currentLevelIndex].solucion;

    if (numeroArrastrado === solucion[siguienteIndice]) {
      sonidoCorrectoRef.current?.play();
      setVagonesEnTren((prev) => [...prev, numeroArrastrado]);
      setVagonesDisponibles((prev) => prev.filter((n) => n !== numeroArrastrado));

      const nuevoIndice = siguienteIndice + 1;
      setSiguienteIndice(nuevoIndice);

      if (nuevoIndice === solucion.length) {
        sonidoChuchuRef.current?.play();
        setHaGanadoNivel(true);
        setTimeout(() => setGameStatus('levelComplete'), 2500);
      }
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 500);
    }
  }

  const renderJuego = () => (
    <div className="tren-numerico-body">
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
        modifiers={[restrictToWindowEdges]}
      >
        <div className="juego-tren-container">
          <div className="juego-header">
            <h2>
              Nivel {NIVELES[currentLevelIndex].id}: {NIVELES[currentLevelIndex].titulo}
            </h2>
          </div>

          <ZonaTren isError={isError} haGanado={haGanadoNivel}>
            {vagonesEnTren.map((num) => (
              <Vagon key={num} numero={num} estaEnTren={true} />
            ))}
          </ZonaTren>

          {haGanadoNivel && <div className="mensaje-ganador">¡Chuuuu-chuuu!🎉</div>}

          <div className="zona-vagones-disponibles">
            <h3>Vagones disponibles:</h3>
            <div className="vagones-wrapper">
              {vagonesDisponibles.map((num) => (
                <Vagon
                  key={num}
                  numero={num}
                  estaEnTren={false}
                  isDragging={activeId === num}
                />
              ))}
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeId && (
            <div className="vagon vagon-flotante">
              <span className="vagon-numero">{activeId}</span>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <audio ref={sonidoCorrectoRef} src="/sounds/correct.mp3" preload="auto" />
      <audio ref={sonidoChuchuRef} src="./audio/trensonido.mp3" preload="auto" />
    </div>
  );

  if (gameStatus === 'menu') {
    return (
      <div className="tren-numerico-body">
        <div className="pantalla-menu">
          <h1 className="titulo-juego">El Tren Numérico</h1>
          <div className="locomotora-menu"></div>
          <p>¡Ayuda a ordenar los vagones del tren!</p>
          <button className="boton-jugar" onClick={() => cargarNivel(0)}>
            ¡Jugar!
          </button>
        </div>
      </div>
    );
  }

  if (gameStatus === 'levelComplete') {
    const isLastLevel = currentLevelIndex === NIVELES.length - 1;
    const buttonText = isLastLevel ? 'Finalizar Juego' : 'Siguiente Nivel';
    const buttonAction = () =>
      isLastLevel ? setGameStatus('menu') : cargarNivel(currentLevelIndex + 1);

    return (
      <div className="tren-numerico-body">
        <div className="pantalla-nivel-completo">
          <div className="modal-nivel">
            <h2>¡Nivel {NIVELES[currentLevelIndex].id} Completado!</h2>
            <div className="estrellas">
              <span>⭐</span>
              <span>⭐</span>
              <span>⭐</span>
            </div>
            <p>¡Excelente trabajo!</p>
            <button className="boton-jugar" onClick={buttonAction}>
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameStatus === 'allComplete') {
    return (
      <div className="tren-numerico-body">
        <div className="pantalla-menu">
          <h1 className="titulo-juego">¡Felicidades!</h1>
          <div className="locomotora-menu"></div>
          <p>¡Has completado todos los niveles!</p>
          <div className="estrellas">
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
          </div>
          <button className="boton-jugar" onClick={() => cargarNivel(0)}>
            Jugar de Nuevo
          </button>
        </div>
      </div>
    );
  }

  return renderJuego();
}
