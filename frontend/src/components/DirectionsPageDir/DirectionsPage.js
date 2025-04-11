import React, { useEffect } from 'react';
import './DirectionsPage.css';

function DirectionsPage({ isOpen, children, onClose, closeDirections, visibility }) {
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

  const imageMap = {
    ice: 'https://epic7db.com/images/elements/Ice-circle.png',
    5: '/rarityAssets/5-star.png',
    soulweaver: '/classAssets/Soul Weaver.png',
    taurus: '/zodiacAssets/Taurus.png',
    eureka: '/regionAssets/eureka.png',
  };


  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content-directions">
        <div className="modal-content-fill">
          <h1 className='directions-title'>How to Play</h1>

          <img className='divider' src='miscAssets/dividerline.png' alt='divider' />

          <p className='directions-text'>Enter a Character's name into the input field and submit your guess</p>
          <img src={'miscAssets/directions1.PNG'} alt="directions1img" className="directions1img" />

          <div className="guess-table" style={{ marginTop: 40 }}>
            <table>
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Element</th>
                  <th>Class</th>
                  <th>Star Sign</th>
                  <th>Region</th>
                  <th>Rarity</th>
                  <th>Release Year</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={'photo-cell'}>
                    <div className='celldiv'>
                      <img src={'https://raw.githubusercontent.com/fribbels/Fribbels-Epic-7-Optimizer/main/data/cachedimages/c1163_s.png'}
                        alt={'frida icon'} className="character-imageicon front" />
                    </div>
                  </td>
                  <td className={'incorrect-answer'}>
                    <div className='celldiv'>
                      <span className='front'>{'Example'}</span>
                    </div>
                  </td>
                  <td className={'correct-answer'}>
                    <div className='celldiv'>
                      <div className='iconname-container front'>
                        <img src={imageMap.ice} alt={'example element'} title={'ice'} />
                        {visibility.element && <p className='iconname'>{'Ice'}</p>}
                      </div>
                    </div>
                  </td>
                  <td className={'incorrect-answer'}>
                    <div className='celldiv'>
                      <div className='iconname-container front'>
                        <img src={imageMap.soulweaver} alt={'example class'} title={'soulweaver'} />
                        {visibility.class && <p className='iconname'>{'Soul Weaver'}</p>}
                      </div>
                    </div>
                  </td>
                  <td className={'incorrect-answer'}>
                    <div className='celldiv'>
                      <div className='iconname-container front'>
                        <img src={imageMap.taurus} alt={'example zodiac'} title={'taurus'} />
                        {visibility.zodiac && <p className='iconname'>{'Taurus'}</p>}
                      </div>
                    </div>
                  </td>
                  <td className={'correct-answer'}>
                    <div className='celldiv'>
                      <div className='iconname-container front'>
                        <img src={imageMap.eureka} alt={'example region'} title={'eureka'} className="character-regionicon" />
                        {visibility.region && <p className='iconname'>{'Eureka'}</p>}
                      </div>
                    </div>
                  </td>
                  <td className={'incorrect-answer'}>
                    <div className='celldiv'>
                      <div className='iconname-container front'>
                        <img src={imageMap[5]} alt={'example rarity'} title={'5'} />
                        {visibility.rarity && <p className='iconname'>{'5-star'}</p>}
                      </div>
                    </div>
                  </td>
                  <td className={'correct-answer'}>
                    <div className='celldiv'>
                      <div className='iconname-container front'>
                        <span>{'2024'}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className='directions-text'> -- Feedback on the Guess's characteristics will be shown in the table</p>

          <p className='directions-text'> -- Green box means Correct, Red box means Incorrect</p>

          <div className='directionsyeararrows-div'>
            <img className='directionsyeararrowsimg' src='miscAssets/directionsYearArrows.png' alt='directionsyeararrows' />
            <p className='directions-text'> -- In the Release Year column, an arrow will show if the solution's release year is above or below the guess's.
              A double arrow means a difference in 3 or more years
            </p>
          </div>


          <img src={'miscAssets/directions2.PNG'} alt="directions2img" className="directions2img" />
          <p className='directions-text'> -- In Endless Mode, you can use the search bar to filter characters.
          A faded red button hides characters with matching traits, while a highlighted button shows them.
          </p>


          <button className="close-button" onClick={onClose}>
            <img className='x-icon' src='miscAssets/extracted_image_11116.png' alt='close' />
          </button>

          {children}
        </div>
      </div>
    </div>
  );
}

export default DirectionsPage;
