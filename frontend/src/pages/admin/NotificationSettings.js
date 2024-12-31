import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BellIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import Toast from '../../components/Toast';

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    email: {
      enabled: true,
      frequency: 'immediate',
      types: {
        newCompany: true,
        communicationDue: true,
        systemUpdates: false,
        securityAlerts: true
      }
    },
    push: {
      enabled: true,
      types: {
        newCompany: true,
        communicationDue: true,
        systemUpdates: true,
        securityAlerts: true
      }
    },
    sms: {
      enabled: false,
      types: {
        newCompany: false,
        communicationDue: false,
        systemUpdates: false,
        securityAlerts: true
      }
    },
    inApp: {
      enabled: true,
      types: {
        newCompany: true,
        communicationDue: true,
        systemUpdates: true,
        securityAlerts: true
      }
    }
  });

  const [notification, setNotification] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Here you would typically save to backend
      setNotification({
        type: 'success',
        message: 'Notification settings updated successfully'
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.message || 'Failed to update notification settings'
      });
    }
  };

  const toggleChannel = (channel) => {
    setSettings(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        enabled: !prev[channel].enabled
      }
    }));
  };

  const toggleNotificationType = (channel, type) => {
    setSettings(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        types: {
          ...prev[channel].types,
          [type]: !prev[channel].types[type]
        }
      }
    }));
  };

  const channels = [
    {
      id: 'email',
      name: 'Email Notifications',
      description: 'Receive notifications via email',
      icon: EnvelopeIcon
    },
    {
      id: 'push',
      name: 'Push Notifications',
      description: 'Browser push notifications',
      icon: BellIcon
    },
    {
      id: 'sms',
      name: 'SMS Notifications',
      description: 'Get notified via text messages',
      icon: DevicePhoneMobileIcon
    },
    {
      id: 'inApp',
      name: 'In-App Notifications',
      description: 'Notifications within the application',
      icon: ChatBubbleLeftRightIcon
    }
  ];

  const notificationTypes = [
    {
      id: 'newCompany',
      name: 'New Company Added',
      description: 'When a new company is added to the system'
    },
    {
      id: 'communicationDue',
      name: 'Communication Due',
      description: 'When scheduled communications are due'
    },
    {
      id: 'systemUpdates',
      name: 'System Updates',
      description: 'Important system updates and maintenance'
    },
    {
      id: 'securityAlerts',
      name: 'Security Alerts',
      description: 'Critical security-related notifications'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Notification Settings
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Configure how and when you receive notifications
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Notification Channels */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Notification Channels
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {channels.map((channel) => (
              <motion.div
                key={channel.id}
                whileHover={{ scale: 1.02 }}
                className="relative rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex items-start"
              >
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={settings[channel.id].enabled}
                    onChange={() => toggleChannel(channel.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center">
                    <channel.icon className="h-6 w-6 text-gray-400 mr-2" />
                    <label className="font-medium text-gray-700 dark:text-gray-300">
                      {channel.name}
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {channel.description}
                  </p>
                  
                  {channel.id === 'email' && settings.email.enabled && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Frequency
                      </label>
                      <select
                        value={settings.email.frequency}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          email: {
                            ...prev.email,
                            frequency: e.target.value
                          }
                        }))}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600"
                      >
                        <option value="immediate">Immediate</option>
                        <option value="daily">Daily Digest</option>
                        <option value="weekly">Weekly Summary</option>
                      </select>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Notification Types */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Notification Types
          </h2>
          <div className="space-y-6">
            {notificationTypes.map((type) => (
              <div key={type.id} className="rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">
                      {type.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {type.description}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {channels.map((channel) => (
                    <label
                      key={`${type.id}-${channel.id}`}
                      className="flex items-center space-x-3 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={settings[channel.id].types[type.id]}
                        disabled={!settings[channel.id].enabled}
                        onChange={() => toggleNotificationType(channel.id, type.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        {channel.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </motion.button>
        </div>
      </form>

      {/* Notification Toast */}
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

export default NotificationSettings; 