import React, { useEffect } from 'react';
import './SettingsPage.css';

function SettingsPage({ isOpen, children, onClose, backgroundImage, handleBackgroundChange, closeSettings }) {
  // close pop up when pressing Esc Key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Add event listener for keydown
    document.addEventListener('keydown', handleKeyDown);

    // Clean up event listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]); // Include onClose to handle potential updates to the prop

  if (!isOpen) return null; // Return null after hooks if modal is not open

  // close pop up when clicking outside
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  
  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content">
        <h1 className='title'>Settings</h1>
        <select onChange={handleBackgroundChange} value={backgroundImage}>
          <option value="">Select a Background</option>
          <option value="https://www.e7vau.lt/static/datamine/2024/20240814/banner/pk_challange_1_pack.png">Background 1</option>
          <option value="https://www.e7vau.lt/static/datamine/2024/20240814/banner/pk_luckyweek_dash10.png">Background 2</option>
          <option value="https://www.e7vau.lt/static/datamine/2024/20240814/banner/pk_newshinbigacha2408_1.png">Background 3</option>
        </select>

        <button className="close-button" onClick={onClose}>x</button>
        {children}
      </div>
    </div>
  );
}

export default SettingsPage;
