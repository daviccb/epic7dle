import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import './App.css';
import Header from './components/HeaderDir/Header';
import MainGame from './components/MainGameDir/MainGame';
// import Sidebar from './components/SidebarDir/Sidebar';

function App() {
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
    background: `url(${backgroundImage}) no-repeat center center fixed`,
    backgroundSize: 'cover'
  };

  return (
    <div className="App" style={backgroundStyle}>
      <Header />
      {/* <h1>Choose Your Background</h1>
      <select onChange={handleBackgroundChange} value={backgroundImage}>
        <option value="">Select a Background</option>
        <option value="background1.webp">Background 1</option>
        <option value="background2.jpg">Background 2</option>
        <option value="background3.webp">Background 3</option>
      </select> */}
      <div className="maingame-container">
        <MainGame />
      </div>
    </div>
  );
}

export default App;
