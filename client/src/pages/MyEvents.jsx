import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { getUser } from '../utils/auth';
import './MyEvents.css';

const MyEvents = () => {
  const [user] = useState(getUser());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch user's registered events from API
    // For now, showing placeholder
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="my-events-page">
        <div className="my-events-container">
          <div className="loading">Loading your events...</div>
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

        {events.length === 0 ? (
          <div className="no-events">
            <Calendar size={64} />
            <h2>No Events Yet</h2>
            <p>You haven't registered for any events. Browse events to get started!</p>
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-image">
                  <img src={event.image} alt={event.name} />
                </div>
                <div className="event-details">
                  <h3>{event.name}</h3>
                  <div className="event-meta">
                    <span className="event-date">
                      <Calendar size={16} />
                      {event.date}
                    </span>
                    <span className="event-location">
                      <MapPin size={16} />
                      {event.location}
                    </span>
                    <span className="event-participants">
                      <Users size={16} />
                      {event.participants} participants
                    </span>
                  </div>
                  <div className="event-status">
                    <span className={`status-badge ${event.status}`}>
                      {event.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvents;