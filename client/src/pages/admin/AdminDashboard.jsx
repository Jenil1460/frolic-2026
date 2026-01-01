import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import { 
  Building2, 
  Briefcase, 
  Calendar, 
  Users, 
  UsersRound, 
  UserCheck, 
  CreditCard, 
  CheckCircle, 
  Clock 
} from 'lucide-react';
import StatCard from '../../components/admin/StatCard';
import Card from '../../components/admin/Card';
import { useToast } from '../../components/admin/ToastContainer';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminAPI.getDashboardStats();
        if (response.success) {
          setStats(response.data);
        } else {
          throw new Error(response.message);
        }
      } catch (err) {
        showError(err.message || 'Failed to fetch dashboard stats.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [showError]);

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="admin-dashboard-error">
        <p>No statistics available.</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <h1 className="admin-heading-1">Dashboard Overview</h1>
        <p className="admin-text-body">Welcome back! Here's what's happening with your events.</p>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Institutes"
          value={stats.totalInstitutes}
          icon={Building2}
          color="primary"
        />
        <StatCard
          title="Total Departments"
          value={stats.totalDepartments}
          icon={Briefcase}
          color="secondary"
        />
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          icon={Calendar}
          color="info"
        />
        <StatCard
          title="Registered Users"
          value={stats.totalUsers}
          icon={Users}
          color="success"
        />
        <StatCard
          title="Total Groups"
          value={stats.totalGroups}
          icon={UsersRound}
          color="warning"
        />
        <StatCard
          title="Total Participants"
          value={stats.totalParticipants}
          icon={UserCheck}
          color="primary"
        />
        <StatCard
          title="Payments Done"
          value={stats.totalPaymentsDone}
          icon={CreditCard}
          color="success"
        />
        <StatCard
          title="Events Completed"
          value={stats.eventsCompleted}
          icon={CheckCircle}
          color="info"
        />
        <StatCard
          title="Upcoming Events"
          value={stats.upcomingEvents}
          icon={Clock}
          color="warning"
        />
      </div>

      <div className="dashboard-cards-grid">
        <Card title="Quick Stats" subtitle="Overview of key metrics">
          <div className="quick-stats">
            <div className="quick-stat-item">
              <span className="quick-stat-label">Participation Rate</span>
              <span className="quick-stat-value">
                {stats.totalEvents > 0 
                  ? `${((stats.totalGroups / stats.totalEvents) * 100).toFixed(1)}%`
                  : '0%'}
              </span>
            </div>
            <div className="quick-stat-item">
              <span className="quick-stat-label">Payment Rate</span>
              <span className="quick-stat-value">
                {stats.totalGroups > 0 
                  ? `${((stats.totalPaymentsDone / stats.totalGroups) * 100).toFixed(1)}%`
                  : '0%'}
              </span>
            </div>
            <div className="quick-stat-item">
              <span className="quick-stat-label">Avg Participants/Group</span>
              <span className="quick-stat-value">
                {stats.totalGroups > 0 
                  ? (stats.totalParticipants / stats.totalGroups).toFixed(1)
                  : '0'}
              </span>
            </div>
          </div>
        </Card>

        <Card title="Recent Activity" subtitle="Latest updates">
          <div className="recent-activity">
            <div className="activity-item">
              <div className="activity-icon success">
                <CheckCircle size={16} />
              </div>
              <div className="activity-content">
                <div className="activity-text">System is running smoothly</div>
                <div className="activity-time">All services operational</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;