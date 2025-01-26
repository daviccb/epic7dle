import React, { useState, useEffect } from 'react';
import './ToggleButton.css';

function ToggleButton({ label, onClick, isActive }) {
  const [isToggled, setIsToggled] = useState(isActive || false);

  useEffect(() => {
    setIsToggled(isActive); // Synchronize with prop changes
  }, [isActive]);

  const handleToggle = () => {
    const newState = !isToggled;
    setIsToggled(newState);
    if (onClick) {
      onClick(newState); // Send the new state back to the parent
    }
  };

  return (
    <div className="toggle-container" onClick={handleToggle}>
      {label && <span className="toggle-label">{label}</span>}
      <div className={`toggle-button ${isToggled ? 'active' : ''}`}>
        <div className="toggle-circle"></div>
      </div>
    </div>
  );
}

export default ToggleButton;
