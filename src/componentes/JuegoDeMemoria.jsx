import React, { useState, useEffect, useRef } from "react";
import "../style/JuegoDeMemoria.css";

const CONFIG_NIVELES = [
  { id: 1, nombre: "Nivel 1", parejas: 3 },
  { id: 2, nombre: "Nivel 2", parejas: 4 },
  { id: 3, nombre: "Nivel 3", parejas: 5 },
  { id: 4, nombre: "Nivel 4", parejas: 6 },
  { id: 5, nombre: "Nivel 5", parejas: 7 },
  { id: 6, nombre: "Nivel 6", parejas: 8 },
  { id: 7, nombre: "Nivel 7", parejas: 9 },
  { id: 8, nombre: "Nivel 8", parejas: 10 },
  { id: 9, nombre: "Nivel 9", parejas: 11 },
];

const ICONOS = [
  "🐶", "🐱", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮",
  "🍎", "🍌", "🍉", "🍇", "🍓", "🍒", "🥝", "🍑", "🥭", "🍍",
];

const EMOJIS_PREMIO = ["😊", "😍", "😜", "😎", "🤓", "😁", "🤩", "🥳", "🏆"];

const generarCartas = (nivel) => {
  const seleccion = ICONOS.slice(0, nivel.parejas);
  const duplicadas = [...seleccion, ...seleccion];
  for (let i = duplicadas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [duplicadas[i], duplicadas[j]] = [duplicadas[j], duplicadas[i]];
  }
  return duplicadas.map((valor, idx) => ({
    id: `${Date.now().toString(36)}-${idx}-${Math.random().toString(36).substr(2, 5)}`,
    valor,
  }));
};

const obtenerColumnasGrid = (parejas) => {
  if (parejas <= 3) return 2;
  if (parejas === 4) return 4;
  if (parejas === 5) return 5;
  if (parejas <= 8) return 4;
  return 5;
};

