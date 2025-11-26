import React from "react";
import "../Style/dibujos.css";
import Header from "../componentes/Header";
import Footer from "../componentes/Footer";

const Dibujos = () => {
  const categorias = [
    {
      titulo: "Animales",
      pdfs: ["perrito.pdf", "gatito.pdf", "leon.pdf", "jirafa.pdf", "conejos.pdf", "tiburon.pdf"]
    },
    {
      titulo: "Dibujos divertidos",
      pdfs: ["corazonarcoiris.pdf", "erizo.pdf", "dragon.pdf", "stitch.pdf", "unicornio.pdf", "casa.pdf"]
    },
    {
      titulo: "Letras",
      pdfs: ["letra-A.pdf", "letra-D.pdf", "letra-E.pdf", "letra-O.pdf", "letra-P.pdf", "letra-S.pdf"]
    },
    {
      titulo: "Números",
      pdfs: ["número-1.pdf", "número-2.pdf", "número-6.pdf", "número-7.pdf", "número-8.pdf", "número-4.pdf"]
    },
    {
      titulo: "Mándalas",
      pdfs: ["mandala-1.pdf", "mandala-2.pdf", "mandala-3.pdf", "mandala-4.pdf", "mandala-5.pdf", "mandala-6.pdf"]
    },
    {
      titulo: "Dibujos de Navidad",
      pdfs: ["papanoel.pdf", "reno.pdf", "calcetin.pdf", "chimenea.pdf", "duende.pdf", "arbol.pdf"]
    },
    {
      titulo: "Autos",
      pdfs: ["auto-en-el-espacio.pdf", "Deportivo.pdf", "Auto-de-Carreras(1).pdf", "Auto-de-Carreras.pdf", "policia.pdf", "Rally-en-la-jungla.pdf"]
    },
    {
      titulo: "Princesas",
      pdfs: ["bella.pdf", "blancanieves.pdf", "cenicienta.pdf", "frozeen.pdf", "moana.pdf", "rapunzel.pdf"]
    }
  ];

  return (
    <>
      {/* HEADER: Ocupa todo el ancho porque está fuera del container */}
      <Header />

      {/* CONTENEDOR: Centra solo el contenido del medio */}
    <div className="fondo-dibujos">
        <div className="dibujos-container">
          
          <div className="titulo-principal">
            <h1>Material para Colorear</h1>
            <p className="descripcion">
              Recursos simples, divertidos y listos para imprimir. ¡Elegí una categoría y empezá a colorear!
            </p>
          </div>

          {categorias.map((cat, index) => (
            <div key={index} className="categoria">
              <h2>{cat.titulo}</h2>

              <div className="grid-pdfs">
                {cat.pdfs.map((pdf, i) => (
                  <div key={i} className="card-pdf">
                    
                    {/* MINIATURA */}
                    <iframe
                      src={`/pdfs/${pdf}`}
                      className="mini-pdf"
                      title={pdf}
                    ></iframe>

                    {/* NOMBRE DEL PDF */}
                    <p>
                      {pdf
                        .replace(".pdf", "")
                        .charAt(0)
                        .toUpperCase() + pdf.replace(".pdf", "").slice(1)}
                    </p>

                    {/* BOTÓN DESCARGAR */}
                    <a
                      href={`/pdfs/${pdf}`}
                      download
                      className="boton-descargar"
                    >
                      Descargar PDF
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Dibujos;