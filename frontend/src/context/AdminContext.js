import React, { createContext, useContext, useState } from 'react';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [adminSettings, setAdminSettings] = useState({
    systemSettings: {
      maintenanceMode: false,
      debugMode: false,
      allowRegistration: true,
      defaultUserRole: 'user'
    },
    emailSettings: {
      smtpServer: '',
      smtpPort: '',
      smtpUser: '',
      emailFrom: ''
    },
    securitySettings: {
      passwordPolicy: {
        minLength: 8,
        requireNumbers: true,
        requireSymbols: true,
        requireUppercase: true
      },
      sessionTimeout: 30,
      maxLoginAttempts: 5
    }
  });

  const [auditLogs, setAuditLogs] = useState([]);

  const updateSystemSettings = (newSettings) => {
    setAdminSettings(prev => ({
      ...prev,
      systemSettings: {
        ...prev.systemSettings,
        ...newSettings
      }
    }));
  };

  const updateEmailSettings = (newSettings) => {
    setAdminSettings(prev => ({
      ...prev,
      emailSettings: {
        ...prev.emailSettings,
        ...newSettings
      }
    }));
  };

  const updateSecuritySettings = (newSettings) => {
    setAdminSettings(prev => ({
      ...prev,
      securitySettings: {
        ...prev.securitySettings,
        ...newSettings
      }
    }));
  };

  const addAuditLog = (log) => {
    setAuditLogs(prev => [{
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...log
    }, ...prev]);
  };

  return (
    <AdminContext.Provider value={{
      adminSettings,
      updateSystemSettings,
      updateEmailSettings,
      updateSecuritySettings,
      auditLogs,
      addAuditLog
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext); 