import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Cookies from 'js-cookie';
import './App.css';
import Header from './components/HeaderDir/Header';
import MainGame from './components/MainGameDir/MainGame';
import SettingsPage from './components/SettingsPageDir/SettingsPage';
import InfoPage from './components/InfoPageDir/InfoPage';

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
    inElement: Cookies.get('inElement') === 'true',
    inClass: Cookies.get('inClass') === 'true',
    inZodiac: Cookies.get('inZodiac') ? Cookies.get('inZodiac') === 'true' : true,
    inRegion: Cookies.get('inRegion') ? Cookies.get('inRegion') === 'true' : true,
    inRarity: Cookies.get('inRarity') === 'true'
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

// CODE FOR INFO PAGE:
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const openInfo = () => setIsInfoOpen(true);
  const closeInfo = () => setIsInfoOpen(false);

  return (
    <Router>
      <div className="App" style={backgroundStyle}>
        <Header openSettings={openSettings} openInfo={openInfo} />
        <InfoPage isOpen={isInfoOpen} onClose={closeInfo} closeInfo={closeInfo} />
        <SettingsPage isOpen={isSettingsOpen} onClose={closeSettings} closeSettings={closeSettings}
          //background settings
          backgroundImage={backgroundImage}
          handleBackgroundChange={handleBackgroundChange}
          //iconname settings
          visibility={visibility}
          toggleVisibility={toggleVisibility}
        />
        <div className="maingame-container">
          <Routes>
            <Route path="/" element={<MainGame visibility={visibility} mode="daily" />} />
            <Route path="/endless" element={<MainGame visibility={visibility} mode="endless" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
