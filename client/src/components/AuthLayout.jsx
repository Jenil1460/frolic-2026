import './AuthLayout.css';

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      {/* Animated background gradient */}
      <div className="cosmic-background">
        {/* Floating decorative elements */}
        <div className="floating-element planet-1"></div>
        <div className="floating-element planet-2"></div>
        <div className="floating-element orb-1"></div>
        <div className="floating-element orb-2"></div>
        <div className="floating-element orb-3"></div>
      </div>
      
      {/* Main content */}
      <div className="auth-container">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;