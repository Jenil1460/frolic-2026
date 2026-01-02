import React from 'react';
import Logo from './Logo';
import './Footer.css';

const Footer = ({ onNavigate }) => {
  const handleNavClick = (e, destination) => {
    e.preventDefault();
    if (onNavigate) {
      const path = destination.startsWith('/') ? destination : `/${destination}`;
      onNavigate(path);
    }
  };

  return (
    <footer className="frolic-footer">
      <div className="footer-content">
        <div className="footer-section about">
          <Logo onClick={() => onNavigate?.('/')} />
          <p>Frolic is your ultimate platform for discovering and managing college events. Join our community and never miss out on the fun!</p>
        </div>
        <div className="footer-section links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#" onClick={(e) => handleNavClick(e, '/')}>Home</a></li>
            <li><a href="#" onClick={(e) => handleNavClick(e, '/events')}>Events</a></li>
            <li><a href="#" onClick={(e) => handleNavClick(e, '/institutes')}>Institutes</a></li>
            <li><a href="#" onClick={(e) => handleNavClick(e, '/about')}>About Us</a></li>
          </ul>
        </div>
        <div className="footer-section contact">
          <h4>Contact Us</h4>
          <p>Email: contact@frolic.com</p>
          <p>Phone: +1 (123) 456-7890</p>
        </div>
        <div className="footer-section social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="#" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Frolic. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
