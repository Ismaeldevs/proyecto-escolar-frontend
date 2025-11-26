import React from "react";
import Header from "../componentes/Header";
import Footer from "../componentes/Footer";
import RelacionaPlurales from "../componentes/RelacionaPlurales";

export default function JuegoRelacionaPluralesPage() {
  return (
    <div>
      <Header />

      <div className="page-juego">
        <h1>🔗 Relaciona los Plurales</h1>
        <p>Une cada imagen con su forma plural correcta y completa todos los niveles.</p>

        <div className="juego-container">
          <RelacionaPlurales />
        </div>
      </div>

      <Footer />
    </div>
  );
}
