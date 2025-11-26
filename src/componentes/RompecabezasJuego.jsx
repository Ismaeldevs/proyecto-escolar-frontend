import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import ReactConfetti from 'react-confetti';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';

import './RompecabezasJuego.css';

const musicaFondo = "../audio/musica-fondo.mp3";
const confettiSound = ".-/audio/confite.mp3";

const puzzles = [
  { id: 'a', name: 'A', image: './images/avion.png' },
  { id: 'e', name: 'E', image: './images/elefante.png' },
  { id: 'i', name: 'I', image: './images/isla.png' },
  { id: 'o', name: 'O', image: './images/oso.png' },
  { id: 'u', name: 'U', image: './images/uva.png' },
];

const useAudio = (url) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio(url);
    audioRef.current.loop = true;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [url]);

  const toggle = useCallback(() => {
    if (!audioRef.current) return;
    setPlaying(prev => {
      const next = !prev;
      if (next) audioRef.current.play().catch(e => console.error(e));
      else audioRef.current.pause();
      return next;
    });
  }, []);

  const stop = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setPlaying(false);
  }, []);

  return [playing, toggle, stop, audioRef];
};

const SortablePiece = ({ piece, pieceSize, isBoardSlot, difficulty, imageSrc }) => {
  if (isBoardSlot) {
    const { setNodeRef } = useDroppable({ id: piece.id });
    return (
      <div
        ref={setNodeRef}
        style={{ width: `${pieceSize}px`, height: `${pieceSize}px` }}
        className="puzzle-slot"
      />
    );
  }

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: piece.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: `${pieceSize}px`,
    height: `${pieceSize}px`,
    opacity: isDragging ? 0.6 : 1,
    backgroundImage: `url(${imageSrc})`,
    backgroundSize: `${difficulty * pieceSize}px ${difficulty * pieceSize}px`,
    backgroundPosition: piece.backgroundPosition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="puzzle-piece-image"
      {...attributes}
      {...listeners}
    />
  );
};

