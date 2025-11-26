import React, { useState, useEffect, useCallback } from "react"; 
import Agujero from "./Agujero";
import "../Style/AtrapaAlTopo.css";

const niveles = [
  { id: 1, agujeros: 9, duracionVisible: 1000, objetivo: 5 },
  { id: 2, agujeros: 9, duracionVisible: 900, objetivo: 8 },
  { id: 3, agujeros: 9, duracionVisible: 900, objetivo: 10 },
  { id: 4, agujeros: 9, duracionVisible: 850, objetivo: 14 },
  { id: 5, agujeros: 9, duracionVisible: 850, objetivo: 18 },
  { id: 6, agujeros: 9, duracionVisible: 850, objetivo: 20 },
];

const TIEMPO_JUEGO = 20;
const sonidoGolpe = new Audio("./audio/pop-402324.mp3");

export const AtrapaAlTopo = () => {
  const [estadoJuego, setEstadoJuego] = useState("mapa");
  const [nivelActual, setNivelActual] = useState(1);

  const [nivelesDesbloqueados, setNivelesDesbloqueados] = useState([1]);
  const [estrellasPorNivel, setEstrellasPorNivel] = useState({});

  const [puntaje, setPuntaje] = useState(0);
  const [tiempo, setTiempo] = useState(TIEMPO_JUEGO);
  const [agujeroVisible, setAgujeroVisible] = useState(null);

  const nivel = niveles.find((n) => n.id === nivelActual);


  const calcularEstrellas = useCallback(() => {
    const objetivo = Number(nivel?.objetivo);

    if (!objetivo || objetivo <= 0) return 0;
    if (puntaje <= 0) return 0;
    if (puntaje >= objetivo) return 3;
    if (puntaje >= Math.ceil(objetivo * 0.66)) return 2;
    return 1;
  }, [puntaje, nivel]);

  const estrellas = estadoJuego === "jugando" && puntaje > 0 
    ? calcularEstrellas() 
    : 0;

  
  useEffect(() => {
    if (estadoJuego !== "jugando") return;
    if (tiempo === 0) {
      setEstadoJuego("fin");
      return;
    }

    const timer = setTimeout(() => setTiempo((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [tiempo, estadoJuego]);

  
  useEffect(() => {
    if (estadoJuego !== "jugando") return;

    let esconderTimeout;
    const intervalo = setInterval(() => {
      const nuevo = Math.floor(Math.random() * nivel.agujeros);
      setAgujeroVisible(nuevo);

      esconderTimeout = setTimeout(() => {
        setAgujeroVisible((prev) => (prev === nuevo ? null : prev));
      }, nivel.duracionVisible);
    }, nivel.duracionVisible + 300);

    return () => {
      clearInterval(intervalo);
      clearTimeout(esconderTimeout);
    };
  }, [estadoJuego, nivel]);


  const handleTopoClick = useCallback(
    (index) => {
      if (estadoJuego !== "jugando") return;
      if (index === agujeroVisible) {
        sonidoGolpe.currentTime = 0;
        sonidoGolpe.play().catch(e => console.error(e)); 
        setPuntaje((p) => p + 1);
        setAgujeroVisible(null);
      }
    },
    [estadoJuego, agujeroVisible]
  );


  const guardarProgreso = () => {
    const estrellasGanadas = calcularEstrellas();


    setEstrellasPorNivel((prev) => ({
      ...prev,
      [nivelActual]: Math.max(prev[nivelActual] || 0, estrellasGanadas),
    }));


    const siguiente = nivelActual + 1;
    const existeSiguienteNivel = niveles.find((n) => n.id === siguiente);

    if (
      estrellasGanadas >= 1 && 
      !nivelesDesbloqueados.includes(siguiente) &&
      existeSiguienteNivel
    ) {
      setNivelesDesbloqueados((prev) => [...prev, siguiente]);
    }
  };

  const empezarNivel = (id) => {
    setNivelActual(id);
    setPuntaje(0);
    setTiempo(TIEMPO_JUEGO);
    setAgujeroVisible(null);
    setEstadoJuego("jugando");
  };

  const volverAlMapa = () => {
    if (estadoJuego === "fin" && calcularEstrellas() >= 1) {
      guardarProgreso();
    }
    setEstadoJuego("mapa");
  };

  const siguienteNivel = () => {
    guardarProgreso();
    const siguiente = nivelActual + 1;

    if (niveles.find((n) => n.id === siguiente)) {
      empezarNivel(siguiente);
    } else {
      setEstadoJuego("mapa");
    }
  };


  const nivelSuperado = calcularEstrellas() >= 1;

  return (
    <div className="atrapa-al-topo-wrapper">
      <div className="atrapa-al-topo-container">


        {estadoJuego === "mapa" && (
          <div className="pantalla-mapa">
            <h1>🌍 Mapa de Niveles</h1>

            <div className="niveles-grid">
              {niveles.map((n) => (
                <div key={n.id}>
                  <button
                    className={`nivel-btn ${
                      nivelesDesbloqueados.includes(n.id)
                        ? "desbloqueado"
                        : "bloqueado"
                    }`}
                    onClick={() =>
                      nivelesDesbloqueados.includes(n.id) &&
                      empezarNivel(n.id)
                    }
                    disabled={!nivelesDesbloqueados.includes(n.id)}
                  >
                    {n.id}
                  </button>

                  <div className="mini-estrellas">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <span
                        key={i}
                        className={`mini-estrella ${
                          i < (estrellasPorNivel[n.id] || 0)
                            ? "llena"
                            : "vacia"
                        }`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {estadoJuego === "jugando" && (
          <div className="pantalla-juego">
            <div className="nivel-con-estrellas">
              <h2>Nivel {nivelActual}</h2>

              <div className="estrellas">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span
                    key={i}
                    className={`estrella ${
                      i < estrellas ? "llena" : "vacia"
                    }`}
                  >
                    ⭐
                  </span>
                ))}
              </div>
            </div>

            <div className="metricas">
              <h3 className="puntaje">Puntaje: {puntaje}</h3>
              <h3 className="tiempo">Tiempo: {tiempo}s</h3>
              <h3 className="objetivo">Objetivo: {nivel.objetivo}</h3>
            </div>

            <div className="tablero">
              {Array.from({ length: 9 }).map((_, index) => (
                <Agujero
                  key={index}
                  isVisible={index === agujeroVisible}
                  onClick={() => handleTopoClick(index)}
                />
              ))}
            </div>
          </div>
        )}

     
        {estadoJuego === "fin" && (
          <div className="pantalla-fin">
            <h2>¡Nivel {nivelActual} terminado!</h2>
            <p>Puntaje final: {puntaje}</p>

            <div className="estrellas">
              {Array.from({ length: 3 }).map((_, i) => (
                <span
                  key={i}
                  className={`estrella ${
                    i < calcularEstrellas() ? "llena" : "vacia"
                  }`}
                >
                  ⭐
                </span>
              ))}
            </div>

            {nivelSuperado ? (
              <>
                <p>🎉 ¡Nivel superado!</p>
                <button onClick={siguienteNivel}>Siguiente Nivel</button>
              </>
            ) : (
              <>
                <p>😅 No alcanzaste suficientes puntos.</p>
                <button onClick={() => empezarNivel(nivelActual)}>
                  Reintentar
                </button>
              </>
            )}

            <button onClick={volverAlMapa}>Volver al Mapa</button>
          </div>
        )}

      </div>
    </div>
  );
};