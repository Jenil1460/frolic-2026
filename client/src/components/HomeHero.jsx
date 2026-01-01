import React, { useState, useEffect } from 'react';
import './HomeHero.css';
import techBg from '../assets/images/tech-bg.jpg';
import partyBg from '../assets/images/party-bg.jpg';
import CodeIcon from './icons/CodeIcon';
import ArtIcon from './icons/ArtIcon';

const HomeHero = ({ onExplore }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={`hero-split-container ${isLoaded ? 'loaded' : ''}`}>
      <div className="split-panel left-panel" style={{ backgroundImage: `url(${techBg})` }}>
        <div className="glass-card">
          <CodeIcon />
          <h2 className="panel-title">Technical</h2>
          <p className="panel-description">Innovate, build, and compete. Your journey in tech starts here.</p>
          <button className="panel-button" onClick={onExplore}>Explore Tech</button>
        </div>
      </div>
      <div className="split-panel right-panel" style={{ backgroundImage: `url(${partyBg})` }}>
        <div className="glass-card">
          <ArtIcon />
          <h2 className="panel-title">Cultural</h2>
          <p className="panel-description">Create, celebrate, and connect. Unleash your artistic talents.</p>
          <button className="panel-button" onClick={onExplore}>Explore Arts</button>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
