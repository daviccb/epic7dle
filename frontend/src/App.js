import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import './App.css';
import Header from './components/HeaderDir/Header';
import MainGame from './components/MainGameDir/MainGame';
import SettingsPage from './components/SettingsPageDir/SettingsPage';

function App() {
// CODE FOR BACKGROUND CHANGING:
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    // Check if a background image is saved in cookies
    const savedBackground = Cookies.get('backgroundImage');
    if (savedBackground) {
      setBackgroundImage(savedBackground);
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

// CODE FOR SETTINGS PAGE:
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  return (
    <div className="App" style={backgroundStyle}>
      <Header openSettings={openSettings} />
      <SettingsPage isOpen={isSettingsOpen} onClose={closeSettings}
        backgroundImage={backgroundImage} 
        handleBackgroundChange={handleBackgroundChange} 
        closeSettings={closeSettings} />
      <div className="maingame-container">
        <MainGame />
      </div>
    </div>
  );
}

export default App;
