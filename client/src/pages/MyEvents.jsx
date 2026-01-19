import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Filter, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { getUser } from '../utils/auth';
import './MyEvents.css';
import { eventAPI } from '../utils/api';
import PaymentModal from '../components/PaymentModal';

const MyEvents = () => {
  const navigate = useNavigate();
  const [user] = useState(getUser());
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await eventAPI.getMyEvents();
      const data = res.data || [];
      
      // Ensure all events have proper structure
      const validRegistrations = data.filter(reg => reg.event && reg.event._id);
      setRegistrations(validRegistrations);
      applyFiltersAndSearch(validRegistrations, selectedFilter, searchQuery);
    } catch (err) {
      console.error('Failed to fetch my events', err);
      setError(err.message || 'Failed to load your registered events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const applyFiltersAndSearch = (data, filter, search) => {
    let filtered = [...data];

    // Apply status filter
    if (filter && filter !== 'all') {
      filtered = filtered.filter(reg => {
        const paymentStatus = (reg.paymentStatus || '').toUpperCase().trim();
        const status = (reg.status || '').toUpperCase().trim();
        const statusToCheck = paymentStatus || status;
        const filterCheck = filter.toUpperCase().trim();
        
        // Handle special cases
        if (filterCheck === 'PENDING') {
          return paymentStatus === 'PENDING' || status === 'PENDING' || (!paymentStatus && !status);
        }
        if (filterCheck === 'PAID') {
          return paymentStatus === 'PAID' || status === 'CONFIRMED' || paymentStatus === 'CONFIRMED';
        }
        
        return statusToCheck === filterCheck;
      });
    }

    // Apply search query - more comprehensive search
    if (search && search.trim()) {
      const query = search.toLowerCase().trim();
      filtered = filtered.filter(reg => {
        if (!reg.event) return false;
        
        const eventName = (reg.event.name || '').toLowerCase();
        const location = (reg.event.location || '').toLowerCase();
        const description = (reg.event.description || '').toLowerCase();
        
        return (
          eventName.includes(query) ||
          location.includes(query) ||
          description.includes(query)
        );
      });
    }

    setFilteredRegistrations(filtered);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    applyFiltersAndSearch(registrations, filter, searchQuery);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFiltersAndSearch(registrations, selectedFilter, query);
  };

  // Re-apply filters whenever registrations change
  useEffect(() => {
    applyFiltersAndSearch(registrations, selectedFilter, searchQuery);
  }, [registrations]);

  const getFilterCount = (filterType) => {
    if (filterType === 'all') return registrations.length;
    
    return registrations.filter(reg => {
      const paymentStatus = (reg.paymentStatus || '').toUpperCase().trim();
      const status = (reg.status || '').toUpperCase().trim();
      
      if (filterType === 'pending') {
        return paymentStatus === 'PENDING' || status === 'PENDING' || (!paymentStatus && !status);
      }
      if (filterType === 'paid') {
        return paymentStatus === 'PAID' || status === 'CONFIRMED' || paymentStatus === 'CONFIRMED';
      }
      return false;
    }).length;
  };

  const handlePaymentSuccess = (data) => {
    setShowPayment(false);
    // Refresh the registrations list
    fetchRegistrations();
  };

  const getStatusIcon = (status) => {
    const upperStatus = (status || '').toUpperCase();
    if (upperStatus === 'PAID' || upperStatus === 'CONFIRMED') {
      return <CheckCircle size={16} />;
    } else if (upperStatus === 'PENDING' || upperStatus === 'AWAITING PAYMENT') {
      return <Clock size={16} />;
    }
    return <AlertCircle size={16} />;
  };

  const getStatusColor = (status) => {
    const upperStatus = (status || '').toUpperCase();
    if (upperStatus === 'PAID' || upperStatus === 'CONFIRMED') {
      return 'paid';
    } else if (upperStatus === 'PENDING' || upperStatus === 'AWAITING PAYMENT') {
      return 'pending';
    }
    return 'cancelled';
  };

  const isEventUpcoming = (eventDate) => {
    return new Date(eventDate) > new Date();
  };

  if (loading) {
    return (
      <div className="my-events-page">
        <div className="my-events-container">
          <div className="my-events-header">
            <h1>My Events</h1>
            <p>Manage and track your registered events</p>
          </div>
          
          <div className="loading-container">
            <div className="skeleton-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-text"></div>
                    <div className="skeleton-text short"></div>
                    <div className="skeleton-meta">
                      <div className="skeleton-badge"></div>
                      <div className="skeleton-badge"></div>
                    </div>
                    <div className="skeleton-actions">
                      <div className="skeleton-button"></div>
                      <div className="skeleton-button"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-events-page">
      <div className="my-events-container">
        <div className="my-events-header">
          <h1>My Events</h1>
          <p>Manage and track your registered events</p>
        </div>

        {error && (
          <div className="error-banner">
            <AlertCircle size={20} />
            <span>{error}</span>
            <button onClick={fetchRegistrations} className="retry-btn">Retry</button>
          </div>
        )}

        {registrations.length > 0 && (
          <div className="events-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search events by name or location..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>

            <div className="filter-container">
              <Filter size={18} />
              <div className="filter-buttons">
                <button
                  className={`filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('all')}
                >
                  All <span className="count-badge">{getFilterCount('all')}</span>
                </button>
                <button
                  className={`filter-btn ${selectedFilter === 'pending' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('pending')}
                >
                  Pending <span className="count-badge">{getFilterCount('pending')}</span>
                </button>
                <button
                  className={`filter-btn ${selectedFilter === 'paid' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('paid')}
                >
                  Confirmed <span className="count-badge">{getFilterCount('paid')}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {registrations.length === 0 ? (
          <div className="no-events">
            <Calendar size={64} />
            <h2>No Events Yet</h2>
            <p>You haven't registered for any events.</p>
            <button className="btn-browse" onClick={() => navigate('/events')}>
              Browse Events
            </button>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="no-events">
            <Filter size={64} />
            <h2>No Events Found</h2>
            <p>Your search didn't match any events. Try adjusting your filters.</p>
            <button className="btn-browse" onClick={() => {
              setSelectedFilter('all');
              setSearchQuery('');
            }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="events-grid">
            {filteredRegistrations.map((reg) => {
              const ev = reg.event || {};
              const paymentStatus = reg.paymentStatus || reg.status || 'PENDING';
              const upcoming = isEventUpcoming(ev.eventDate);
              
              return (
                <div key={reg.id} className={`event-card ${upcoming ? 'upcoming' : 'past'}`}>
                  <div className="event-image">
                    <img 
                      src={ev.images?.[0] || ev.image || '/placeholder-event.jpg'} 
                      alt={ev.name} 
                      onError={(e) => {
                        e.target.src = '/placeholder-event.jpg';
                      }} 
                    />
                    <div className="event-overlay">
                      <span className={`status-badge ${getStatusColor(paymentStatus)}`}>
                        {getStatusIcon(paymentStatus)}
                        {paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="event-details">
                    <h3>{ev.name}</h3>
                    
                    <div className="event-meta">
                      <span className="event-date">
                        <Calendar size={16} />
                        {ev.eventDate ? new Date(ev.eventDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        }) : 'TBD'}
                      </span>
                      
                      <span className="event-location">
                        <MapPin size={16} />
                        {ev.location || 'Location TBD'}
                      </span>
                      
                      {ev.maxParticipants && (
                        <span className="event-participants">
                          <Users size={16} />
                          Max {ev.maxParticipants} participants
                        </span>
                      )}
                    </div>

                    {ev.fees > 0 && (
                      <div className="event-fees">
                        <span className="fee-label">Event Fee:</span>
                        <span className="fee-amount">₹{ev.fees}</span>
                      </div>
                    )}

                    <div className="event-actions">
                      <button 
                        className="btn-primary" 
                        onClick={() => navigate(`/events/${ev._id}`)}
                      >
                        View Details
                      </button>
                      {paymentStatus !== 'PAID' && paymentStatus !== 'CONFIRMED' && ev.fees > 0 && (
                        <button 
                          className="btn-secondary" 
                          onClick={() => { 
                            setSelectedRegistration(reg); 
                            setShowPayment(true); 
                          }}
                        >
                          Pay ₹{ev.fees}
                        </button>
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
        <PaymentModal 
          registrationId={selectedRegistration.id} 
          amount={selectedRegistration.event?.fees || 0} 
          onClose={() => setShowPayment(false)} 
          onSuccess={handlePaymentSuccess} 
        />
      )}
    </div>
  );
};

export default MyEvents;