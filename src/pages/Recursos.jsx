import React from "react";
import { useNavigate } from "react-router-dom";
import "../Style/Recursos.css"; 
import Header from '../componentes/Header'; 
import Footer from '../componentes/Footer';

const pdfs = [
  { nombre: "Adjetivos", archivo: "/pdfs/Adjetivos.pdf" },
  { nombre: "Sustantivos", archivo: "/pdfs/Sustantivos.pdf" },
  { nombre: "Verbos", archivo: "/pdfs/Verbos.pdf" },
  { nombre: "Escribo mi nombre", archivo: "/pdfs/escribo-mi-nombre.pdf" },
  { nombre: "Abecedario", archivo: "/pdfs/Abecedario.pdf" },
  { nombre: "Formas", archivo: "/pdfs/Formas.pdf" },
  { nombre: "Las Vocales", archivo: "/pdfs/Vocales.pdf" },
  { nombre: "Grafomotricidad Creativa", archivo: "/pdfs/GrafomotricidadCreativaNúmerosIlustrados1al9.pdf" },
  { nombre: "Colorea y Remarca", archivo: "/pdfs/Colorea y Remarca.pdf" },
  { nombre: "Patrones en Zig Zag", archivo: "/pdfs/PatronesZigZag.pdf" },
];

function Recursos() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      
      {/* Usamos 'recursos-page-wrapper' para aplicar el fondo pastel 
        SOLO a esta sección y no a todo el body 
      */}
      <div className="recursos-page-wrapper">
        <div className="recursos-main-container">
          
          <h1 className="recursos-titulo">Recursos</h1>
          <h2 className="recursos-subtitulo">Somos Saltamontes</h2>

          <p className="recursos-descripcion">
            ¡Te damos la bienvenida a nuestra colección de Recursos Educativos para Primaria!  
            Aquí vas a encontrar materiales pensados especialmente para que los chicos
            aprendan de manera divertida y sencilla.
          </p>

          <div className="recursos-grid">
            {pdfs.map((pdf, index) => (
              <div className="recursos-card" key={index}>
                
                <div className="recursos-pdf-preview">
                  <embed 
                    src={`${pdf.archivo}#toolbar=0&navpanes=0&view=FitH`} 
                    type="application/pdf" 
                  />
                </div>

                <div className="recursos-card-content">
                    <h3 className="recursos-card-title">{pdf.nombre}</h3>
                    <a
                      href={pdf.archivo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="recursos-btn-ver"
                    >
                      Ver PDF Completo
                    </a>
                </div>
              </div>
            ))}
          </div>

          <div className="recursos-btn-volver-container">
              <button className="recursos-btn-volver" onClick={() => navigate("/")}>
                ⬅ Volver al Inicio
              </button>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default Recursos;