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
      <div className="modal-content">
        <h1 className='title'>How to Play</h1>

        <p>Goal: Guess the hidden character</p>
        <p>How to Achieve Goal:</p>
        <p>Enter a Character's name and submit guess</p>
        <p> -- Feedback on the Guess's characteristics will be shown in the table</p>
        <p> -- Green box means Correct, Red box means Incorrect</p>
        <p> -- In the Release Year column, an arrow will show if the solution's release year is above or below the guess's. 
            A double arrow means a difference in 3 or more years
        </p>
        <p> -- In the Endless Mode, filtering options are available in the search bar. 
            A grayed-out button hides characters with matching characteristics while a lit-up button shows characters with matching characteristics
        </p>
        

        <button className="close-button" onClick={onClose}>x</button>
        {children}
      </div>
    </div>
  );
}

export default InfoPage;
