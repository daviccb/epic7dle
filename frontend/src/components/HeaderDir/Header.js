import React from 'react';
import './Header.css';

function Header({ openSettings, openInfo }) {
  return (
    <header className="header">
      <h1>Epic7dle</h1>
      <button onClick={openInfo} className="infobtn" aria-label="Open Info" >
        <img src={'miscAssets/info_icon.png'} alt="Info" className="info-button-icon" />
      </button>
      <button onClick={openSettings} className="settingsbtn" aria-label="Open Settings" >
        <img src={'miscAssets/settings_icon.png'} alt="Settings" className="settings-button-icon" />
      </button>
      <span>Version 0.1</span>
    </header>
  );
}

export default Header;
