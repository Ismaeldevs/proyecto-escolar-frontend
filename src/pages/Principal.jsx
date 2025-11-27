import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { socket } from '../socket/socket'; 
import Header from '../componentes/Header';
import Footer from '../componentes/Footer';
import '../Style/Principal.css';

const Principal = () => {

const [msg, setMsg] = useState("");
  const [logs, setLogs] = useState([]);

  // useEffect(() => {
  //   socket.on("mensaje_servidor", (data) => {
  //     setLogs((prev) => [...prev, data]);
  //   });

  //   return () => {
  //     socket.off("mensaje_servidor");
  //   };
  // }, []);

  // const enviar = () => {
  //   socket.emit("mensaje_cliente", msg);
  //   setMsg("");
  // };




  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleNavigation = (path) => {
    window.scrollTo(0, 0);
    navigate(path);
  };

  const scrollToSection = () => {
    const element = document.getElementById('explorar');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [slideIndex, setSlideIndex] = useState(0);

  const slides = [
    {
      id: 1,
      titulo: "¡Bienvenido a Saltamontes!",
      texto: "Un lugar mágico para aprender, jugar y crear.",
      // === CAMBIO: AQUÍ VA TU MASCOTA (Sin emoji de grillo) ===
      // Asegúrate de poner la ruta correcta de tu imagen aquí
      mascotaImg: "./imagenmascota/saludando.png", 
      imagen: "Saltamontes.jpg" 
    },
    {
      id: 2,
      titulo: "¡Hora de Pintar!",
      texto: "Usa nuestro lienzo, pon stickers y descarga tu obra de arte.",
      emoji: "🎨",
      imagen: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1600&q=80"
    },
    {
      id: 3,
      titulo: "Aula Virtual",
      texto: "Maestros y alumnos conectados aprendiendo juntos.",
      emoji: "🏫",
      imagen: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const secciones = [
    { id: "juegos", titulo: "Juegos", desc: "Memoria, Abecedario y más", icono: "🎮", color: "card-red", link: "/juegos" },
    { id: "canciones", titulo: "Canciones", desc: "Tradicionales, Granja y más", icono: "🎶", color: "card-yellow", link: "/canciones" },
    { id: "colorear", titulo: "A Colorear", desc: "Lienzo digital con stickers", icono: "🖍️", color: "card-purple", link: "/colorear" },
    { id: "adivinanzas", titulo: "Adivinanzas", desc: "¡Pon a prueba tu ingenio!", icono: "🤔", color: "card-blue", link: "/adivinanzas" },
    { id: "dibujos", titulo: "Imprimibles", desc: "Descarga y pinta en papel", icono: "🖨️", color: "card-orange", link: "/dibujos" },
    { id: "recursos", titulo: "Recursos PDF", desc: "Matemáticas y Lengua", icono: "📚", color: "card-green", link: "/recursos" }
  ];

  return (
    <div className="contenedor-pagina-principal">
      
      <Header />

      <div className="main-layout">
        <main className="home-content">

          
          <section
            className="hero-section"
            style={{ backgroundImage: `url(${slides[slideIndex].imagen})` }}
          >
            <div className="hero-overlay"></div>

            <div className="hero-container">
              <div className="hero-text fade-in">
                
               
                <div className="hero-icon-wrapper">
                  {slides[slideIndex].mascotaImg ? (
                    <img 
                      src={slides[slideIndex].mascotaImg} 
                      alt="Mascota Saltamontes" 
                      className="hero-mascota-img"
                    />
                  ) : (
                    <span className="hero-icon">{slides[slideIndex].emoji}</span>
                  )}
                </div>

                <h1>{slides[slideIndex].titulo}</h1>
                <p>{slides[slideIndex].texto}</p>

                <button className="btn-hero" onClick={scrollToSection}>
                  ¡Comenzar Aventura!
                </button>
              </div>

              <div className="slider-dots">
                {slides.map((_, idx) => (
                  <span
                    key={idx}
                    className={`dot ${idx === slideIndex ? 'active' : ''}`}
                    onClick={() => setSlideIndex(idx)}
                  ></span>
                ))}
              </div>
            </div>

            <div className="wave-separator">
              <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
                <path className="wave-path" fillOpacity="1" d="
                  M0,128L48,144C96,160,192,192,288,186.7C384,181,480,139,576,122.7C672,107,768,117,864,138.7C960,160,1056,192,1152,192C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
              </svg>
            </div>
          </section>

     
          <section id="explorar" className="categories-container">
            <div className="section-header">
              <h2>Explora nuestro mundo 🌍</h2>
              <p>Elige tu actividad favorita</p>
            </div>

            <div className="cards-grid">
              {secciones.map((item) => (
                <div key={item.id} className={`category-card ${item.color}`}>
                  <div className="card-icon-wrapper">
                    {item.icono}
                  </div>
                  <h3>{item.titulo}</h3>
                  <p>{item.desc}</p>

                  <button
                    className="btn-card"
                    onClick={() => handleNavigation(item.link)}
                  >
                    Ir a {item.titulo}
                  </button>
                </div>
              ))}
            </div>
          </section>

         
          <section className="features-section">
            <div className="bento-grid">

              <div className="bento-item teacher-zone">
                <div className="bento-content">
                  <h4>🍎 Zona de Maestros</h4>
                  <p>Crea salas de preguntas y recibe las respuestas de tus alumnos en tiempo real.</p>
                  <button
                    className="btn-outline"
                    onClick={() => navigate('/inicio')} 
                  >
                    Ingresar como Profe
                  </button>
                </div>
                <div className="bento-img">👩‍🏫</div>
              </div>

              <div className="bento-item fun-fact">
                <h5>💡 ¿Sabías qué?</h5>
                <p>Los saltamontes tienen oídos en sus barrigas.</p>
              </div>

            </div>
          </section>

        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Principal;