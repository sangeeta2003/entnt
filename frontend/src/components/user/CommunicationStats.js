import React from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const CommunicationStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[
        {
          label: 'Total Communications',
          value: stats.total,
          icon: ChartBarIcon,
          color: 'bg-indigo-500'
        },
        {
          label: 'Completed',
          value: stats.completed,
          icon: CheckCircleIcon,
          color: 'bg-green-500'
        },
        {
          label: 'Pending',
          value: stats.pending,
          icon: ClockIcon,
          color: 'bg-yellow-500'
        },
        {
          label: 'Overdue',
          value: stats.overdue,
          icon: ExclamationCircleIcon,
          color: 'bg-red-500'
        }
      ].map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.label}
              </p>
              <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
            <div className={`${stat.color} p-3 rounded-full`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CommunicationStats; 