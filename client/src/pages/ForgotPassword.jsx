import { useState } from 'react';
import { Mail, ArrowLeft, ShieldCheck } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import GradientButton from '../components/GradientButton';
import Logo from '../components/Logo';
import './ForgotPassword.css';

const ForgotPassword = ({ onNavigateToLogin }) => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch (err) {
      setError('Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <Logo />
        
        <div className="forgot-password-illustration">
          <div className="illustration-icon shield">
            <ShieldCheck size={48} />
          </div>
          <div className="illustration-icon envelope">
            <Mail size={32} />
          </div>
        </div>
        
        {success ? (
          <div className="success-state">
            <div className="success-icon">
              <ShieldCheck size={64} />
            </div>
            <h1 className="auth-title">Check Your Email</h1>
            <p className="success-message">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="helper-text">
              Please check your inbox and follow the instructions to reset your password.
            </p>
            <button onClick={onNavigateToLogin} className="back-link">
              <ArrowLeft size={18} />
              <span>Back to Login</span>
            </button>
          </div>
        ) : (
          <>
            <h1 className="auth-title">Forgot Password?</h1>
            <p className="auth-subtitle">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit} className="auth-form">
              <InputField
                icon={Mail}
                type="email"
                name="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <GradientButton type="submit" variant="primary">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </GradientButton>
              
              <button 
                type="button" 
                onClick={onNavigateToLogin}
                className="back-link"
              >
                <ArrowLeft size={18} />
                <span>Back to Login</span>
              </button>
            </form>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;