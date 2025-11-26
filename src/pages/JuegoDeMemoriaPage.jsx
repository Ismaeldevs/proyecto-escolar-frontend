import React from "react";
import Header from "../componentes/Header";
import Footer from "../componentes/Footer";
import JuegoMemoria from "../componentes/JuegoDeMemoria";



export default function MemoriaPage() {
  return (
    <div>
      <Header />
      <div className="page-juego">
        <h1>🎴 Juego de Memoria</h1>
        <p>Encuentra todas las parejas antes de que se acabe el tiempo.</p>
        <div className="juego-container">
          <JuegoMemoria />
        </div>
      </div>
      <Footer />
    </div>
  );
}
