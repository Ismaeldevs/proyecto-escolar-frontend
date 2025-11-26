import React from "react";
import Header from "../componentes/Header";
import Footer from "../componentes/Footer";
import Abecedario from "../componentes/JuegoAbecedarioDesordenado"; 

export default function AbecedarioPage() {
  return (
    <div>
      <Header />
      <div className="page-juego">
        <h1>🔤 Abecedario a su Sitio</h1>
        <p>
          Las letras se han caído 😱 — ¡Ayuda a colocarlas en su lugar correcto
          arrastrándolas hasta su sitio!
        </p>
        <div className="juego-container">
          <Abecedario />
        </div>
      </div>
      <Footer />
    </div>
  );
}
