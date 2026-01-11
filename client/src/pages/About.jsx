import React from 'react';
import { Target, Users, Award, Zap } from 'lucide-react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
      </div>

      <div className="about-container">
        <div className="about-header">
          <h1 className="about-title">About Frolic</h1>
          <p className="about-subtitle">Your ultimate platform for college event management</p>
        </div>

        <div className="about-content">
          <div className="about-section">
            <h2 className="section-title">Our Mission</h2>
            <p className="section-text">
              Frolic is dedicated to revolutionizing how educational institutions organize and manage events. 
              We provide a comprehensive platform that connects students, coordinators, and administrators, 
              making event participation seamless and engaging.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon" style={{ background: 'rgba(139, 92, 246, 0.2)' }}>
                <Target size={32} style={{ color: '#8b5cf6' }} />
              </div>
              <h3 className="feature-title">Event Discovery</h3>
              <p className="feature-text">
                Browse and discover exciting events across multiple institutions
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon" style={{ background: 'rgba(59, 130, 246, 0.2)' }}>
                <Users size={32} style={{ color: '#3b82f6' }} />
              </div>
              <h3 className="feature-title">Easy Registration</h3>
              <p className="feature-text">
                Simple and quick event registration process for students
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
                <Award size={32} style={{ color: '#10b981' }} />
              </div>
              <h3 className="feature-title">Track Achievements</h3>
              <p className="feature-text">
                Monitor your participation and view results effortlessly
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon" style={{ background: 'rgba(245, 158, 11, 0.2)' }}>
                <Zap size={32} style={{ color: '#f59e0b' }} />
              </div>
              <h3 className="feature-title">Real-time Updates</h3>
              <p className="feature-text">
                Get instant notifications about events and announcements
              </p>
            </div>
          </div>

          <div className="about-section">
            <h2 className="section-title">Why Choose Frolic?</h2>
            <ul className="benefits-list">
              <li>Centralized platform for all inter-college events</li>
              <li>Role-based access for students, coordinators, and admins</li>
              <li>Comprehensive event management tools</li>
              <li>Real-time result publishing and tracking</li>
              <li>User-friendly interface with modern design</li>
              <li>Secure and reliable platform</li>
            </ul>
          </div>

          <div className="contact-section">
            <h2 className="section-title">Get in Touch</h2>
            <p className="section-text">
              Have questions or suggestions? We'd love to hear from you!
            </p>
            <div className="contact-info">
              <p>Email: contact@frolic.com</p>
              <p>Phone: +1 (123) 456-7890</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;