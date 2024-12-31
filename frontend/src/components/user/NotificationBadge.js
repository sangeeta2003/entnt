import React, { useEffect, useState, useCallback } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { userDashboardService } from '../../services/userDashboardService';
import { motion } from 'framer-motion';

const NotificationBadge = () => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotificationCount = useCallback(async () => {
    try {
      const data = await userDashboardService.getNotifications();
      // Calculate total notifications from both overdue and dueToday
      const totalCount = (data.overdue?.length || 0) + (data.dueToday?.length || 0);
      setCount(totalCount);
      setError(null);
    } catch (error) {
      console.error('Error fetching notification count:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotificationCount();
    // Set up polling every minute
    const interval = setInterval(fetchNotificationCount, 60000);
    return () => clearInterval(interval);
  }, [fetchNotificationCount]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500" title={error}>
        <BellIcon className="h-6 w-6" />
      </div>
    );
  }

  return (
    <div className="relative">
      <BellIcon className="h-6 w-6 text-gray-600 hover:text-gray-800 transition-colors" />
      {count > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
        >
          {count > 99 ? '99+' : count}
        </motion.div>
      )}
    </div>
  );
};

export default NotificationBadge; 