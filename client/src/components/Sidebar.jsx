import { LayoutDashboard, Calendar, CircleUser, LogOut } from 'lucide-react';
import Logo from './Logo';
import './Sidebar.css';

const Sidebar = ({ currentPage, onNavigate, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'events', icon: Calendar, label: 'Events' },
    { id: 'profile', icon: CircleUser, label: 'Profile' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Logo />
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`sidebar-nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
        
        <button className="sidebar-nav-item logout" onClick={onLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;