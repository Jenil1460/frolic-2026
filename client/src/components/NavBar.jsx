import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, Calendar } from 'lucide-react';
import AnimatedLogo from './AnimatedLogo';
import { isAuthenticated, getUser, logout } from '../utils/auth';
import './NavBar.css';

export default function NavBar({ onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // Update login state when storage changes
    const handleStorageChange = () => {
      setIsLoggedIn(isAuthenticated());
      setUser(getUser());
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Check on component mount and update
    handleStorageChange();
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (destination) => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
    
    // Handle section anchors for home page
    if (destination.startsWith('#')) {
      const element = document.querySelector(destination);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Ensure destination starts with '/'
      const path = destination.startsWith('/') ? destination : `/${destination}`;
      onNavigate(path);
    }
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUser(null);
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
    onNavigate('login');
  };

  const getNavLinks = () => {
    const baseLinks = [
      { label: 'Home', path: '#home' },
      { label: 'Events', path: '#events' },
      { label: 'Institutes', path: '#institutes' },
      { label: 'Results', path: '#results' },
      { label: 'About', path: '#about' }
    ];

    // Add role-based links
    if (user?.role === 'Admin') {
      return [
        ...baseLinks,
        { label: 'Admin Dashboard', path: '/admin/dashboard' }
      ];
    } else if (user?.role?.includes('Coordinator')) {
      return [
        ...baseLinks,
        { label: 'Coordinator Panel', path: '/coordinator/dashboard' }
      ];
    }

    return baseLinks;
  };

  const navLinks = getNavLinks();

  return (
    <motion.header 
      className={`frolic-nav ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="nav-inner">
        <AnimatedLogo onClick={() => handleNavClick('#home')} />
        
        {/* Desktop Navigation */}
        <nav className="nav-links">
          {navLinks.map((link) => (
            <a 
              key={link.path}
              href="#" 
              onClick={(e) => { e.preventDefault(); handleNavClick(link.path); }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="nav-actions">
          {isLoggedIn ? (
            <div className="profile-dropdown-container">
              <button 
                className="profile-button" 
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
                <User size={18} />
                <span>{user?.fullName || 'Profile'}</span>
              </button>
              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div 
                    className="profile-dropdown"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                  <div className="profile-dropdown-header">
                    <p className="profile-name">{user?.fullName}</p>
                    <p className="profile-role">{user?.role}</p>
                  </div>
                  <div className="profile-dropdown-divider"></div>
                  <button 
                    className="profile-dropdown-item"
                    onClick={() => handleNavClick('/profile')}
                  >
                    <User size={16} />
                    <span>My Profile</span>
                  </button>
                  {user?.role !== 'Admin' && (
                    <button 
                      className="profile-dropdown-item"
                      onClick={() => handleNavClick('/my-events')}
                    >
                      <Calendar size={16} />
                      <span>My Events</span>
                    </button>
                  )}
                  <div className="profile-dropdown-divider"></div>
                  <button 
                    className="profile-dropdown-item logout"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <button className="secondary-button" onClick={() => handleNavClick('login')}>Login</button>
              <button className="primary-button" onClick={() => handleNavClick('register')}>Register</button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="mobile-menu mobile-menu-open"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <nav className="mobile-nav-links">
              {navLinks.map((link) => (
                <a 
                  key={link.path}
                  href="#" 
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.path); }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mobile-nav-actions">
              {isLoggedIn ? (
                <>
                  <div className="mobile-profile-info">
                    <p className="mobile-profile-name">{user?.fullName}</p>
                    <p className="mobile-profile-role">{user?.role}</p>
                  </div>
                  <button className="secondary-button" onClick={() => handleNavClick('/profile')}>
                    <User size={16} />
                    Profile
                  </button>
                  {user?.role !== 'Admin' && (
                    <button className="secondary-button" onClick={() => handleNavClick('/my-events')}>
                      <Calendar size={16} />
                      My Events
                    </button>
                  )}
                  <button className="primary-button logout-button" onClick={handleLogout}>
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button className="secondary-button" onClick={() => handleNavClick('/login')}>Login</button>
                  <button className="primary-button" onClick={() => handleNavClick('/register')}>Register</button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}