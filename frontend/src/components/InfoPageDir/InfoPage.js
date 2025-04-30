import React, { useEffect } from 'react';
import './InfoPage.css';

function InfoPage({ isOpen, children, onClose, closeInfo }) {
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
      <div className="modal-content-info">
        <div className="modal-content-fill">
          <h1 className='info-title'>Info</h1>

          <img className='divider' src='miscAssets/dividerline.png' alt='divider'/>

          <p className='info-text'>Last updated to Rinak</p>
          <p className='info-text'>This website only uses Cookies for enhancing user experience</p>
          <p className='info-text'>Contact me on Discord @davicc</p>
          <p className='info-text'>Credits: Epic Seven, Genshindle, nORbDragon, Fribbels, CeciliaBot, UsernameSniped, Paula</p>


          <button className="close-button" onClick={onClose}>
            <img className='x-icon' src='miscAssets/extracted_image_11116.png' alt='close'/>
          </button>
          
          {children}
        </div>
      </div>
    </div>
  );
}

export default InfoPage;
