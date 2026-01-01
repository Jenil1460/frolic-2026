import React from 'react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import './Events.css';

const Events = () => {
  // Placeholder data - will be replaced with API data
  const events = [];

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

        {events.length === 0 ? (
          <div className="no-events">
            <Calendar size={80} />
            <h2>No Events Available</h2>
            <p>Check back soon for upcoming events!</p>
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-image">
                  <img src={event.image} alt={event.name} />
                  <div className="event-category">{event.category}</div>
                </div>
                <div className="event-content">
                  <h3 className="event-name">{event.name}</h3>
                  <p className="event-description">{event.description}</p>
                  <div className="event-meta">
                    <div className="meta-item">
                      <Calendar size={16} />
                      <span>{event.date}</span>
                    </div>
                    <div className="meta-item">
                      <Clock size={16} />
                      <span>{event.time}</span>
                    </div>
                    <div className="meta-item">
                      <MapPin size={16} />
                      <span>{event.location}</span>
                    </div>
                    <div className="meta-item">
                      <Users size={16} />
                      <span>{event.participants} participants</span>
                    </div>
                  </div>
                  <button className="register-button">Register Now</button>
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