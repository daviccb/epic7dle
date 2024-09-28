import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import './App.css';
import Header from './components/HeaderDir/Header';
import MainGame from './components/MainGameDir/MainGame';
import SettingsPage from './components/SettingsPageDir/SettingsPage';

function App() {
// CODE FOR BACKGROUND CHANGING:
  const [backgroundImage, setBackgroundImage] = useState('');

  const defaultBackgroundImage = 'backgroundAssets/pvp_rta_ss14_r.--old--.png';

  useEffect(() => {
    // Check if a background image is saved in cookies
    const savedBackground = Cookies.get('backgroundImage');
    if (savedBackground) {
      setBackgroundImage(savedBackground);
    } else {
      // Set the default background image if no cookie is found
      setBackgroundImage(defaultBackgroundImage);
    }
  }, []);

  const handleBackgroundChange = (event) => {
    const selectedImage = event.target.value;
    setBackgroundImage(selectedImage);
    Cookies.set('backgroundImage', selectedImage, { expires: 7 }); // Save for 7 days
  };

  // Dynamic style to ensure background covers correctly every time it's updated
  const backgroundStyle = {
    background: `url(${backgroundImage}) center center/cover no-repeat fixed`,

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif',
    height: '100vh',
    width: '100%',
    position: 'relative',
    overflowX: 'hidden',
    overflowY: 'scroll',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  };

// CODE FOR ICONNAMES
  const [visibility, setVisibility] = useState({
    element: Cookies.get('element') === 'true',
    class: Cookies.get('class') === 'true',
    zodiac: Cookies.get('zodiac') ? Cookies.get('zodiac') === 'true' : true,
    region: Cookies.get('region') ? Cookies.get('region') === 'true' : true,
    rarity: Cookies.get('rarity') === 'true'
  });

  const toggleVisibility = (key) => {
    setVisibility(prevVisibility => ({
        ...prevVisibility,
        [key]: !prevVisibility[key]
    }));
  };

  // Update cookies whenever the visibility state changes
  useEffect(() => {
    Object.entries(visibility).forEach(([key, value]) => {
        Cookies.set(key, value, { expires: 7 }); // Set each cookie to expire in 7 days
    });
  }, [visibility]);

// CODE FOR SETTINGS PAGE:
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  return (
    <div className="App" style={backgroundStyle}>
      <Header openSettings={openSettings} />
      <SettingsPage isOpen={isSettingsOpen} onClose={closeSettings} closeSettings={closeSettings} 
        //background settings
        backgroundImage={backgroundImage} 
        handleBackgroundChange={handleBackgroundChange}

        //iconname settings
        visibility={visibility}
        toggleVisibility={toggleVisibility}
      />
      <div className="maingame-container">
        <MainGame visibility={visibility} />
      </div>
    </div>
  );
}

export default App;
