import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import './Events.css';
import { eventAPI } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await eventAPI.getEvents();
        setEvents(res.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="events-page">
      <div className="events-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
      </div>

      <div className="events-container">
        <div className="events-header">
          <h1 className="events-title">All Events</h1>
          <p className="events-subtitle">Discover and register for upcoming events</p>
        </div>

        {loading ? (
          <div className="no-events">
            <p>Loading events...</p>
          </div>
        ) : error ? (
          <div className="no-events">
            <p>Error: {error}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="no-events">
            <Calendar size={80} />
            <h2>No Events Available</h2>
            <p>Check back soon for upcoming events!</p>
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <div key={event._id} className="event-card">
                <div className="event-image">
                  <img src={event.images?.[0] || event.image || '/placeholder-event.jpg'} alt={event.name} onError={(e)=>{e.target.src='/placeholder-event.jpg'}} />
                  <div className="event-category">{event.category}</div>
                </div>
                <div className="event-content">
                  <h3 className="event-name">{event.name}</h3>
                  <p className="event-description">{event.description}</p>
                  <div className="event-meta">
                    <div className="meta-item">
                      <Calendar size={16} />
                      <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                    </div>
                    <div className="meta-item">
                      <Clock size={16} />
                      <span>{/* time placeholder */}</span>
                    </div>
                    <div className="meta-item">
                      <MapPin size={16} />
                      <span>{event.location}</span>
                    </div>
                    <div className="meta-item">
                      <Users size={16} />
                      <span>{event.maxParticipants} participants</span>
                    </div>
                  </div>
                  <button className="register-button" onClick={() => navigate(`/events/${event._id}`)}>View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;