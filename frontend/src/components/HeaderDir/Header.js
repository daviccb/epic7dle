import React from 'react';
import './Header.css';

function Header({ openSettings }) {
  return (
    <header className="header">
      <h1>Epic7dle</h1>
      <button onClick={openSettings} className="settingsbtn" aria-label="Open settings" >
        <img src={'miscAssets/settings_icon.png'} alt="Settings" className="settings-button-icon" />
      </button>
      <span>Version 0.1</span>
    </header>
  );
}

export default Header;
