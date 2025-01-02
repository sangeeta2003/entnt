import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import Login from './pages/LoginPage';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import SignupPage from './pages/SignupPage';
import ForgetPassword from './pages/ForgotPasswordPage'
import { AuthProvider } from './context/AuthContext';
import './styles/responsive.css';

// User Pages
import {
  Dashboard as UserDashboard,
  Calendar,
  Companies,
  Communications,
  Notifications
} from './pages/user';

// Import UserAnalytics separately
import UserAnalytics from './pages/user/Analytics';

// Admin Pages
import {
  Dashboard as AdminDashboard,
  UserManagement,
  CompanyManagement,
  CommunicationMethodManagement,
} from './pages/admin';

import AddCompany from './pages/user/AddCompany';

function App() {
  return (
    <AuthProvider>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="companies" element={<CompanyManagement />} />
            <Route path="communication-methods" element={<CommunicationMethodManagement />} />
          </Route>

          {/* User Routes */}
          <Route path="/user" element={
            <ProtectedRoute requiredRole="user">
              <UserLayout />
            </ProtectedRoute>
          }>
            <Route index element={<UserDashboard />} />
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="companies" element={<Companies />} />
            <Route path="companies/add" element={<AddCompany />} />
            <Route path="communications" element={<Communications />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="analytics" element={<UserAnalytics />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  );
}

export default App; 