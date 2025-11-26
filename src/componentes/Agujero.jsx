import React, { useState } from 'react';
import './Agujero.css';

const Agujero = ({ isVisible, onClick }) => {
  const [showPlusOne, setShowPlusOne] = useState(false);

  const handleClick = () => {
    if (!isVisible) return;
    setShowPlusOne(true);
    onClick();
    setTimeout(() => setShowPlusOne(false), 600);
  };

  return (
    <div className="agujero">
      <img
        src="./images/topo.png"
        alt="Un topo sonriente"
        className={`topo ${isVisible ? 'visible' : 'hidden'}`}
        onClick={handleClick}
        style={{ userSelect: 'none' }}
      />
      {showPlusOne && <span className="plus-one">+1</span>}
    </div>
  );
};

export default Agujero;

