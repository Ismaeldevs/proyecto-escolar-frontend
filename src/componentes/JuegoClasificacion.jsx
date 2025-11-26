import React, { useState, useEffect, useCallback, useRef } from "react";
import "../Style/JuegoClasificacion.css";


const DATOS_CATEGORIAS = {
  ANIMALES: { nombre: "ANIMALES", color: "#4ade80" },
  FRUTAS: { nombre: "FRUTAS", color: "#f87171" },
  ROPA: { nombre: "ROPA", color: "#60a5fa" },
};

const ITEMS_BASE = [
  { nombre: "Perro", categoria: "ANIMALES", emoji: "🐶" },
  { nombre: "Gato", categoria: "ANIMALES", emoji: "🐱" },
  { nombre: "Vaca", categoria: "ANIMALES", emoji: "🐮" },
  { nombre: "Manzana", categoria: "FRUTAS", emoji: "🍎" },
  { nombre: "Banana", categoria: "FRUTAS", emoji: "🍌" },
  { nombre: "Pera", categoria: "FRUTAS", emoji: "🍐" },
  { nombre: "Camisa", categoria: "ROPA", emoji: "👕" },
  { nombre: "Pantalón", categoria: "ROPA", emoji: "👖" },
  { nombre: "Zapato", categoria: "ROPA", emoji: "👟" },
];

const NIVELES = [
  { id: 1, nombre: "Nivel 1 (Fácil)", itemsPorNivel: 5 },
  { id: 2, nombre: "Nivel 2 (Medio)", itemsPorNivel: 7 },
  { id: 3, nombre: "Nivel 3 (Difícil)", itemsPorNivel: 9 },
];

const PREMIOS = ["🐶", "🍎", "👕"];


const barajar = (array) => [...array].sort(() => Math.random() - 0.5);
const generarItemsNivel = (nivel) =>
  barajar(ITEMS_BASE)
    .slice(0, nivel.itemsPorNivel)
    .map((i) => ({ ...i, id: Math.random().toString(36).substring(2, 9) }));

