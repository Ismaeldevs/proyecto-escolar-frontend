import React from 'react';

const colores = [
  '#FF0000', '#FF9900', '#FFD700', '#32CD32', '#008000', 
  '#00BFFF', '#0000FF', '#800080', '#FF69B4', '#8B4513', '#000000'
];

const PaletaDeColor = ({ onColorSelect, activeColor, onBrushSizeSelect, activeBrushSize }) => {
  const esGomaActiva = activeColor === '#FFFFFF';
  
  // Verificamos si el color actual es uno de los predefinidos
  // Si NO está en la lista, significa que es un color personalizado
  const esColorPersonalizado = !colores.includes(activeColor) && !esGomaActiva;

  return (
    <div className="tarjeta-paleta">
      
      {/* Fila 1: Herramientas y Colores */}
      <div className="fila-herramientas">
        
        {/* Botón Goma */}
        <button
          onClick={() => onColorSelect('#FFFFFF')}
          className={`boton-goma ${esGomaActiva ? 'activo' : ''}`}
        >
          🧼 Goma
        </button>

        <div className="divisor"></div>

        {/* Botones de Colores Predefinidos */}
        {colores.map((color) => (
          <button
            key={color}
            onClick={() => onColorSelect(color)}
            className={`circulo-color ${activeColor === color ? 'activo' : ''}`}
            style={{ backgroundColor: color }}
            aria-label={color}
          />
        ))}

        {/* --- NUEVO: Selector de Color Personalizado (Arcoíris) --- */}
        <div className={`contenedor-picker ${esColorPersonalizado ? 'activo' : ''}`}>
           {/* El input es invisible pero ocupa todo el espacio para recibir el clic */}
           <input 
             type="color" 
             className="input-color-oculto"
             onChange={(e) => onColorSelect(e.target.value)}
             value={esColorPersonalizado ? activeColor : '#ffffff'} // Para que el picker muestre el color actual
             title="Elige cualquier color"
           />
           {/* Icono visual de + o Arcoiris */}
           <span className="icono-mas">+</span>
        </div>

      </div>

      {/* Fila 2: Tamaños de Pincel */}
      <div className="fila-tamanos">
        <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 'bold' }}>Grosor:</span>
        {[5, 10, 15, 25, 40].map((tamano) => (
          <button
            key={tamano}
            onClick={() => onBrushSizeSelect(tamano)}
            className={`boton-tamano-pincel ${activeBrushSize === tamano ? 'activo' : ''}`}
            style={{
              width: tamano + 15 + 'px',
              height: tamano + 15 + 'px',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PaletaDeColor;