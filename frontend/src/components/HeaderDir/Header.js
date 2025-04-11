import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header({ openSettings, openInfo, openDirections }) {
  return (
    <header className="header">
      <nav className="navigation">
        <Link to="/" className="nav-link">Daily Puzzle</Link>
        <Link to="/endless" className="nav-link">Endless Mode</Link>
      </nav>

      <h1>Epic7dle</h1>

      <button onClick={openDirections} className="directionsbtn" aria-label="Open Directions" >
        <img src={'miscAssets/directions_icon.png'} alt="Directions" className="directions-button-icon" />
      </button>
      <button onClick={openInfo} className="infobtn" aria-label="Open Info" >
        <img src={'miscAssets/info_icon.png'} alt="Info" className="info-button-icon" />
      </button>
      <button onClick={openSettings} className="settingsbtn" aria-label="Open Settings" >
        <img src={'miscAssets/settings_icon.png'} alt="Settings" className="settings-button-icon" />
      </button>
      <span className='versiontext'>v1.0</span>
    </header>
  );
}

export default Header;
