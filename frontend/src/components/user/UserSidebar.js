import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import NotificationBadge from './NotificationBadge';

const UserSidebar = () => {
  const navItems = [
    { path: '/user/dashboard', icon: HomeIcon, text: 'Dashboard' },
    { path: '/user/calendar', icon: CalendarIcon, text: 'Calendar' },
    { path: '/user/companies', icon: BuildingOfficeIcon, text: 'Companies' },
    { 
      path: '/user/notifications', 
      icon: BellIcon, 
      text: 'Notifications',
      badge: <NotificationBadge />
    }
  ];

  return (
    <nav className="w-64 bg-white dark:bg-gray-800 shadow-lg">
      <div className="p-4">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
      </div>
      <div className="mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                isActive ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : ''
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            <span>{item.text}</span>
            {item.badge && <div className="ml-auto">{item.badge}</div>}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default UserSidebar; 