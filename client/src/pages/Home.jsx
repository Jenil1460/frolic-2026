import React, { useEffect } from 'react';
import { Calendar, Users, Trophy, Building2, Target, Zap, Award, ArrowRight, Star, CheckCircle } from 'lucide-react';
import './Home.css';

export default function Home({ onNavigate }) {
  
  useEffect(() => {
    // Smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }, []);

  return (
    <div className="home-page-modern">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              College Event Platform
            </div>
            <h1 className="hero-title">
              Discover. Register.
              <span className="gradient-text"> Participate.</span>
            </h1>
            <p className="hero-subtitle">
              Your ultimate platform for discovering and managing inter-college events. 
              Join thousands of students creating unforgettable experiences.
            </p>
            <div className="hero-actions">
              <button className="cta-button primary" onClick={() => onNavigate('/register')}>
                Get Started Free
                <ArrowRight size={20} />
              </button>
              <button className="cta-button secondary" onClick={() => onNavigate('/events')}>
                Explore Events
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Active Events</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Students</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100+</div>
                <div className="stat-label">Institutes</div>
              </div>
            </div>
          </div>
          
          {/* Floating Cards */}
          <div className="hero-visual">
            <div className="floating-card card-1">
              <Calendar size={24} className="card-icon" />
              <div className="card-content">
                <h4>Tech Fest 2024</h4>
                <p>Innovation Summit</p>
                <div className="card-meta">
                  <Users size={14} />
                  <span>2.5K participants</span>
                </div>
              </div>
            </div>
            
            <div className="floating-card card-2">
              <Trophy size={24} className="card-icon" />
              <div className="card-content">
                <h4>Cultural Night</h4>
                <p>Annual Celebration</p>
                <div className="card-meta">
                  <Star size={14} />
                  <span>Featured Event</span>
                </div>
              </div>
            </div>
            
            <div className="floating-card card-3">
              <Award size={24} className="card-icon" />
              <div className="card-content">
                <h4>Hackathon Pro</h4>
                <p>24hr Coding Challenge</p>
                <div className="card-meta">
                  <CheckCircle size={14} />
                  <span>Registration Open</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="events-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-label">Upcoming Events</span>
            <h2 className="section-title">Discover Amazing Events</h2>
            <p className="section-subtitle">Browse and register for exciting inter-college competitions and festivals</p>
          </div>
          
          <div className="empty-state">
            <div className="empty-icon">
              <Calendar size={80} />
            </div>
            <h3>No Events Yet</h3>
            <p>Check back soon for upcoming events!</p>
            <button className="cta-button primary" onClick={() => onNavigate('/register')}>
              Register to Get Notified
            </button>
          </div>
        </div>
      </section>

      {/* Features Section - How It Works */}
      <section id="how-it-works" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-label">How It Works</span>
            <h2 className="section-title">Get Started in 3 Simple Steps</h2>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-number">01</div>
              <div className="feature-icon">
                <Target size={32} />
              </div>
              <h3>Browse Events</h3>
              <p>Explore hundreds of events across multiple institutions. Filter by category, date, and location.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-number">02</div>
              <div className="feature-icon">
                <Calendar size={32} />
              </div>
              <h3>Register Instantly</h3>
              <p>Quick and easy registration process. Fill in your details and you're good to go!</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-number">03</div>
              <div className="feature-icon">
                <Trophy size={32} />
              </div>
              <h3>Participate & Win</h3>
              <p>Show your skills, compete with peers, and track your achievements in real-time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Institutes Section */}
      <section id="institutes" className="institutes-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-label">Partner Network</span>
            <h2 className="section-title">Participating Institutes</h2>
            <p className="section-subtitle">Join our growing network of educational institutions</p>
          </div>
          
          <div className="empty-state">
            <div className="empty-icon">
              <Building2 size={80} />
            </div>
            <h3>Expanding Our Network</h3>
            <p>We're onboarding new institutes regularly. Stay tuned!</p>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="results-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-label">Achievements</span>
            <h2 className="section-title">Recent Winners</h2>
            <p className="section-subtitle">Celebrating success stories from our community</p>
          </div>
          
          <div className="empty-state">
            <div className="empty-icon">
              <Trophy size={80} />
            </div>
            <h3>Results Coming Soon</h3>
            <p>Winners will be announced after event completion!</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="section-container">
          <div className="about-content">
            <div className="about-text">
              <span className="section-label">About Frolic</span>
              <h2 className="section-title">Revolutionizing Event Management</h2>
              <p className="about-description">
                Frolic is your ultimate platform for discovering and managing inter-college events. 
                We connect students, coordinators, and institutions to create unforgettable experiences.
              </p>
              
              <div className="about-features">
                <div className="about-feature">
                  <CheckCircle size={24} />
                  <div>
                    <h4>Centralized Platform</h4>
                    <p>All events in one place</p>
                  </div>
                </div>
                <div className="about-feature">
                  <CheckCircle size={24} />
                  <div>
                    <h4>Real-time Updates</h4>
                    <p>Instant notifications</p>
                  </div>
                </div>
                <div className="about-feature">
                  <CheckCircle size={24} />
                  <div>
                    <h4>Secure Platform</h4>
                    <p>Your data is safe</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="about-visual">
              <div className="about-card">
                <Zap size={48} />
                <h3>Fast Registration</h3>
                <p>Register for events in seconds</p>
              </div>
              <div className="about-card">
                <Users size={48} />
                <h3>Community Driven</h3>
                <p>Connect with 50K+ students</p>
              </div>
              <div className="about-card">
                <Award size={48} />
                <h3>Track Progress</h3>
                <p>Monitor your achievements</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section">
        <div className="section-container">
          <div className="final-cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of students already using Frolic</p>
            <div className="cta-actions">
              <button className="cta-button primary large" onClick={() => onNavigate('/register')}>
                Create Free Account
                <ArrowRight size={24} />
              </button>
              <button className="cta-button secondary large" onClick={() => onNavigate('/events')}>
                Browse Events
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}