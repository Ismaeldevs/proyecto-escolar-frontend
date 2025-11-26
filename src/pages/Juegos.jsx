import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../componentes/Header";
import Footer from "../componentes/Footer";
import "../style/juegos.css";

export default function Juegos() {
  const navigate = useNavigate();

  const juegos = [
    {
      id: 1,
      titulo: "Juego de Memoria",
      descripcion: "Encuentra las parejas lo más rápido posible.",
      ruta: "/juegodememoria",
      imagen: "/images/Gemini_Generated_Image_g3pnqgg3pnqgg3pn.png",
    },
    {
      id: 2,
      titulo: "Abecedario Desordenado",
      descripcion: "Responde preguntas y gana puntos.",
      ruta: "/juegoabecedariodesordenado",
      imagen: "/images/AbcDesordenadoimgPrincipal.png",
    },
    {
      id: 3,
      titulo: "Clasificación de Objetos",
      descripcion: "Agrega cada objeto a su lugar.",
      ruta: "/juegoclasificacion",
      imagen: "/images/clasificaygana.png",
    },
    {
      id: 4,
      titulo: "Relaciona los Plurales",
      descripcion: "Une cada imagen con su plural correcto.",
      ruta: "/juegoplurales",
      imagen: "/images/plurales.png",
    },
    {
      id: 5,
      titulo: "Atrapa al Topo",
      descripcion: "Haz clic en el topo antes de que desaparezca y gana estrellas.",
      ruta: "/juego-atrapa-al-topo",
      imagen: "/images/Atrapaaltopo.png",
    },
    {
      id: 6,
      titulo: "Tren Numérico",
      descripcion: "Arrastra los vagones y ordénalos correctamente.",
      ruta: "/tren-numerico",
      imagen: "/images/trennumerico.png",
    },
    {
      id: 7,
      titulo: "Rompecabezas de Vocales",
      descripcion: "Arma el rompecabezas de la vocal seleccionada.",
      ruta: "/rompecabezas",
      imagen: "/images/oso.png",
    },
  ];

 return (
    <>
      {/* Header fuera del div principal para que ocupe todo el ancho y no herede estilos */}
      <Header />

      <div className="juegos-page">
        <div className="lista-juegos-container">
          <h1>🎮 Elige tu juego</h1>

          <div className="lista-juegos-grid">
            {juegos.map((juego) => (
              <div key={juego.id} className="lista-juego-card">
                <img src={juego.imagen} alt={juego.titulo} />
                <h3>{juego.titulo}</h3>
                <p>{juego.descripcion}</p>
                <button onClick={() => navigate(juego.ruta)}>Jugar</button>
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

