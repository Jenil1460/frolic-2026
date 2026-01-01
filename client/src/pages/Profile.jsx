import { useState, useEffect } from 'react';
import { Mail, Phone, Camera, User as UserIcon, Shield, Award, Edit2, Save, X } from 'lucide-react';
import { authAPI } from '../utils/api';
import { setUser as setLocalUser, getUser } from '../utils/auth';
import './Profile.css';

const Profile = ({ onNavigate }) => {
  const currentUser = getUser();
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const cachedUser = getUser();
      if (cachedUser) {
        setUserData({
          fullName: cachedUser.fullName || '',
          email: cachedUser.email || '',
          phone: cachedUser.phone || '',
          role: cachedUser.role || 'Student'
        });
      }
      
      const profile = await authAPI.getProfile();
      const profileData = {
        fullName: profile.fullName || profile.data?.fullName || '',
        email: profile.email || profile.data?.email || '',
        phone: profile.phone || profile.data?.phone || '',
        role: profile.role || profile.data?.role || 'Student'
      };
      setUserData(profileData);
      setLocalUser(profileData);
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError('Failed to load profile data');
    }
  };

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
    setSuccess('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const response = await authAPI.updateProfile({
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone
      });
      
      const updatedData = response.data || response;
      setLocalUser({ ...updatedData, role: userData.role });
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    loadProfile();
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const getRoleIcon = (role) => {
    if (role === 'Admin') return <Shield size={20} />;
    if (role?.includes('Coordinator')) return <Award size={20} />;
    return <UserIcon size={20} />;
  };

  const getRoleColor = (role) => {
    if (role === 'Admin') return '#ef4444';
    if (role?.includes('Coordinator')) return '#f59e0b';
    return '#8b5cf6';
  };

  return (
    <div className="modern-profile-page">
      <div className="profile-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
      </div>

      <div className="modern-profile-container">
        {/* Header */}
        <div className="modern-profile-header">
          <div>
            <h1 className="modern-profile-title">My Profile</h1>
            <p className="modern-profile-subtitle">Manage your account information</p>
          </div>
          {!isEditing && (
            <button 
              className="edit-profile-button"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 size={18} />
              Edit Profile
            </button>
          )}
        </div>

        {/* Messages */}
        {success && (
          <div className="modern-alert modern-alert-success">
            {success}
          </div>
        )}
        {error && (
          <div className="modern-alert modern-alert-error">
            {error}
          </div>
        )}

        {/* Profile Card */}
        <div className="modern-profile-card">
          {/* Avatar Section */}
          <div className="modern-avatar-section">
            <div className="modern-avatar-wrapper">
              <div 
                className="modern-avatar"
                style={{ borderColor: getRoleColor(userData.role) }}
              >
                <UserIcon size={64} />
              </div>
              <button className="modern-avatar-upload">
                <Camera size={18} />
              </button>
            </div>
            
            <div className="modern-user-info">
              <h2 className="modern-user-name">{userData.fullName || 'User'}</h2>
              <p className="modern-user-email">{userData.email}</p>
              <div 
                className="modern-role-badge"
                style={{ 
                  background: `linear-gradient(135deg, ${getRoleColor(userData.role)}22, ${getRoleColor(userData.role)}11)`,
                  borderColor: `${getRoleColor(userData.role)}33`
                }}
              >
                {getRoleIcon(userData.role)}
                <span>{userData.role}</span>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="modern-profile-form">
            <div className="modern-form-grid">
              <div className="modern-form-group">
                <label className="modern-form-label">
                  <UserIcon size={16} />
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={userData.fullName}
                  onChange={handleChange}
                  className="modern-form-input"
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="modern-form-group">
                <label className="modern-form-label">
                  <Mail size={16} />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  className="modern-form-input"
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="modern-form-group">
                <label className="modern-form-label">
                  <Phone size={16} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={userData.phone}
                  onChange={handleChange}
                  className="modern-form-input"
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="modern-form-group">
                <label className="modern-form-label">
                  <Shield size={16} />
                  Role
                </label>
                <input
                  type="text"
                  value={userData.role}
                  className="modern-form-input"
                  disabled
                  style={{ opacity: 0.7 }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="modern-form-actions">
                <button
                  type="button"
                  className="modern-button modern-button-secondary"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  <X size={18} />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modern-button modern-button-primary"
                  disabled={loading}
                >
                  <Save size={18} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Quick Stats */}
        <div className="modern-quick-stats">
          <div className="modern-stat-card">
            <div className="modern-stat-icon" style={{ background: `${getRoleColor(userData.role)}22` }}>
              <Award size={24} style={{ color: getRoleColor(userData.role) }} />
            </div>
            <div className="modern-stat-content">
              <p className="modern-stat-label">Events Registered</p>
              <h3 className="modern-stat-value">0</h3>
            </div>
          </div>

          <div className="modern-stat-card">
            <div className="modern-stat-icon" style={{ background: '#10b98122' }}>
              <Award size={24} style={{ color: '#10b981' }} />
            </div>
            <div className="modern-stat-content">
              <p className="modern-stat-label">Events Completed</p>
              <h3 className="modern-stat-value">0</h3>
            </div>
          </div>

          <div className="modern-stat-card">
            <div className="modern-stat-icon" style={{ background: '#3b82f622' }}>
              <Award size={24} style={{ color: '#3b82f6' }} />
            </div>
            <div className="modern-stat-content">
              <p className="modern-stat-label">Achievements</p>
              <h3 className="modern-stat-value">0</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;