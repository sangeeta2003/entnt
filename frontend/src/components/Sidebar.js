import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BuildingOfficeIcon, 
  ChatBubbleLeftRightIcon,
  UsersIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const adminLinks = [
    {
      name: 'Dashboard',
      to: '/admin/dashboard',
      icon: ChartBarIcon
    },
    {
      name: 'Users',
      to: '/admin/users',
      icon: UsersIcon
    },
    {
      name: 'Companies',
      to: '/admin/companies',
      icon: BuildingOfficeIcon
    },
    {
      name: 'Communication Methods',
      to: '/admin/communication-methods',
      icon: ChatBubbleLeftRightIcon
    }
  ];

  return (
    <nav className="space-y-1">
      {adminLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
              isActive
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`
          }
        >
          <link.icon className="h-5 w-5 mr-3" />
          {link.name}
        </NavLink>
      ))}
    </nav>
  );
};

export default Sidebar; 