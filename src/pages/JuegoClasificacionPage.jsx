import React from "react";
import Header from "../componentes/Header";
import Footer from "../componentes/Footer";
import JuegoClasificacion from "../componentes/JuegoClasificacion";

export default function JuegoClasificacionPage() {
  return (
    <div>
      <Header />
      <div className="page-juego flex flex-col items-center p-4">
        <h1 className="text-4xl font-bold mb-2">🧩 Juego de Clasificación</h1>
        <p className="text-lg mb-4 text-center">
          Arrastra los emojis a la categoría correcta antes de que se acabe el tiempo.
        </p>
        <div className="juego-container w-full flex justify-center">
          <JuegoClasificacion />
        </div>
      </div>
      <Footer />
    </div>
  );
}
