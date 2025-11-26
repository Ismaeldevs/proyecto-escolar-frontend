// src/componentes/RelacionaPlurales.jsx
import { useEffect, useRef, useState } from "react";
import "../Style/RelacionaPlurales.css";

const NIVELES_CONFIG = [
  {
    id: 1,
    nombre: "Nivel 1 - Animales",
    parejas: [
      { singular: "Gato", plural: "Gatos", emoji: "🐱" },
      { singular: "Perro", plural: "Perros", emoji: "🐶" },
      { singular: "Pato", plural: "Patos", emoji: "🦆" }
    ]
  },
  {
    id: 2,
    nombre: "Nivel 2 - Objetos",
    parejas: [
      { singular: "Libro", plural: "Libros", emoji: "📚" },
      { singular: "Reloj", plural: "Relojes", emoji: "⌚" },
      { singular: "Lápiz", plural: "Lápices", emoji: "✏️" }
    ]
  },
  {
    id: 3,
    nombre: "Nivel 3 - Comida",
    parejas: [
      { singular: "Manzana", plural: "Manzanas", emoji: "🍎" },
      { singular: "Pan", plural: "Panes", emoji: "🍞" },
      { singular: "Taco", plural: "Tacos", emoji: "🌮" }
    ]
  },
  {
    id: 4,
    nombre: "Nivel 4 - Naturaleza",
    parejas: [
      { singular: "Árbol", plural: "Árboles", emoji: "🌳" },
      { singular: "Flor", plural: "Flores", emoji: "🌸" },
      { singular: "Hongo", plural: "Hongos", emoji: "🍄" }
    ]
  }
];

const TOTAL_NIVELES = NIVELES_CONFIG.length;

