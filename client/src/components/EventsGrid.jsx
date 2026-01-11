import React from 'react';
import './EventsGrid.css';
import useReveal from '../hooks/useReveal';

export default function EventsGrid({ events = [], loading = false, error = null, onNavigate }){
  useReveal('.event-card');

  if (loading) {
    return (
      <section id="events" className="events-section">
        <div className="maxwrap">
          <h3 className="section-title">Trending Events</h3>
          <div className="events-grid">
            <div className="loading-state">Loading events...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="events" className="events-section">
        <div className="maxwrap">
          <h3 className="section-title">Trending Events</h3>
          <div className="events-grid">
            <div className="error-state">Failed to load events: {error}</div>
          </div>
        </div>
      </section>
    );
  }

  if (!events || events.length === 0) {
    return (
      <section id="events" className="events-section">
        <div className="maxwrap">
          <h3 className="section-title">Trending Events</h3>
          <div className="events-grid">
            <div className="empty-state">No events available at the moment.</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="events" className="events-section">
      <div className="maxwrap">
        <h3 className="section-title">Trending Events</h3>
        <div className="events-grid">
          {events.map(e=> (
            <div className="event-card" key={e._id}>
              <div className="thumb">
                <img
                  src={e.images?.[0] || e.image || '/placeholder-event.jpg'}
                  alt={e.name}
                  onError={(e) => { e.target.src = '/placeholder-event.jpg'; }}
                />
              </div>
              <div className="info">
                <div className="dept">{e.location || 'TBD'}</div>
                <h4>{e.name}</h4>
                <div className="meta">{new Date(e.eventDate).toLocaleDateString()} • ₹{e.fees}</div>
                <div className="actions"><button className="view" onClick={() => onNavigate(`/events/${e._id}`)}>View Details</button></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
