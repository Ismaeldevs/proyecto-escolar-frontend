import { useState } from "react";
import Header from '../componentes/Header'; 
import Footer from '../componentes/Footer';
import "../Style/adivinanzas.css"; 

const Adivinanzas = () => {
  const categorias = [
    {
      titulo: "Animales",
      color: "verde", 
      lista: [
        { pregunta: "¿Cuál es el animal que tiene cama y nunca duerme?", respuesta: "El camello 🐪" },
        { pregunta: "¿Cuál es el animal que es dos veces animal?", respuesta: "El gato (porque es gato y araña) 😸" },
        { pregunta: "Vuelo de noche y duermo de día, pero no tengo plumas.", respuesta: "El murciélago 🦇" },
        { pregunta: "Tiene silla pero no se puede sentar.", respuesta: "El caballo 🐴" },
        { pregunta: "Salta y salta y la cola le falta.", respuesta: "El sapo 🐸" },
        { pregunta: "¿Quién anda con casa al hombro?", respuesta: "El caracol 🐌" },
      ]
    },
    {
      titulo: "Frutas",
      color: "rosa", 
      lista: [
        { pregunta: "Soy amarilla por fuera y blanca por dentro. Me pelan para comerme.", respuesta: "La banana 🍌" },
        { pregunta: "Soy roja, dulce y tengo semillas afuera.", respuesta: "La frutilla 🍓" },
        { pregunta: "Me cortan y lloro.", respuesta: "La cebolla 😂" },
        { pregunta: "Redonda, jugosa y crezco en el árbol del mismo nombre.", respuesta: "La naranja 🍊" },
        { pregunta: "Tengo corona pero no soy rey.", respuesta: "La piña/ananá 🍍" },
        { pregunta: "Soy chiquita, roja y vengo en racimos.", respuesta: "La uva 🍇" },
      ]
    },
    {
      titulo: "Transporte",
      color: "amarillo",
      lista: [
        { pregunta: "Tiene ruedas pero no es auto, tiene timbre pero no es casa.", respuesta: "La bicicleta 🚲" },
        { pregunta: "Vuelo pero no soy ave.", respuesta: "El avión ✈" },
        { pregunta: "Tiene motor pero no va por tierra.", respuesta: "El barco ⛴" },
        { pregunta: "Llevo mucha gente y paro en estaciones.", respuesta: "El tren 🚆" },
        { pregunta: "Va por la ciudad sin ruedas.", respuesta: "El subte 🚇" },
        { pregunta: "Tiene ruedas grandes y transporta cajas.", respuesta: "El camión 🚛" },
      ]
    },
    {
      titulo: "Profesiones",
      color: "celeste",
      lista: [
        { pregunta: "Curo gente y uso guardapolvo.", respuesta: "El médico 👨‍⚕️" },
        { pregunta: "Apago incendios y soy muy valiente.", respuesta: "El bombero 🚒" },
        { pregunta: "Construyo casas y edificios.", respuesta: "El albañil 👷" },
        { pregunta: "Enseño y acompaño a los chicos.", respuesta: "La maestra 👩‍🏫" },
        { pregunta: "Corto el pelo y barro el piso.", respuesta: "El peluquero 💇" },
        { pregunta: "Cuido animales y los reviso.", respuesta: "El veterinario 🐶" },
      ]
    },
    {
      titulo: "Números",
      color: "morado",
      lista: [
        { pregunta: "Si me das la vuelta soy el mismo. ¿Qué número soy?", respuesta: "El 0️⃣" },
        { pregunta: "Soy redondo como la luna y detrás de mí viene el 1.", respuesta: "El 0️⃣" },
        { pregunta: "Soy mitad de 2 y doble de 0.", respuesta: "El 1️⃣" },
        { pregunta: "Dos patitos caminando juntos.", respuesta: "El 22 🦆" },
        { pregunta: "Me doy vuelta y parezco una silla.", respuesta: "El 4️⃣" },
        { pregunta: "Soy el número favorito de los gatos.", respuesta: "El 7 😺" },
      ]
    },
    {
      titulo: "Difíciles",
      color: "naranja",
      lista: [
        { pregunta: "Oro parece, plata no es. El que no lo adivine, bien tonto es.", respuesta: "El plátano 🍌" },
        { pregunta: "Tengo agujas pero no pincho. ¿Quién soy?", respuesta: "El reloj ⏰" },
        { pregunta: "Tengo ciudades pero no casas, tengo montañas pero no árboles.", respuesta: "El mapa 🗺️" },
        { pregunta: "Mientras más grande soy, menos se ve.", respuesta: "La oscuridad 🌑" },
        { pregunta: "¿Qué cosa cuanto más seca, más moja?", respuesta: "La toalla 🧖" },
        { pregunta: "Me rayo sin enojarme y soy blanco.", respuesta: "El queso rallado 🧀" },
      ]
    },
  ];

  return (
    <>
      <Header />

      {/* --- WRAPPER NUEVO PARA EL FONDO --- */}
      <div className="fondo-adivinanzas">
        
          {/* TU CONTENEDOR ORIGINAL */}
          <div className="adivinanzas-container">
            <h1 className="titulo-principal">¡Adivina, Adivinador! 🧠</h1>

            {categorias.map((cat, index) => (
              <div key={index} className="categoria-section">
                
                <h2 className={`titulo-categoria ${cat.color}`}>{cat.titulo}</h2>

                <div className="grid-adivinanzas">
                  {cat.lista.map((item, i) => (
                    <TarjetaAdivinanza
                      key={i}
                      pregunta={item.pregunta}
                      respuesta={item.respuesta}
                      color={cat.color}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          
      </div>

      <Footer />
    </>
  );
};

const TarjetaAdivinanza = ({ pregunta, respuesta, color }) => {
  const [mostrar, setMostrar] = useState(false);

  return (
    <div className={`tarjeta ${mostrar ? 'revelada' : ''}`}>
      <div className="contenido-tarjeta">
        <p className="pregunta">{pregunta}</p>
      </div>

      <div className="zona-accion">
        {mostrar ? (
          <div className="respuesta-box">
            <p>{respuesta}</p>
            <button className="btn-reset" onClick={() => setMostrar(false)}>🔄</button>
          </div>
        ) : (
          <button
            className={`btn-revelar btn-${color}`}
            onClick={() => setMostrar(true)}
          >
            <span className="lupa">🔍</span> ¿Qué soy?
          </button>
        )}
      </div>
    </div>
  );
};

export default Adivinanzas;