import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { isAuthenticated, setAuthToken } from '@/utils/auth';
import { LoginPage } from '@/components/LoginPage';
import Home from '@/Pages/Home';
import Visits from '@/Pages/Visits/Visits';
import VisitsAdd from '@/Pages/Visits/VisitsAdd';
import Sales from '@/Pages/Sales/Sales';
import WishList from '@/Pages/WishList/WishList';
import Leads from '@/Pages/Leads/Leads';
import LeadsAdd from '@/Pages/Leads/LeadsAdd';


// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  // 🔐 Check for SSO Token in URL query params
  const urlParams = new URLSearchParams(window.location.search);
  const ssoToken = urlParams.get('token');

  if (ssoToken) {
    try {
      const base64Url = ssoToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const user = JSON.parse(jsonPayload);

      setAuthToken(ssoToken);
      localStorage.setItem('user', JSON.stringify(user));

      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    } catch (e) {
      console.error('Failed to parse SSO token:', e);
    }
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.role !== 'sales') {
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Router Configuration
export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (<ProtectedRoute><MainLayout /></ProtectedRoute>),
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: 'home', element: <Home /> },
      
      // مثال لصفحة visits
      { path: 'sales', element: <Sales /> },
      
      // مثال لصفحة visits
      { path: 'visits', element: <Visits /> },
      { path: 'visits/add', element: <VisitsAdd /> },
      { path: 'visits/:id/edit', element: <VisitsAdd /> },

      // leads
      { path: 'leads', element: <Leads /> },
      { path: 'leads/add', element: <LeadsAdd /> },
      { path: 'leads/:id/edit', element: <LeadsAdd /> },
      
      { path: 'wishlist', element: <WishList /> },

      // كرري نفس النمط لباقي الصفحات
      // { path: 'visits', element: <Visits /> },
      // { path: 'visits/add', element: <AddVisit /> },
      // { path: 'visits/:id/edit', element: <EditVisit /> },
    ],
  },
  {
    path: '*', 
    element: <Navigate to="/" replace />,
  },
]);