export default function RelacionaPlurales() {
  const [gameState, setGameState] = useState("INICIO");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [mensaje, setMensaje] = useState("");
  const [score, setScore] = useState(0);
  const [paresEncontrados, setParesEncontrados] = useState([]);
  const [estrellasGanadas, setEstrellasGanadas] = useState(Array(TOTAL_NIVELES).fill(0));
  const [erroresNivel, setErroresNivel] = useState(0);
  const [permanentLines, setPermanentLines] = useState([]);
  const [tempLine, setTempLine] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [showProgress, setShowProgress] = useState(false);
  const [muted, setMuted] = useState(false);

  const svgRef = useRef(null);
  const gameAreaRef = useRef(null);
  const audioRef = useRef(null);
  const firstPlayTriggeredRef = useRef(false);
  const [juegoPares, setJuegoPares] = useState({ images: [], words: [] });

  // Cargar progreso
  useEffect(() => {
    const saved = localStorage.getItem("plurales-progress");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setCurrentLevel(data.currentLevel || 1);
        setScore(data.score || 0);
        setEstrellasGanadas(data.estrellas || Array(TOTAL_NIVELES).fill(0));
      } catch {}
    }
  }, []);

  // Guardar progreso
  useEffect(() => {
    localStorage.setItem(
      "plurales-progress",
      JSON.stringify({ currentLevel, score, estrellas: estrellasGanadas })
    );
  }, [currentLevel, score, estrellasGanadas]);

  // Audio y cleanup al desmontar
  useEffect(() => {
    if (!audioRef.current) {
      const music = new Audio("/audio/musicaparajuego1.mp3");
      music.loop = true;
      music.volume = muted ? 0 : 0.35;
      audioRef.current = music;
      music.play().catch(() => {});
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, []);

  // Controlar mute
  useEffect(() => {
    if (!audioRef.current) return;
    muted ? audioRef.current.pause() : audioRef.current.play().catch(() => {});
  }, [muted]);

  // Autoplay al primer toque
  useEffect(() => {
    const tryPlayOnFirstInteraction = () => {
      if (audioRef.current && !firstPlayTriggeredRef.current) {
        audioRef.current.play().catch(() => {});
        firstPlayTriggeredRef.current = true;
      }
      window.removeEventListener("pointerdown", tryPlayOnFirstInteraction);
      window.removeEventListener("keydown", tryPlayOnFirstInteraction);
    };
    window.addEventListener("pointerdown", tryPlayOnFirstInteraction, { once: true });
    window.addEventListener("keydown", tryPlayOnFirstInteraction, { once: true });
    return () => {
      window.removeEventListener("pointerdown", tryPlayOnFirstInteraction);
      window.removeEventListener("keydown", tryPlayOnFirstInteraction);
    };
  }, []);

  const iniciarNivel = (nivel) => {
    const cfg = NIVELES_CONFIG[nivel - 1];
    if (!cfg) return;
    setGameState("JUEGO");
    setParesEncontrados([]);
    setErroresNivel(0);
    setMensaje("");
    setPermanentLines([]);

    const imgs = cfg.parejas.map((p, i) => ({
      id: `img-${nivel}-${i}`,
      valor: p.plural,
      singular: p.singular,
      emoji: p.emoji
    }));

    const words = cfg.parejas
      .map((p, i) => ({ id: `txt-${nivel}-${i}`, valor: p.plural }))
      .sort(() => Math.random() - 0.5);

    setJuegoPares({ images: imgs, words });
  };

  // Drag & Drop
  const handlePointerDownFromImage = (e, item) => {
    if (paresEncontrados.includes(item.valor)) return;
    e.preventDefault();
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDragging({ fromId: item.id, valor: item.valor, startX: x, startY: y });
    setTempLine({ x1: x, y1: y, x2: x, y2: y });
    setMensaje(`Arrastra desde ${item.singular}`);
  };

  const handlePointerMoveGlobal = (e) => {
    if (!dragging || !tempLine) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    setTempLine((prev) => ({ ...prev, x2: e.clientX - rect.left, y2: e.clientY - rect.top }));
  };

  const handlePointerUpGlobal = (e) => {
    if (!dragging || !tempLine) return;
    const elementsAtPoint = document.elementsFromPoint(e.clientX, e.clientY);
    const dropTarget = elementsAtPoint.find((el) => el.id?.startsWith("txt-"));
    if (!dropTarget) {
      setTempLine(null);
      setDragging(null);
      setMensaje("Suelta sobre la palabra correcta.");
      setTimeout(() => setMensaje(""), 1000);
      return;
    }
    const palabraObj = juegoPares.words.find((w) => w.id === dropTarget.id);
    if (!palabraObj || paresEncontrados.includes(palabraObj.valor)) {
      setTempLine(null);
      setDragging(null);
      setMensaje("Esa palabra ya está emparejada.");
      setTimeout(() => setMensaje(""), 1000);
      return;
    }

    if (palabraObj.valor === dragging.valor) {
      const fromEl = document.getElementById(dragging.fromId);
      const toEl = document.getElementById(palabraObj.id);
      if (fromEl && toEl) {
        const gameRect = gameAreaRef.current.getBoundingClientRect();
        const a = fromEl.getBoundingClientRect();
        const b = toEl.getBoundingClientRect();
        const newLine = {
          x1: a.left - gameRect.left + a.width / 2,
          y1: a.top - gameRect.top + a.height / 2,
          x2: b.left - gameRect.left + b.width / 2,
          y2: b.top - gameRect.top + b.height / 2
        };
        setPermanentLines((prev) => [...prev, newLine]);
      }
      setParesEncontrados((prev) => [...prev, palabraObj.valor]);
      setScore((s) => s + 10);
      setMensaje("¡Correcto!");
      setTimeout(() => setMensaje(""), 900);
    } else {
      setErroresNivel((e) => e + 1);
      setMensaje("Incorrecto");
      setTimeout(() => setMensaje(""), 900);
    }
    setTempLine(null);
    setDragging(null);
  };

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMoveGlobal);
    window.addEventListener("pointerup", handlePointerUpGlobal);
    window.addEventListener("pointercancel", handlePointerUpGlobal);
    return () => {
      window.removeEventListener("pointermove", handlePointerMoveGlobal);
      window.removeEventListener("pointerup", handlePointerUpGlobal);
      window.removeEventListener("pointercancel", handlePointerUpGlobal);
    };
  }, [dragging, tempLine, juegoPares]);

  // Dibujar flechas
  useEffect(() => {
    if (!svgRef.current || !gameAreaRef.current) return;
    const svg = svgRef.current;
    svg.innerHTML = "";

    const drawArrowHead = (x, y, angle, color, size = 10) => {
      const p1x = x - Math.cos(angle - Math.PI / 6) * size;
      const p1y = y - Math.sin(angle - Math.PI / 6) * size;
      const p2x = x - Math.cos(angle + Math.PI / 6) * size;
      const p2y = y - Math.sin(angle + Math.PI / 6) * size;
      const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      poly.setAttribute("points", `${x},${y} ${p1x},${p1y} ${p2x},${p2y}`);
      poly.setAttribute("fill", color);
      return poly;
    };

    permanentLines.forEach((line) => {
      const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
      l.setAttribute("x1", line.x1);
      l.setAttribute("y1", line.y1);
      l.setAttribute("x2", line.x2);
      l.setAttribute("y2", line.y2);
      l.setAttribute("stroke", "#10b981");
      l.setAttribute("stroke-width", "6");
      l.setAttribute("stroke-linecap", "round");
      svg.appendChild(l);

      const dx = line.x2 - line.x1;
      const dy = line.y2 - line.y1;
      const ang = Math.atan2(dy, dx);
      const arrow = drawArrowHead(line.x2, line.y2, ang, "#10b981");
      svg.appendChild(arrow);
    });

    if (tempLine) {
      const t = document.createElementNS("http://www.w3.org/2000/svg", "line");
      t.setAttribute("x1", tempLine.x1);
      t.setAttribute("y1", tempLine.y1);
      t.setAttribute("x2", tempLine.x2);
      t.setAttribute("y2", tempLine.y2);
      t.setAttribute("stroke", "#F472B6");
      t.setAttribute("stroke-width", "5");
      t.setAttribute("stroke-linecap", "round");
      t.setAttribute("stroke-dasharray", "6 4");
      svg.appendChild(t);

      const dx = tempLine.x2 - tempLine.x1;
      const dy = tempLine.y2 - tempLine.y1;
      const ang = Math.atan2(dy, dx);
      const arrowTemp = drawArrowHead(tempLine.x2, tempLine.y2, ang, "#F472B6");
      svg.appendChild(arrowTemp);
    }
  }, [permanentLines, tempLine]);

  // Ganar nivel
  useEffect(() => {
    if (juegoPares.images.length > 0 && paresEncontrados.length === juegoPares.images.length) {
      let estrellas = 3;
      if (erroresNivel === 1) estrellas = 2;
      if (erroresNivel >= 2) estrellas = 1;
      setEstrellasGanadas((prev) => {
        const copy = [...prev];
        copy[currentLevel - 1] = estrellas;
        return copy;
      });
      setGameState(currentLevel === TOTAL_NIVELES ? "FINAL" : "GANO");
      setTimeout(() => setPermanentLines([]), 900);
    }
  }, [paresEncontrados, juegoPares.images.length, erroresNivel, currentLevel]);

  const startGame = () => {
    setScore(0);
    setEstrellasGanadas(Array(TOTAL_NIVELES).fill(0));
    setCurrentLevel(1);
    iniciarNivel(1);
  };

  const nextLevel = () => {
    if (currentLevel < TOTAL_NIVELES) {
      const next = currentLevel + 1;
      setCurrentLevel(next);
      iniciarNivel(next);
    }
  };

  const volverInicio = () => setGameState("INICIO");

  const ItemCard = ({ item, matched, isImage }) => (
    <div
      id={item.id}
      className={`w-full p-3 mb-3 rounded-xl border-2 flex items-center justify-center ${
        matched ? "bg-green-100 border-green-500 opacity-70 cursor-not-allowed" : "bg-white border-gray-200 hover:shadow-lg cursor-pointer"
      }`}
      style={{ touchAction: "none" }}
      onPointerDown={(!matched && isImage) ? (e) => handlePointerDownFromImage(e, item) : undefined}
    >
      {isImage ? (
        <div className="colItem">
          <span className="emoji">{item.emoji}</span>
          <span className="singular">{item.singular}</span>
        </div>
      ) : (
        <div className="palabra">{item.valor}</div>
      )}
    </div>
  );

  const PantallaInicio = () => (
    <div className="panelInicio">
      <h1 className="inicioTitulo">Relaciona y Une 🔗</h1>
      <p className="inicioDesc">Dibuja líneas como un lápiz para unir singular ↔ plural.</p>
      <button onClick={startGame} className="btnPrincipal">Comenzar</button>
      <button className="btnSec" onClick={() => setShowProgress(true)}>Ver Progreso</button>
      <button className="btnSec" onClick={() => setMuted((m) => !m)} style={{ marginTop: "20px", background: muted ? "#EF4444" : "#14b8a6" }}>
        {muted ? "🔇 Activar sonido" : "🔊 Silenciar"}
      </button>
    </div>
  );

  const PantallaProgreso = () => (
    <div className="panelProgreso">
      <h2 className="tituloProgreso">🏆 Progreso</h2>
      {NIVELES_CONFIG.map((n, i) => (
        <div key={i} className="itemNivel">
          <span>{n.nombre}</span>
          <span>{"⭐".repeat(estrellasGanadas[i])}</span>
        </div>
      ))}
      <button onClick={() => setShowProgress(false)} className="btnSec">Volver</button>
    </div>
  );

  const PantallaJuego = () => {
    const nivel = NIVELES_CONFIG[currentLevel - 1];
    return (
      <div className="panelJuego" ref={gameAreaRef}>
        <svg ref={svgRef} className="svgLines" />
        <div className="juegoHeader">
          <div className="nivelTxt">{nivel.nombre}</div>
          <button className="btnSec" onClick={() => setMuted((m) => !m)} style={{ background: muted ? "#EF4444" : "#14b8a6" }}>
            {muted ? "🔇" : "🔊"}
          </button>
          <button className="btnSec" onClick={volverInicio}>Volver</button>
        </div>
        <div className="mensajeTxt">{mensaje}</div>
        <div className="juegoGrid">
          <div>
            <h3 className="colTitulo">Singular</h3>
            {juegoPares.images.map((img) => <ItemCard key={img.id} item={img} matched={paresEncontrados.includes(img.valor)} isImage={true} />)}
          </div>
          <div>
            <h3 className="colTitulo">Plural</h3>
            {juegoPares.words.map((w) => <ItemCard key={w.id} item={w} matched={paresEncontrados.includes(w.valor)} isImage={false} />)}
          </div>
        </div>
      </div>
    );
  };

  const PantallaGano = () => {
    const estrellas = estrellasGanadas[currentLevel - 1];
    return (
      <div className="panelGano">
        <h1 className="tituloGano">¡Nivel completado!</h1>
        <div className="estrellasGano">{"⭐".repeat(estrellas)}</div>
        <button className="btnPrincipal" onClick={nextLevel}>Siguiente Nivel</button>
        <button className="btnSec" onClick={volverInicio}>Inicio</button>
      </div>
    );
  };

  const PantallaFinal = () => (
    <div className="panelFinal">
      <h1 className="tituloFinal">🎉 ¡Juego terminado! 🎉</h1>
      <h2 className="subTituloFinal">Tu desempeño</h2>
      <div className="resumenFinal">
        {NIVELES_CONFIG.map((n, i) => (
          <div key={i} className="itemFinal">
            <span>{n.nombre}</span>
            <span>{"⭐".repeat(estrellasGanadas[i])}</span>
          </div>
        ))}
      </div>
      <button className="btnPrincipal" onClick={() => { setCurrentLevel(1); iniciarNivel(1); }}>Jugar de Nuevo</button>
      <button className="btnSec" onClick={volverInicio}>Inicio</button>
    </div>
  );

  return (
    <div className="juegoWrapper">
      {{
        INICIO: showProgress ? <PantallaProgreso /> : <PantallaInicio />,
        JUEGO: <PantallaJuego />,
        GANO: <PantallaGano />,
        FINAL: <PantallaFinal />
      }[gameState]}
    </div>
  );
}
