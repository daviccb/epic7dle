import React, { useEffect } from 'react';
import './SettingsPage.css';
import ToggleButton from '../ToggleButtonDir/ToggleButton';

function SettingsPage({ isOpen, children, onClose, closeSettings,
  backgroundImage, handleBackgroundChange, //backgroundimage
  visibility, toggleVisibility //iconnames
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

  const backgroundOptions = [
    'backgroundAssets/pvp_rta_ss14_r.--old--.png',
    'backgroundAssets/pk_challange_1_pack.png',
    'backgroundAssets/pk_luckyweek_dash10.png',
    'backgroundAssets/pk_newshinbigacha2408_1.png',
  ];

  const imageMap = {
    ice: 'https://epic7db.com/images/elements/Ice-circle.png',
    5: '/rarityAssets/5-star.png',
    soulweaver: '/classAssets/Soul Weaver.png',
    taurus: '/zodiacAssets/Taurus.png',
    eureka: '/regionAssets/eureka.png',
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-content-fill">
          <h1 className='title'>Settings</h1>

          <img className='divider' src='miscAssets/dividerline.png' alt='divider'/>

          <div className='toggle-iconnames-div'>
            <h2 className='settings-header'>Toggle Icon Names</h2>
            <div className='toggle-inbuttons-div'>
              <ToggleButton
                label="Element"
                isActive={visibility.element}
                onClick={() => toggleVisibility('element')}
              />
              <ToggleButton
                label="Class"
                isActive={visibility.class}
                onClick={() => toggleVisibility('class')}
              />
              <ToggleButton
                label="Zodiac"
                isActive={visibility.zodiac}
                onClick={() => toggleVisibility('zodiac')}
              />
              <ToggleButton
                label="Region"
                isActive={visibility.region}
                onClick={() => toggleVisibility('region')}
              />
              <ToggleButton
                label="Rarity"
                isActive={visibility.rarity}
                onClick={() => toggleVisibility('rarity')}
              />
            </div>

            <div className="guess-table">
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
          </div>

          <img className='subdivider' src='miscAssets/dividerline.png' alt='subdivider'/>

          <h2 className='settings-header'>Select a background</h2>
          <div className="background-options-grid">
            {backgroundOptions.map((background, index) => (
              <div
                key={index}
                className={`background-option ${backgroundImage === background ? 'selected' : ''}`}
                style={{ backgroundImage: `url(${background})` }}
                onClick={() => handleBackgroundChange({ target: { value: background } })}
              >
              </div>
            ))}
          </div>

          <button className="close-button" onClick={onClose}>
            <img className='x-icon' src='miscAssets/extracted_image_11116.png' alt='close'/>
          </button>
          
          {children}
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
