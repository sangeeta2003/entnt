import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { userDashboardService } from '../../services/userDashboardService';
// import NotificationAction from './NotificationAction';
import NotificationAction from '../../components/user/NotificationAction';

const Notifications = () => {
  const [notifications, setNotifications] = useState({ overdue: [], dueToday: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await userDashboardService.getNotifications();
      
      // Directly set the notifications from the response
      setNotifications({
        overdue: response.overdue || [],
        dueToday: response.dueToday || []
      });
      
      setError(null);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError(error.message || 'Failed to load notifications');
      setNotifications({ overdue: [], dueToday: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleNotificationComplete = async (notificationId) => {
    try {
      await userDashboardService.updateCommunicationStatus(notificationId, 'completed');
      await fetchNotifications();
    } catch (error) {
      console.error('Error completing notification:', error);
      setError('Failed to update notification');
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        {error}
      </div>
    );
  }

  const hasNotifications = 
    (notifications.overdue?.length || 0) > 0 || 
    (notifications.dueToday?.length || 0) > 0;

  if (!hasNotifications) {
    return (
      <div className="p-4 text-gray-500 text-center">
        No pending notifications
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <AnimatePresence>
        {notifications.overdue?.length > 0 && (
          <div className="p-4">
            <h3 className="text-red-500 font-medium mb-3">Overdue</h3>
            <div className="space-y-3">
              {notifications.overdue.map((notification) => (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex justify-between items-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {notification.company?.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {notification.type} - {format(new Date(notification.scheduledDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <NotificationAction
                    notification={notification}
                    onComplete={handleNotificationComplete}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {notifications.dueToday?.length > 0 && (
          <div className="p-4">
            <h3 className="text-yellow-500 font-medium mb-3">Due Today</h3>
            <div className="space-y-3">
              {notifications.dueToday.map((notification) => (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex justify-between items-center bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {notification.company?.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {notification.type}
                    </p>
                  </div>
                  <NotificationAction
                    notification={notification}
                    onComplete={handleNotificationComplete}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notifications; 



// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { format } from 'date-fns';
// import { userDashboardService } from '../../services/userDashboardService';
// import NotificationAction from '../../components/user/NotificationAction';

// const Notifications = () => {
//   const [notifications, setNotifications] = useState({ overdue: [], dueToday: [] });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchNotifications = async () => {
//     try {
//       setLoading(true);
//       const response = await userDashboardService.getNotifications();
//       setNotifications({
//         overdue: response.overdue || [],
//         dueToday: response.dueToday || []
//       });
//       setError(null);
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//       setError(error.message || 'Failed to load notifications');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//     const interval = setInterval(fetchNotifications, 60000);
//     return () => clearInterval(interval);
//   }, []);

//   if (loading) {
//     return (
//       <div className="p-4">
//         <div className="animate-pulse space-y-4">
//           <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//           <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4 text-red-500">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <AnimatePresence mode="wait">
//         {/* Overdue Notifications */}
//         {notifications.overdue.length > 0 && (
//           <motion.div
//             key="overdue-section"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className="mb-8"
//           >
//             <h2 className="text-xl font-semibold text-red-600 mb-4">
//               Overdue Communications
//             </h2>
//             <div className="space-y-4">
//               {notifications.overdue.map((notification, index) => (
//                 <motion.div
//                   key={`overdue-${notification._id || index}`}
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg"
//                 >
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <p className="font-medium text-gray-900 dark:text-white">
//                         {notification.company?.name}
//                       </p>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         {notification.type}
//                       </p>
//                     </div>
//                     <NotificationAction
//                       notification={notification}
//                       onComplete={fetchNotifications}
//                     />
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//         )}

//         {/* Due Today Notifications */}
//         {notifications.dueToday.length > 0 && (
//           <motion.div
//             key="due-today-section"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className="mb-8"
//           >
//             <h2 className="text-xl font-semibold text-yellow-600 mb-4">
//               Due Today
//             </h2>
//             <div className="space-y-4">
//               {notifications.dueToday.map((notification, index) => (
//                 <motion.div
//                   key={`due-today-${notification._id || index}`}
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg"
//                 >
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <p className="font-medium text-gray-900 dark:text-white">
//                         {notification.company?.name}
//                       </p>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         {notification.type}
//                       </p>
//                     </div>
//                     <NotificationAction
//                       notification={notification}
//                       onComplete={fetchNotifications}
//                     />
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//         )}

//         {/* No notifications message */}
//         {!notifications.overdue.length && !notifications.dueToday.length && (
//           <motion.div
//             key="no-notifications"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-center text-gray-500 py-8"
//           >
//             No notifications to display
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default Notifications; 