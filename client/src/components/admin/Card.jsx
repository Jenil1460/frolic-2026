import React from 'react';
import './Card.css';

const Card = ({ children, className = '', title, subtitle, action }) => {
  return (
    <div className={`admin-card ${className}`}>
      {(title || subtitle || action) && (
        <div className="admin-card-header">
          <div className="admin-card-header-content">
            {title && <h3 className="admin-card-title">{title}</h3>}
            {subtitle && <p className="admin-card-subtitle">{subtitle}</p>}
          </div>
          {action && <div className="admin-card-action">{action}</div>}
        </div>
      )}
      <div className="admin-card-body">
        {children}
      </div>
    </div>
  );
};

export default Card;