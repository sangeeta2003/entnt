import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';
import SecuritySettings from '../pages/admin/SecuritySettings';
import UserManagement from '../pages/admin/UserManagement';
import CompanyManagement from '../pages/admin/CompanyManagement';
import CommunicationMethodManagement from '../pages/admin/CommunicationMethodManagement';
import SystemSettings from '../pages/admin/SystemSettings';
import AnalyticsConfig from '../pages/admin/AnalyticsConfig';
import AuditLogs from '../pages/admin/AuditLogs';
import NotificationSettings from '../pages/admin/NotificationSettings';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<AdminDashboard />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="companies" element={<CompanyManagement />} />
      <Route path="communication-methods" element={<CommunicationMethodManagement />} />
      <Route path="security" element={<SecuritySettings />} />
      <Route path="settings" element={<SystemSettings />} />
      <Route path="analytics" element={<AnalyticsConfig />} />
      <Route path="audit-logs" element={<AuditLogs />} />
      <Route path="notifications" element={<NotificationSettings />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminRoutes; 