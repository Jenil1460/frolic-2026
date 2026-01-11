import React from 'react';
import { Building2, MapPin, Globe } from 'lucide-react';
import './Institutes.css';

const Institutes = () => {
  const institutes = [];

  return (
    <div className="institutes-page">
      <div className="institutes-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
      </div>

      <div className="institutes-container">
        <div className="institutes-header">
          <h1 className="institutes-title">Participating Institutes</h1>
          <p className="institutes-subtitle">Explore colleges and universities in our network</p>
        </div>

        {institutes.length === 0 ? (
          <div className="no-institutes">
            <Building2 size={80} />
            <h2>No Institutes Listed</h2>
            <p>Institute information will be available soon!</p>
          </div>
        ) : (
          <div className="institutes-grid">
            {institutes.map((institute) => (
              <div key={institute.id} className="institute-card">
                <div className="institute-logo">
                  <Building2 size={48} />
                </div>
                <div className="institute-content">
                  <h3 className="institute-name">{institute.name}</h3>
                  <div className="institute-meta">
                    <div className="meta-item">
                      <MapPin size={16} />
                      <span>{institute.location}</span>
                    </div>
                    <div className="meta-item">
                      <Globe size={16} />
                      <span>{institute.website}</span>
                    </div>
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

export default Institutes;