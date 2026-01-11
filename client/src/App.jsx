import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Home from './pages/Home';
import MyEvents from './pages/MyEvents';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Institutes from './pages/Institutes';
import Results from './pages/Results';
import About from './pages/About';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import EventManagement from './pages/admin/EventManagement';
import UserManagement from './pages/admin/UserManagement';
import CoordinatorManagement from './pages/admin/CoordinatorManagement';
import ResultManagement from './pages/admin/ResultManagement';
import GalleryManagement from './pages/admin/GalleryManagement';
import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './pages/Unauthorized';
import { isAuthenticated, logout as authLogout, getUser } from './utils/auth';
import { ToastProvider } from './components/admin/ToastContainer';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [userRole, setUserRole] = useState(getUser()?.role || '');

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
    setUserRole(getUser()?.role || '');
  }, [location]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setUserRole(getUser()?.role || '');
    if (getUser()?.role === 'Admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleRegisterSuccess = () => {
    setIsLoggedIn(true);
    setUserRole(getUser()?.role || '');
    navigate('/');
  };

  const handleLogout = () => {
    authLogout();
    setIsLoggedIn(false);
    setUserRole('');
    navigate('/login');
  };

  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <ToastProvider>
      {!isAuthPage && !isAdminPage && <NavBar onNavigate={navigate} />}
      <Routes>
        <Route path="/" element={<Home onNavigate={navigate} />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/institutes" element={<Institutes />} />
        <Route path="/results" element={<Results />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login onNavigateToRegister={() => navigate('/register')} onNavigateToForgotPassword={() => navigate('/forgot-password')} onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<Register onNavigateToLogin={() => navigate('/login')} onRegisterSuccess={handleRegisterSuccess} />} />
        <Route path="/forgot-password" element={<ForgotPassword onNavigateToLogin={() => navigate('/login')} />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile onNavigate={navigate} onLogout={handleLogout} />} />
          <Route path="/my-events" element={<MyEvents />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route path="" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="events" element={<EventManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="coordinators" element={<CoordinatorManagement />} />
            <Route path="results" element={<ResultManagement />} />
            <Route path="gallery" element={<GalleryManagement />} />
          </Route>
        </Route>

      </Routes>
      {!isAuthPage && !isAdminPage && <Footer onNavigate={navigate} />}
    </ToastProvider>
  );
}

export default App;