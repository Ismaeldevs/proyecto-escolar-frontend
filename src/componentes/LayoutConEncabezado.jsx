// src/componentes/LayoutConEncabezado.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Encabezado from "./Encabezado"; // Ajustado a la carpeta componentes

const LayoutConEncabezado = () => {
  return (
    <div className="layout-con-encabezado">
      <Encabezado />
      <main className="flex-grow contenedor-principal">
        <Outlet /> {/* Aquí se renderizan las rutas hijas */}
      </main>
    </div>
  );
};

export default LayoutConEncabezado;
