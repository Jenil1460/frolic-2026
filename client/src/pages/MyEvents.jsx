import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { getUser } from '../utils/auth';
import './MyEvents.css';
import { authAPI } from '../utils/api';
import PaymentModal from '../components/PaymentModal';

const MyEvents = () => {
  const navigate = useNavigate();
  const [user] = useState(getUser());
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await authAPI.getMyRegistrations();
      setRegistrations(res.data || []);
    } catch (err) {
      console.error('Failed to fetch my events', err);
      setError(err.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handlePaymentSuccess = (data) => {
    setShowPayment(false);
    alert('Payment successful! Registration confirmed.');
    // Refresh the registrations list
    fetchRegistrations();
  };

  if (loading) {
    return (
      <div className="my-events-page">
        <div className="my-events-container">
          <div className="loading">Loading your events...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-events-page">
        <div className="my-events-container">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-events-page">
      <div className="my-events-container">
        <div className="my-events-header">
          <h1>My Events</h1>
          <p>Track and manage your registered events</p>
        </div>

        {registrations.length === 0 ? (
          <div className="no-events">
            <Calendar size={64} />
            <h2>No Events Yet</h2>
            <p>You haven't registered for any events. Browse events to get started!</p>
          </div>
        ) : (
          <div className="events-grid">
            {registrations.map((reg) => {
              const ev = reg.event || {};
              return (
                <div key={reg.id} className="event-card">
                  <div className="event-image">
                    <img src={ev.images?.[0] || ev.image || '/placeholder-event.jpg'} alt={ev.name} onError={(e)=>{e.target.src='/placeholder-event.jpg'}} />
                  </div>
                  <div className="event-details">
                    <h3>{ev.name}</h3>
                    <div className="event-meta">
                      <span className="event-date">
                        <Calendar size={16} />
                        {ev.eventDate ? new Date(ev.eventDate).toLocaleDateString() : 'TBD'}
                      </span>
                      <span className="event-location">
                        <MapPin size={16} />
                        {ev.location}
                      </span>
                      <span className="event-participants">
                        <Users size={16} />
                        {ev.maxParticipants} participants
                      </span>
                    </div>
                    <div className="event-status">
                      <span className={`status-badge ${reg.status?.toLowerCase() || 'upcoming'}`}>
                        {reg.status || reg.paymentStatus || 'PENDING'}
                      </span>
                    </div>

                    <div className="event-actions">
                      <button className="btn-primary" onClick={() => navigate(`/events/${ev._id}`)}>View Details</button>
                      {reg.paymentStatus !== 'PAID' && ev.fees > 0 && (
                        <button className="btn-secondary" onClick={() => { setSelectedRegistration(reg); setShowPayment(true); }}>Pay ₹{ev.fees}</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showPayment && selectedRegistration && (
        <PaymentModal registrationId={selectedRegistration.id} amount={selectedRegistration.event?.fees || 0} onClose={() => setShowPayment(false)} onSuccess={handlePaymentSuccess} />
      )}

    </div>
  );
};

export default MyEvents;