import { useState } from 'react';
import { Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import GradientButton from '../components/GradientButton';
import Logo from '../components/Logo';
import { authAPI } from '../utils/api';
import { setAuthToken, setUser } from '../utils/auth';
import './Register.css';

const Register = ({ onNavigateToLogin, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'Student'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
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
    
    // Client-side validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the Terms & Conditions');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    
    console.log('Attempting registration for:', formData.email);
    
    try {
      const { confirmPassword, ...registrationData } = formData;
      const response = await authAPI.register(registrationData);
      console.log('Registration response:', response);
      
      // Response structure: { success: true, data: { token, user }, message }
      if (response && response.data && response.data.token && response.data.user) {
        setAuthToken(response.data.token);
        setUser(response.data.user);
        onRegisterSuccess();
      } else {
        setError('Invalid response from server');
        console.error('Invalid response structure:', response);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || err.message || 'Registration failed. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <Logo />
        
        <h1 className="auth-title">Create Your Frolic Account</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <InputField
            icon={User}
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          
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
            icon={Phone}
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          
          <div className="input-field-wrapper">
            <label className="role-label">Register As</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="role-select"
              required
            >
              <option value="Student">Student</option>
              <option value="Event Coordinator">Event Coordinator</option>
              <option value="Department Coordinator">Department Coordinator</option>
              <option value="Institute Coordinator">Institute Coordinator</option>
            </select>
          </div>
          
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
          
          <InputField
            icon={Lock}
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            rightIcon={showConfirmPassword ? EyeOff : Eye}
            onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
          />
          
          <div className="checkbox-container">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="checkbox"
              />
              <span className="checkbox-text">
                I agree to the <a href="#" className="link">Terms & Conditions</a>
              </span>
            </label>
          </div>
          
          <GradientButton type="submit" variant="primary">
            {loading ? 'Creating Account...' : 'Register'}
          </GradientButton>
          
          <div className="auth-footer">
            <span className="footer-text">Already have an account? </span>
            <button 
              type="button" 
              onClick={onNavigateToLogin}
              className="link-button"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Register;