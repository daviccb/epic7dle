import React, { useEffect } from 'react';
import './SettingsPage.css';

function SettingsPage({ isOpen, children, onClose, closeSettings,
  backgroundImage, handleBackgroundChange, //backgroundimage
  toggleVisibility //iconnames
  }) {
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
          <option value="backgroundAssets/pvp_rta_ss14_r.--old--.png">Background 0</option>
          <option value="backgroundAssets/pk_challange_1_pack.png">Background 1</option>
          <option value="backgroundAssets/pk_luckyweek_dash10.png">Background 2</option>
          <option value="backgroundAssets/pk_newshinbigacha2408_1.png">Background 3</option>
        </select>

        <div className='toggle-iconnames-div'>
          <button onClick={() => toggleVisibility('element')}>Element</button>
          <button onClick={() => toggleVisibility('class')}>Class</button>
          <button onClick={() => toggleVisibility('starsign')}>Star Sign</button>
          <button onClick={() => toggleVisibility('region')}>Region</button>
          <button onClick={() => toggleVisibility('rarity')}>Rarity</button>
        </div>

        <button className="close-button" onClick={onClose}>x</button>
        {children}
      </div>
    </div>
  );
}

export default SettingsPage;
