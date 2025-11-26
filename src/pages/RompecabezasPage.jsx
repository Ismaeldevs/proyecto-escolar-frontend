import React from "react";
import Header from "../componentes/Header";
import Footer from "../componentes/Footer";
import RompecabezasJuego from "../componentes/RompecabezasJuego";

export default function RompecabezasPage() {
  return (
    <div>
      <Header />
      <div className="page-juego">
        <div className="juego-container">
          <RompecabezasJuego />
        </div>
      </div>
      <Footer />
    </div>
  );
}
