import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary' }) => {
  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-card-content">
        <div className="stat-card-header">
          <div className="stat-card-icon-wrapper">
            {Icon && <Icon className="stat-card-icon" size={24} />}
          </div>
          <div className="stat-card-title">{title}</div>
        </div>
        <div className="stat-card-value">{value}</div>
        {trend && (
          <div className={`stat-card-trend stat-card-trend-${trend}`}>
            <span className="stat-card-trend-icon">
              {trend === 'up' ? '↑' : '↓'}
            </span>
            <span className="stat-card-trend-value">{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;