import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  UsersIcon, 
  Cog6ToothIcon, 
  ChartBarIcon,
  BuildingOfficeIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const modules = [
  {
    title: 'Company Management',
    description: 'Add, edit, and manage company profiles',
    icon: BuildingOfficeIcon,
    link: '/admin/companies',
    color: 'bg-blue-500'
  },
  {
    title: 'Communication Methods',
    description: 'Configure communication channels and sequences',
    icon: ChatBubbleLeftRightIcon,
    link: '/admin/communication-methods',
    color: 'bg-green-500'
  },
  {
    title: 'User Management',
    description: 'Manage user accounts and permissions',
    icon: UsersIcon,
    link: '/admin/users',
    color: 'bg-purple-500'
  },
  {
    title: 'System Settings',
    description: 'Configure system-wide settings',
    icon: Cog6ToothIcon,
    link: '/admin/settings',
    color: 'bg-gray-500'
  },
  {
    title: 'Security Settings',
    description: 'Manage security and access controls',
    icon: ShieldCheckIcon,
    link: '/admin/security',
    color: 'bg-red-500'
  },
  {
    title: 'Analytics',
    description: 'View system analytics and reports',
    icon: ChartBarIcon,
    link: '/admin/analytics',
    color: 'bg-yellow-500'
  },
  {
    title: 'Audit Logs',
    description: 'Track system activities and changes',
    icon: ClipboardDocumentListIcon,
    link: '/admin/audit-logs',
    color: 'bg-indigo-500'
  },
  {
    title: 'Notifications',
    description: 'Configure notification settings',
    icon: BellIcon,
    link: '/admin/notifications',
    color: 'bg-pink-500'
  }
];

const AdminDashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your application settings and data
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {modules.map((module, index) => (
          <motion.div
            key={module.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={module.link}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 h-full"
              >
                <div className="flex items-center">
                  <div className={`rounded-lg p-3 ${module.color}`}>
                    <module.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {module.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {module.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AdminDashboard; 