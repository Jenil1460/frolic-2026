import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Calendar, Users, Trophy, Building2, Target, Zap, Award, ArrowRight, Star, CheckCircle } from 'lucide-react';
import FadeIn from '../components/animations/FadeIn';
import ScaleIn from '../components/animations/ScaleIn';
import StaggerChildren from '../components/animations/StaggerChildren';
import './Home.css';
import EventsGrid from '../components/EventsGrid';
import { adminAPI } from '../utils/api';

export default function Home({ onNavigate }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getEvents();
        setEvents(response.data || []);
        setError(null);
      } catch (err) {
        setError(err.message);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
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
        <motion.div className="hero-container" style={{ y }}>
          <div className="hero-content">
            <FadeIn delay={0.2} direction="down">
              <div className="hero-badge">
                <span className="badge-dot"></span>
                College Event Platform
              </div>
            </FadeIn>
            <FadeIn delay={0.4} direction="up">
              <h1 className="hero-title">
                Discover. Register.
                <span className="gradient-text"> Participate.</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.6} direction="up">
              <p className="hero-subtitle">
                Your ultimate platform for discovering and managing inter-college events. 
                Join thousands of students creating unforgettable experiences.
              </p>
            </FadeIn>
            <FadeIn delay={0.8} direction="up">
              <div className="hero-actions">
                <motion.button 
                  className="cta-button primary" 
                  onClick={() => onNavigate('/register')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started Free
                  <ArrowRight size={20} />
                </motion.button>
                <motion.button 
                  className="cta-button secondary" 
                  onClick={() => onNavigate('/events')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Events
                </motion.button>
              </div>
            </FadeIn>
            <StaggerChildren staggerDelay={0.15} className="hero-stats">
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
            </StaggerChildren>
          </div>
          
          {/* Floating Cards */}
          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <motion.div 
              className="floating-card card-1"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Calendar size={24} className="card-icon" />
              <div className="card-content">
                <h4>Tech Fest 2024</h4>
                <p>Innovation Summit</p>
                <div className="card-meta">
                  <Users size={14} />
                  <span>2.5K participants</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="floating-card card-2"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, delay: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Trophy size={24} className="card-icon" />
              <div className="card-content">
                <h4>Cultural Night</h4>
                <p>Annual Celebration</p>
                <div className="card-meta">
                  <Star size={14} />
                  <span>Featured Event</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="floating-card card-3"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, delay: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Award size={24} className="card-icon" />
              <div className="card-content">
                <h4>Hackathon Pro</h4>
                <p>24hr Coding Challenge</p>
                <div className="card-meta">
                  <CheckCircle size={14} />
                  <span>Registration Open</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Events Section */}
      <section id="events" className="events-section">
        <div className="section-container">
          <FadeIn delay={0.2} className="section-header">
            <span className="section-label">Upcoming Events</span>
            <h2 className="section-title">Discover Amazing Events</h2>
            <p className="section-subtitle">Browse and register for exciting inter-college competitions and festivals</p>
          </FadeIn>
          
          {events.length > 0 ? (
            <EventsGrid events={events} />
          ) : loading ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Calendar size={80} />
              </div>
              <h3>Loading Events...</h3>
              <p>Please wait while we fetch the latest events.</p>
            </div>
          ) : error ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Calendar size={80} />
              </div>
              <h3>Failed to Load Events</h3>
              <p>{error}</p>
              <button className="cta-button primary" onClick={() => window.location.reload()}>
                Try Again
              </button>
            </div>
          ) : (
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
          )}
        </div>
      </section>

      {/* Features Section - How It Works */}
      <section id="how-it-works" className="features-section">
        <div className="section-container">
          <FadeIn delay={0.2} className="section-header">
            <span className="section-label">How It Works</span>
            <h2 className="section-title">Get Started in 3 Simple Steps</h2>
          </FadeIn>
          
          <StaggerChildren staggerDelay={0.2} className="features-grid">
            <motion.div 
              className="feature-card"
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="feature-number">01</div>
              <div className="feature-icon">
                <Target size={32} />
              </div>
              <h3>Browse Events</h3>
              <p>Explore hundreds of events across multiple institutions. Filter by category, date, and location.</p>
            </motion.div>
            
            <motion.div 
              className="feature-card"
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="feature-number">02</div>
              <div className="feature-icon">
                <Calendar size={32} />
              </div>
              <h3>Register Instantly</h3>
              <p>Quick and easy registration process. Fill in your details and you're good to go!</p>
            </motion.div>
            
            <motion.div 
              className="feature-card"
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="feature-number">03</div>
              <div className="feature-icon">
                <Trophy size={32} />
              </div>
              <h3>Participate & Win</h3>
              <p>Show your skills, compete with peers, and track your achievements in real-time.</p>
            </motion.div>
          </StaggerChildren>
        </div>
      </section>

      {/* Institutes Section */}
      <section id="institutes" className="institutes-section">
        <div className="section-container">
          <FadeIn delay={0.2} className="section-header">
            <span className="section-label">Partner Network</span>
            <h2 className="section-title">Participating Institutes</h2>
            <p className="section-subtitle">Join our growing network of educational institutions</p>
          </FadeIn>
          
          <ScaleIn delay={0.4}>
            <div className="empty-state">
              <div className="empty-icon">
                <Building2 size={80} />
              </div>
              <h3>Expanding Our Network</h3>
              <p>We're onboarding new institutes regularly. Stay tuned!</p>
            </div>
          </ScaleIn>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="results-section">
        <div className="section-container">
          <FadeIn delay={0.2} className="section-header">
            <span className="section-label">Achievements</span>
            <h2 className="section-title">Recent Winners</h2>
            <p className="section-subtitle">Celebrating success stories from our community</p>
          </FadeIn>
          
          <ScaleIn delay={0.4}>
            <div className="empty-state">
              <div className="empty-icon">
                <Trophy size={80} />
              </div>
              <h3>Results Coming Soon</h3>
              <p>Winners will be announced after event completion!</p>
            </div>
          </ScaleIn>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="section-container">
          <div className="about-content">
            <FadeIn delay={0.2} direction="left" className="about-text">
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
            </FadeIn>
            
            <FadeIn delay={0.4} direction="right" className="about-visual">
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
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section">
        <div className="section-container">
          <FadeIn delay={0.2}>
            <div className="final-cta-content">
              <h2>Ready to Get Started?</h2>
              <p>Join thousands of students already using Frolic</p>
              <div className="cta-actions">
                <motion.button 
                  className="cta-button primary large" 
                  onClick={() => onNavigate('/register')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create Free Account
                  <ArrowRight size={24} />
                </motion.button>
                <motion.button 
                  className="cta-button secondary large" 
                  onClick={() => onNavigate('/events')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Browse Events
                </motion.button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}