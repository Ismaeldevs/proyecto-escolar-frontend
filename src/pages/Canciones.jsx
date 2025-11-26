import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Style/canciones.css";
import Header from "../componentes/Header";
import Footer from "../componentes/Footer";

export default function Canciones() {
  const navigate = useNavigate();
  const [videoEmbedUrl, setVideoEmbedUrl] = useState(null);

  // 🎵 Datos de canciones
  const secciones = [
    {
      categoria: "Canciones Tradicionales",
      canciones: [
        {
          id: "ct1",
          titulo: "Estrellita, ¿Dónde Estás?",
          artista: "LooLoo Kids",
          imagen: "./imagenCancion/pestrella.png",
          videoUrl: "https://www.youtube.com/watch?v=cZvsDDjK9o0",
        },
        {
          id: "ct2",
          titulo: "Incy Wincy Araña",
          artista: "La Granja de Zenón",
          imagen: "./imagenCancion/paraña.png",
          videoUrl: "https://youtu.be/HHg4t0Ibnr8?si=QMywVEJ5Vtm3ATMQ",
        },
        {
          id: "ct3",
          titulo: "Arroz con Leche",
          artista: "ToyCantando",
          imagen: "./imagenCancion/arrozconleche.png", 
          videoUrl: "https://youtu.be/-QLLboEyOs4?si=sRnO6MIx2FgLyfSc",
        },
        {
          id: "ct4",
          titulo: "Señora Vaca",
          artista: "La Granja de Zenón",
          imagen: "./imagenCancion/señoravaca.png",
          videoUrl: "https://youtu.be/jjXafQKFY28?si=QPlXXYr-s79Z2N8X",
        },
      ],
    },
   
    {
      categoria: "Primeros Aprendizajes",
      canciones: [
        {
          id: "e1",
          titulo: "Aprendemos los números",
          artista: "El Reino Infantil",
          imagen: "./imagenCancion/cancionnumero.png",
          videoUrl: "https://youtu.be/pSqnl2eSu9Y?si=8ClWN9PiF_H38_oz",
        },
        {
          id: "e2",
          titulo: "La canción de los colores",
          artista: "ToyCantando",
          imagen: "./imagenCancion/colores.png",
          videoUrl: "https://youtu.be/Vh4OqNrk130?si=CAVIR9bW0SsiwcO7",
        },
        {
          id: "e3",
          titulo: "Aprende las Vocales",
          artista: "Bichikids",
          imagen: "./imagenCancion/vocales.png",
          videoUrl: "https://youtu.be/FwoulzCrwDM?si=WZOkbTwFo8wmPdLJ",
        },
        {
          id: "e4",
          titulo: "Aprende el Abecedario",
          artista: "El Payaso Plim Plim",
          imagen: "./imagenCancion/ABC.png",
          videoUrl: "https://youtu.be/w8MD_Uto4NQ?si=P-bRTbLKucEtH7vm",
        },
      ],
    },

    {
      categoria: "Hábitos y Rutinas",
      canciones: [
        {
          id: "h1",
          titulo: "Hasta Mañana-A la Camita",
          artista: "Topo Gigio",
          imagen: "./imagenCancion/topogigio.png",
          videoUrl: "https://youtu.be/_KIFTQgUaO0?si=iE8HE7_669KWpUhb",
        },
        {
          id: "h2",
          titulo: "¡A Cepillarnos Los Dientes! 🎵🪥",
          artista: "El Payaso Plim Plim",
          imagen: "./imagenCancion/cepillar.png",
          videoUrl: "https://youtu.be/Rp6MJPzB2nE?si=NsrY7QX0vzFmj58v",
        },
        {
          id: "h3",
          titulo: "Manitos Limpias",
          artista: "Super Simple Español",
          imagen: "./imagenCancion/manitoslimpias.png", 
          videoUrl: "https://youtu.be/h-0NPK09ANo?si=fUUYInntRIvaB4se",
        },
        {
          id: "h4",
          titulo: "Si Tú Tienes Muchas Ganas de Comer 🍎🍌",
          artista: "El Payaso Plim Plim",
          imagen: "./imagenCancion/muchasganasdecomer.png",
          videoUrl: "https://youtu.be/phKUCN3tGms?si=Vc_Ce4etvahsHGOw",
        },
        {
          id: "h5",
          titulo: "Canción para Atarse los Cordones",
          artista: "Moonbug Kids en español",
          imagen: "./imagenCancion/cordones.png", 
          videoUrl: "https://youtu.be/PL69Ph2prWo?si=RrMC5DXugyLWqnpo",
        },
      ],
    },

    {
      categoria: "Para Jugar y Bailar",
      canciones: [
        {
          id: "j1",
          titulo: "Soy una Taza",
          artista: "Topa",
          imagen: "./imagenCancion/topa.jpg", 
          videoUrl: "https://youtu.be/bzOcpIOKlKI?si=OyWMnOXyTQkCo25d",
        },
        {
          id: "j2",
          titulo: "FRENTE HOMBROS PIERNAS PIES ",
          artista: "Luli Pampín",
          imagen: "./imagenCancion/luliytopa.jpg", 
          videoUrl: "https://youtu.be/5IOii10dmRc?si=_2mK1skAKqJPhHP_",
        },
        {
          id: "j3",
          titulo: "Si Usted Tiene Muchas Ganas de Aplaudir",
          artista: "El Reino Infantil",
          imagen: "./imagenCancion/bichokids.png", 
          videoUrl: "https://youtu.be/mO2Xwv4g2XE?si=Fai3k65ABgqw5bCD",
        },
        {
          id: "j4",
          titulo: "El Baile del Sapito",
          artista: "El Payaso Plim Plim",
          imagen: "./imagenCancion/elbailedelsapito.png", 
          videoUrl: "https://youtu.be/oDTX-yP52rg?si=-0s_03HZ862dRswk",
        },
        {
          id: "j5",
          titulo: "Chu Chu Ua",
          artista: "Piñón Fijo",
          imagen: "./imagenCancion/chuchua.png", 
          videoUrl: "https://youtu.be/BU5aTeBEXlI?si=8mEdFjuMR3DMVPZD",
        },
      ],
    },

    {
      categoria: "Animales y La Granja",
      canciones: [
        {
          id: "ag1",
          titulo: "Los pollitos dicen",
          artista: "ToyCantando",
          imagen: "./imagenCancion/pollitos.png",
          videoUrl: "https://youtu.be/PVv7pIssaMc?si=DGGXHu_iMRn2PdgJ",
        },
        {
          id: "ag2",
          titulo: "Bartolito",
          artista: "La Granja de Zenón",
          imagen: "./imagenCancion/Bartolito.png", 
          videoUrl: "https://youtu.be/ebVVuJN1WFM?si=ZwaAr64VPt0tBZcA",
        },
        {
          id: "ag3",
          titulo: "La Gallina Turuleca",
          artista: "La Granja de Zenón",
          imagen: "./imagenCancion/gallinaturuleca.jpg",
          videoUrl: "https://youtu.be/d7Mh6uqHyuI?si=0AldC_NpstcxjEbt",
        },
        {
          id: "ag4",
          titulo: "El Pollito Pío",
          artista: "El Reino Infantil",
          imagen: "./imagenCancion/pollitopio.png",
          videoUrl: "https://youtu.be/wPNQw8naE2Q?si=Hvwi0n6ZIurL6rR6",
        },
      ],
    },
  ];

  // 🎵 Función para CONVERTIR la URL y mostrar el video
  const handlePlay = (watchUrl) => {
    try {
      const url = new URL(watchUrl);
      let videoId = null;

      if (url.hostname === "youtu.be") {
        videoId = url.pathname.substring(1);
      } else if (
        url.hostname === "www.youtube.com" ||
        url.hostname === "youtube.com"
      ) {
        videoId = url.searchParams.get("v");
      }

      if (videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        setVideoEmbedUrl(embedUrl);
      } else {
        console.error("URL de YouTube no válida o no reconocida:", watchUrl);
      }
    } catch (error) {
      console.error("Error al procesar la URL:", error);
    }
  };

  return (
    <>
      {/* 1. Header afuera (ocupa todo el ancho) */}
      <Header />

      {/* 2. Contenedor solo para el contenido */}
      <div className="canciones-page">
        <h1>🎵 Canciones Infantiles</h1>

        {secciones.map((seccion) => (
          <section key={seccion.categoria} className="canciones-seccion">
            <h2>{seccion.categoria}</h2>
            <ul>
              {seccion.canciones.map((cancion) => (
                <li key={cancion.id} className="cancion-item">
                  <img
                    src={cancion.imagen}
                    alt={cancion.titulo}
                    className="cancion-imagen"
                  />
                  <div className="cancion-info">
                    <a
                      href={cancion.videoUrl}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePlay(cancion.videoUrl);
                      }}
                    >
                      🎶 {cancion.titulo}
                    </a>
                    <p className="artista">{cancion.artista}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* 3. Modal del video (fuera del contenedor para que cubra todo) */}
      {videoEmbedUrl && (
        <div
          className="video-modal-backdrop"
          onClick={() => setVideoEmbedUrl(null)}
        >
          <div
            className="video-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              className="video-iframe"
              src={videoEmbedUrl}
              title="Reproductor de video de YouTube"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <button
              onClick={() => setVideoEmbedUrl(null)}
              className="cerrar-modal-btn"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* 4. Footer afuera */}
      <Footer />
    </>
  );
}