export default function App() {
  const [cargando, setCargando] = useState(true);
  const [progreso, setProgreso] = useState(0);
  const [estado, setEstado] = useState("INICIO");
  const [nivelActual, setNivelActual] = useState(null);
  const [cartas, setCartas] = useState([]);
  const [seleccionadasIds, setSeleccionadasIds] = useState([]);
  const [acertadas, setAcertadas] = useState([]);
  const [bloquear, setBloquear] = useState(false);
  const [intentos, setIntentos] = useState(0);
  const [tiempo, setTiempo] = useState(0);
  const [premios, setPremios] = useState([]);
  const [sonidoActivo, setSonidoActivo] = useState(true);

  const timerRef = useRef(null);
  const mountedRef = useRef(true);
  const audioFondoRef = useRef(null);
  const clickAudioRef = useRef(null);

  
  useEffect(() => {
    mountedRef.current = true;
    let intervalo = null;
    intervalo = setInterval(() => {
      setProgreso((prev) => {
        const next = prev + 2;
        if (next >= 100) {
          clearInterval(intervalo);
          setTimeout(() => {
            if (mountedRef.current) setCargando(false);
          }, 150);
          return 100;
        }
        return next;
      });
    }, 20);
    return () => {
      mountedRef.current = false;
      clearInterval(intervalo);
    };
  }, []);

 
  useEffect(() => {
    const manejarPrimerInteraccion = () => {
      if (sonidoActivo && audioFondoRef.current) {
        audioFondoRef.current.volume = 0.5;
        audioFondoRef.current.loop = true;
        audioFondoRef.current.play().catch(() => {});
      }
      document.removeEventListener("click", manejarPrimerInteraccion);
    };
    document.addEventListener("click", manejarPrimerInteraccion);
    return () => document.removeEventListener("click", manejarPrimerInteraccion);
  }, [sonidoActivo]);


  useEffect(() => {
    const fondo = audioFondoRef.current;
    if (!fondo) return;
    if (sonidoActivo) {
      fondo.play().catch(() => {});
    } else {
      fondo.pause();
    }
  }, [sonidoActivo]);


  const reproducirClick = () => {
    if (!sonidoActivo || !clickAudioRef.current) return;
    clickAudioRef.current.currentTime = 0;
    clickAudioRef.current.play().catch(() => {});
  };

  const iniciarNivel = (nivel) => {
    reproducirClick();
    if (!nivel) return;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setNivelActual(nivel);
    setCartas(generarCartas(nivel));
    setSeleccionadasIds([]);
    setAcertadas([]);
    setIntentos(0);
    setTiempo(0);
    setBloquear(false);
    setEstado("JUEGO");
  };

  const volverMenu = () => {
    reproducirClick();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setEstado("MENU");
    setNivelActual(null);
  };


  useEffect(() => {
    if (estado === "JUEGO") {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTiempo((t) => {
          if (t >= 60) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            setEstado("PERDIO");
            return 60;
          }
          return t + 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current && estado !== "JUEGO") {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [estado]);

  const manejarClick = (carta) => {
    if (!carta || bloquear) return;
    if (acertadas.includes(carta.valor)) return;
    if (seleccionadasIds.includes(carta.id)) return;
    if (seleccionadasIds.length >= 2) return;
    setSeleccionadasIds((prev) => [...prev, carta.id]);
  };

  useEffect(() => {
    if (seleccionadasIds.length !== 2) return;
    setBloquear(true);
    setIntentos((i) => i + 1);

    const [id1, id2] = seleccionadasIds;
    const carta1 = cartas.find((c) => c.id === id1);
    const carta2 = cartas.find((c) => c.id === id2);

    if (!carta1 || !carta2) {
      setTimeout(() => {
        setSeleccionadasIds([]);
        setBloquear(false);
      }, 400);
      return;
    }

    if (carta1.valor === carta2.valor) {
      setAcertadas((prev) =>
        !prev.includes(carta1.valor) ? [...prev, carta1.valor] : prev
      );
      setTimeout(() => {
        setSeleccionadasIds([]);
        setBloquear(false);
      }, 350);
    } else {
      setTimeout(() => {
        setSeleccionadasIds([]);
        setBloquear(false);
      }, 700);
    }
  }, [seleccionadasIds, cartas]);

  useEffect(() => {
    if (estado === "JUEGO" && cartas.length > 0 && acertadas.length === cartas.length / 2) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setPremios((prev) => {
        const nuevo = [...prev];
        if (nuevo.length < EMOJIS_PREMIO.length) {
          nuevo.push(EMOJIS_PREMIO[nuevo.length]);
        }
        return nuevo;
      });
      setTimeout(() => setEstado("GANO"), 500);
    }
  }, [acertadas, cartas, estado]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="container">
  
      <audio ref={audioFondoRef} src="/audio/musicaparajuego1.mp3" loop />
      <audio ref={clickAudioRef} src="/audio/boton.mp3" />

      {cargando ? (
        <div className="card">
          <h1 className="loadingTitle">Cargando...</h1>
          <p className="loadingText">{progreso}%</p>
          <div className="progressBarContainer">
            <div className="progressBarFill" style={{ width: `${progreso}%` }} />
          </div>
        </div>
      ) : (
        <>
          
          {estado === "INICIO" && (
            <div className="pantallaInicio fadeIn">
              <button
                className="btn btn-primary botonInicio"
                onClick={() => {
                  reproducirClick();
                  setEstado("MENU");
                }}
              >
                🎮 Jugar
              </button>
              <button
                className="boton-Musica"
                onClick={() => {
                  reproducirClick();
                  setSonidoActivo(!sonidoActivo);
                }}
                style={{ marginTop: "10px" }}
              >
                {sonidoActivo ? "🔊 Apagar música" : "🔇 Encender música"}
              </button>
            </div>
          )}

    
          {estado === "MENU" && (
            <div className="card">
              <div className="infoBar">
                <h1 className="menuTitle">🎴 Juego de Memoria</h1>
                <button
                  className="boton-Musica"
                  onClick={() => {
                    reproducirClick();
                    setSonidoActivo(!sonidoActivo);
                  }}
                >
                  {sonidoActivo ? "🔊" : "🔇"}
                </button>
              </div>
              <div className="premios">
                {EMOJIS_PREMIO.map((e, i) => (
                  <span key={i} className={`emoji ${i < premios.length ? "activo" : ""}`}>
                    {e}
                  </span>
                ))}
              </div>
              <div className="nivelesGrid">
                {CONFIG_NIVELES.map((nivel) => (
                  <button
                    key={nivel.id}
                    className={`btn ${nivel.id <= premios.length ? "btn-success" : "btn-primary"}`}
                    onClick={() => iniciarNivel(nivel)}
                  >
                    {nivel.nombre} {nivel.id <= premios.length ? "✅" : "🎮"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {estado === "JUEGO" && nivelActual && (
            <div className="cardNivel">
              <div className="infoBar">
                <button className="btn btn-back" onClick={volverMenu}>◀️ Menú</button>
                <h2 className="nivelTitulo">{nivelActual.nombre}</h2>
                <div className="stats">
                  <span>⏱ {tiempo}s</span>
                  <span>💡 {intentos}</span>
                  <button
                    className="boton-Musica"
                    onClick={() => {
                      reproducirClick();
                      setSonidoActivo(!sonidoActivo);
                    }}
                  >
                    {sonidoActivo ? "🔊" : "🔇"}
                  </button>
                </div>
              </div>
              <div
                className="cartasGrid"
                style={{ gridTemplateColumns: `repeat(${obtenerColumnasGrid(nivelActual.parejas)}, 1fr)` }}
              >
                {cartas.map((carta) => {
                  const volteada =
                    seleccionadasIds.includes(carta.id) || acertadas.includes(carta.valor);
                  const esAcertada = acertadas.includes(carta.valor);
                  return (
                    <div
                      key={carta.id}
                      className={`carta ${volteada ? "volteada" : ""} ${esAcertada ? "acertada" : ""}`}
                      onClick={() => manejarClick(carta)}
                      style={{ pointerEvents: bloquear || esAcertada ? "none" : "auto" }}
                    >
                      {volteada ? carta.valor : "❓"}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

       
          {estado === "GANO" && nivelActual && (
            <div className="card final ganado">
              <h2>¡{nivelActual.nombre} completado! 🎉</h2>
              <p className="emojiFinal">{premios[premios.length - 1]}</p>
              <p>Tiempo: {tiempo}s | Intentos: {intentos}</p>
              <button className="btn btn-success" onClick={volverMenu}>
                Volver al menú
              </button>
            </div>
          )}

          
          {estado === "PERDIO" && (
            <div className="card final perdido">
              <h2>⏰ ¡Se acabó el tiempo! 😭</h2>
              <p>¡Inténtalo de nuevo!</p>
              <button className="btn btn-danger" onClick={volverMenu}>
                Volver al menú
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