export default function JuegoClasificacion() {
  const [estado, setEstado] = useState("CARGANDO");
  const [nivelIndex, setNivelIndex] = useState(0);
  const [itemsPendientes, setItemsPendientes] = useState([]);
  const [clasificados, setClasificados] = useState({
    ANIMALES: [],
    FRUTAS: [],
    ROPA: [],
  });
  const [premios, setPremios] = useState([]);
  const [tiempo, setTiempo] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const timerRef = useRef(null);
  const audioRef = useRef(null);
  const clickRef = useRef(null);

  const nivel = NIVELES[nivelIndex];

  useEffect(() => {
    if (estado === "CARGANDO") {
      let p = 0;
      const interval = setInterval(() => {
        p += 5;
        setProgress(p);
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setEstado("MENU"), 500);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [estado]);


  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;
    if (!isMuted) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  }, [isMuted, estado]);

  const playClick = () => {
    if (clickRef.current) {
      clickRef.current.currentTime = 0;
      clickRef.current.play();
    }
  };

  const iniciarNivel = useCallback((index) => {
    playClick();
    const nivelConfig = NIVELES[index];
    setNivelIndex(index);
    setItemsPendientes(generarItemsNivel(nivelConfig));
    setClasificados({ ANIMALES: [], FRUTAS: [], ROPA: [] });
    setTiempo(0);
    setMensaje("");
    setEstado("JUEGO");
  }, []);


  useEffect(() => {
    if (estado === "JUEGO") {
      timerRef.current = setInterval(() => {
        setTiempo((t) => {
          if (t >= 60) {
            clearInterval(timerRef.current);
            setEstado("PERDIO");
          }
          return t + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [estado]);

 
  useEffect(() => {
    const total = NIVELES[nivelIndex].itemsPorNivel;
    const clasificadosTotal = Object.values(clasificados).flat().length;
    if (clasificadosTotal === total && total > 0) {
      clearInterval(timerRef.current);
      setPremios((prev) => {
        if (prev.length < PREMIOS.length) return [...prev, PREMIOS[nivelIndex]];
        return prev;
      });
      setEstado("GANO");
    }
  }, [clasificados, nivelIndex]);

  
  const handleDragStart = (e, itemId) => e.dataTransfer.setData("itemId", itemId);

  const handleDrop = (e, categoriaDestino) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("itemId");
    const item = itemsPendientes.find((i) => i.id === itemId);
    if (!item) return;

    if (item.categoria === categoriaDestino) {
      setClasificados((prev) => ({
        ...prev,
        [categoriaDestino]: [...prev[categoriaDestino], item],
      }));
      setItemsPendientes((prev) => prev.filter((i) => i.id !== itemId));
      setMensaje(`✅ ¡Correcto! ${item.nombre} pertenece a ${categoriaDestino}`);
    } else {
      setMensaje(`❌ ${item.nombre} no pertenece a ${categoriaDestino}`);
    }
    setTimeout(() => setMensaje(""), 1500);
  };

  const handleDragOver = (e) => e.preventDefault();
  const volverMenu = () => {
    clearInterval(timerRef.current);
    setEstado("MENU");
  };

 
  if (estado === "CARGANDO")
    return (
      <div className="jcc-container">
        <div className="jcc-cardCarga">
          <h1 className="jcc-loadingTitle">🔄 Cargando...</h1>
          <div className="jcc-progressBarContainer">
            <div className="jcc-progressBarFill" style={{ width: `${progress}%` }}></div>
          </div>
          <p>{progress}%</p>
        </div>
        <audio ref={audioRef} src="/audio/musicaparajuego2.mp3" />
        <audio ref={clickRef} src="/audio/boton.mp3" />
      </div>
    );

  return (
    <div className="jcc-container">
      <button
        className="jcc-btn-sonido"
        onClick={() => {
          playClick();
          setIsMuted(!isMuted);
        }}
      >
        {isMuted ? "🔇" : "🔊"}
      </button>

  
      {estado === "MENU" && (
        <div className="jcc-cardNivel">
          <h1 className="jcc-menuTitle">🧩 Clasifica y Gana Emojis</h1>
          <div className="jcc-nivelesGrid">
            {NIVELES.map((n, i) => (
              <button key={n.id} onClick={() => iniciarNivel(i)} className="jcc-btn-nivel">
                {n.nombre}
              </button>
            ))}
          </div>
          <div className="jcc-premios">
            {PREMIOS.map((emoji, i) => (
              <span key={i} className={`jcc-emojiFinal ${i < premios.length ? "" : "jcc-opacity-20"}`}>
                {emoji}
              </span>
            ))}
          </div>
        </div>
      )}

      
      {estado === "JUEGO" && (
        <div className="jcc-cardNivel">
          <h2 className="jcc-text-2xl">{nivel.nombre}</h2>
          <div className="jcc-tiempo">⏱ {tiempo}s</div>

          <div className="jcc-gridCategorias">
            {Object.keys(DATOS_CATEGORIAS).map((cat) => (
              <div
                key={cat}
                className="jcc-categoria-card"
                style={{ backgroundColor: DATOS_CATEGORIAS[cat].color + "33" }}
                onDrop={(e) => handleDrop(e, cat)}
                onDragOver={handleDragOver}
              >
                <h3>{cat}</h3>
                <div className="jcc-categoria-items">
                  {clasificados[cat].map((i) => (
                    <div key={i.id} className="jcc-item-emoji">
                      {i.emoji}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="jcc-mensaje">{mensaje}</div>

          <div className="jcc-itemsPendientes">
            {itemsPendientes.map((i) => (
              <div
                key={i.id}
                draggable
                onDragStart={(e) => handleDragStart(e, i.id)}
                className="jcc-item-emoji"
              >
                {i.emoji}
              </div>
            ))}
          </div>
        </div>
      )}

  
      {estado === "GANO" && (
        <div className="jcc-cardNivel">
          <h2>🎉 ¡{nivel.nombre} completado!</h2>
          <p className="jcc-emojiFinal">{PREMIOS[nivelIndex]}</p>
          <button onClick={() => iniciarNivel(nivelIndex + 1)} className="jcc-btn-siguiente">
            Siguiente Nivel
          </button>
          <button onClick={volverMenu} className="jcc-btn-volver">
            Volver al menú
          </button>
        </div>
      )}

      
      {estado === "PERDIO" && (
        <div className="jcc-cardNivel">
          <h2>⏰ ¡Tiempo agotado!</h2>
          <p>No ganaste ningún emoji esta vez 😢</p>
          <button onClick={volverMenu} className="jcc-btn-volver">
            Volver al menú
          </button>
        </div>
      )}

      <audio ref={audioRef} src="/audio/musicaparajuego2.mp3" />
      <audio ref={clickRef} src="/audio/boton.mp3" />
    </div>
  );
}
