import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventAPI } from '../utils/api';
import { isAuthenticated, getUser } from '../utils/auth';
import './EventDetail.css';
import PaymentModal from '../components/PaymentModal';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [registrationId, setRegistrationId] = useState(null);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await eventAPI.getEventById(id);
        setEvent(res.data);
        console.log('Fetched event:', res.data);
        if (isAuthenticated()) {
          const status = await eventAPI.checkRegistrationStatus(id);
          setRegistered(status.data.registered);
          if(status.data.registered) setRegistrationId(status.data.registrationId);
        }
      } catch (err) {
        setError(err.message || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleRegister = async () => {
    console.log('Handle register called');
    if (!isAuthenticated()) {
      console.log('Not authenticated, navigating to login');
      return navigate('/login');
    }
    const user = getUser();
    console.log('User:', user);
    if (user.role !== 'Student') {
      console.log('User role not Student');
      return alert('Only students can register for events');
    }

    try {
      console.log('Calling register API for event:', id);
      const res = await eventAPI.registerForEvent(id);
      console.log('Registration response:', res);
      setRegistrationId(res.data.registrationId);
      // Open payment modal
      setShowPayment(true);
    } catch (err) {
      console.log('Registration error:', err);
      alert(err.message || 'Registration failed');
    }
  };

  const handlePaymentSuccess = (data) => {
    setShowPayment(false);
    alert('Payment successful! Transaction: ' + data.transactionId);
    setRegistered(true);
  };

  if (loading) {
    return (
      <div className="event-detail-page">
        <div className="detail-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <div style={{ fontSize: '1.2rem', color: 'rgba(255, 255, 255, 0.7)' }}>Loading event details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="event-detail-page">
        <div className="detail-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <div style={{ 
            padding: '2rem', 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            color: '#f87171',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <h2 style={{ color: '#f87171', marginBottom: '1rem' }}>Error</h2>
            <p>{error}</p>
            <button 
              className="register-cta" 
              onClick={() => navigate('/events')}
              style={{ marginTop: '1rem' }}
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-detail-page">
        <div className="detail-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <div style={{ 
            padding: '2rem', 
            background: 'rgba(255, 255, 255, 0.03)', 
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            color: 'rgba(255, 255, 255, 0.7)',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <h2 style={{ color: '#ffffff', marginBottom: '1rem' }}>Event Not Found</h2>
            <p>The event you're looking for doesn't exist or has been removed.</p>
            <button 
              className="register-cta" 
              onClick={() => navigate('/events')}
              style={{ marginTop: '1rem' }}
            >
              Browse Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  const mainImage = event.images?.[0] || event.image || '/placeholder-event.jpg';
  console.log('Main image URL:', mainImage);

  return (
    <div className="event-detail-page">
      <div className="hero" style={{backgroundImage: `url(${mainImage})`}}>
        <div className="hero-overlay">
          <h1>{event.name}</h1>
          <p>{new Date(event.eventDate).toLocaleString()}</p>
          <div className="hero-actions">
            {isAuthenticated() && getUser().role === 'Student' ? (
              !registered ? (
                <button className="register-cta" onClick={handleRegister}>Register Now</button>
              ) : (
                <button className="registered" disabled>Already Registered</button>
              )
            ) : (
              <button className="register-cta" onClick={() => navigate('/login')}>Login to Register</button>
            )}
          </div>
        </div>
      </div>

      <div className="detail-container">
        <h2>About the Event</h2>
        <p>{event.description}</p>

        <div className="detail-grid">
          <div><strong>Location</strong><p>{event.location}</p></div>
          <div><strong>Fees</strong><p>₹{event.fees}</p></div>
          <div><strong>Participants</strong><p>{event.minParticipants} - {event.maxParticipants}</p></div>
          <div><strong>Registration Ends</strong><p>{new Date(event.registrationEndDate).toLocaleString()}</p></div>
        </div>
      </div>

      {showPayment && registrationId && (
        <PaymentModal registrationId={registrationId} amount={event.fees} onClose={() => setShowPayment(false)} onSuccess={handlePaymentSuccess} />
      )}
    </div>
  );
};

export default EventDetail;