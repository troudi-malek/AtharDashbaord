import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
const ProtectedRoutes = () => {
  const [authStatus, setAuthStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    axios.get(`${API_URL}admin/verify`, { withCredentials: true })
      .then(() => setAuthStatus('authenticated'))
      .catch(() => setAuthStatus('unauthenticated'));
  }, []);

  if (authStatus === 'loading') return null; // or a spinner
  return authStatus === 'authenticated' ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;