import React from 'react';
import { motion } from 'framer-motion';
import { format, parseISO, isValid } from 'date-fns';
import { ExclamationCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const NotificationPanel = ({ overdueCompanies, dueCompanies }) => {
  // Helper function to safely format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      const date = new Date(dateString);
      if (!isValid(date)) return 'Invalid date';
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg"
      >
        <div className="flex items-center">
          <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
          <h3 className="ml-2 text-lg font-medium text-red-900 dark:text-red-200">
            Overdue Communications ({overdueCompanies?.length || 0})
          </h3>
        </div>
        <div className="mt-4 space-y-3">
          {overdueCompanies?.map(company => (
            <div key={company._id} className="flex justify-between items-center">
              <span className="text-red-700 dark:text-red-300">
                {company.name || 'Unknown Company'}
              </span>
              <span className="text-red-600 dark:text-red-400">
                {company.nextCommunication?.scheduledDate ? 
                  formatDate(company.nextCommunication.scheduledDate) 
                  : 'No date'
                }
              </span>
            </div>
          ))}
          {(!overdueCompanies || overdueCompanies.length === 0) && (
            <div className="text-red-600 dark:text-red-400">
              No overdue communications
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg"
      >
        <div className="flex items-center">
          <ClockIcon className="h-6 w-6 text-yellow-600" />
          <h3 className="ml-2 text-lg font-medium text-yellow-900 dark:text-yellow-200">
            Due Today ({dueCompanies?.length || 0})
          </h3>
        </div>
        <div className="mt-4 space-y-3">
          {dueCompanies?.map(company => (
            <div key={company._id} className="flex justify-between items-center">
              <span className="text-yellow-700 dark:text-yellow-300">
                {company.name || 'Unknown Company'}
              </span>
              <span className="text-yellow-600 dark:text-yellow-400">
                {company.nextCommunication?.type || 'No type specified'}
              </span>
            </div>
          ))}
          {(!dueCompanies || dueCompanies.length === 0) && (
            <div className="text-yellow-600 dark:text-yellow-400">
              No communications due today
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationPanel; 