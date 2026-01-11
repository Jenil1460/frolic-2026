import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false, 
  type = 'button',
  className = '',
  icon: Icon,
  iconPosition = 'left'
}) => {
  return (
    <button
      type={type}
      className={`admin-btn admin-btn-${variant} admin-btn-${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && iconPosition === 'left' && <Icon className="admin-btn-icon admin-btn-icon-left" size={18} />}
      <span className="admin-btn-text">{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="admin-btn-icon admin-btn-icon-right" size={18} />}
    </button>
  );
};

export default Button;