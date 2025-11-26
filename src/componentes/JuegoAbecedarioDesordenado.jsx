import React, { useState, useCallback, useEffect, useRef } from "react";
import "../Style/abecedariodesordenado.css";

const COLUMNAS = 7;
const LETTER_ORDER = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
const TOTAL_LETRAS = LETTER_ORDER.length;

const generarTargetSlots = () =>
  LETTER_ORDER.map((letra, i) => ({ letra, id: `t-${i}`, isPlaced: false }));

export default function JuegoAbecedarioDesordenado() {
  const [gameState, setGameState] = useState("CARGANDO");
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [targetSlots, setTargetSlots] = useState([]);
  const [draggableLetters, setDraggableLetters] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);
  const clickSoundRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
      if (!isMuted) audioRef.current.play().catch(() => {});
      else audioRef.current.pause();
    }
  }, [isMuted, gameState]);

  useEffect(() => {
    if (gameState === "CARGANDO") {
      let p = 0;
      const interval = setInterval(() => {
        p += 2;
        setProgress(p);
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setGameState("INICIO"), 500);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [gameState]);

  const playClick = () => {
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play();
    }
  };

  const startGame = useCallback(() => {
    playClick();
    const slots = generarTargetSlots();
    setTargetSlots(slots);
    setScore(0);
    // Mensaje permanece
    setGameState("JUEGO");

    const letrasIniciales = LETTER_ORDER.map((letra, index) => ({
      id: `l-${index}`,
      letra,
      top: 0,
      left: (index % COLUMNAS) * (100 / COLUMNAS) + 3,
      initialTop: 0,
      initialLeft: (index % COLUMNAS) * (100 / COLUMNAS) + 3,
      wrong: false,
    }));

    const letrasCaidas = letrasIniciales
      .map((l) => ({
        ...l,
        top: 65 + Math.random() * 15,
        left: 10 + Math.random() * 70,
        falling: true,
      }))
      .sort(() => Math.random() - 0.5);

    setDraggableLetters(letrasCaidas);
    setMensaje("😱 ¡Las letras se cayeron! ¡Ayúdalas a volver a su sitio!");
  }, []);

  const volverInicio = () => {
    playClick();
    setGameState("INICIO");
  };

  const handleDragStart = (e, letra) => {
    e.dataTransfer.setData("text/plain", letra);
    e.currentTarget.style.opacity = "0.2";
  };

  const handleDrop = (e, targetLetra) => {
    e.preventDefault();
    const draggedLetra = e.dataTransfer.getData("text/plain");

    if (draggedLetra === targetLetra) {
      setTargetSlots((prev) =>
        prev.map((slot) =>
          slot.letra === targetLetra ? { ...slot, isPlaced: true } : slot
        )
      );
      setDraggableLetters((prev) =>
        prev.filter((l) => l.letra !== draggedLetra)
      );
      setScore((s) => s + 10);
    } else {
      setScore((s) => Math.max(0, s - 5));
      // Muestra rojo y reposiciona
      setDraggableLetters((prev) =>
        prev.map((l) =>
          l.letra === draggedLetra
            ? { ...l, wrong: true, top: l.initialTop, left: l.initialLeft }
            : l
        )
      );
    }
  };

  const TargetSlot = ({ slot }) => (
    <div
      className={`slot ${slot.isPlaced ? "slot-placed" : ""}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => handleDrop(e, slot.letra)}
    >
      {slot.letra}
    </div>
  );

  const DraggableLetter = ({ data }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, data.letra)}
      onDragEnd={(e) => (e.currentTarget.style.opacity = "1")}
      className={`letter ${data.falling ? "caida" : ""} ${
        data.wrong ? "letter-wrong" : ""
      }`}
      style={{
        top: `${data.top}%`,
        left: `${data.left}%`,
      }}
    >
      {data.letra}
    </div>
  );

  const PantallaCarga = () => (
    <div className="inicio-card centered-card">
      <h1>🔄 Cargando...</h1>
      <div className="barra-carga">
        <div className="progreso" style={{ width: `${progress}%` }}></div>
      </div>
      <p>{progress}%</p>
    </div>
  );

  const PantallaInicio = () => (
    <div className="inicio-card centered-card">
      <h1>🔤 ¡Abecedario Desordenado!</h1>
      <p>Las letras se van a caer 😱 — ¡Ayúdalas a volver a su sitio!</p>
      <button onClick={startGame} className="btn-jugar">
        ¡Comenzar!
      </button>
      <button
        className="btn-sonido"
        onClick={() => { playClick(); setIsMuted(!isMuted); }}
        title={isMuted ? "Activar sonido" : "Silenciar"}
      >
        {isMuted ? "🔇" : "🔊"}
      </button>
    </div>
  );

  const PantallaJuego = () => (
    <div className="juego-card">
      <div className="info-bar">
        <div>Puntaje: <strong>{score}</strong></div>
        <button onClick={volverInicio} className="btn-volver">Volver</button>
      </div>

      <div className="slots-area">
        {targetSlots.map((slot) => (
          <TargetSlot key={slot.id} slot={slot} />
        ))}
      </div>

      <div className="mensaje visible">{mensaje}</div>

      <div className="letras-area">
        {draggableLetters.map((data) => (
          <DraggableLetter key={data.id} data={data} />
        ))}
      </div>

      <button
        className="btn-sonido"
        onClick={() => { playClick(); setIsMuted(!isMuted); }}
        title={isMuted ? "Activar sonido" : "Silenciar"}
      >
        {isMuted ? "🔇" : "🔊"}
      </button>
    </div>
  );

  const PantallaTerminado = () => (
    <div className="fin-card">
      <h1>🎉 ¡Abecedario Ordenado!</h1>
      <p>Tu puntaje final es: <strong>{score}</strong></p>
      <button onClick={startGame} className="btn-jugar">Jugar otra vez</button>
      <button onClick={volverInicio} className="btn-volver">Volver al inicio</button>
    </div>
  );

  return (
    <div className="contenedor-principal">
      {gameState === "CARGANDO" && <PantallaCarga />}
      {gameState === "INICIO" && <PantallaInicio />}
      {gameState === "JUEGO" && <PantallaJuego />}
      {gameState === "TERMINADO" && <PantallaTerminado />}
      <audio ref={audioRef} src="/audio/musicaparajuego2.mp3" />
      <audio ref={clickSoundRef} src="/audio/boton.mp3" />
    </div>
  );
}