export default function RompecabezasJuego() {
  const [selectedVowel, setSelectedVowel] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [piecesPool, setPiecesPool] = useState([]);
  const [boardPieces, setBoardPieces] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPlayingMusic, toggleMusic, stopMusic] = useAudio(musicaFondo);
  const confettiAudio = useMemo(() => new Audio(confettiSound), []);
  const timeoutRef = useRef(null);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const pieceSize = 100;

  const generateImagePieces = useCallback((size) => {
    const totalPieces = size * size;
    const newPieces = [];
    const denominator = size - 1;

    for (let i = 0; i < totalPieces; i++) {
      const row = Math.floor(i / size);
      const col = i % size;
      const backgroundPositionX = denominator > 0 ? (col / denominator) * 100 : 0;
      const backgroundPositionY = denominator > 0 ? (row / denominator) * 100 : 0;

      newPieces.push({
        id: `piece-${i}`,
        originalIndex: i,
        backgroundPosition: `${backgroundPositionX}% ${backgroundPositionY}%`
      });
    }
    return newPieces;
  }, []);

  const startGame = useCallback((size) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setDifficulty(size);
    setIsComplete(false);
    setIsPreviewing(true);
    setGameStarted(false);
    setBoardPieces([]);
    setPiecesPool([]);

    const generatedPieces = generateImagePieces(size);
    const emptySlots = Array.from({ length: size * size }, (_, i) => ({ id: `slot-${i}`, isEmpty: true, originalIndex: i }));

    timeoutRef.current = setTimeout(() => {
      setIsPreviewing(false);
      setBoardPieces(emptySlots);
      setPiecesPool([...generatedPieces].sort(() => Math.random() - 0.5));
      setGameStarted(true);
      timeoutRef.current = null;
    }, 2000);

    if (!isPlayingMusic) toggleMusic();
  }, [generateImagePieces, isPlayingMusic, toggleMusic]);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const handleDragStart = (event) => setActiveId(event.active.id);
  const handleDragCancel = () => setActiveId(null);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const findPiece = (id) => piecesPool.find(p => p.id === id) || boardPieces.find(p => p.id === id);
    const findContainer = (id) => {
      if (piecesPool.some(p => p.id === id)) return 'pool';
      if (boardPieces.some(p => p.id === id)) return 'board';
      return null;
    };

    const activePiece = findPiece(active.id);
    const overPieceOrSlot = findPiece(over.id);
    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (activeContainer === overContainer) {
      if (activeContainer === 'pool') {
        setPiecesPool((items) => arrayMove(items, items.findIndex(p => p.id === active.id), items.findIndex(p => p.id === over.id)));
      } else {
        setBoardPieces((items) => {
          const newItems = [...items];
          [newItems[items.findIndex(p => p.id === active.id)], newItems[items.findIndex(p => p.id === over.id)]] =
            [newItems[items.findIndex(p => p.id === over.id)], newItems[items.findIndex(p => p.id === active.id)]];
          return newItems;
        });
      }
    } else {
      if (activeContainer === 'pool' && overContainer === 'board' && overPieceOrSlot.isEmpty) {
        setPiecesPool(prev => prev.filter(p => p.id !== active.id));
        setBoardPieces(prev => {
          const overIndex = prev.findIndex(p => p.id === over.id);
          const newBoard = [...prev];
          newBoard[overIndex] = activePiece;
          return newBoard;
        });
      } else if (activeContainer === 'board' && overContainer === 'pool') {
        setBoardPieces(prev => {
          const index = prev.findIndex(p => p.id === active.id);
          const newBoard = [...prev];
          newBoard[index] = { id: `slot-${index}`, isEmpty: true, originalIndex: index };
          return newBoard;
        });
        setPiecesPool(prev => [...prev, activePiece]);
      }
    }
  };

  useEffect(() => {
    if (!gameStarted || !difficulty) return;
    if (piecesPool.length === 0 && boardPieces.length === difficulty * difficulty) {
      const solved = boardPieces.every((p, i) => !p.isEmpty && p.originalIndex === i);
      if (solved) {
        setIsComplete(true);
        setGameStarted(false);
        if (isPlayingMusic) toggleMusic();
        confettiAudio.play().catch(console.error);
      }
    }
  }, [boardPieces, difficulty, piecesPool.length, isPlayingMusic, toggleMusic, gameStarted, confettiAudio]);

  const poolPieceIds = useMemo(() => piecesPool.map(p => p.id), [piecesPool]);
  const boardPieceIds = useMemo(() => boardPieces.map(p => p.id), [boardPieces]);

  const handleBackToVowels = () => {
    clearTimeout(timeoutRef.current);
    setSelectedVowel(null);
    setDifficulty(null);
    setIsComplete(false);
    setIsPreviewing(false);
    setGameStarted(false);
    setBoardPieces([]);
    setPiecesPool([]);
    stopMusic();
  };

  const handleSelectVowel = (puzzle) => setSelectedVowel(puzzle);

  return (
    <div className="fondo-vocales">
      {!selectedVowel ? (
        <div className="puzzle-container">
          <h2>Elige una Vocal</h2>
          <div className="vowel-selector">
            {puzzles.map(puzzle => (
              <button key={puzzle.id} className="vowel-card" onClick={() => handleSelectVowel(puzzle)}>
                <img src={puzzle.image} alt={puzzle.name} />
                <span className="vowel-letter">{puzzle.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : !difficulty ? (
        <div className="puzzle-container">
          <h2>Elige el tamaño para "{selectedVowel.name}"</h2>
          <div className="difficulty-selector">
            <button onClick={() => startGame(2)}>2x2</button>
            <button onClick={() => startGame(3)}>3x3</button>
            <button onClick={() => startGame(4)}>4x4</button>
          </div>
          <div className="puzzle-controls">
            <button onClick={handleBackToVowels}>← Regresar a Vocales</button>
          </div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
          modifiers={[restrictToWindowEdges]}
        >
          <div className="puzzle-container">
            {isComplete && (
              <>
                <div className="win-modal-overlay">
                  <div className="win-modal-box">
                    <h2>¡Ganaste!</h2>
                    <button onClick={handleBackToVowels}>Selecciona otra Vocal</button>
                  </div>
                </div>
                <ReactConfetti recycle={false} numberOfPieces={300} />
              </>
            )}

            <h2>Arma el Rompecabezas: {selectedVowel.name}</h2>
            <div className="puzzle-controls">
              <button onClick={toggleMusic}>
                {isPlayingMusic ? 'Pausar Música 🎵' : 'Iniciar Música 🎵'}
              </button>
              <button onClick={handleBackToVowels}>← Volver al Menú</button>
            </div>

            {isPreviewing ? (
              <div className="puzzle-preview">
                <img
                  src={selectedVowel.image}
                  alt={`Vista previa ${selectedVowel.name}`}
                  className="preview-image"
                  style={{
                    width: `${difficulty * pieceSize}px`,
                    height: `${difficulty * pieceSize}px`,
                  }}
                />
                <p className="preview-text">Observa la imagen...</p>
              </div>
            ) : (
              <>
                <SortableContext items={boardPieceIds} strategy={rectSortingStrategy}>
                  <div className={`puzzle-board grid-${difficulty}`}>
                    {boardPieces.map(piece => (
                      <SortablePiece
                        key={piece.id}
                        piece={piece}
                        pieceSize={pieceSize}
                        isBoardSlot={piece.isEmpty}
                        difficulty={difficulty}
                        imageSrc={selectedVowel.image}
                      />
                    ))}
                  </div>
                </SortableContext>

                <SortableContext items={poolPieceIds} strategy={rectSortingStrategy}>
                  <div className="pieces-pool">
                    {piecesPool.map(piece => (
                      <SortablePiece
                        key={piece.id}
                        piece={piece}
                        pieceSize={pieceSize}
                        difficulty={difficulty}
                        imageSrc={selectedVowel.image}
                      />
                    ))}
                  </div>
                </SortableContext>
              </>
            )}

            <DragOverlay>
              {activeId && (() => {
                const activePiece = piecesPool.find(p => p.id === activeId) || boardPieces.find(p => p.id === activeId);
                if (!activePiece) return null;
                return (
                  <div
                    className="puzzle-piece-image"
                    style={{
                      width: `${pieceSize}px`,
                      height: `${pieceSize}px`,
                      backgroundImage: `url(${selectedVowel.image})`,
                      backgroundSize: `${difficulty * pieceSize}px ${difficulty * pieceSize}px`,
                      backgroundPosition: activePiece.backgroundPosition,
                      zIndex: 9999,
                      transform: 'scale(1.06)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.25)'
                    }}
                  />
                );
              })()}
            </DragOverlay>
          </div>
        </DndContext>
      )}
    </div>
  );
}
