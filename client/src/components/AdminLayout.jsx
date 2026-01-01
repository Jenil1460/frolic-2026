import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  UserCheck, 
  Users, 
  Shield, 
  Trophy, 
  Images, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';
import { logout, getUser } from '../utils/auth';
import './AdminLayout.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/events', icon: Calendar, label: 'Events' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/coordinators', icon: Shield, label: 'Coordinators' },
    { path: '/admin/results', icon: Trophy, label: 'Results' },
    { path: '/admin/gallery', icon: Images, label: 'Gallery' },
  ];

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar-open' : 'admin-sidebar-closed'}`}>
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-logo">
            <h2>Frolic Admin</h2>
          </div>
          <button 
            className="admin-sidebar-toggle" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <nav className="admin-sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-sidebar-link ${isActive ? 'admin-sidebar-link-active' : ''}`}
              >
                <Icon className="admin-sidebar-icon" size={20} />
                {sidebarOpen && <span className="admin-sidebar-label">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-sidebar-logout" onClick={handleLogout}>
            <LogOut className="admin-sidebar-icon" size={20} />
            {sidebarOpen && <span className="admin-sidebar-label">Logout</span>}
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <button 
            className="admin-mobile-toggle" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={24} />
          </button>
          
          <div className="admin-header-spacer"></div>
          
          <div className="admin-header-user">
            <div className="admin-header-user-info">
              <div className="admin-header-user-name">{user?.fullName || 'Admin'}</div>
              <div className="admin-header-user-role">{user?.role || 'Administrator'}</div>
            </div>
            <div className="admin-header-user-avatar">
              {(user?.fullName || 'A').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;