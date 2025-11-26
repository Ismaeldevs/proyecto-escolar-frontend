// src/Componentes/TarjetaEstadistica.jsx
import React from 'react';
import './TarjetaEstadistica.css';

const TarjetaEstadistica = ({ titulo, valor, icono, color }) => (
    <div className={`tarjeta-estadistica ${color}`}>
        <span className='icono-grande'>{icono}</span>
        <div>
            <p className='titulo-tarjeta'>{titulo}</p>
            <p className='valor-tarjeta'>{valor}</p>
        </div>
    </div>
);

export default TarjetaEstadistica;