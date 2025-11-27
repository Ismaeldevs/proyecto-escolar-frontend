// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// --- Contextos Globales ---
import { AuthProvider } from './Contextos/AuthContext.jsx';
import { DatosProvider } from './Contextos/DatosContext.jsx';



// --- Layout con Encabezado ---
import LayoutConEncabezado from './componentes/LayoutConEncabezado.jsx';

// --- Páginas Generales ---

import Principal from './pages/Principal.jsx';
import Inicio from './pages/Inicio.jsx';
import MaestroRegistro from './pages/Maestro/Registro';
import MaestroIngreso from './pages/Maestro/Ingreso';


// --- Páginas de Maestro ---
import MaestroEscritorio from './pages/Maestro/Escritorio';
import MaestroCrearSala from './pages/Maestro/CrearSala';
import MaestroCrearTarea from './pages/Maestro/CrearTarea';
import MaestroEditarTarea from './pages/Maestro/EditarTarea';
import MaestroProgreso from './pages/Maestro/Progreso';
import GestionAsistencia from './pages/Maestro/GestionAsistencia';
import MaestroCrearJuego from './pages/Maestro/CrearJuego';
import JuegoEnVivoMaestro from './pages/Maestro/JuegoEnVivoMaestro';

// --- Páginas de Estudiante ---
import EstudianteIngresoSala from './pages/Estudiante/IngresoSala';
import EstudianteListaTareas from './pages/Estudiante/ListaTareas';
import EstudianteVistaTarea from './pages/Estudiante/VistaTarea';
import JuegoEnVivoEstudiante from './pages/Estudiante/JuegoEnVivoEstudiante';

// --- Otras Páginas ---
import Canciones from './pages/Canciones.jsx';
import Colorear from './pages/Colorear.jsx';
import Dibujos from './pages/Dibujos.jsx';
import Adivinanzas from './pages/Adivinanzas.jsx';
import Juegos from './pages/Juegos.jsx';

// --- Juegos ---
import MemoriaPage from './pages/JuegoDeMemoriaPage.jsx';
import AbecedarioPage from './pages/JuegoAbecedarioDesordenadoPage.jsx';
import JuegoClasificacionPage from './pages/JuegoClasificacionPage.jsx';
import JuegoRelacionaPluralesPage from './pages/JuegoRelacionaPluralesPage.jsx';
import AtrapaAlTopoPage from './pages/AtrapaAlTopoPage.jsx';  
import TrenNumericoPage from './pages/TrenNumericoPage.jsx';
import RompecabezasPage from './pages/RompecabezasPage.jsx'; // ← NUEVO

// --- Recursos ---
import Recursos from './pages/Recursos.jsx';


const App = () => {
    console.log('App component rendering');
    console.log('API_URL:', import.meta.env.VITE_API_URL);
    
    return (
    <AuthProvider>
        <DatosProvider>
            <BrowserRouter>
                <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
                    <Routes>

                        {/* ------------------ RUTAS SIN ENCABEZADO ------------------ */}
                        <Route path="/" element={<Principal />} />

                        {/* Contenido General */}
                        <Route path="/canciones" element={<Canciones />} />
                        <Route path="/colorear" element={<Colorear />} />
                        <Route path="/dibujos" element={<Dibujos />} />
                        <Route path="/adivinanzas" element={<Adivinanzas />} />
                        <Route path="/juegos" element={<Juegos />} />

                        {/* Juegos */}
                        <Route path="/juegodememoria" element={<MemoriaPage />} />
                        <Route path="/juegoabecedariodesordenado" element={<AbecedarioPage />} />
                        <Route path="/juegoclasificacion" element={<JuegoClasificacionPage />} />
                        <Route path="/juegoplurales" element={<JuegoRelacionaPluralesPage />} />
                        <Route path="/juego-atrapa-al-topo" element={<AtrapaAlTopoPage />} />
                        <Route path="/tren-numerico" element={<TrenNumericoPage />} />
                        <Route path="/rompecabezas" element={<RompecabezasPage />} /> {/* NUEVO */}

                        {/* Recursos */}
                        <Route path="/recursos" element={<Recursos />} />
                        <Route path="/inicio" element={<Inicio />} />

                        {/* ------------------ RUTAS CON ENCABEZADO ------------------ */}
                        <Route element={<LayoutConEncabezado />}>

                            {/* General */}
                            
                            <Route path="/registro" element={<MaestroRegistro />} />
                            <Route path="/ingreso" element={<MaestroIngreso />} />

                            {/* Maestro */}
                            <Route path="/escritorio" element={<MaestroEscritorio />} />
                            <Route path="/crear-sala" element={<MaestroCrearSala />} />
                            <Route path="/crear-tarea" element={<MaestroCrearTarea />} />
                            <Route path="/editar-tarea/:roomId/:taskId" element={<MaestroEditarTarea />} />
                            <Route path="/progreso/:roomId/:taskId" element={<MaestroProgreso />} />
                            <Route path="/asistencia/:salaId" element={<GestionAsistencia />} />
                            <Route path="/crear-juego" element={<MaestroCrearJuego />} />
                            <Route path="/juego-vivo/maestro" element={<JuegoEnVivoMaestro />} />

                            {/* Estudiante */}
                            <Route path="/estudiante/sala" element={<EstudianteIngresoSala />} />
                            <Route path="/estudiante/seleccion-tarea" element={<EstudianteListaTareas />} />
                            <Route path="/estudiante/tarea" element={<EstudianteVistaTarea />} />
                            <Route path="/juego-vivo/estudiante" element={<JuegoEnVivoEstudiante />} />

                        </Route>
                    </Routes>
                </div>
            </BrowserRouter>
        </DatosProvider>
    </AuthProvider>
    );
};

export default App;
