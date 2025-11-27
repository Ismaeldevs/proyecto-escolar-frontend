import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";


export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    
    const [maestroActual, setMaestroActual] = useState(() => {
        const saved = localStorage.getItem('maestroActual');
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        if (maestroActual) {
            localStorage.setItem('maestroActual', JSON.stringify(maestroActual));
        } else {
            localStorage.removeItem('maestroActual');
        }
    }, [maestroActual]);


    const registrarMaestro = async (nombre, email, password) => {
        try {
            const response = await fetch(`${API_URL}/api/registro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, email, password })
            });
            const data = await response.json();

            if (data.success) {
                setMaestroActual(data.maestro);
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            return { success: false, message: "No se pudo conectar con el servidor." };
        }
    };

    const ingresarMaestro = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (data.success) {
                setMaestroActual(data.maestro);
                return { success: true };
            } else {
                return { success: false, message: data.message || "Credenciales inválidas" };
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            return { success: false, message: "Error de conexión con el servidor." };
        }
    };

    const cerrarSesionMaestro = () => {
        setMaestroActual(null);
    };

    return (
        <AuthContext.Provider value={{ maestroActual, registrarMaestro, ingresarMaestro, cerrarSesionMaestro }}>
            {children}
        </AuthContext.Provider>
    );
};