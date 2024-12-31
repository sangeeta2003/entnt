import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarIcon, 
  ClockIcon, 
  BellIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { dashboardService } from '../services/dashboardService';
import Toast from '../components/Toast';
import { format } from 'date-fns';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getDashboardData();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setNotification({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHighlight = async (id) => {
    try {
      await dashboardService.toggleHighlight(id);
      await fetchDashboardData();
      setNotification({ type: 'success', message: 'Highlight preference updated' });
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    }
  };

  const getStatusColor = (status, isOverridden) => {
    if (isOverridden) return 'bg-gray-100 dark:bg-gray-700';
    switch (status) {
      case 'overdue':
        return 'bg-red-50 dark:bg-red-900/20';
      case 'due':
        return 'bg-yellow-50 dark:bg-yellow-900/20';
      default:
        return 'bg-white dark:bg-gray-800';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'overdue':
        return 'text-red-600 dark:text-red-400';
      case 'due':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Communication Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track and manage company communications
        </p>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {dashboardData.map((item, index) => (
            <motion.div
              key={item.company._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-lg shadow-sm overflow-hidden ${
                getStatusColor(item.nextCommunication?.status, item.highlightOverride)
              }`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {item.company.name}
                  </h2>
                  {item.nextCommunication && (
                    <button
                      onClick={() => handleToggleHighlight(item.nextCommunication._id)}
                      className="text-gray-400 hover:text-gray-500"
                      title={item.highlightOverride ? "Enable highlights" : "Disable highlights"}
                    >
                      <EyeSlashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Recent Communications */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                      Recent Communications
                    </h3>
                    <div className="space-y-3">
                      {item.recentCommunications.map((comm, idx) => (
                        <div
                          key={idx}
                          className="flex items-center text-sm"
                        >
                          <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-600 dark:text-gray-300">
                            {comm.method} - {format(new Date(comm.date), 'MMM d, yyyy')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Next Communication */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                      Next Scheduled Communication
                    </h3>
                    {item.nextCommunication ? (
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-600 dark:text-gray-300">
                            {item.nextCommunication.method}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <BellIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className={getStatusTextColor(item.nextCommunication.status)}>
                            {format(new Date(item.nextCommunication.date), 'MMM d, yyyy')}
                            {' - '}
                            {item.nextCommunication.status.charAt(0).toUpperCase() + 
                             item.nextCommunication.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No upcoming communications
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {notification && (
        <Toast
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </motion.div>
  );
};

export default Dashboard; 