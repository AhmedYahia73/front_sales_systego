import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { isAuthenticated, setAuthToken, initSsoToken } from '@/utils/auth';
import { setProjectBrand, applyBrandTheme } from '@/utils/brand';
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
  initSsoToken();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.role !== 'sales') {
      console.warn("User role mismatch for Sales portal. Current role:", user?.role);
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