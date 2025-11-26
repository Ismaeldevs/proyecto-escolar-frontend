import React, { useState, useEffect } from 'react';
import { socket } from '../socket/socket';
import './IndicadorConexion.css';

const IndicadorConexion = () => {
    const [conectado, setConectado] = useState(socket.connected);

    useEffect(() => {
        const onConnect = () => setConectado(true);
        const onDisconnect = () => setConectado(false);

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, []);

    return (
        <div className="indicador-conexion">
            <div className={`circulo-estado ${conectado ? 'conectado' : 'desconectado'}`}></div>
            <span className="texto-estado">{conectado ? 'Conectado' : 'Desconectado'}</span>
        </div>
    );
};

export default IndicadorConexion;
