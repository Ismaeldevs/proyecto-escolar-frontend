import React from "react";
import Header from "../componentes/Header";
import Footer from "../componentes/Footer";
import TrenNumerico from "../componentes/TrenNumerico";

export default function TrenNumericoPage() {
  return (
    <div>
      <Header />
      <div className="page-juego">
        <TrenNumerico />
      </div>
      <Footer />
    </div>
  );
}
