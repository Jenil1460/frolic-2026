import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated, getUser } from '../utils/auth';

const AdminRoute = () => {
  const auth = isAuthenticated();
  const user = getUser();

  if (auth && user?.role === 'Admin') {
    return <Outlet />;
  } else {
    // Optionally, redirect to a "Not Authorized" page or login
    return <Navigate to="/unauthorized" />;
  }
};

export default AdminRoute;
