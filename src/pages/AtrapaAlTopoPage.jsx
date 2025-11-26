import React from "react";
import Header from "../componentes/Header";
import Footer from "../componentes/Footer";
import { AtrapaAlTopo } from "../componentes/AtrapaAlTopo";

export default function AtrapaAlTopoPage() {
  return (
    <div className="atrapa-al-topo-page-wrapper">
      <Header />
      <div className="page-juego">
        <div className="juego-container">
          <AtrapaAlTopo />
        </div>
      </div>
      <Footer />
    </div>
  );
}
