import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import GradientButton from '../components/GradientButton';
import Logo from '../components/Logo';
import { authAPI } from '../utils/api';
import { setAuthToken, setUser } from '../utils/auth';
import './Login.css';

const Login = ({ onNavigateToRegister, onNavigateToForgotPassword, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Client-side validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    console.log('Attempting login for:', formData.email);
    
    try {
      const response = await authAPI.login(formData);
      console.log('Login response:', response);
      
      // Response structure: { success: true, data: { token, user }, message }
      if (response && response.data && response.data.token && response.data.user) {
        setAuthToken(response.data.token);
        setUser(response.data.user);
        onLoginSuccess();
      } else {
        setError('Invalid response from server');
        console.error('Invalid response structure:', response);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <Logo />

        <h1 className="auth-title">Welcome Back to Frolic</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <InputField
            icon={Mail}
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <InputField
            icon={Lock}
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            rightIcon={showPassword ? EyeOff : Eye}
            onRightIconClick={() => setShowPassword(!showPassword)}
          />
          
          <div className="forgot-password">
            <button 
              type="button" 
              onClick={onNavigateToForgotPassword}
              className="link-button"
            >
              Forgot Password?
            </button>
          </div>
          
          <GradientButton type="submit" variant="primary">
            {loading ? 'Logging in...' : 'Login'}
          </GradientButton>
          
          <div className="auth-footer">
            <span className="footer-text">Don't have an account? </span>
            <button 
              type="button" 
              onClick={onNavigateToRegister}
              className="link-button"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;