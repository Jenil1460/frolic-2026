import './GradientButton.css';

const GradientButton = ({ children, variant = 'primary', onClick, type = 'button', icon: Icon }) => {
  return (
    <button 
      type={type}
      className={`gradient-button gradient-button-${variant}`}
      onClick={onClick}
    >
      {Icon && <Icon size={20} />}
      <span>{children}</span>
    </button>
  );
};

export default GradientButton;