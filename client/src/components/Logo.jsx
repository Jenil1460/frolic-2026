import React from 'react';
import './Logo.css';

const Logo = ({ onClick }) => {
  const handleKeyDown = (e) => {
    if (!onClick) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className="logo-container"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={handleKeyDown}
    >
      <svg width="40" height="40" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 150 C 50 50, 150 50, 150 150" stroke="url(#paint0_linear_1_2)" stroke-width="20" stroke-linecap="round" />
        <path d="M75 125 C 75 75, 125 75, 125 125" stroke="url(#paint1_linear_1_2)" stroke-width="20" stroke-linecap="round" />
        <path d="M100 100 C 100 87.5, 112.5 87.5, 112.5 100" stroke="url(#paint2_linear_1_2)" stroke-width="20" stroke-linecap="round" />
        <defs>
          <linearGradient id="paint0_linear_1_2" x1="50" y1="100" x2="150" y2="100" gradientUnits="userSpaceOnUse">
            <stop stop-color="#8A2BE2"/>
            <stop offset="1" stop-color="#4B0082"/>
          </linearGradient>
          <linearGradient id="paint1_linear_1_2" x1="75" y1="100" x2="125" y2="100" gradientUnits="userSpaceOnUse">
            <stop stop-color="#8A2BE2"/>
            <stop offset="1" stop-color="#FF00FF"/>
          </linearGradient>
          <linearGradient id="paint2_linear_1_2" x1="100" y1="93.75" x2="112.5" y2="93.75" gradientUnits="userSpaceOnUse">
            <stop stop-color="#8A2BE2"/>
            <stop offset="1" stop-color="#FF00FF"/>
          </linearGradient>
        </defs>
      </svg>
      <span className="logo-text">FROLIC</span>
    </div>
  );
};

export default Logo;
